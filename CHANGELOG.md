# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-10-05

### Added
- 🎉 Initial release
- AI-powered code review using Google Gemini 2.5 Pro
- Time complexity analysis with interactive graphs
- Space complexity analysis with interactive graphs
- Chrome/Brave extension with floating panel
- Keyboard shortcut (`Ctrl + \``) to toggle panel visibility
- Dark UI matching LeetCode's theme
- Express backend server with API endpoints
- React-based graph visualization using Chart.js
- LaTeX rendering for Big-O notation using KaTeX
- CORS support for cross-origin requests
- Shadow DOM for style isolation
- Automatic code capture from LeetCode editor
- Health check endpoint for server monitoring

### Features
- **Review Button** - Get AI hints and suggestions
- **Time Button** - Visualize time complexity
- **Space Button** - Visualize space complexity
- **Back Button** - Return to main view
- **Toggle Panel** - Hide/show with keyboard shortcut

### Technical
- Manifest V3 Chrome Extension
- Express.js backend on port 5055
- Vite build system for React app
- TailwindCSS for styling
- Node.js with ES modules
- Environment-based configuration

---

## Future Releases

### [1.1.0] - Planned
- [ ] Support for more programming languages
- [ ] Caching for API responses
- [ ] Export review/complexity reports
- [ ] Improved error messages
- [ ] Unit tests

### [1.2.0] - Planned
- [ ] Dark/light theme toggle
- [ ] Customizable keyboard shortcuts
- [ ] Firefox extension support
- [ ] Offline mode

---

## Version Format

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards compatible)
- **PATCH** version for bug fixes (backwards compatible)
