const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generatePDF(content, fileName) {
    const doc = new PDFDocument();
    const filePath = `./${fileName}`;
    doc.pipe(fs.createWriteStream(filePath));
    doc.text(content);
    doc.end();
    return filePath;
}

export default generatePDF;