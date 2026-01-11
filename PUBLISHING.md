# Chrome Web Store Publishing Checklist

Use this checklist to publish Focus - Website Blocker to the Chrome Web Store.

## Pre-Publishing Checklist

### ✅ Code & Build
- [ ] All features working correctly
- [ ] All tests passing (`yarn test`)
- [ ] Production build successful (`yarn build`)
- [ ] Extension manually tested in Chrome
- [ ] No console errors in production build
- [ ] ZIP file created (`yarn zip`)

### ✅ Assets Prepared

#### Required Assets
- [ ] Extension icon (128x128) - ✅ Already in `public/icon/128.png`
- [ ] Screenshots (at least 1, recommended 3-5)
  - Size: 1280x800 or 640x400
  - Show extension popup
  - Show blocked page
  - Show key features

#### Optional but Recommended
- [ ] Small promotional tile (440x280)
- [ ] Promotional marquee (1400x560)
- [ ] Featured/large tile (920x680)

### ✅ Documentation
- [ ] Privacy policy created - ✅ See `PRIVACY_POLICY.md`
- [ ] Privacy policy hosted online (GitHub Pages, your website, etc.)
- [ ] README.md updated with installation instructions
- [ ] License file added (MIT, Apache 2.0, etc.)

### ✅ Metadata
- [ ] Extension name finalized: "Focus - Website Blocker"
- [ ] Short description (132 chars max): "Block distracting websites with keyword-based filtering to stay focused and productive"
- [ ] Full description written (see below)
- [ ] Category selected: Productivity
- [ ] Language: English

## Chrome Web Store Setup

### Step 1: Developer Account
- [ ] Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [ ] Sign in with Google Account
- [ ] Pay $5 one-time developer registration fee
- [ ] Complete developer profile

### Step 2: Create New Item
- [ ] Click "New Item"
- [ ] Upload ZIP file from `.output/`
- [ ] Wait for upload to complete

### Step 3: Store Listing

#### Item Details
- [ ] **Name**: Focus - Website Blocker
- [ ] **Summary**: Block distracting websites with keyword-based filtering to stay focused and productive
- [ ] **Description**: Copy from template below
- [ ] **Category**: Productivity
- [ ] **Language**: English

#### Detailed Description Template
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
Focus does NOT collect, transmit, or share any data. All your settings are stored locally on your device using Chrome's storage API. See our privacy policy for details.

📝 OPEN SOURCE
This extension is open source! Check out the code and contribute on GitHub: [Your GitHub URL]

Need help? Check out our documentation or open an issue on GitHub!
```

#### Graphics
- [ ] Upload icon (128x128)
- [ ] Upload at least 1 screenshot (1280x800 or 640x400)
- [ ] Upload promotional images (optional)

#### Additional Fields
- [ ] Official URL: Your GitHub repository or website
- [ ] Homepage URL: Same as official URL
- [ ] Support URL: GitHub issues page

### Step 4: Privacy Practices
- [ ] Click "Privacy practices"
- [ ] Select "No" for all data collection questions
- [ ] Add privacy policy URL (GitHub Pages link to PRIVACY_POLICY.md)
- [ ] Justify permissions:
  - **storage**: "Used to store your blocked keywords list and preferences locally on your device. No data is transmitted or shared."

### Step 5: Distribution
- [ ] Select visibility: Public
- [ ] Select regions: All regions (or specific ones)
- [ ] Set pricing: Free

### Step 6: Final Review
- [ ] Preview the listing
- [ ] Check all information is correct
- [ ] Verify screenshots look good
- [ ] Test privacy policy link works

### Step 7: Submit
- [ ] Click "Submit for review"
- [ ] Save item ID for future reference
- [ ] Note: First review typically takes 1-3 business days

## Post-Submission

### Monitor Review Status
- [ ] Check dashboard daily for review updates
- [ ] Respond to any feedback from Google reviewers
- [ ] Be ready to make changes if requested

### After Approval
- [ ] Test extension from Chrome Web Store
- [ ] Share the listing link
- [ ] Update README.md with Chrome Web Store badge/link
- [ ] Promote on social media, GitHub, etc.

## Future Updates

When you want to release an update:
1. Increment version in `package.json`
2. Build: `yarn build`
3. Create ZIP: `yarn zip`
4. Upload new ZIP to existing listing
5. Update "What's new" section
6. Submit for review

## Quick Commands

```bash
# Run tests
yarn test

# Build production
yarn build

# Create ZIP for upload
yarn zip

# The ZIP will be in .output/
# Example: focus-filter-extension-1.0.0-chrome.zip
```

## Screenshots Recommendations

Create screenshots showing:
1. **Popup Interface** - Extension popup with toggle, input, and keyword list
2. **Adding Keywords** - Tooltip visible, showing keyword entry
3. **Blocked Page** - Beautiful block warning page
4. **Features Overview** - Annotated screenshot highlighting key features

## Notes

- **Review Time**: Usually 1-3 business days for new extensions
- **Updates**: Updates are typically reviewed faster (same day to 1 day)
- **Rejections**: Common reasons:
  - Missing privacy policy
  - Misleading descriptions
  - Insufficient screenshots
  - Permissions not justified

## Resources

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Web Store Publishing Guide](https://developer.chrome.com/docs/webstore/publish)
- [Chrome Web Store Best Practices](https://developer.chrome.com/docs/webstore/best-practices)
- [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies)

---

Good luck with your submission! 🚀
