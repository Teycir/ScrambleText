const HOMOGLYPHS: { [key: string]: string[] } = {
  'a': ['а', 'ɑ', 'α', 'ａ'], 'b': ['Ь', 'ḃ', 'ｂ'], 'c': ['с', 'ϲ', 'ⅽ'], 
  'd': ['ԁ', 'ḋ', 'ｄ'], 'e': ['е', 'ε', 'ｅ'], 'f': ['ḟ', 'ｆ'], 
  'g': ['ɡ', 'ġ', 'ｇ'], 'h': ['һ', 'ḣ', 'ｈ'], 'i': ['і', 'ı', 'ɪ', 'ｉ'],
  'j': ['ј', 'ϳ', 'ｊ'], 'k': ['ḳ', 'ｋ'], 'l': ['ⅼ', 'Ⅰ', 'ｌ'],
  'm': ['ⅿ', 'ṁ', 'ｍ'], 'n': ['ո', 'ṅ', 'ｎ'], 'o': ['о', 'ο', 'σ', 'ｏ'],
  'p': ['р', 'ρ', 'ｐ'], 'q': ['ԛ', 'ｑ'], 'r': ['ｒ'],
  's': ['ѕ', 'ṡ', 'ｓ'], 't': ['ｔ', 'ṫ'], 'u': ['υ', 'ս', 'ｕ'],
  'v': ['ν', 'ѵ', 'ｖ'], 'w': ['ԝ', 'ẁ', 'ｗ'], 'x': ['х', 'χ', 'ｘ'],
  'y': ['у', 'γ', 'ỳ', 'ｙ'], 'z': ['ᴢ', 'ż', 'ｚ'],
  'A': ['А', 'Α', 'Ａ'], 'B': ['В', 'Β', 'Ḃ', 'Ｂ'], 'C': ['С', 'Ⅽ', 'Ｃ'],
  'D': ['Ḋ', 'Ｄ'], 'E': ['Е', 'Ε', 'Ｅ'], 'F': ['Ḟ', 'Ｆ'],
  'G': ['Ġ', 'Ｇ'], 'H': ['Н', 'Η', 'Ḣ', 'Ｈ'], 'I': ['І', 'Ι', 'Ⅰ', 'Ｉ'],
  'J': ['Ј', 'Ｊ'], 'K': ['К', 'Κ', 'Ｋ'], 'L': ['Ⅼ', 'Ｌ'],
  'M': ['М', 'Μ', 'Ⅿ', 'Ṁ', 'Ｍ'], 'N': ['Ν', 'Ṅ', 'Ｎ'], 'O': ['О', 'Ο', 'Ｏ'],
  'P': ['Р', 'Ρ', 'Ｐ'], 'Q': ['Ｑ'], 'R': ['Ｒ'],
  'S': ['Ѕ', 'Ṡ', 'Ｓ'], 'T': ['Т', 'Τ', 'Ṫ', 'Ｔ'], 'U': ['Ս', 'Ｕ'],
  'V': ['Ѵ', 'Ｖ'], 'W': ['Ԝ', 'Ẁ', 'Ｗ'], 'X': ['Х', 'Χ', 'Ｘ'],
  'Y': ['Υ', 'Ỳ', 'Ｙ'], 'Z': ['Ζ', 'Ż', 'Ｚ'],
  '0': ['О', 'Ο', '০'], '1': ['Ⅰ', 'Ӏ', 'l'],
  '2': ['Ꙅ'], '3': ['Ʒ'], '5': ['Ƽ'], '6': ['б']
};

const ZERO_WIDTH = ['\u200B', '\u200C', '\u200D'];

const PROFILE_NAMES: { [key: string]: string } = {
  'anti-ai': '🤖 Anti-AI Training',
  'anti-mod': '🛡️ Anti-Moderation',
  'stealth': '👻 Privacy Stealth',
  'chaos': '💥 Maximum Chaos'
};

function scramble(text: string, profile: string): string {
  let result = '';
  let zwProb = 0.7;
  let replaceProb = 1.0;
  
  switch(profile) {
    case 'stealth':
      zwProb = 0.1;
      replaceProb = 0.2;
      break;
    case 'anti-ai':
      zwProb = 0.9;
      replaceProb = 1.0;
      break;
    case 'chaos':
      zwProb = 1.0;
      replaceProb = 1.0;
      break;
    case 'anti-mod':
    default:
      zwProb = 0.7;
      replaceProb = 1.0;
  }
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (HOMOGLYPHS[char] && Math.random() < replaceProb) {
      const variants = HOMOGLYPHS[char];
      result += variants[Math.floor(Math.random() * variants.length)];
    } else {
      result += char;
    }
    if (/[a-zA-Z0-9]/.test(char) && Math.random() < zwProb) {
      result += ZERO_WIDTH[Math.floor(Math.random() * ZERO_WIDTH.length)];
      if (profile === 'chaos' && Math.random() < 0.5) {
        result += ZERO_WIDTH[Math.floor(Math.random() * ZERO_WIDTH.length)];
      }
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
    const settings = await chrome.storage.sync.get(['profile', 'enabled']);
    if (settings.enabled === false) return;
    const currentProfile = settings.profile || 'anti-mod';
    const scrambled = scramble(info.selectionText, currentProfile);
    const profileName = PROFILE_NAMES[currentProfile];
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (scrambledText: string, modeName: string) => {
        navigator.clipboard.writeText(scrambledText);
        
        const toast = document.createElement('div');
        toast.innerHTML = `✓ Text scrambled!<br><small style="opacity: 0.9; font-size: 11px;">${modeName} • Copied to clipboard</small>`;
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
      args: [scrambled, profileName]
    });
  }
});
