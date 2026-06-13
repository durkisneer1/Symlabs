from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

W, H = 1200, 630
out = Path('public/images/symlabs-og.png')
logo_path = Path('public/images/brand/symlabs@4x.png')
img = Image.new('RGBA', (W, H), (248, 250, 252, 255))
d = ImageDraw.Draw(img)
for y in range(H):
    t = y / (H - 1)
    d.line([(0, y), (W, y)], fill=(int(248*(1-t)+241*t), int(250*(1-t)+245*t), int(252*(1-t)+249*t), 255))

glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse((-130, 360, 300, 790), fill=(108, 232, 219, 95))
gd.ellipse((870, -180, 1320, 270), fill=(255, 171, 100, 105))
gd.ellipse((760, 410, 1120, 760), fill=(196, 181, 253, 70))
img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(48)))
d = ImageDraw.Draw(img)

d.rounded_rectangle((76, 72, 1124, 558), radius=34, fill=(255, 255, 255, 235), outline=(220, 226, 235, 255), width=2)
d.rounded_rectangle((96, 92, 1104, 538), radius=24, outline=(236, 240, 246, 255), width=1)

logo = Image.open(logo_path).convert('RGBA')
logo.thumbnail((520, 124), Image.Resampling.LANCZOS)
img.alpha_composite(logo, (130, 126))

def font(name, size):
    for p in [Path('C:/Windows/Fonts') / name, Path('/usr/share/fonts/truetype/dejavu') / name]:
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()

heading = font('segoeui.ttf', 60)
sub = font('segoeui.ttf', 30)
small = font('segoeui.ttf', 24)

d.text((132, 282), 'Free programming courseware', font=heading, fill=(24, 24, 27, 255))
d.text((134, 364), 'Lessons, practice, and classroom tools', font=sub, fill=(82, 82, 91, 255))
d.text((134, 405), 'for web and software topics.', font=sub, fill=(82, 82, 91, 255))

d.line((134, 482, 1066, 482), fill=(226, 232, 240, 255), width=2)
d.text((134, 492), 'symlabs.net', font=small, fill=(113, 113, 122, 255))
img.convert('RGB').save(out, quality=94, optimize=True)
