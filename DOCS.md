# LeetCode AI Assistant - Developer Documentation

## Quick Reference

### Start the Application
```bash
npm start
```

### Toggle Panel
- **Keyboard:** `Ctrl + \``

### Project Commands

| Command | Description |
|---------|-------------|
| `npm start` | Build React app + Start server (production) |
| `npm run dev` | Start Vite dev server (development) |
| `npm run build` | Build React app only |
| `cd server && npm start` | Start server only |
| `cd server && npm run dev` | Start server with nodemon |

---

## Architecture

### Flow Diagram
```
LeetCode Page
    ↓
Content Script (content.js)
    ↓ (captures code via postMessage)
Page Bridge (pageBridge.js)
    ↓ (HTTP POST)
Express Server (localhost:5055)
    ↓ (API call)
Google Gemini API
    ↓ (response)
React Graph Component (iframe)
```

### Key Files

- **`extension/content.js`** - Main extension logic, panel UI, keyboard shortcuts
- **`extension/pageBridge.js`** - Code extraction from LeetCode editor
- **`extension/manifest.json`** - Extension configuration
- **`server/src/index.js`** - Express API + static file server
- **`src/Components/ComplexityGraph.jsx`** - React graph visualization

---

## Environment Variables

### `server/.env`
```env
PORT=5055
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-pro
```

---

## Extension Development

### Reload Extension
After making changes to extension files:
1. Go to `chrome://extensions`
2. Click reload icon on the extension
3. Refresh LeetCode page

### Debug Console
- **Extension logs:** Check LeetCode page console
- **Server logs:** Check terminal where `npm start` runs
- Look for `[LC Assistant]` prefix

---

## API Integration

### Review Endpoint
```javascript
POST http://localhost:5055/api/review
Content-Type: application/json

{
  "code": "def twoSum(nums, target): ...",
  "language": "python3"
}
```

### Complexity Endpoint
```javascript
POST http://localhost:5055/api/complexity
Content-Type: application/json

{
  "code": "def twoSum(nums, target): ...",
  "language": "python3"
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + \`` | Toggle panel visibility |

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5055
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5055 | xargs kill -9
```

### Extension Not Loading
1. Check manifest.json is valid
2. Verify all files in extension/ folder
3. Check browser console for errors

### Failed to Fetch
1. Ensure server is running: `npm start`
2. Check `http://localhost:5055/health`
3. Verify CORS headers in server

---

## Build Process

### Production Build
```bash
npm start
```
1. Runs `vite build` → outputs to `server/public/`
2. Starts Express server
3. Server serves API + static React app

### Development Build
```bash
# Terminal 1
npm run dev

# Terminal 2
cd server && npm run dev
```

---

## Testing

### Manual Testing Checklist
- [ ] Extension loads without errors
- [ ] Panel appears on LeetCode
- [ ] `Ctrl + \`` toggles panel
- [ ] Review button works
- [ ] Time complexity button works
- [ ] Space complexity button works
- [ ] Graphs render correctly
- [ ] Back button returns to main view

### API Testing
```bash
# Health check
curl http://localhost:5055/health

# Test review endpoint
curl -X POST http://localhost:5055/api/review \
  -H "Content-Type: application/json" \
  -d '{"code":"def test(): pass","language":"python3"}'
```

