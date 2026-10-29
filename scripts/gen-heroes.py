from PIL import Image, ImageDraw, ImageFilter
import os
import random

out = os.path.join(os.path.dirname(__file__), "..", "public", "heroes")
os.makedirs(out, exist_ok=True)


def noise(img, amount=12):
    px = img.load()
    w, h = img.size
    rnd = random.Random(42)
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r, g, b = px[x, y]
            d = rnd.randint(-amount, amount)
            px[x, y] = (
                max(0, min(255, r + d)),
                max(0, min(255, g + d)),
                max(0, min(255, b + d)),
            )
    return img.filter(ImageFilter.GaussianBlur(0.6))


def vignette(img, strength=0.45):
    w, h = img.size
    overlay = Image.new("RGB", (w, h), (20, 10, 10))
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((-w * 0.1, -h * 0.05, w * 1.1, h * 1.15), fill=int(255 * strength))
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    return Image.composite(overlay, img, mask)


def soft_radial(size, c1, c2, c3):
    w, h = size
    img = Image.new("RGB", size, c2)
    draw = ImageDraw.Draw(img)
    for i in range(18, 0, -1):
        t = i / 18
        r = tuple(int(c1[j] * t + c2[j] * (1 - t)) for j in range(3))
        pad = int((1 - t) * min(w, h) * 0.55)
        draw.ellipse((pad - 80, pad - 40, w - pad + 80, h - pad + 120), fill=r)
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((-40, int(h * 0.45), w + 40, h + 80), fill=(*c3, 110))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    return Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")


def draw_modest_figure(draw, cx, cy, scale, robe=(90, 70, 95), head=(210, 180, 160)):
    hx, hy = cx, cy - int(70 * scale)
    draw.ellipse(
        (hx - int(28 * scale), hy - int(34 * scale), hx + int(28 * scale), hy + int(30 * scale)),
        fill=robe,
    )
    draw.ellipse(
        (hx - int(18 * scale), hy - int(16 * scale), hx + int(18 * scale), hy + int(16 * scale)),
        fill=head,
    )
    draw.polygon(
        [
            (cx - int(55 * scale), cy + int(90 * scale)),
            (cx - int(40 * scale), cy - int(10 * scale)),
            (cx + int(40 * scale), cy - int(10 * scale)),
            (cx + int(55 * scale), cy + int(90 * scale)),
        ],
        fill=robe,
    )


def draw_baby(draw, cx, cy, scale=1.0):
    wrap = (245, 235, 225)
    draw.ellipse(
        (cx - int(50 * scale), cy - int(28 * scale), cx + int(50 * scale), cy + int(38 * scale)),
        fill=wrap,
    )
    draw.ellipse(
        (cx - int(22 * scale), cy - int(22 * scale), cx + int(18 * scale), cy + int(12 * scale)),
        fill=(230, 200, 180),
    )


W, H = 900, 1400

# studio newborn / maternity modest
img = soft_radial((W, H), (168, 50, 50), (248, 243, 237), (255, 220, 210))
d = ImageDraw.Draw(img)
d.rectangle((80, 180, 820, 980), fill=(252, 248, 244))
d.rectangle((120, 220, 780, 920), outline=(220, 200, 190), width=3)
draw_modest_figure(d, 380, 620, 1.15, robe=(120, 40, 50), head=(225, 195, 175))
draw_baby(d, 520, 640, 1.05)
img = noise(img, 10)
img = vignette(img, 0.35)
img.save(os.path.join(out, "studio-newborn.jpg"), quality=90)

