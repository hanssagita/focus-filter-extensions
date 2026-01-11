# Manual Installation Guide

If you received this extension as a ZIP file or from GitHub, follow these steps to install it manually.

## Installation Steps

### 1. Download or Build

**Option A: If you have the source code**
```bash
npm install
npm run build
```

**Option B: If you have a pre-built ZIP**
- Extract the ZIP file to a folder

### 2. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right corner)
3. Click **"Load unpacked"**
4. Select the folder:
   - If built from source: `.output/chrome-mv3/`
   - If extracted from ZIP: The extracted folder containing `manifest.json`
5. The extension icon should appear in your toolbar

### 3. Pin the Extension (Optional)

1. Click the puzzle piece icon in Chrome's toolbar
2. Find "Focus - Website Blocker"
3. Click the pin icon to keep it visible

## Using the Extension

1. Click the Focus icon in your toolbar
2. Add keywords for sites you want to block (e.g., "instagram", "facebook")
3. Toggle blocking on/off as needed
4. Visit a blocked site to see the block page

## Updating

To update to a new version:
1. Remove the old version from `chrome://extensions/`
2. Follow the installation steps above with the new files

## Troubleshooting

**Extension not appearing?**
- Make sure Developer mode is enabled
- Check that you selected the correct folder (should contain `manifest.json`)

**Sites not blocking?**
- Make sure the toggle is ON (shows "Active")
- Check that your keyword matches the site URL
- Reload the page after adding a keyword

## Need Help?

Check the README.md or QUICKSTART.md for more information.
