{
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

let currentProfile = 'anti-mod';
let isEnabled = true;

chrome.storage.sync.get(['profile', 'enabled'], (data: any) => {
  currentProfile = data.profile || 'anti-mod';
  isEnabled = data.enabled !== false;
});

chrome.storage.onChanged.addListener((changes: any) => {
  if (changes.profile) currentProfile = changes.profile.newValue;
  if (changes.enabled) isEnabled = changes.enabled.newValue;
});

function scramble(text: string): string {
  let result = '';
  let zwProb = 0.7;
  let replaceProb = 1.0;
  switch(currentProfile) {
    case 'stealth':  zwProb = 0.1; replaceProb = 0.2; break;
    case 'anti-ai':  zwProb = 0.9; replaceProb = 1.0; break;
    case 'chaos':    zwProb = 1.0; replaceProb = 1.0; break;
    case 'anti-mod':
    default:         zwProb = 0.7; replaceProb = 1.0;
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
      if (currentProfile === 'chaos' && Math.random() < 0.5) {
        result += ZERO_WIDTH[Math.floor(Math.random() * ZERO_WIDTH.length)];
      }
    }
  }
  return result;
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (!isEnabled) return;
  const target = e.target as HTMLElement;
  const isEditable = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable;
  if (!isEditable) return;

  // Ctrl+Shift+Q — the only shortcut (works on Q or q)
  const isScrambleKey = e.ctrlKey && e.shiftKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'q';
  if (!isScrambleKey) return;
  e.preventDefault();

  const inputElement = target as HTMLInputElement | HTMLTextAreaElement;

  if ('value' in inputElement) {
    const start = inputElement.selectionStart ?? 0;
    const end   = inputElement.selectionEnd   ?? 0;
    if (start === end) return;

    const before    = inputElement.value.slice(0, start);
    const selected  = inputElement.value.slice(start, end);
    const after     = inputElement.value.slice(end);
    const scrambled = scramble(selected);
    inputElement.value = before + scrambled + after;
    inputElement.setSelectionRange(start, start + scrambled.length);
    target.dispatchEvent(new Event('input', { bubbles: true }));

  } else if (target.isContentEditable) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const scrambled = scramble(selectedText);
    range.deleteContents();
    const textNode = document.createTextNode(scrambled);
    range.insertNode(textNode);
    range.selectNode(textNode);
    sel.removeAllRanges();
    sel.addRange(range);
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
}