# studio set
img = soft_radial((W, H), (90, 55, 50), (240, 232, 220), (255, 210, 180))
d = ImageDraw.Draw(img)
d.polygon([(0, H), (0, 900), (W, 860), (W, H)], fill=(210, 195, 175))
d.ellipse((280, 720, 620, 860), fill=(160, 120, 80))
d.rectangle((360, 520, 540, 760), fill=(150, 110, 75))
d.polygon([(650, 220), (820, 300), (800, 520), (630, 440)], fill=(250, 248, 240))
d.rectangle((720, 520, 740, 820), fill=(90, 80, 70))
d.rectangle((180, 560, 280, 620), fill=(40, 40, 40))
d.ellipse((195, 530, 265, 590), fill=(30, 30, 30))
d.line((230, 620, 230, 860), fill=(50, 50, 50), width=6)
d.line((170, 860, 290, 860), fill=(50, 50, 50), width=5)
img = noise(img, 9)
img = vignette(img, 0.4)
img.save(os.path.join(out, "studio-set.jpg"), quality=90)

# garden family modest
img = soft_radial((W, H), (88, 116, 90), (230, 235, 210), (255, 210, 120))
d = ImageDraw.Draw(img)
for x in [80, 220, 700, 820]:
    d.ellipse((x - 90, 180, x + 110, 420), fill=(70, 110, 70))
    d.rectangle((x - 12, 400, x + 12, 780), fill=(90, 60, 40))
d.polygon([(280, H), (380, 700), (520, 700), (640, H)], fill=(200, 180, 140))
wash = Image.new("RGBA", (W, H), (0, 0, 0, 0))
wd = ImageDraw.Draw(wash)
wd.ellipse((200, 100, 900, 700), fill=(255, 200, 80, 70))
wash = wash.filter(ImageFilter.GaussianBlur(50))
img = Image.alpha_composite(img.convert("RGBA"), wash).convert("RGB")
d = ImageDraw.Draw(img)
draw_modest_figure(d, 360, 820, 1.0, robe=(70, 55, 90), head=(220, 185, 165))
draw_modest_figure(d, 500, 840, 0.95, robe=(90, 45, 55), head=(225, 190, 170))
d.ellipse((430, 900, 490, 970), fill=(100, 70, 80))
img = noise(img, 11)
img = vignette(img, 0.3)
img.save(os.path.join(out, "garden-family.jpg"), quality=90)

# garden morning path
img = soft_radial((W, H), (120, 140, 90), (245, 240, 220), (255, 230, 160))
d = ImageDraw.Draw(img)
for i, y in enumerate([200, 320, 450, 580]):
    d.ellipse((-100, y, 500, y + 280), fill=(70 + i * 8, 120, 70))
    d.ellipse((400, y + 40, 1000, y + 320), fill=(60 + i * 6, 110, 65))
d.polygon([(300, H), (400, 500), (520, 500), (620, H)], fill=(210, 190, 150))
rays = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rd = ImageDraw.Draw(rays)
for ang in range(-30, 35, 8):
    rd.polygon(
        [(W * 0.75, 80), (W * 0.75 + ang * 4, H), (W * 0.75 + ang * 4 + 40, H)],
        fill=(255, 245, 200, 28),
    )
rays = rays.filter(ImageFilter.GaussianBlur(8))
img = Image.alpha_composite(img.convert("RGBA"), rays).convert("RGB")
d = ImageDraw.Draw(img)
draw_modest_figure(d, 460, 700, 0.55, robe=(80, 60, 70), head=(220, 185, 165))
img = noise(img, 10)
img = vignette(img, 0.28)
img.save(os.path.join(out, "garden-morning.jpg"), quality=90)

# newborn detail block
img = soft_radial((W, H), (168, 80, 90), (250, 245, 240), (255, 230, 220))
d = ImageDraw.Draw(img)
d.ellipse((180, 420, 720, 980), fill=(248, 236, 228))
draw_baby(d, 450, 680, 1.6)
img = noise(img, 8)
img = vignette(img, 0.32)
img.save(os.path.join(out, "newborn-detail.jpg"), quality=90)

for f in sorted(os.listdir(out)):
    p = os.path.join(out, f)
    print(f, os.path.getsize(p))
