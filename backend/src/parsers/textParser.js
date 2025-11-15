const fs = require('fs');
module.exports = async function textParser(filePath) {
const text = fs.readFileSync(filePath, 'utf8');
return { title: '', text };
};