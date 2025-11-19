# ScrambleText: Human-Readable, Machine-Hostile Text Obfuscator

ScrambleText is a Chrome extension that transforms what you type into text that:

- Looks normal to humans
- Confuses automated moderation systems
- Pollutes AI training data and breaks tokenization

It does this by:

- Replacing standard Latin letters with visually identical homoglyphs (Cyrillic, Greek, mathematical symbols)
- Injecting invisible zero-width characters between letters as "noise"

Example:

- Input: `This corporate policy is bad.`
- Output (what platforms and scrapers see): `Tнiѕ сοrроrаtе pоliсу iѕ bаd.` plus hidden zero-width characters

To you and your followers, it looks like normal text. To bots and LLMs, it's a mess of weird Unicode code points and broken tokens.

---

## Goals

ScrambleText is designed for people who:

- Want to discuss controversial or "flagged" topics without tripping crude keyword filters
- Want to reduce how much of their writing is useful for LLM training
- Want to experiment with adversarial text against:
  - Automated moderation
  - Sentiment analysis
  - Keyword-based ranking and shadowbanning
  - Web scrapers and tokenizers

This is not a perfect shield, but it is a practical, lightweight layer of friction against automated systems.

---

## How It Works (Conceptual Overview)

ScrambleText modifies your text right before it is sent, using three techniques:

1. Homoglyph substitution
2. Zero-width character injection
3. Randomization and configurability

### 1. Homoglyph substitution

Many scripts contain characters that visually resemble Latin letters:

- Latin `a` vs Cyrillic `а` (different code points, look almost identical)
- Latin `e` vs Cyrillic `е`
- Latin `o` vs Greek `ο`
- Latin `p` vs Cyrillic `р`
- Latin `c` vs Cyrillic `с`
- Latin `H` vs Cyrillic `Н`
- Latin `x` vs multiplication-like characters, etc.

ScrambleText uses a configurable map of characters:

- For each Latin letter, there is a set of possible "clones"
- When you type, ScrambleText randomly selects replacements from these sets

Example (simplified):

- Original: `bad`
- Process:
  - `b` → `b` (no safe homoglyph, keep as-is or use alternate)
  - `a` → Cyrillic `а`
  - `d` → maybe replaced with a slightly different Unicode variant, or kept
- Result: `bаd` (looks like "bad" but uses a different code point for `a`)

To most humans, this is indistinguishable from the original. To a keyword filter searching for the precise code points of "bad", this may not match.

### 2. Zero-width character injection

Unicode includes invisible characters such as:

- Zero-width space: `U+200B`
- Zero-width non-joiner: `U+200C`
- Zero-width joiner: `U+200D`
- Zero-width no-break space: `U+FEFF`

These characters:

- Do not show up visually in most text renderers
- Often split tokens for:
  - Regex-based filters
  - Some tokenizers and parsers
- Make strings harder to match with simple keyword rules

ScrambleText randomly inserts zero-width characters between letters, for example:

- Logical string (with invisibles): `b[ZWSP]а[ZWNJ]d`
- Visible string: `bаd`

To a human: still "bad".

To a naive filter trying to match "bad" as a continuous sequence: it may fail because the string is actually `b\u200B\u0430\u200Cd`.

### 3. Randomization

If every instance of "bad" became the same transformed string, filters could adapt. ScrambleText instead:

- Randomly chooses:
  - Which letters to replace
  - Which homoglyph variant to use
  - Where and which zero-width characters to insert
- Allows configuration to tune:
  - Aggressiveness (how many characters to obfuscate)
  - Which sites are affected
  - Whether numbers/punctuation are touched

The result is that:

- The same sentence typed twice can produce different underlying Unicode sequences
- This makes reverse-engineering and static rule-based filtering harder

---

## What ScrambleText Is And Is Not

ScrambleText is:

- A user-side text obfuscation tool
- A way to make your posts:
  - Readable to humans
  - Less accessible to naive bots
  - More adversarial to LLM tokenizers and training pipelines
