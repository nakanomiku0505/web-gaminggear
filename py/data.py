import json

# Đường dẫn tệp JSON
input_file = "json/data.json"
output_file = "json/datanew.json"

# Đọc dữ liệu từ tệp JSON
with open(input_file, "r", encoding="utf-8") as file:
    data = json.load(file)

# Sửa `sku` với định dạng "SP001", "SP002", ...
for index, item in enumerate(data, start=1):  # Bắt đầu từ 1
    item["sku"] = f"SP{index:03}"  # Định dạng `SP001`, `SP002`, ...

# Ghi lại dữ liệu đã chỉnh sửa vào tệp mới
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print(f"Updated SKUs and saved to {output_file}.")

