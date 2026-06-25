import os
import shutil
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APPS_DIR = os.path.join(BASE_DIR, 'apps')

apps_to_migrate = [
    'accounts', 'admin_api', 'cart', 'categories', 
    'orders', 'payments', 'products', 'reviews', 
    'support', 'wishlist'
]

# 1. Update apps.py
for app in apps_to_migrate:
    app_path = os.path.join(APPS_DIR, app, 'apps.py')
    if os.path.exists(app_path):
        with open(app_path, 'r') as f:
            content = f.read()
        content = re.sub(rf"name\s*=\s*'{app}'", f"name = 'apps.{app}'", content)
        content = re.sub(rf'name\s*=\s*"{app}"', f'name = "apps.{app}"', content)
        with open(app_path, 'w') as f:
            f.write(content)
        print(f"Updated {app_path}")

# 2. Update settings.py
settings_path = os.path.join(BASE_DIR, 'core', 'settings.py')
if os.path.exists(settings_path):
    with open(settings_path, 'r') as f:
        content = f.read()
    
    for app in apps_to_migrate:
        # replace "app" or 'app' with "apps.app"
        # Only in INSTALLED_APPS context, but to be safe, just replace the exact line
        content = re.sub(rf'"{app}",', f'"apps.{app}",', content)
        content = re.sub(rf"'{app}',", f"'apps.{app}',", content)
        
    with open(settings_path, 'w') as f:
        f.write(content)
    print(f"Updated {settings_path}")

# 3. Update urls.py
urls_path = os.path.join(BASE_DIR, 'core', 'urls.py')
if os.path.exists(urls_path):
    with open(urls_path, 'r') as f:
        content = f.read()
        
    for app in apps_to_migrate:
        content = re.sub(rf"include\('{app}\.urls'\)", f"include('apps.{app}.urls')", content)
        content = re.sub(rf'include\("{app}\.urls"\)', f'include("apps.{app}.urls")', content)
        
    with open(urls_path, 'w') as f:
        f.write(content)
    print(f"Updated {urls_path}")

# 4. Remove top-level app directories
for app in apps_to_migrate:
    top_level_path = os.path.join(BASE_DIR, app)
    if os.path.exists(top_level_path):
        shutil.rmtree(top_level_path)
        print(f"Removed top-level {app} directory")