- A research/experimentation project in adversarial text for moderation and AI training

ScrambleText is not:

- A guarantee of censorship immunity
- A perfect anonymization or privacy tool
- A bypass for all forms of content moderation (e.g., screenshot-based or manual review still works)
- A cryptographic system (there is no strong security model like in encryption)

Platforms can adapt. ScrambleText raises the cost and complexity of automated scanning; it does not make you invisible.

---

## Features

- Browser extension (Chrome-compatible)
- Human-readable output by design
- Configurable:
  - On/off toggle
  - Aggressiveness level (light / normal / heavy)
  - Per-site enable/disable
  - Optional whitelist/blacklist of words or domains
- Instant feedback:
  - Preview transformed text in the extension popup before posting (optional feature)
- Open-source:
  - Code is public
  - No secret data collection
  - Community can audit, fork, and contribute

---

## Installation

### From the Chrome Web Store (recommended)

Once published:

1. Open Chrome and go to the Chrome Web Store.
2. Search for "ScrambleText" or use the direct link provided in this repository.
3. Click "Add to Chrome".
4. Confirm by clicking "Add extension".
5. Pin the extension (optional):
   - Click the extensions icon (puzzle piece).
   - Click the pin icon next to "ScrambleText".

### Developer mode (from source)

To install ScrambleText directly from this repository:

1. Clone or download the repository:

   - Using Git:
     ```bash
     git clone https://github.com/teycir/ScrambleText.git
     ```
   - Or download the ZIP and extract it.

2. Open Chrome and go to:
   - `chrome://extensions/`

3. Enable "Developer mode":
   - Toggle the switch in the top-right corner.

4. Click "Load unpacked".

5. Select the `extension/` folder of this project.

6. ScrambleText should now appear in your list of extensions.

---

## Quick Start

1. Install the extension.
2. Click the ScrambleText icon in the toolbar.
3. Toggle it ON.
4. Choose your mode (for example: "Normal" obfuscation).
5. Go to a site with a text box (X/Twitter, Facebook, Reddit, etc.).
6. Type your message as usual.
7. Depending on implementation mode:
   - The text in the box may update in place to the obfuscated version, or
   - ScrambleText obfuscates just before submission (e.g., when you click Post/Enter).
8. Post as normal.

Your followers should see readable text. Automated filters and scrapers see Unicode chaos.

---

## Usage Modes

ScrambleText supports multiple obfuscation levels:

- **Light mode**:
  - Minimal homoglyph usage
  - Sparse zero-width characters
  - Designed to look almost indistinguishable from plain ASCII

- **Normal mode**:
  - Balanced obfuscation
  - Good for everyday use
  - Most Latin letters replaced when safe

- **Heavy mode**:
  - Aggressive homoglyph and zero-width injection
  - Maximum adversarial effect
  - May impact copy/paste, search, and some older systems

You can also:

- Enable/disable on specific domains
- Temporarily disable ScrambleText for a single text box or post

---

## Compatibility And Limitations

### Sites

ScrambleText targets text input fields on:

- X/Twitter
- Facebook
- Reddit
- Other platforms that rely heavily on text-based moderation and scraping

However:

- Some sites may normalize text (e.g., stripping certain Unicode characters)
- Some rich-text editors may behave unpredictably with zero-width characters
- Some mobile browsers or platforms may handle homoglyphs differently

### Copy/paste and search

Because ScrambleText changes the underlying code points:

- Copying and pasting into external tools may produce "weird" text for machines
- Exact match search (e.g., Ctrl+F or platform search) may fail because the string is no longer plain ASCII
- Spellcheck and autocorrect might behave oddly (depending on the environment)

### Accessibility

Screen readers and accessibility tools may:

- Read homoglyphs as their underlying script (e.g., Cyrillic vs Latin)
- Struggle with zero-width characters or report unexpected behavior

If accessibility is critical for your audience, consider using:

- Light mode
- Selective obfuscation
- Or disabling ScrambleText for specific posts or platforms

