/**
 * HTML to PDF Generator for User Manual
 * Creates an HTML version that can be easily converted to PDF
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manualPath = path.join(rootDir, 'docs', 'USER_MANUAL.md');
const htmlPath = path.join(rootDir, 'docs', 'USER_MANUAL.html');

function convertMarkdownToHTML(markdown) {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert code blocks
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    const cleanCode = code.replace(/^[\w-]+\n?/, '').trim();
    return `<pre><code>${escapeHtml(cleanCode)}</code></pre>`;
  });
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert unordered lists
  html = html.replace(/^[\*\-] (.+)$/gim, '<li>$1</li>');
  
  // Convert ordered lists
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
  
  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return '<ul>' + match + '</ul>';
  });
  
  // Convert horizontal rules
  html = html.replace(/^---$/gim, '<hr>');
  
  // Convert paragraphs (text between headers, lists, etc.)
  html = html.split('\n').map(line => {
    if (line.trim() === '') return '';
    if (line.match(/^<[h|u|o|l|p|d|t|s]/)) return line;
    if (line.match(/^</)) return line;
    return '<p>' + line + '</p>';
  }).join('\n');
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function generateHTML() {
  try {
    console.log('📄 Generating HTML from User Manual...\n');
    
    if (!fs.existsSync(manualPath)) {
      throw new Error(`User manual not found at: ${manualPath}`);
    }
    
    const markdown = fs.readFileSync(manualPath, 'utf8');
    console.log('✓ Read markdown file');
    
    const htmlContent = convertMarkdownToHTML(markdown);
    
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CORRAD Application Framework - User Manual</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: white;
    }
    
    h1 {
      color: #2c3e50;
      font-size: 24pt;
      margin-top: 30px;
      margin-bottom: 20px;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      page-break-after: avoid;
    }
    
    h2 {
      color: #34495e;
      font-size: 18pt;
      margin-top: 25px;
      margin-bottom: 15px;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 8px;
      page-break-after: avoid;
    }
    
    h3 {
      color: #555;
      font-size: 14pt;
      margin-top: 20px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    
    h4 {
      color: #666;
      font-size: 12pt;
      margin-top: 15px;
      margin-bottom: 10px;
    }
    
    p {
      margin-bottom: 12px;
      text-align: justify;
    }
    
    ul, ol {
      margin-bottom: 15px;
      padding-left: 30px;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    code {
      background-color: #f4f4f4;
      padding: 3px 6px;
      border-radius: 3px;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 10pt;
    }
    
    pre {
      background-color: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      page-break-inside: avoid;
      margin: 15px 0;
      border-left: 4px solid #3498db;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      font-size: 10pt;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      page-break-inside: avoid;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    th {
      background-color: #3498db;
      color: white;
      font-weight: bold;
    }
    
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    blockquote {
      border-left: 4px solid #3498db;
      padding-left: 15px;
      margin: 15px 0;
      color: #666;
      font-style: italic;
    }
    
    strong {
      font-weight: bold;
      color: #2c3e50;
    }
    
    em {
      font-style: italic;
    }
    
    a {
      color: #3498db;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    hr {
      border: none;
      border-top: 2px solid #ecf0f1;
      margin: 30px 0;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    @media print {
      body {
        padding: 0;
        max-width: 100%;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
      
      pre, table, blockquote {
        page-break-inside: avoid;
      }
      
      ul, ol {
        page-break-inside: avoid;
      }
    }
    
    .toc {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
      margin: 20px 0;
    }
    
    .toc ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    .toc li {
      margin-bottom: 5px;
    }
    
    .toc a {
      color: #3498db;
      text-decoration: none;
    }
    
    .toc a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  ${htmlContent}
  
  <script>
    // Add print functionality
    window.addEventListener('load', function() {
      console.log('User Manual loaded. Press Ctrl+P (Cmd+P on Mac) to print to PDF.');
    });
  </script>
</body>
</html>`;
    
    fs.writeFileSync(htmlPath, fullHTML);
    console.log(`✅ HTML version created: ${htmlPath}`);
    console.log('\n💡 Instructions:');
    console.log('   1. Open USER_MANUAL.html in your web browser');
    console.log('   2. Press Ctrl+P (Windows) or Cmd+P (Mac) to print');
    console.log('   3. Select "Save as PDF" as the destination');
    console.log('   4. Click Save\n');
    
  } catch (error) {
    console.error('❌ Error generating HTML:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  generateHTML();
}

module.exports = { generateHTML };

