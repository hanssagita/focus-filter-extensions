# Store Assets Guide

This document outlines all the assets prepared for publishing Focus Filter Extension to the Chrome Web Store.

## 📦 Ready for Chrome Web Store Upload

### Extension Package
✅ **ZIP File**: `.output/focus-filter-extension-1.0.0-chrome.zip` (120 KB)
- **Status**: Ready to upload
- **Includes**: Your custom logo icons in all required sizes

### Extension Icons (Included in ZIP)
All icons have been generated from your logo (`assets/logo.png`):

- ✅ **16x16** - Toolbar icon (small)
- ✅ **32x32** - macOS retina toolbar
- ✅ **48x48** - Extension management page
- ✅ **96x96** - Extension management page (retina)
- ✅ **128x128** - Chrome Web Store listing & installation

**Location**: `public/icon/` (auto-copied to build)

## 📸 Screenshots (Chrome Web Store Required)

### Screenshot Files
Located in: `store-assets/screenshots/`

1. **01-popup-interface.png** (1280x800, 65 KB)
   - Shows the extension popup with toggle, input field, and tooltip
   - Empty state: "No blocked sites yet"
   - Perfect for showing the clean, dark UI

2. **02-blocked-page.png** (1280x800, 159 KB)
   - Shows the blocked page warning for instagram.com
   - Demonstrates the blocking feature in action
   - Highlights the matched keyword display

### Upload Instructions
When uploading to Chrome Web Store:
1. Go to "Graphics" section
2. Upload both screenshots in order
3. Add captions (optional but recommended):
   - Screenshot 1: "Clean, minimal popup interface"
   - Screenshot 2: "Blocked page with clear messaging"

## 🎨 Promotional Images (Optional but Recommended)

Located in: `store-assets/promotional/`

### Small Tile (440x280)
- **File**: `small-tile-440x280.png` (79 KB)
- **Use**: Featured listings, search results
- **Content**: Your full logo centered on dark background

### Marquee (1400x560)
- **File**: `marquee-1400x560.png` (163 KB)
- **Use**: Chrome Web Store homepage features
- **Content**: Your full logo centered on dark background

### Upload Instructions
1. Go to "Graphic assets" in Chrome Web Store dashboard
2. Upload small tile (440x280)
3. Upload marquee (1400x560)
4. These improve visibility in the store

## 📋 Asset Checklist for Chrome Web Store

### Required Assets
- [x] Extension ZIP file (`.output/focus-filter-extension-1.0.0-chrome.zip`)
- [x] At least 1 screenshot (we have 2)
- [x] Extension icon 128x128 (included in ZIP)

### Recommended Assets
- [x] 2-5 screenshots (we have 2)
- [x] Small promotional tile 440x280
- [x] Promotional marquee 1400x560
- [ ] Large promotional tile 920x680 (optional, can create if needed)

### Additional Requirements
- [ ] Privacy policy hosted online (use `PRIVACY_POLICY.md`)
- [ ] Description written (see `PUBLISHING.md`)
- [ ] Chrome Web Store developer account ($5 fee)

## 🎯 How Your Logo is Used

### In the Extension
Your logo from `assets/logo.png` has been:
1. ✅ Resized to all required Chrome icon sizes (16, 32, 48, 96, 128)
2. ✅ Integrated into the extension build
3. ✅ Will appear in:
   - Chrome toolbar
   - Extension management page (chrome://extensions/)
   - Chrome Web Store listing
   - Installation confirmation dialog

### In the Store
Your logo will display:
- As the extension icon (128x128)
- In promotional tiles
- In search results
- On the store listing page

## 📁 File Structure

```
focus-filter-extensions/
├── assets/
│   ├── logo.png                    # Original logo (530 KB)
│   ├── popup-screenshot.png        # Original popup screenshot
│   └── blocked-page-screenshot.png # Original blocked page screenshot
├── public/icon/                    # Extension icons (auto-built)
│   ├── 16.png
│   ├── 32.png
│   ├── 48.png
│   ├── 96.png
│   └── 128.png
├── store-assets/                   # Chrome Web Store assets
│   ├── screenshots/
│   │   ├── 01-popup-interface.png      (1280x800)
│   │   └── 02-blocked-page.png         (1280x800)
│   └── promotional/
│       ├── small-tile-440x280.png      (440x280)
│       └── marquee-1400x560.png        (1400x560)
└── .output/
    └── focus-filter-extension-1.0.0-chrome.zip  # Ready to upload!
```

## 🚀 Next Steps for Publishing

1. **Verify Assets**
   - [x] All icons generated
   - [x] Screenshots optimized
   - [x] Promotional images created
   - [x] ZIP file ready

2. **Prepare Store Listing**
   - [ ] Host privacy policy online (GitHub Pages or your website)
   - [ ] Copy description from `PUBLISHING.md`
   - [ ] Prepare any additional marketing text

3. **Upload to Chrome Web Store**
   ```
   Navigate to: https://chrome.google.com/webstore/devconsole
   
   1. Create new item
   2. Upload: .output/focus-filter-extension-1.0.0-chrome.zip
   3. Upload screenshots from: store-assets/screenshots/
   4. Upload promotional images from: store-assets/promotional/
   5. Fill in description and metadata
   6. Submit for review
   ```

4. **Review Timeline**
   - First submission: 1-3 business days
   - Updates: Usually same day to 1 day

## 💡 Tips for Success

### Screenshot Best Practices
✅ **We followed these:**
- Size: 1280x800 (Chrome Web Store requirement)
- Centered content with dark padding
- High quality (95% JPEG quality)
- Show key features: popup and blocking

### Promotional Images
✅ **We created:**
- Consistent dark theme
- Your logo prominently displayed
- Professional appearance
- Optimized file sizes

### Icon Quality
✅ **Your icons are:**
- High quality PNG
- Properly sized for each use case
- Distinctive and recognizable
- Consistent with your brand

## 🔧 Regenerating Assets (If Needed)

If you need to regenerate any assets:

### Recreate Icons
```bash
python3 -c "
from PIL import Image
import os

logo = Image.open('assets/logo.png')
os.makedirs('public/icon', exist_ok=True)

for size in [16, 32, 48, 96, 128]:
    resized = logo.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f'public/icon/{size}.png', 'PNG', optimize=True)
    print(f'Created {size}x{size} icon')
"
```

### Recreate Screenshots
```bash
# Take new screenshots and run:
python3 -c "
from PIL import Image
import os

os.makedirs('store-assets/screenshots', exist_ok=True)

def resize_with_padding(img_path, output_path):
    img = Image.open(img_path)
    # ... (see STORE_ASSETS_SETUP.md for full script)
"
```

Then rebuild:
```bash
nvm use
npm run build
npm run zip
```

## 📞 Support

If you need to create additional promotional images or modify existing ones:
1. Original logo is in `assets/logo.png`
2. Use the scripts above to regenerate
3. Or use image editing software (Photoshop, GIMP, Figma)

---

**Summary**: All assets are ready for Chrome Web Store submission! 🎉

Upload the ZIP file and screenshots to start the review process.
