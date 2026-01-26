# Documentation

This folder contains the user manual and related documentation for the CORRAD Application Framework.

## Files

- **USER_MANUAL.md** - Complete user manual in Markdown format
- **USER_MANUAL.html** - HTML version of the user manual (generated)
- **USER_MANUAL.pdf** - PDF version of the user manual (to be generated)

## Generating PDF from User Manual

### Method 1: Using HTML (Recommended - Easiest)

1. Generate the HTML file:
   ```bash
   npm run docs:html
   # or
   yarn docs:html
   ```

2. Open `docs/USER_MANUAL.html` in your web browser

3. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac) to open the print dialog

4. Select "Save as PDF" as the destination

5. Click "Save" to generate the PDF

### Method 2: Using Puppeteer (Automated)

1. Install Puppeteer (if not already installed):
   ```bash
   npm install puppeteer --save-dev
   # or
   yarn add puppeteer --dev
   ```

2. Run the PDF generation script:
   ```bash
   npm run docs:pdf
   # or
   yarn docs:pdf
   ```

   This will automatically generate `docs/USER_MANUAL.pdf`

### Method 3: Using Online Tools

1. Generate the HTML file using `npm run docs:html`

2. Use an online HTML to PDF converter:
   - Upload `docs/USER_MANUAL.html`
   - Convert to PDF
   - Download the generated PDF

### Method 4: Using Command Line Tools

If you have `wkhtmltopdf` installed:

```bash
wkhtmltopdf docs/USER_MANUAL.html docs/USER_MANUAL.pdf
```

## Updating the Manual

1. Edit `USER_MANUAL.md` with your changes

2. Regenerate the HTML:
   ```bash
   npm run docs:html
   ```

3. Regenerate the PDF using one of the methods above

## Notes

- The HTML file is automatically generated from the Markdown source
- Always edit the `.md` file, not the `.html` file
- The PDF should be regenerated whenever the Markdown file is updated

