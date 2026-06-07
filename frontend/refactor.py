import os
import shutil
import re

SRC_DIR = os.path.join(os.path.dirname(__file__), 'src')

# Mapping of current directories/files to new locations
MOVES = {
    # Pages
    "pages/Home.jsx": "pages/home/Home.jsx",
    "pages/Home.scss": "pages/home/Home.scss",
    "pages/admin": "pages/admin",
    
    # Components -> buildpc
    "components/build-pc": "components/buildpc",
    "components/build-pc-quiz": "components/buildpc/quiz",
    
    # Components -> product
    "components/ecommerce/ProductCard.jsx": "components/product/ProductCard.jsx",
    "components/ecommerce/ProductCard.scss": "components/product/ProductCard.scss",
    "components/ecommerce/ProductGrid.jsx": "components/product/ProductGrid.jsx",
    "components/ecommerce/ProductGrid.scss": "components/product/ProductGrid.scss",
    
    # Components -> common
    "components/ecommerce/Pagination.jsx": "components/common/Pagination.jsx",
    "components/ecommerce/Pagination.scss": "components/common/Pagination.scss",
    "components/ecommerce/SearchBar.jsx": "components/common/SearchBar.jsx",
    "components/ecommerce/SearchBar.scss": "components/common/SearchBar.scss",
    "components/support": "components/common/support",
    "components/sections": "components/common/sections",
    
    # Components -> pages specific (Gaming/Contact)
    "components/ecommerce/GamingCategoryCard.jsx": "pages/gaming/components/GamingCategoryCard.jsx",
    "components/ecommerce/GamingCategoryCard.scss": "pages/gaming/components/GamingCategoryCard.scss",
    "components/ecommerce/GamingHero.jsx": "pages/gaming/components/GamingHero.jsx",
    "components/ecommerce/GamingHero.scss": "pages/gaming/components/GamingHero.scss",
    "components/ecommerce/GamingShowcase.jsx": "pages/gaming/components/GamingShowcase.jsx",
    "components/ecommerce/GamingShowcase.scss": "pages/gaming/components/GamingShowcase.scss",
    
    "components/ecommerce/ContactForm.jsx": "pages/contact/components/ContactForm.jsx",
    "components/ecommerce/ContactForm.scss": "pages/contact/components/ContactForm.scss",
    "components/ecommerce/ContactInfoCard.jsx": "pages/contact/components/ContactInfoCard.jsx",
    "components/ecommerce/ContactInfoCard.scss": "pages/contact/components/ContactInfoCard.scss",
    "components/ecommerce/SocialContactCard.jsx": "pages/contact/components/SocialContactCard.jsx",
    "components/ecommerce/SocialContactCard.scss": "pages/contact/components/SocialContactCard.scss",
    "components/ecommerce/FilterSidebar.jsx": "pages/pc-components/components/FilterSidebar.jsx",
    "components/ecommerce/FilterSidebar.scss": "pages/pc-components/components/FilterSidebar.scss",
}

def move_files():
    for src, dst in MOVES.items():
        src_path = os.path.join(SRC_DIR, src)
        dst_path = os.path.join(SRC_DIR, dst)
        
        if not os.path.exists(src_path):
            print(f"Skipping {src_path}, does not exist")
            continue
            
        # Ensure target dir exists
        os.makedirs(os.path.dirname(dst_path), exist_ok=True)
        
        # Move
        print(f"Moving {src} to {dst}")
        shutil.move(src_path, dst_path)

