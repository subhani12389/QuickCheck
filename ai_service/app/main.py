from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import Optional

from app.metadata_analyzer import analyze_metadata
from app.image_forensics import analyze_image_forensics
from app.ocr_engine import extract_text_and_fields
from app.similarity_matcher import match_with_record
from app.risk_scorer import calculate_risk_score

app = FastAPI(title="QuickCheck AI Document Verification Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "QuickCheck AI Microservice"}

@app.post("/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    certificateId: Optional[str] = Form(None),
    holderName: Optional[str] = Form(None),
    issuerName: Optional[str] = Form(None),
    courseAward: Optional[str] = Form(None),
    orgRecordJson: Optional[str] = Form(None)
):
    file_bytes = await file.read()
    file_name = file.filename or "document.png"

    # Parse org record if provided
    org_record = None
    if orgRecordJson:
        try:
            org_record = json.loads(orgRecordJson)
        except Exception:
            pass

    user_provided = {
        "certificateId": certificateId,
        "holderName": holderName,
        "issuerName": issuerName,
        "courseAward": courseAward
    }

    # 1. OCR Extraction
    ocr_res = extract_text_and_fields(file_bytes, file_name)

    # 2. Metadata Analysis
    metadata_res = analyze_metadata(file_bytes, file_name)

    # 3. Image Forensics
    forensics_res = analyze_image_forensics(file_bytes)

    # 4. Similarity Matching
    similarity_res = match_with_record(user_provided, org_record, file_bytes)

    # 5. Risk Scoring Engine
    final_result = calculate_risk_score(metadata_res, forensics_res, similarity_res)
    final_result["ocr"] = ocr_res

    return final_result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
