import json

# Đọc dữ liệu từ file JSON
with open('json/data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Thêm các tag mới vào từng sản phẩm
for product in data:
    product['anh2'] = ""
    product['anh3'] = ""
    product['anh4'] = ""
    product['anh5'] = ""

# Ghi lại dữ liệu vào file JSON
with open('json/data_updated.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print("Tags đã được thêm thành công!")