def update_imports():
    """
    Since we enabled `@/` alias in Vite, we can replace all `../../` and `../` imports 
    that point to our internal src structure with `@/`.
    But since this is hard to do with regex perfectly, we'll do some specific replacements
    based on the old paths to the new paths.
    """
    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if not (file.endswith('.jsx') or file.endswith('.js') or file.endswith('.scss')):
                continue
                
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            
            if file.endswith('.scss'):
                # Handle SCSS variables import specifically
                # Just replace all relative variations with the exact alias or absolute
                # Actually Vite alias works in SCSS if prefixed with ~ or @, wait Dart sass prefers standard.
                # Since SCSS is tricky with Vite aliases, we'll just fix @import to @use and keep relative or use absolute if needed.
                # We'll handle SCSS manually or replace the exact known paths.
                new_content = re.sub(r'@import.*?variables.*?;', '@use "@/styles/variables" as *;', new_content)
                new_content = re.sub(r'@use.*?variables.*?;', '@use "@/styles/variables" as *;', new_content)
            else:
                # Replace common component paths with alias
                # For JS/JSX, anything starting with '../components/' or '../../components/' becomes '@/components/'
                new_content = re.sub(r'[\'"]\.\./\.\./components/', "'@/components/", new_content)
                new_content = re.sub(r'[\'"]\.\./components/', "'@/components/", new_content)
                new_content = re.sub(r'[\'"]\.\./\.\./\.\./components/', "'@/components/", new_content)
                
                new_content = re.sub(r'[\'"]\.\./\.\./pages/', "'@/pages/", new_content)
                new_content = re.sub(r'[\'"]\.\./pages/', "'@/pages/", new_content)
                
                new_content = re.sub(r'[\'"]\.\./\.\./context/', "'@/context/", new_content)
                new_content = re.sub(r'[\'"]\.\./context/', "'@/context/", new_content)
                new_content = re.sub(r'[\'"]\.\./contexts/', "'@/contexts/", new_content)
                new_content = re.sub(r'[\'"]\.\./\.\./contexts/', "'@/contexts/", new_content)
                
                new_content = re.sub(r'[\'"]\.\./\.\./hooks/', "'@/hooks/", new_content)
                new_content = re.sub(r'[\'"]\.\./hooks/', "'@/hooks/", new_content)
                
                new_content = re.sub(r'[\'"]\.\./\.\./services/', "'@/services/", new_content)
                new_content = re.sub(r'[\'"]\.\./services/', "'@/services/", new_content)
                
                new_content = re.sub(r'[\'"]\.\./\.\./styles/', "'@/styles/", new_content)
                new_content = re.sub(r'[\'"]\.\./styles/', "'@/styles/", new_content)
                
                # Fix specific moved component paths
                new_content = new_content.replace("@/components/ecommerce/ProductCard", "@/components/product/ProductCard")
                new_content = new_content.replace("@/components/ecommerce/ProductGrid", "@/components/product/ProductGrid")
                new_content = new_content.replace("@/components/ecommerce/Pagination", "@/components/common/Pagination")
                new_content = new_content.replace("@/components/ecommerce/SearchBar", "@/components/common/SearchBar")
                new_content = new_content.replace("@/components/ecommerce/Gaming", "@/pages/gaming/components/Gaming")
                new_content = new_content.replace("@/components/ecommerce/Contact", "@/pages/contact/components/Contact")
                new_content = new_content.replace("@/components/ecommerce/Social", "@/pages/contact/components/Social")
                new_content = new_content.replace("@/components/ecommerce/Filter", "@/pages/pc-components/components/Filter")
                
                new_content = new_content.replace("@/components/build-pc", "@/components/buildpc")
                new_content = new_content.replace("@/components/build-pc-quiz", "@/components/buildpc/quiz")
                new_content = new_content.replace("@/components/sections", "@/components/common/sections")
                new_content = new_content.replace("@/components/support", "@/components/common/support")
                
                # In App.jsx
                new_content = new_content.replace("'./pages/Home'", "'@/pages/home/Home'")
                new_content = new_content.replace("'./pages/auth", "'@/pages/auth")
                new_content = new_content.replace("'./pages/build-pc", "'@/pages/build-pc")
                new_content = new_content.replace("'./pages/pc-components", "'@/pages/pc-components")
                new_content = new_content.replace("'./pages/gaming", "'@/pages/gaming")
                new_content = new_content.replace("'./pages/contact", "'@/pages/contact")
                new_content = new_content.replace("'./pages/product-detail", "'@/pages/products")
                new_content = new_content.replace("'./pages/cart", "'@/pages/cart")
                new_content = new_content.replace("'./pages/checkout", "'@/pages/checkout")
                new_content = new_content.replace("'./admin/", "'@/pages/admin/")
                new_content = new_content.replace("'./components/", "'@/components/")
                new_content = new_content.replace("'./context", "'@/context")
                new_content = new_content.replace("'./contexts", "'@/contexts")
                new_content = new_content.replace("'./styles/", "'@/styles/")

            if content != new_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated imports in {file}")

if __name__ == "__main__":
    move_files()
    update_imports()
    
    # Cleanup empty dirs
    ecommerce_dir = os.path.join(SRC_DIR, 'components/ecommerce')
    if os.path.exists(ecommerce_dir) and not os.listdir(ecommerce_dir):
        os.rmdir(ecommerce_dir)
