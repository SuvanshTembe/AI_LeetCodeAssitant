# Quick Start Guide

Get up and running in 5 minutes! ⚡

---

## Step 1: Install Dependencies (2 min)

Open terminal in project folder:

npm install
cd server
npm install
cd ..
```

---

## Step 2: Get API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

---

## Step 3: Configure

Edit `server/.env` file:

```env
PORT=5055
GEMINI_API_KEY=paste_your_key_here
GEMINI_MODEL=gemini-2.5-pro
```

---

## Step 4: Start Server

```bash
npm start
```

You should see:
```
Server listening on http://localhost:5055
```

---

## Step 5: Load Extension (1 min)

1. Open Chrome/Brave
2. Go to `chrome://extensions`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the `extension` folder
6. Done! ✅

---

## Step 6: Use It! (30 sec)

1. Go to https://leetcode.com/problems/two-sum/
2. Write some code
3. See the panel on the right? Click buttons!
4. Press `Ctrl + \`` to hide/show panel

---

## That's It! 🎉

You're ready to use the LeetCode AI Assistant!

### Quick Tips

- **Hide panel:** Press `Ctrl + \``
- **Review code:** Click "Review" button
- **See complexity:** Click "Time" or "Space" buttons
- **Go back:** Click "← Back" button

### Troubleshooting

**Panel not showing?**
- Reload extension in `chrome://extensions`
- Refresh LeetCode page

**"Failed to fetch" error?**
- Make sure server is running (`npm start`)
- Check `http://localhost:5055/health`

**Need help?**
- Check README.md for detailed docs
- Open an issue on GitHub

---

**Enjoy! 🚀**
