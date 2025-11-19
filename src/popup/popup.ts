{
const previewInput = document.getElementById('previewInput') as HTMLTextAreaElement;
const previewOutput = document.getElementById('previewOutput') as HTMLDivElement;
const copyButton = document.getElementById('copyButton') as HTMLButtonElement;
const regenerateButton = document.getElementById('regenerateButton') as HTMLButtonElement;
const profileSelect = document.getElementById('profileSelect') as HTMLSelectElement;

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

let lastInput = '';
let lastOutput = '';
let currentProfile = 'stealth';

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

chrome.storage.sync.get(['profile'], (data: any) => {
  currentProfile = data.profile || 'stealth';
  if (profileSelect) profileSelect.value = currentProfile;
});

profileSelect.addEventListener('change', () => {
  currentProfile = profileSelect.value;
  chrome.storage.sync.set({ profile: currentProfile });
  if (lastInput) {
    lastOutput = scramble(lastInput, currentProfile);
    previewOutput.textContent = lastOutput;
  }
});

previewInput.addEventListener('input', () => {
  const currentInput = previewInput.value;
  
  if (currentInput.startsWith(lastInput) && currentInput.length > lastInput.length) {
    const newChars = currentInput.slice(lastInput.length);
    lastOutput += scramble(newChars, currentProfile);
  } else {
    lastOutput = scramble(currentInput, currentProfile);
  }
  
  lastInput = currentInput;
  previewOutput.textContent = lastOutput;
});

regenerateButton.addEventListener('click', () => {
  if (lastInput) {
    lastOutput = scramble(lastInput, currentProfile);
    previewOutput.textContent = lastOutput;
    regenerateButton.textContent = '✓';
    setTimeout(() => regenerateButton.textContent = '🔄', 500);
  }
});

copyButton.addEventListener('click', async () => {
  const text = previewOutput.textContent || '';
  if (text) {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = '✓';
    setTimeout(() => copyButton.textContent = '📋', 2000);
  }
});
}
