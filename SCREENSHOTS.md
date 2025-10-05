# Screenshot Guide for GitHub README

This guide will help you capture the screenshots needed for the README.md file.

## Required Screenshots

### 1. `screenshots/demo.png`
**What to capture:** Full view of LeetCode problem page with the extension panel visible

**Steps:**
1. Go to any LeetCode problem (e.g., Two Sum)
2. Make sure the extension panel is visible (press `Ctrl + \`` if hidden)
3. Write some code in the editor
4. Take a screenshot showing:
   - LeetCode problem on the left
   - Your code in the editor
   - Extension panel on the right with buttons visible
5. Save as `screenshots/demo.png`

---

### 2. `screenshots/main-panel.png`
**What to capture:** Close-up of the extension panel with all three buttons

**Steps:**
1. Make sure panel is visible
2. Panel should show:
   - "LeetCode Assistant" title
   - Review button (blue)
   - Time button (green)
   - Space button (orange)
   - Status: "Ready" or "Idle"
3. Crop tightly around the panel
4. Save as `screenshots/main-panel.png`

---

### 3. `screenshots/code-review.png`
**What to capture:** Panel showing AI code review results

**Steps:**
1. Write a LeetCode solution (any problem)
2. Click the **Review** button
3. Wait for AI response to appear
4. Take screenshot showing:
   - The review text with hints/suggestions
   - "← Back" button visible
5. Save as `screenshots/code-review.png`

**Example code to test with:**
```python
def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
```

---

### 4. `screenshots/time-complexity.png`
**What to capture:** Panel showing time complexity graph

**Steps:**
1. Write a LeetCode solution
2. Click the **Time** button
3. Wait for graph to load
4. Take screenshot showing:
   - The complexity graph with curve
   - Big-O notation (e.g., O(n²))
   - Graph axes and labels
5. Save as `screenshots/time-complexity.png`

---

### 5. `screenshots/space-complexity.png`
**What to capture:** Panel showing space complexity graph

**Steps:**
1. Write a LeetCode solution
2. Click the **Space** button
3. Wait for graph to load
4. Take screenshot showing:
   - The complexity graph
   - Big-O notation (e.g., O(1) or O(n))
   - Graph axes and labels
5. Save as `screenshots/space-complexity.png`

---

### 6. `screenshots/extension-loaded.png`
**What to capture:** Chrome extensions page showing the extension installed

**Steps:**
1. Go to `chrome://extensions` or `brave://extensions`
2. Make sure "Developer mode" is enabled
3. Locate the "LeetCode Assistant" extension
4. Take screenshot showing:
   - Extension card with name and description
   - Extension enabled (toggle on)
   - "Load unpacked" button visible
5. Save as `screenshots/extension-loaded.png`

---

## Screenshot Tips

### Quality
- Use high resolution (at least 1920x1080)
- Make sure text is readable
- Use good lighting (if taking photos of screen)
- Prefer native screenshot tools over photos

### Tools
**Windows:**
- `Win + Shift + S` - Snipping tool
- `Win + PrtScn` - Full screenshot

**Mac:**
- `Cmd + Shift + 4` - Area selection
- `Cmd + Shift + 3` - Full screenshot

**Chrome Extension:**
- Use "Awesome Screenshot" or "Nimbus Screenshot"

### Editing
- Crop unnecessary parts
- Highlight important features with arrows/boxes (optional)
- Compress images to reduce file size
- Use PNG format for better quality

---

## Folder Structure

Create this folder structure:
```
leetcode-ai-assistant/
├── screenshots/
│   ├── demo.png
│   ├── main-panel.png
│   ├── code-review.png
│   ├── time-complexity.png
│   ├── space-complexity.png
│   └── extension-loaded.png
└── README.md
```

---

## After Taking Screenshots

1. Create `screenshots` folder in project root
2. Add all 6 screenshots with exact names above
3. Verify images load in README by opening it in GitHub
4. Optimize images if they're too large (use tinypng.com)

---

## Optional Screenshots

If you want to make the README even better, consider adding:

- **Dark mode comparison** - Show extension in light vs dark theme
- **Multiple problems** - Show extension working on different LeetCode problems
- **Error handling** - Show how extension handles errors gracefully
- **Mobile view** - If extension works on mobile browsers

---

## Quick Checklist

Before pushing to GitHub:

- [ ] Created `screenshots/` folder
- [ ] Captured all 6 required screenshots
- [ ] Named files exactly as specified
- [ ] Images are clear and readable
- [ ] File sizes are reasonable (<500KB each)
- [ ] Tested images load in README.md locally
- [ ] Added screenshots to git: `git add screenshots/`
