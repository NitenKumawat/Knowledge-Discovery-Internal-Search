const fs = require('fs');
const mammoth = require('mammoth');


module.exports = async function docxParser(filePath) {
const buffer = fs.readFileSync(filePath);
const { value } = await mammoth.extractRawText({ buffer });
return { title: '', text: value };
};