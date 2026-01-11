# Chrome Web Store Upload Quick Reference

## 📦 Files to Upload

### 1. Extension Package
**File**: `.output/focus-filter-extension-1.0.0-chrome.zip` (120 KB)
- ✅ This file is **READY TO UPLOAD**
- Contains all code and your custom logo icons
- Upload in the "Package" section

### 2. Screenshots (Required)
**Location**: `store-assets/screenshots/`

Upload these in order:
1. `01-popup-interface.png` (1280x800)
   - Caption: "Clean, minimal popup interface with dark theme"
   
2. `02-blocked-page.png` (1280x800)
   - Caption: "Blocked page with clear messaging and matched keyword"

### 3. Promotional Images (Recommended)
**Location**: `store-assets/promotional/`

- `small-tile-440x280.png` → Upload as "Small promotional tile"
- `marquee-1400x560.png` → Upload as "Marquee promotional image"

## 🎯 Store Listing Quick Fill

### Basic Info
```
Name: Focus - Website Blocker
Summary: Block distracting websites with keyword-based filtering
Category: Productivity
Language: English
```

### Description
```
Stay focused and productive by blocking distracting websites with Focus!

⭐ KEY FEATURES
• Keyword-based blocking - Block sites by keyword (e.g., "instagram" blocks instagram.com, m.instagram.com, and more)
• Quick toggle - Turn blocking on/off instantly without losing your list
• Beautiful dark theme - Clean, modern Google Material 3 inspired interface
• Non-intrusive - Simple popup that doesn't disrupt your workflow
• Privacy-first - All data stays on your device, nothing is collected or transmitted

🚀 HOW IT WORKS
1. Click the Focus icon to open the popup
2. Add keywords for sites you want to block (e.g., "facebook", "instagram", "twitter")
3. When blocking is on, visiting those sites shows a friendly reminder to stay focused
4. Toggle off anytime to temporarily access blocked sites
5. Remove keywords individually as needed

💡 PERFECT FOR
• Students focusing on studies
• Remote workers avoiding distractions
• Anyone wanting to build better digital habits
• People practicing digital minimalism

🔒 PRIVACY
Focus does NOT collect, transmit, or share any data. All your settings are stored locally on your device using Chrome's storage API.

Need help? Visit our GitHub repository!
```

### Privacy Practices
```
Data Collection: No data collected
Permissions: storage (to save your blocked sites list locally)
Privacy Policy URL: [Your GitHub Pages URL or website]
```

## ⚡ Upload Steps (5 Minutes)

1. **Go to Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Sign in with Google Account
   - Pay $5 fee (one-time, if not already paid)

2. **Create New Item**
   - Click "New Item"
   - Upload: `.output/focus-filter-extension-1.0.0-chrome.zip`
   - Wait for upload to complete

3. **Fill Store Listing**
   - Name: `Focus - Website Blocker`
   - Summary: Copy from above
   - Description: Copy from above
   - Category: `Productivity`

4. **Upload Graphics**
   - Screenshots → Upload 2 files from `store-assets/screenshots/`
   - Small tile → Upload from `store-assets/promotional/`
   - Marquee → Upload from `store-assets/promotional/`

5. **Privacy**
   - No data collection → Select "No" for all
   - Privacy policy URL → [Your URL]
   - Justify "storage" permission → "Store blocked sites list locally"

6. **Submit**
   - Review everything
   - Click "Submit for review"
   - Wait 1-3 business days

## ✅ Pre-Upload Checklist

Before clicking "Submit":
- [ ] ZIP file uploaded successfully
- [ ] 2 screenshots uploaded
- [ ] Promotional images uploaded
- [ ] Name and description filled
- [ ] Category selected (Productivity)
- [ ] Privacy practices completed
- [ ] Privacy policy URL added
- [ ] Permissions justified
- [ ] Preview looks good

## 🎨 Asset Summary

| Asset Type | File | Size | Status |
|------------|------|------|--------|
| Extension ZIP | focus-filter-extension-1.0.0-chrome.zip | 120 KB | ✅ Ready |
| Screenshot 1 | 01-popup-interface.png | 1280x800 | ✅ Ready |
| Screenshot 2 | 02-blocked-page.png | 1280x800 | ✅ Ready |
| Small Tile | small-tile-440x280.png | 440x280 | ✅ Ready |
| Marquee | marquee-1400x560.png | 1400x560 | ✅ Ready |
| Icon 128x128 | (included in ZIP) | 128x128 | ✅ Ready |

## 🔗 Important Links

- Chrome Web Store Dashboard: https://chrome.google.com/webstore/devconsole
- Publishing Guide: [PUBLISHING.md](./PUBLISHING.md)
- Privacy Policy: [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)
- Full Asset Guide: [STORE_ASSETS.md](./STORE_ASSETS.md)

## 📞 Need Help?

- Check `PUBLISHING.md` for detailed step-by-step guide
- Check `STORE_ASSETS.md` for asset regeneration
- Chrome Web Store Publishing Docs: https://developer.chrome.com/docs/webstore/publish

---

**You're ready to publish! All assets are prepared and optimized.** 🚀
