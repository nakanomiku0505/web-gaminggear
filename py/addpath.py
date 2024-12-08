import json
import os

# Đọc file JSON
with open('json/data.json', 'r', encoding='utf-8') as file:
    products = json.load(file)

# Cập nhật đường dẫn ảnh
for product in products:
    product_id = product["id"]
    image_urls = [
        product.get("img"),
        product.get("anh2"),
        product.get("anh3"),
        product.get("anh4"),
        product.get("anh5")
    ]
    
    for i, url in enumerate(image_urls):
        if url:
            # Tạo đường dẫn mới cho ảnh
            new_image_path = f"product_images/sp{product_id}/anh{i+1}.png"
            # Cập nhật đường dẫn trong file JSON
            if i == 0:
                product["img"] = new_image_path
            elif i == 1:
                product["anh2"] = new_image_path
            elif i == 2:
                product["anh3"] = new_image_path
            elif i == 3:
                product["anh4"] = new_image_path
            elif i == 4:
                product["anh5"] = new_image_path

# Ghi lại file JSON đã được chỉnh sửa
with open('json/products_updated.json', 'w', encoding='utf-8') as file:
    json.dump(products, file, ensure_ascii=False, indent=4)

print("Đường dẫn ảnh đã được cập nhật và ghi vào file products_updated.json.")