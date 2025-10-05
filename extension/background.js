// Simple background script reserved for future messaging or auth.
chrome.runtime.onInstalled.addListener(() => {
  // Initialize default backend URL if not set
  chrome.storage.sync.get(['EXT_BACKEND_URL'], (data) => {
    if (!data.EXT_BACKEND_URL) {
      chrome.storage.sync.set({ EXT_BACKEND_URL: 'http://localhost:5173' });
    }
  });
});


