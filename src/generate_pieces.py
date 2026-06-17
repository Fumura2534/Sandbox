import os
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

# Configuration pour chessboardjs (150x150 pixels pour une netteté maximale)
size = (150, 150)
output_dir = "img/chesspieces/dbz"
os.makedirs(output_dir, exist_ok=True)

def create_base_canvas(bg_color):
    """Crée un fond transparent avec un socle circulaire net."""
    img = Image.new("RGBA", size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    # Ombre sous la pièce
    draw.ellipse([25, 115, 125, 140], fill=(40, 40, 40, 100))
    # Socle de la figurine
    draw.ellipse([30, 120, 120, 138], fill=bg_color, outline=(20, 20, 20, 255), width=2)
    return img

def enhance_image(img):
    """Applique des filtres de contraste et de netteté style Anime."""
    img = ImageEnhance.Contrast(img).enhance(1.2)
    img = ImageEnhance.Color(img).enhance(1.25)
    return img.filter(ImageFilter.SHARPEN)

# Configuration graphique de chaque pièce
pieces_config = {
    # --- BLANCS (Héros) ---
    "wP": {"bg": (230, 130, 40, 255), "type": "dragonball"}, # Pion : Dragon Ball
    "wR": {"bg": (180, 50, 50, 255), "type": "kame_house"},  # Tour : Kame House
    "wN": {"bg": (60, 100, 190, 255), "type": "trunks"},      # Cavalier : Trunks
    "wB": {"bg": (210, 180, 50, 255), "type": "gohan"},       # Fou : Gohan
    "wQ": {"bg": (240, 210, 30, 255), "type": "goku_ssj"},    # Reine : Goku SSJ
    "wK": {"bg": (40, 160, 90, 255), "type": "piccolo"},      # Roi : Piccolo

    # --- NOIRS (Méchants) ---
    "bP": {"bg": (100, 160, 60, 255), "type": "saibaman"},    # Pion : Saibaman
    "bR": {"bg": (120, 120, 140, 255), "type": "frieza_ship"},# Tour : Vaisseau Freezer
    "bN": {"bg": (190, 80, 50, 255), "type": "nappa"},        # Cavalier : Nappa
    "bB": {"bg": (150, 60, 180, 255), "type": "cell_jr"},     # Fou : Cell Jr.
    "bQ": {"bg": (220, 100, 180, 255), "type": "majin_buu"},  # Reine : Majin Buu
    "bK": {"bg": (110, 60, 150, 255), "type": "frieza"}       # Roi : Freezer
}

for name, cfg in pieces_config.items():
    base = create_base_canvas(cfg["bg"])
    draw = ImageDraw.Draw(base)
    t = cfg["type"]

    if t == "dragonball":
        draw.ellipse([45, 40, 105, 100], fill=(255, 140, 0, 255), outline=(180, 60, 0, 255), width=3)
        draw.ellipse([53, 46, 75, 62], fill=(255, 210, 120, 200)) # Reflet glossy
        stars = [(75, 55), (63, 72), (87, 72), (75, 85)] # 4 étoiles
        for p in stars:
            draw.regular_polygon((p[0], p[1], 6), 3, fill=(230, 20, 20, 255))
    elif t == "kame_house":
        draw.rectangle([50, 60, 100, 115], fill=(240, 130, 140, 255), outline=(150, 40, 50, 255), width=3)
        draw.polygon([(40, 60), (75, 25), (110, 60)], fill=(220, 40, 40, 255), outline=(150, 20, 20, 255), width=3)
        draw.rectangle([65, 85, 85, 115], fill=(130, 80, 40, 255))
    elif t == "trunks":
        draw.line([40, 30, 60, 60], fill=(200, 200, 200, 255), width=4) # Épée
        draw.ellipse([55, 55, 95, 95], fill=(60, 70, 140, 255), outline=(20, 20, 50, 255), width=2)
        draw.polygon([(45, 30), (65, 25), (75, 45), (85, 25), (105, 30), (75, 55)], fill=(180, 160, 220, 255), outline=(80, 60, 120, 255), width=2)
    elif t == "gohan":
        draw.rectangle([55, 55, 95, 115], fill=(90, 50, 140, 255), outline=(40, 20, 70, 255), width=2)
        draw.rectangle([55, 85, 95, 93], fill=(210, 30, 30, 255))
        draw.polygon([(50, 35), (75, 30), (100, 35), (75, 60)], fill=(30, 30, 30, 255), outline=(0, 0, 0, 255), width=2)
    elif t == "goku_ssj":
        draw.polygon([(30, 110), (75, 15), (120, 110)], fill=(255, 250, 180, 120)) # Aura
        draw.polygon([(50, 120), (75, 55), (100, 120)], fill=(240, 90, 20, 255), outline=(150, 40, 0, 255), width=2)
        draw.polygon([(40, 45), (50, 25), (75, 10), (100, 25), (75, 65)], fill=(255, 220, 40, 255), outline=(180, 140, 10, 255), width=2)
    elif t == "piccolo":
        draw.polygon([(40, 55), (75, 30), (110, 55), (75, 80)], fill=(245, 245, 245, 255), outline=(180, 180, 180, 255), width=2)
        draw.ellipse([60, 45, 90, 75], fill=(50, 160, 80, 255), outline=(20, 80, 40, 255), width=2)
    elif t == "saibaman":
        draw.ellipse([55, 50, 95, 85], fill=(120, 190, 70, 255), outline=(60, 110, 30, 255), width=2)
        draw.ellipse([63, 65, 71, 73], fill=(230, 20, 20, 255)) # Yeux rouges
        draw.ellipse([79, 65, 87, 73], fill=(230, 20, 20, 255))
    elif t == "frieza_ship":
        draw.ellipse([35, 55, 115, 95], fill=(200, 205, 215, 255), outline=(100, 105, 115, 255), width=3)
        draw.ellipse([50, 45, 100, 65], fill=(140, 50, 160, 255))
    elif t == "nappa":
        draw.rectangle([45, 60, 105, 115], fill=(30, 30, 30, 255), outline=(10, 10, 10, 255), width=2)
        draw.rectangle([40, 60, 55, 85], fill=(230, 170, 30, 255))
        draw.rectangle([95, 60, 110, 85], fill=(230, 170, 30, 255))
        draw.ellipse([60, 35, 90, 65], fill=(240, 190, 150, 255), outline=(160, 110, 80, 255), width=2)
    elif t == "cell_jr":
        draw.ellipse([55, 45, 95, 80], fill=(50, 110, 180, 255), outline=(20, 50, 100, 255), width=2)
        draw.polygon([(50, 45), (75, 65), (100, 45)], fill=(30, 30, 40, 255))
    elif t == "majin_buu":
        draw.ellipse([40, 50, 110, 115], fill=(255, 160, 180, 255), outline=(200, 90, 120, 255), width=3)
        draw.rectangle([48, 90, 102, 115], fill=(30, 30, 30, 255))
        draw.ellipse([75, 30, 85, 52], fill=(255, 160, 180, 255)) # Crête
    elif t == "frieza":
        draw.ellipse([55, 40, 95, 75], fill=(245, 245, 245, 255), outline=(170, 170, 180, 255), width=2)
        draw.ellipse([65, 42, 85, 55], fill=(150, 50, 180, 255)) # Plaque violette

    final_img = enhance_image(base)
    final_img.save(os.path.join(output_dir, f"{name}.png"), "PNG")

print("Toutes les pièces DBZ ont été générées proprement dans 'img/chesspieces/dbz/' ! ")