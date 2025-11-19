{
const previewInput = document.getElementById('previewInput') as HTMLTextAreaElement;
const previewOutput = document.getElementById('previewOutput') as HTMLDivElement;
const copyButton = document.getElementById('copyButton') as HTMLButtonElement;
const copyStatus = document.getElementById('copyStatus') as HTMLSpanElement;

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
    if (i < text.length - 1 && /[a-zA-Z]/.test(char) && Math.random() < 0.7) {
      result += ZERO_WIDTH[Math.floor(Math.random() * ZERO_WIDTH.length)];
    }
  }
  return result;
}

previewInput.addEventListener('input', () => {
  previewOutput.textContent = scramble(previewInput.value);
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
