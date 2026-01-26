/**
 * PDF Generation Script for User Manual
 * 
 * This script attempts to generate PDF using Puppeteer (recommended)
 * Falls back to HTML generation if Puppeteer is not available
 * 
 * Usage: node scripts/generate-pdf.js
 */

const path = require('path');

const rootDir = path.resolve(__dirname, '..');

async function generatePDF() {
  try {
    // First, ensure HTML exists
    const { generateHTML } = require('./generate-pdf-html.js');
    generateHTML();
    
    // Try to use Puppeteer for PDF generation
    try {
      const { generatePDF: generatePDFPuppeteer } = require('./generate-pdf-puppeteer.js');
      await generatePDFPuppeteer();
    } catch (error) {
      console.log('\n⚠️  Puppeteer not available. Using HTML method instead.\n');
      console.log('💡 To generate PDF automatically, install Puppeteer:');
      console.log('   npm install puppeteer --save-dev\n');
      console.log('💡 Or use the HTML method:');
      console.log('   1. Open docs/USER_MANUAL.html in your browser');
      console.log('   2. Press Ctrl+P (Cmd+P on Mac)');
      console.log('   3. Select "Save as PDF"\n');
    }
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  }
}


// Run the script
if (require.main === module) {
  generatePDF();
}

module.exports = { generatePDF };

