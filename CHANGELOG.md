# Changelog

All notable changes to ScrambleText will be documented in this file.

## [1.2.0] - 2024-11-19

### Added
- Modern gradient UI design with purple theme
- Subtitle "Human-readable, machine-hostile" in popup header
- Smooth animations for button hover and copy confirmation
- Visual distinction for read-only output field (light grey background)

### Changed
- Incremental scrambling - only new characters get scrambled as you type
- Previously scrambled text remains consistent
- Zero-width characters now added after all letters (not just between)
- Improved popup layout with better spacing and rounded corners
- Enhanced button styling with gradient and shadow effects

### Fixed
- Output text no longer changes when adding spaces after words
- Consistent scrambling behavior throughout typing

## [1.1.0] - 2024-11-19

### Changed
- Optimized homoglyph selection for better human readability
- Reduced to only visually identical characters (Cyrillic/Greek)
- Removed combining diacritics and fullwidth characters
- Adjusted zero-width character injection to 70% probability
- Maintained 100% homoglyph replacement for maximum machine hostility

### Improved
- Text now looks completely normal to humans while remaining hostile to machines
- Better balance between readability and obfuscation effectiveness

## [1.0.0] - 2024-11-19

### Added
- Initial release of ScrambleText Chrome extension
- Homoglyph substitution using Cyrillic, Greek, and mathematical symbols
- Zero-width character injection for token breaking
- Heavy mode obfuscation (0.9 intensity) enabled by default
- Ctrl+Enter / Cmd+Enter keyboard shortcut to scramble text in any input field
- Live preview popup with scrambled text output
- Copy to clipboard button with confirmation message
- Support for textarea, input, and contentEditable elements
- TypeScript implementation with proper build system
- Comprehensive README with usage instructions and threat model

### Features
- Always-on obfuscation (no toggle needed)
- Human-readable output
- Machine-hostile text transformation
- Randomized character replacement
- Works on all websites
