{
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

document.addEventListener('keydown', (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const inputElement = target as any;
      const originalText = inputElement.value || target.textContent || '';
      const scrambled = scramble(originalText);
      
      if ('value' in inputElement) {
        inputElement.value = scrambled;
      } else {
        target.textContent = scrambled;
      }
      
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
});
}
