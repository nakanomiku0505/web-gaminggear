import json
import os
import requests
from PIL import Image
from io import BytesIO

# Đọc file JSON
with open('json/data.json', 'r', encoding='utf-8') as file:
    products = json.load(file)

# Tải xuống các ảnh từ tất cả các sản phẩm và chuyển đổi WebP sang PNG
for product in products:
    product_id = product["id"]
    image_urls = [
        product.get("img"),
        product.get("anh2"),
        product.get("anh3"),
        product.get("anh4"),
        product.get("anh5")
    ]
    
    # Tạo thư mục riêng cho mỗi sản phẩm
    product_image_folder = f"product_images/sp{product_id}"
    if not os.path.exists(product_image_folder):
        os.makedirs(product_image_folder)
    
    for i, url in enumerate(image_urls):
        if url:
            response = requests.get(url)
            if response.status_code == 200:
                # Tạo tên tệp dựa trên thứ tự ảnh
                image_name = f"anh{i+1}.png"
                image_path = os.path.join(product_image_folder, image_name)
                
                # Kiểm tra định dạng ảnh
                if url.lower().endswith('.webp'):
                    # Chuyển đổi WebP sang PNG
                    img = Image.open(BytesIO(response.content))
                    img.save(image_path, 'PNG')
                    print(f"Ảnh {image_name} của sản phẩm ID {product_id} đã được tải xuống và chuyển đổi từ WebP.")
                else:
                    # Lưu ảnh với định dạng gốc (nếu đã là PNG)
                    with open(image_path, 'wb') as file:
                        file.write(response.content)
                    print(f"Ảnh {image_name} của sản phẩm ID {product_id} đã được tải xuống.")
            else:
                print(f"Lỗi khi tải xuống ảnh từ URL: {url}")
        else:
            print(f"URL ảnh thứ {i+1} của sản phẩm ID {product_id} không tồn tại.")