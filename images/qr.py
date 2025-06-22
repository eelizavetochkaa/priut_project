import qrcode
from PIL import Image

# Данные для QR-кода
url = "https://qr.nspk.ru/AS1A0075FHQV4NR19P0PM4IG0DDQUTB3?type=01&bank=100000000159&crc=3757"

# Цвета
fill_color = "#B6A28E"  # цвет самого QR-кода
back_color = "#F5F5DC"  # цвет фона (бежевый)

# Создание QR-кода
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # высокая коррекция ошибок
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Генерация изображения QR-кода
img = qr.make_image(fill_color=fill_color, back_color=back_color)

# Сохранение изображения
img.save("qr_code_custom.png")

print("QR-код сохранён как qr_code_custom.png")