---

## Security, Privacy, And Data Handling

Design principles:

- Process text locally, in the browser
- Do not send your text to external servers
- Request minimal necessary permissions

ScrambleText:

- Operates on text fields in your browser
- Does not need to log or store your content by default
- Should be auditable from the open-source code

Check the extension's options to see:

- Whether any analytics or telemetry is enabled
- How permissions are used
- How to disable or opt out of any optional data collection

If you suspect an issue, inspect the source or open an issue in the repository.

---

## Threat Model And Expectations

ScrambleText is designed to:

- Break simple keyword filters and regex-based moderation
- Degrade the usefulness of scraped text for:
  - LLM training
  - Basic sentiment analysis
  - Simple classification models that assume clean, normalized text

It may partially or fully frustrate:

- Systems that:
  - Do not normalize Unicode aggressively
  - Do not remove zero-width characters
  - Rely on exact tokenization that splits on such characters

It is less effective against:

- Platforms that:
  - Normalize and canonicalize Unicode
  - Strip zero-width characters
  - Use OCR (image-based) or screenshot-based moderation
  - Use robust, adversarially-trained models on diverse Unicode corpora

ScrambleText's strength lies in:

- Being easy for users to apply
- Being hard for platforms to fully neutralize without side effects
- Constantly changing its exact patterns through randomness/configuration

---

## Roadmap

Planned and potential future features:

- **Per-site rules**:
  - Only obfuscate on specific domains
  - Different aggressiveness per site
- **Custom dictionaries**:
  - Only obfuscate specific keywords or phrases
- **Profiles**:
  - "Anti-censorship" profile
  - "Anti-AI-training" profile
- **Multi-browser support**:
  - Firefox (WebExtensions)
  - Edge (Chromium-based)
  - Possibly others

Feature ideas and requests are welcome via GitHub Issues.

---

## Contributing

Contributions are welcome. You can help with:

- **Code**:
  - Homoglyph mappings
  - Smarter zero-width insertion strategies
  - Performance improvements
  - Site-specific integrations (e.g., special handling for certain platforms)
- **Documentation**:
  - More examples
  - Threat model analysis
  - Platform behavior reports
- **Testing**:
  - Trying ScrambleText on different sites and reporting:
    - What works
    - What breaks
    - What gets normalized/stripped

How to contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-improvement
   ```
3. Make your changes.
4. Add tests where reasonable.
5. Submit a pull request describing:
   - What you changed
   - Why
   - Any known limitations

---

## Building From Source

To build ScrambleText from source:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```
   Output goes to `dist/` directory

3. Load the built extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the `dist/` directory

4. Test on various sites and input fields.

---

## Known Issues And Caveats

- Some platforms may:
  - Strip or normalize text, nullifying some protections
  - Break certain homoglyphs in their fonts, making text look slightly "off"
- Some systems may:
  - Show replacement boxes or question marks for rare Unicode characters
  - Affect readability for certain fonts or locales

If you encounter a platform where ScrambleText behaves poorly:

- Open an issue
- Include:
  - The platform
  - Browser version
  - Example text
  - Screenshots (if possible)
  - Whether you used Light/Normal/Heavy mode

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Disclaimer

- ScrambleText is provided "as is", without any guarantees.
- Using ScrambleText does not guarantee that:
  - Your content will avoid moderation or removal
  - Your data will never be used in AI training
- You are responsible for:
  - Complying with the terms of service of the platforms you use
  - Understanding the legal and ethical implications in your jurisdiction

ScrambleText is a tool for experimentation, privacy-minded expression, and research into adversarial text — not a promise of invisibility.

---

## Support

If you find ScrambleText useful, consider:

- ⭐ Starring this repository
- 🐛 Reporting bugs via GitHub Issues
- 💡 Suggesting features
- 🔀 Contributing code or documentation

For questions or support, please open an issue on GitHub.

---

## Credits

Created by [Teycir Ben Soltane](https://teycirbensoltane.tn)