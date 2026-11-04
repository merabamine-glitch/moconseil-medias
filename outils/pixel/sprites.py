"""Personnages pixel M&O (originaux) : grosse tête, petit corps, charte marine / or / pierre.
Essai du 04/11/2026 — rendu PNG agrandi au plus proche voisin (net à toute taille)."""
from PIL import Image, ImageDraw, ImageFont
PAL = {'.': None, 'K': '#0F1B2D', 'S': '#EDBE95', 's': '#D29A70', 'p': '#E9A08C', 'H': '#4A2B1A', 'h': '#7A4A2C',
       'B': '#1B2A41', 'b': '#2E4A70', 'W': '#F4EFE6', 'G': '#C9A24B', 'M': '#A8502E', 'N': '#0F1B2D', 'w': '#FFFFFF',
       'D': '#2A1A10', 'g': '#8A6A55'}
FEMME = """
......KKKKKKKK......
....KKHHHHHHHHKK....
...KHHhhHHHHhhHHK...
..KHHhHHHHHHHHhHHK..
..KHHHHHHHHHHHHHHK..
.KHHHSSSSSSSSSSHHHK.
.KHHSSSSSSSSSSSSHHK.
.KHHSSKKSSSSKKSSHHK.
.KHHSSKwSSSSKwSSHHK.
.KHHSSSSSSSSSSSSHHK.
.KHHSppSSSSSSppSHHK.
.KHHSSSSSMMSSSSSHHK.
.KHHHSSSSSSSSSSHHHK.
..KHHKSSSSSSSSKHHK..
..KHHHKKSSSSKKHHHK..
...KHHKBBWWBBKHHK...
....KKBBBWWBBBKK....
....KBBBBWWBBGBK....
...KSKBBBWWBBBKSK...
...KSKbBBWWBBbKSK...
....KKBBBBBBBBKK....
.....KBBBBBBBBK.....
.....KBBKKKKBBK.....
.....KNNK..KNNK.....
.....KKKK..KKKK.....
"""
HOMME = """
....................
.....KKKKKKKKKK.....
...KKDDhDDhDDDDKK...
..KDDhDDDDhDDhDDDK..
..KDDDDDDDDDDDDDDK..
.KDDDSSSSSSSSSSDDDK.
.KDDSSSSSSSSSSSSDDK.
.KDSSKKKSSSSKKKSSDK.
.KSSSSKKSSSSKKSSSSK.
.KSSSSKwSSSSKwSSSSK.
.KSSSSSSSSSSSSSSSSK.
.KSSSSSSSssSSSSSSSK.
.KSgSSSSMMMMSSSSgSK.
..KSggSSSSSSSSggSK..
..KKSggggggggggSKK..
....KKKBBWWBBKKK....
....KBBBBWWBBBBK....
....KBBBBWWBBGBK....
...KSKBBBWWBBBKSK...
...KSKbBBWWBBbKSK...
....KKBBBBBBBBKK....
.....KBBBBBBBBK.....
.....KBBKKKKBBK.....
.....KNNK..KNNK.....
.....KKKK..KKKK.....
"""
def sprite(txt, mouth=None, blink=False):
    rows = [r for r in txt.strip('\n').split('\n')]
    assert all(len(r) == 20 for r in rows), [len(r) for r in rows]
    rows = [list(r) for r in rows]
    if blink:
        for y, r in enumerate(rows):
            for x, c in enumerate(r):
                if c == 'w' or (c == 'K' and y in (7, 8, 9) and 4 < x < 15 and rows[y][x] == 'K' and y == 8 + (txt is HOMME)):
                    rows[y][x] = 'S'
    if mouth:
        my = 11 if txt is FEMME else 12
        for x in range(7, 13): rows[my][x] = 'S' if rows[my][x] == 'M' else rows[my][x]
        for dx, dy in mouth: rows[my + dy][dx] = 'M'
    im = Image.new('RGBA', (20, len(rows)), (0, 0, 0, 0))
    for y, r in enumerate(rows):
        for x, c in enumerate(r):
            if PAL.get(c): im.putpixel((x, y), tuple(int(PAL[c][i:i + 2], 16) for i in (1, 3, 5)) + (255,))
    return im
if __name__ == '__main__':
    W, H = 1080, 1350
    out = Image.new('RGB', (W, H), '#F4EFE6')
    d = ImageDraw.Draw(out)
    # sol et ligne d'or
    d.rectangle([0, 1030, W, H], fill='#E8DCC6'); d.rectangle([0, 1026, W, 1032], fill='#C9A24B')
    K = 15
    f = sprite(FEMME).resize((20 * K, 25 * K), Image.NEAREST); h = sprite(HOMME).resize((20 * K, 25 * K), Image.NEAREST)
    out.paste(f, (110, 1030 - 25 * K + 8), f); out.paste(h, (W - 110 - 20 * K, 1030 - 25 * K + 8), h)
    ft = ImageFont.truetype('/home/claude/moconseil-medias/outils/video/public/fonts/Manrope-ExtraBold.ttf', 40) if False else None
    try:
        import glob
        p = (glob.glob('/home/claude/moconseil-medias/outils/**/Manrope*Bold*.ttf', recursive=True) + glob.glob('/usr/share/fonts/**/DejaVuSans-Bold.ttf', recursive=True))[0]
        ft = ImageFont.truetype(p, 44); fs = ImageFont.truetype(p, 30)
    except Exception: ft = fs = ImageFont.load_default()
    def bulle(x, y, w, hh, txt, tail):
        P = 6
        d.rectangle([x, y, x + w, y + hh], fill='#FFFFFF', outline='#0F1B2D', width=P)
        tx, ty = tail
        for i in range(5): d.rectangle([tx - i * P, y + hh + i * P, tx + P, y + hh + (i + 1) * P], fill='#0F1B2D')
        d.multiline_text((x + 30, y + 26), txt, font=ft, fill='#1B2A41', spacing=10)
    bulle(60, 260, 470, 170, "Vous vivez\nen Europe ?", (250, 0))
    bulle(560, 470, 460, 170, "On gère tout\nsur place !", (880, 0))
    d.text((W // 2, 120), "ESSAI · PERSONNAGES PIXEL M&O", font=fs, fill='#9C7726', anchor='mm')
    # planche bouche / clignement
    for i, (m, b) in enumerate([(None, False), ([(8, 0), (9, 0), (10, 0), (11, 0), (9, 1), (10, 1)], False), (None, True)]):
        s = sprite(FEMME, m, b).crop((0, 0, 20, 15)).resize((20 * 6, 15 * 6), Image.NEAREST)
        out.paste(s, (300 + i * 170, 1110), s)
    d.text((W // 2, 1250), "repos · parle · cligne", font=fs, fill='#1B2A41', anchor='mm')
    out.save('essai-personnages-pixel.png')
    print('ok')
