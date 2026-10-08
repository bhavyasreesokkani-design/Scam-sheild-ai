import hashlib
import os
import hmac

def hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    pwd_bytes = password.encode('utf-8')
    key = hashlib.pbkdf2_hmac('sha256', pwd_bytes, salt.encode('utf-8'), 100000)
    return f"{salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if '$' not in hashed_password:
            return False
        salt, key_hex = hashed_password.split('$', 1)
        pwd_bytes = plain_password.encode('utf-8')
        new_key = hashlib.pbkdf2_hmac('sha256', pwd_bytes, salt.encode('utf-8'), 100000)
        return hmac.compare_digest(new_key.hex(), key_hex)
    except Exception:
        return False
