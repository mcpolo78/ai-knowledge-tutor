import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.security import get_password_hash, verify_password

# Test password hashing
test_password = "test123"
print(f"Testing password: {test_password}")
print(f"Password length in bytes: {len(test_password.encode('utf-8'))}")

try:
    hashed = get_password_hash(test_password)
    print(f"Hash successful: {hashed[:50]}...")

    # Test verification
    verified = verify_password(test_password, hashed)
    print(f"Verification result: {verified}")

except Exception as e:
    print(f"Error: {str(e)}")

# Test with a longer password
long_password = "a" * 100
print(f"\nTesting long password: {long_password}")
print(f"Password length in bytes: {len(long_password.encode('utf-8'))}")

try:
    hashed_long = get_password_hash(long_password)
    print(f"Hash successful: {hashed_long[:50]}...")

except Exception as e:
    print(f"Error: {str(e)}")