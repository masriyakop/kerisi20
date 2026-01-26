/**
 * PDF Generation Script using Puppeteer
 * 
 * This script converts the USER_MANUAL.html file to PDF using Puppeteer
 * 
 * Usage: node scripts/generate-pdf-puppeteer.js
 * 
 * Requirements: npm install puppeteer
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'docs', 'USER_MANUAL.html');
const outputPath = path.join(rootDir, 'docs', 'USER_MANUAL.pdf');

async function generatePDF() {
  try {
    console.log('📄 Generating PDF from User Manual using Puppeteer...\n');
    
    // Check if HTML file exists
    if (!fs.existsSync(htmlPath)) {
      console.log('⚠️  HTML file not found. Generating it first...\n');
      const { generateHTML } = require('./generate-pdf-html.js');
      generateHTML();
    }
    
    // Try to require puppeteer
    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.log('❌ Puppeteer is not installed.');
        console.log('\nTo install Puppeteer, run:');
        console.log('  npm install puppeteer --save-dev');
        console.log('  OR');
        console.log('  yarn add puppeteer --dev\n');
        console.log('Alternatively, use the HTML method:');
        console.log('  1. Open docs/USER_MANUAL.html in your browser');
        console.log('  2. Press Ctrl+P (Cmd+P on Mac)');
        console.log('  3. Select "Save as PDF"\n');
        process.exit(1);
      } else {
        throw error;
      }
    }
    
    console.log('✓ Puppeteer loaded');
    console.log('⏳ Launching browser and generating PDF...\n');
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Read HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Set content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">CORRAD Application Framework - User Manual</div>',
      footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
    });
    
    await browser.close();
    
    console.log(`✅ PDF generated successfully!`);
    console.log(`📁 Location: ${outputPath}\n`);
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  generatePDF();
}

module.exports = { generatePDF };

