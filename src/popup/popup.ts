{
const previewInput = document.getElementById('previewInput') as HTMLTextAreaElement;
const previewOutput = document.getElementById('previewOutput') as HTMLDivElement;
const copyButton = document.getElementById('copyButton') as HTMLButtonElement;
const copyStatus = document.getElementById('copyStatus') as HTMLSpanElement;

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
    if (/[a-zA-Z0-9]/.test(char) && Math.random() < 0.7) {
      result += ZERO_WIDTH[Math.floor(Math.random() * ZERO_WIDTH.length)];
    }
  }
  return result;
}

previewInput.addEventListener('input', () => {
  const currentInput = previewInput.value;
  
  if (currentInput.startsWith(lastInput) && currentInput.length > lastInput.length) {
    const newChars = currentInput.slice(lastInput.length);
    lastOutput += scramble(newChars);
  } else {
    lastOutput = scramble(currentInput);
  }
  
  lastInput = currentInput;
  previewOutput.textContent = lastOutput;
  copyStatus.textContent = '';
});

copyButton.addEventListener('click', async () => {
  const text = previewOutput.textContent || '';
  if (text) {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = '✓ Copied!';
    setTimeout(() => copyStatus.textContent = '', 2000);
  }
});
}
