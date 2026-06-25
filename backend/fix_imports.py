import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APPS_DIR = os.path.join(BASE_DIR, 'apps')

apps_list = [
    'accounts', 'admin_api', 'cart', 'categories', 
    'orders', 'payments', 'products', 'reviews', 
    'support', 'wishlist'
]

# Create a regex to match any of the apps
apps_regex = '|'.join(apps_list)

def fix_imports_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Handle "from app.module import ..." -> "from apps.app.module import ..."
    # Be careful not to replace "from apps.app.module..."
    new_content = re.sub(rf'^from\s+({apps_regex})\b', r'from apps.\1', new_content, flags=re.MULTILINE)
    new_content = re.sub(rf'^import\s+({apps_regex})\b', r'import apps.\1', new_content, flags=re.MULTILINE)

    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed imports in {file_path}")

for root, _, files in os.walk(APPS_DIR):
    for file in files:
        if file.endswith('.py'):
            fix_imports_in_file(os.path.join(root, file))

# Fix imports in core/urls.py and other files in core/ if necessary
for root, _, files in os.walk(os.path.join(BASE_DIR, 'core')):
    for file in files:
        if file.endswith('.py'):
            fix_imports_in_file(os.path.join(root, file))

