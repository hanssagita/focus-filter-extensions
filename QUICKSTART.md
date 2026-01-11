# Quick Start Guide

Get up and running with the Focus Filter Extension in under 5 minutes!

## 🚀 Installation (First Time)

### Step 1: Build the Extension
```bash
cd focus-filter-extensions
npm install
npm run build
```

### Step 2: Load in Chrome
1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Toggle **Developer mode** ON (top right corner)
4. Click **"Load unpacked"**
5. Select the `.output/chrome-mv3/` folder
6. Done! The extension icon should appear in your toolbar

## 💡 Using the Extension

### Block a Website
1. Click the Focus extension icon in your toolbar
2. Make sure the toggle is **ON** (shows "Active")
3. Type a keyword in the input (e.g., `instagram`)
4. Click **Add** or press Enter
5. Try visiting instagram.com - you'll see a block page! 🎉

### The Tooltip
Hover over the **?** icon to understand how keyword blocking works:
- `instagram` blocks: instagram.com, m.instagram.com, instagram.net, etc.

### Unblock Temporarily
- Click the toggle switch to turn blocking **OFF**
- All sites become accessible again
- Your blocked list is preserved

### Remove a Keyword
- Click the **×** button next to any keyword in your list
- That site becomes accessible immediately

## 🧪 Testing (Optional)

Run the unit tests to verify everything works:
```bash
npm test
```

You should see: `✓ 12 tests passed`

## 🎨 What You'll See

### Popup UI
A clean, dark-themed popup with:
- Toggle switch for quick on/off
- Input field to add keywords
- List of your blocked keywords
- Info tooltip for guidance

### Blocked Page
When you visit a blocked site:
- Beautiful dark page with a lock icon
- Shows the blocked URL
- Shows which keyword matched
- Instructions to unblock

## 🛠️ Development

### Hot Reload Development
```bash
npm run dev
```
- Makes changes to the code
- Extension auto-rebuilds
- Reload extension in `chrome://extensions/` to see changes

### Production Build
```bash
npm run build
```

## 📖 Example Workflow

**Scenario**: Block social media during work hours

1. Open the extension
2. Add these keywords:
   - `instagram`
   - `facebook`
   - `twitter`
   - `tiktok`
3. Close the popup
4. Try visiting any social media site → Blocked! 🚫
5. Need a quick break? Toggle OFF
6. Back to work? Toggle ON

## 🔍 Troubleshooting

### Extension not blocking?
- Make sure the toggle is ON
- Check that the keyword matches the URL
- Reload the page you're trying to block

### Changes not appearing?
1. Go to `chrome://extensions/`
2. Click the refresh icon ↻ next to Focus
3. Reload any affected pages

### Popup not opening?
- Check that the extension is enabled in `chrome://extensions/`
- Try removing and re-adding the extension

## 📚 More Info

- **Full documentation**: See `README.md`
- **Development guide**: See `DEVELOPMENT.md`
- **Project summary**: See `PROJECT_SUMMARY.md`

## 🎯 Pro Tips

1. **Be specific**: Use unique keywords to avoid over-blocking
2. **Check the tooltip**: Understand how keywords match
3. **Test first**: Add one keyword and test before adding more
4. **Use the toggle**: Quick on/off without losing your list
5. **Case doesn't matter**: `Instagram` = `instagram` = `INSTAGRAM`

---

**You're all set! Stay focused! 🚀**
