"""Audit KU_AI_Direction.pptx — bounds + overlap checks."""
from pptx import Presentation

EMU_PER_INCH = 914400
SLIDE_W = 10.0
SLIDE_H = 5.625

prs = Presentation("KU_AI_Direction.pptx")
print(f"[OK] Slides: {len(prs.slides)}, size {prs.slide_width/EMU_PER_INCH:.2f}x{prs.slide_height/EMU_PER_INCH:.2f}")

total_shapes = 0
total_text_shapes = 0
warnings = []

for idx, slide in enumerate(prs.slides, start=1):
    shape_count = 0
    text_count = 0
    for shape in slide.shapes:
        shape_count += 1
        x = shape.left/EMU_PER_INCH if shape.left else 0
        y = shape.top/EMU_PER_INCH if shape.top else 0
        w = shape.width/EMU_PER_INCH if shape.width else 0
        h = shape.height/EMU_PER_INCH if shape.height else 0

        if shape.has_text_frame and shape.text_frame.text.strip():
            text_count += 1

        # Bounds check
        if x < -0.01 or y < -0.01:
            warnings.append(f"Slide {idx}: shape ({x:.2f},{y:.2f}) past top/left")
        if x + w > SLIDE_W + 0.01:
            warnings.append(f"Slide {idx}: right edge {x+w:.2f}\" > {SLIDE_W}\"")
        if y + h > SLIDE_H + 0.01:
            warnings.append(f"Slide {idx}: bottom edge {y+h:.2f}\" > {SLIDE_H}\"")

    total_shapes += shape_count
    total_text_shapes += text_count
    print(f"[OK] Slide {idx}: {shape_count} shapes, {text_count} with text")

print(f"\n[TOTAL] {total_shapes} shapes, {total_text_shapes} with text")

if warnings:
    print(f"\n[WARN] {len(warnings)} issue(s):")
    for w in warnings:
        print(f"  - {w}")
else:
    print("\n[OK] No bounds violations.")
