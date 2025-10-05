# Contributing to LeetCode AI Assistant

Thank you for considering contributing to this project! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- **Clear title** describing the bug
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature already exists or is planned
- Describe the feature clearly
- Explain why it would be useful
- Provide examples or mockups if possible

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add: Feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/YourFeatureName
   ```
7. **Open a Pull Request**

## Development Setup

### Prerequisites
- Node.js v16+
- Chrome/Brave browser
- Gemini API key

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/leetcode-ai-assistant.git
cd leetcode-ai-assistant

# Install dependencies
npm install
cd server && npm install && cd ..

# Configure environment
cp server/.env.example server/.env
# Edit server/.env and add your API key

# Start development
npm run dev
```

## Code Style

### JavaScript/React
- Use ES6+ features
- Follow existing code style
- Add comments for complex logic
- Use meaningful variable names

### Formatting
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- Trailing commas in objects/arrays

### Example
```javascript
const myFunction = (param1, param2) => {
  // Clear comment explaining logic
  const result = param1 + param2;
  return result;
};
```

## Testing

Before submitting a PR, test:
- [ ] Extension loads without errors
- [ ] All buttons work correctly
- [ ] Keyboard shortcut (`Ctrl + \``) works
- [ ] API endpoints respond correctly
- [ ] No console errors
- [ ] Works on different LeetCode problems

## Commit Message Guidelines

Use clear, descriptive commit messages:

- **Add:** New feature
- **Fix:** Bug fix
- **Update:** Modify existing feature
- **Remove:** Delete code/feature
- **Refactor:** Code restructuring
- **Docs:** Documentation changes

Examples:
```
Add: Keyboard shortcut to toggle panel
Fix: CORS error on API requests
Update: Improve graph visualization
Docs: Add setup instructions to README
```

## Project Structure

```
├── extension/          # Browser extension
│   ├── content.js     # Main logic
│   ├── manifest.json  # Config
│   └── pageBridge.js  # Code extraction
├── server/            # Backend
│   └── src/index.js   # API server
├── src/               # React app
│   └── Components/    # UI components
└── README.md          # Documentation
```

## Areas for Contribution

### High Priority
- [ ] Add support for more programming languages
- [ ] Improve error handling and user feedback
- [ ] Add unit tests
- [ ] Optimize graph rendering performance
- [ ] Add caching for API responses

### Medium Priority
- [ ] Dark/light theme toggle
- [ ] Customizable keyboard shortcuts
- [ ] Export review/complexity reports
- [ ] Support for other coding platforms (HackerRank, CodeForces)
- [ ] Offline mode with cached responses

### Low Priority
- [ ] Animation improvements
- [ ] Additional graph types
- [ ] Internationalization (i18n)
- [ ] Browser compatibility (Firefox, Edge)

## Questions?

Feel free to:
- Open an issue for questions
- Join discussions in existing issues
- Reach out to maintainers

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🚀**
