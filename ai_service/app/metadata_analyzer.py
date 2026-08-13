import os
import re
from PIL import Image
from PIL.ExifTags import TAGS

def analyze_metadata(file_bytes: bytes, file_name: str) -> dict:
    """
    Analyzes image or PDF metadata for suspicious software signatures,
    inconsistent timestamps, and edit history flags.
    """
    indicators = []
    suspicious_software = ['photoshop', 'gimp', 'canva', 'inkscape', 'illustrator', 'acrobat', 'pdf2img', 'paint.net']
    found_software = []
    creation_date = None
    modification_date = None

    is_pdf = file_name.lower().endswith('.pdf') or file_bytes.startswith(b'%PDF')

    if is_pdf:
        # Search PDF header/trailer bytes for metadata tags
        try:
            content_str = file_bytes.decode('ascii', errors='ignore')
            # Extract Creator / Producer / Author
            creator_match = re.search(r'/Creator\s*\((.*?)\)', content_str)
            producer_match = re.search(r'/Producer\s*\((.*?)\)', content_str)
            mod_match = re.search(r'/ModDate\s*\(D:(.*?)\)', content_str)
            creation_match = re.search(r'/CreationDate\s*\(D:(.*?)\)', content_str)

            if creator_match:
                creator = creator_match.group(1).lower()
                for sw in suspicious_software:
                    if sw in creator:
                        found_software.append(creator_match.group(1))

            if producer_match:
                producer = producer_match.group(1).lower()
                for sw in suspicious_software:
                    if sw in producer and producer_match.group(1) not in found_software:
                        found_software.append(producer_match.group(1))

            if mod_match and creation_match:
                creation_date = creation_match.group(1)
                modification_date = mod_match.group(1)
                if creation_date != modification_date:
                    indicators.append("Document modification timestamp differs from original creation date.")
        except Exception as e:
            indicators.append(f"Could not parse PDF metadata: {str(e)}")
    else:
        # EXIF analysis for JPG/PNG
        try:
            import io
            img = Image.open(io.BytesIO(file_bytes))
            exif_data = img._getexif() if hasattr(img, '_getexif') and img._getexif() else {}
            if exif_data:
                for tag_id, value in exif_data.items():
                    tag = TAGS.get(tag_id, tag_id)
                    if tag == 'Software':
                        sw_name = str(value).lower()
                        for sw in suspicious_software:
                            if sw in sw_name:
                                found_software.append(str(value))
                    elif tag == 'DateTimeOriginal':
                        creation_date = str(value)
                    elif tag == 'DateTime':
                        modification_date = str(value)
            
            # Check software traces in raw comments
            info = img.info
            if 'Software' in info:
                sw_val = str(info['Software'])
                for sw in suspicious_software:
                    if sw in sw_val.lower() and sw_val not in found_software:
                        found_software.append(sw_val)
        except Exception:
            pass

    if found_software:
        software_list = ", ".join(list(set(found_software)))
        indicators.append(f"Editing software signature detected: {software_list}")

    score_impact = 0
    if found_software:
        score_impact += 25
    if "modification timestamp differs" in " ".join(indicators):
        score_impact += 15

    return {
        "is_pdf": is_pdf,
        "editing_software_detected": len(found_software) > 0,
        "detected_software": list(set(found_software)),
        "creation_date": creation_date,
        "modification_date": modification_date,
        "indicators": indicators,
        "metadata_risk_penalty": score_impact
    }
