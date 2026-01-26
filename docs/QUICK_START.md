# Quick Start Guide - PDF Generation

## Fastest Method (Recommended)

1. **Generate HTML:**
   ```bash
   npm run docs:html
   ```

2. **Open in Browser:**
   - Navigate to `docs/USER_MANUAL.html`
   - Open it in Chrome, Firefox, or Edge

3. **Print to PDF:**
   - Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
   - Select "Save as PDF" as destination
   - Click "Save"

**Done!** You now have `USER_MANUAL.pdf` saved to your Downloads folder.

## Automated Method (Requires Puppeteer)

1. **Install Puppeteer:**
   ```bash
   npm install puppeteer --save-dev
   ```

2. **Generate PDF:**
   ```bash
   npm run docs:pdf
   ```

The PDF will be automatically generated at `docs/USER_MANUAL.pdf`.

## File Locations

- **Source:** `docs/USER_MANUAL.md` (edit this file)
- **HTML:** `docs/USER_MANUAL.html` (auto-generated)
- **PDF:** `docs/USER_MANUAL.pdf` (generated output)

## Updating the Manual

1. Edit `docs/USER_MANUAL.md`
2. Run `npm run docs:html` to regenerate HTML
3. Generate PDF using one of the methods above

