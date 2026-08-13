import hashlib
from difflib import SequenceMatcher

def compute_file_hash(file_bytes: bytes) -> str:
    """Computes SHA-256 hash of the uploaded document."""
    return hashlib.sha256(file_bytes).hexdigest()

def string_similarity(a: str, b: str) -> float:
    """Calculates string similarity score between 0.0 and 1.0."""
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.strip().lower(), b.strip().lower()).ratio()

def match_with_record(user_provided_data: dict, org_record: dict, file_bytes: bytes) -> dict:
    """
    Compares uploaded document data with official organization database record.
    Returns detail match confidence & discrepancies.
    """
    discrepancies = []
    matches = []

    file_hash = compute_file_hash(file_bytes)
    hash_matched = False

    if org_record:
        if org_record.get('documentHash') and org_record.get('documentHash').lower() == file_hash.lower():
            hash_matched = True
            matches.append("Cryptographic document hash (SHA-256) exactly matches official organization record.")

        # Check Certificate ID
        req_cert_id = user_provided_data.get('certificateId', '')
        rec_cert_id = org_record.get('certificateId', '')
        if req_cert_id and rec_cert_id:
            if req_cert_id.strip().lower() == rec_cert_id.strip().lower():
                matches.append("Certificate ID matches official database record.")
            else:
                discrepancies.append(f"Certificate ID mismatch: Submitted '{req_cert_id}', Record displays '{rec_cert_id}'.")

        # Check Holder Name
        req_holder = user_provided_data.get('holderName', '')
        rec_holder = org_record.get('holderName', '')
        if req_holder and rec_holder:
            sim = string_similarity(req_holder, rec_holder)
            if sim >= 0.85:
                matches.append(f"Holder name verified ({rec_holder}).")
            else:
                discrepancies.append(f"Holder name mismatch: Submitted '{req_holder}', Official record states '{rec_holder}'.")

        # Check Issuer Name / Course
        req_course = user_provided_data.get('courseAward', '')
        rec_course = org_record.get('courseAward', '')
        if req_course and rec_course:
            sim = string_similarity(req_course, rec_course)
            if sim < 0.75:
                discrepancies.append(f"Course/Award mismatch: Submitted '{req_course}', Official record states '{rec_course}'.")
    else:
        discrepancies.append("Certificate ID not found in official registered database records.")

    return {
        "file_hash": file_hash,
        "hash_matched": hash_matched,
        "record_found": org_record is not None,
        "matches": matches,
        "discrepancies": discrepancies
    }
