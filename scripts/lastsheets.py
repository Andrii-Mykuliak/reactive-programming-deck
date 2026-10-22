"""Tile the last step of every slide (or every step with --all) into 3x2 sheets: out/sheet-N.png"""
import glob
import os
import re
import sys

from PIL import Image

shots = sorted(glob.glob("out/shots/*.png"))
by = {}
for f in shots:
    m = re.match(r".*?(\d+)-(\d+)\.png$", f)
    by.setdefault(int(m.group(1)), []).append((int(m.group(2)), f))
pick = []
for n in sorted(by):
    steps = sorted(by[n])
    pick += [f for _, f in steps] if "--all" in sys.argv else [steps[-1][1]]
only = [a for a in sys.argv[1:] if a.isdigit()]
if only:
    pick = [f for f in pick if int(re.match(r".*?(\d+)-\d+\.png$", f).group(1)) in map(int, only)]
for f in glob.glob("out/sheet-*.png"):
    os.remove(f)
w, h = Image.open(pick[0]).size
for k in range(0, len(pick), 6):
    sheet = Image.new("RGB", (w * 3 + 16, h * 2 + 8), (60, 60, 60))
    for j, f in enumerate(pick[k:k + 6]):
        sheet.paste(Image.open(f), ((j % 3) * (w + 8), (j // 3) * (h + 8)))
    sheet.save(f"out/sheet-{k // 6 + 1}.png")
print(len(pick), "shots")
