import io
from PIL import Image
import pytesseract
from typing import Dict, Any

def extract_text_from_image(image_bytes: bytes) -> Dict[str, Any]:
    try:
        image = Image.open(io.BytesIO(image_bytes))
        # Attempt pytesseract OCR
        extracted_text = pytesseract.image_to_string(image)
        extracted_text = extracted_text.strip()

        if not extracted_text:
            return {
                "success": False,
                "text": "",
                "method": "pytesseract",
                "error": "No legible text found in uploaded image."
            }

        return {
            "success": True,
            "text": extracted_text,
            "method": "pytesseract",
            "error": None
        }
    except Exception as e:
        # Fallback if tesseract binary is not installed on Windows
        return {
            "success": False,
            "text": "URGENT! Your account ending in 4892 has been temporarily locked due to suspicious activity. Verify credentials immediately at http://sbi-secure-update.xyz/login to restore access. Do NOT share your OTP.",
            "method": "demo_ocr_fallback",
            "error": f"OCR Engine Notice: Tesseract binary not detected ({str(e)}). Using OCR fallback demo text."
        }
