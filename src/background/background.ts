const HOMOGLYPHS: { [key: string]: string[] } = {
  'a': ['а', 'ɑ'], 'c': ['с', 'ϲ'], 'e': ['е', 'ε'],
  'o': ['о', 'ο'], 'p': ['р', 'ρ'], 'x': ['х', 'χ'],
  'y': ['у', 'γ'], 'i': ['і', 'ı'], 's': ['ѕ'], 'v': ['ν'],
  'A': ['А', 'Α'], 'B': ['В', 'Β'], 'C': ['С'], 'E': ['Е', 'Ε'],
  'H': ['Н', 'Η'], 'I': ['І', 'Ι'], 'K': ['К', 'Κ'], 'M': ['М', 'Μ'],
  'N': ['Ν'], 'O': ['О', 'Ο'], 'P': ['Р', 'Ρ'], 'T': ['Т', 'Τ'],
  'X': ['Х', 'Χ'], 'Y': ['Υ'], 'Z': ['Ζ'], 'S': ['Ѕ']
};

const ZERO_WIDTH = ['\u200B', '\u200C', '\u200D'];

function scramble(text: string): string {
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (HOMOGLYPHS[char]) {
      const variants = HOMOGLYPHS[char];
      result += variants[Math.floor(Math.random() * variants.length)];
    } else {
      result += char;
    }
    if (/[a-zA-Z]/.test(char) && Math.random() < 0.7) {
      result += ZERO_WIDTH[Math.floor(Math.random() * ZERO_WIDTH.length)];
    }
  }
  return result;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scrambleText',
    title: 'Scramble selected text',
    contexts: ['selection', 'editable']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'scrambleText' && info.selectionText && tab?.id) {
    const scrambled = scramble(info.selectionText);
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (scrambledText: string) => {
        navigator.clipboard.writeText(scrambledText);
        
        const toast = document.createElement('div');
        toast.innerHTML = '✓ Text scrambled!<br><small style="opacity: 0.9; font-size: 12px;">Copied to clipboard - paste with Ctrl+V</small>';
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 999999;
          animation: slideIn 0.3s ease-out;
          line-height: 1.5;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      },
      args: [scrambled]
    });
  }
});
