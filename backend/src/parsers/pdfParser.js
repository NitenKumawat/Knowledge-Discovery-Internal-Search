const fs = require('fs');
const pdf = require('pdf-parse');


module.exports = async function pdfParser(filePath) {
const dataBuffer = fs.readFileSync(filePath);
const data = await pdf(dataBuffer);
return { title: '', text: data.text };
};