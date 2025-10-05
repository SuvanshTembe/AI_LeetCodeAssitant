document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('backend');
  const save = document.getElementById('save');
  const saved = document.getElementById('saved');

  chrome.storage.sync.get(['EXT_BACKEND_URL'], (data) => {
    input.value = data.EXT_BACKEND_URL || 'http://localhost:5055';
  });

  save.addEventListener('click', () => {
    chrome.storage.sync.set({ EXT_BACKEND_URL: input.value.trim() }, () => {
      saved.textContent = 'Saved!';
      setTimeout(() => (saved.textContent = ''), 1200);
    });
  });
});


