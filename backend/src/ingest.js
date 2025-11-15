const fs = require('fs');
const path = require('path');
const { MeiliSearch } = require('meilisearch');
const pdfParser = require('./parsers/pdfParser');
const docxParser = require('./parsers/docxParser');
const textParser = require('./parsers/textParser');
const { v4: uuidv4 } = require('uuid');

const client = new MeiliSearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_KEY
});

// Dynamic index naming
function getIndexName(company, team) {
  if (!company) return 'global_documents';
  if (!team) return `company_${company}`;
  return `company_${company}_team_${team}`;
}

// Ensure index + schema
async function ensureIndex(indexName) {
  try {
    await client.getIndex(indexName);
  } catch {
    await client.createIndex(indexName, { primaryKey: 'id' });
  }

  await client.index(indexName).updateFilterableAttributes([
    'company',
    'team',
    'fileType',
    'project'
  ]);

  await client.index(indexName).updateSearchableAttributes([
    'title',
    'content',
    'project'
  ]);
}

// Parse & Index single file
async function parseAndIndex(filePath, meta = {}) {
  const { originalName, company, team, project } = meta;
  const indexes = ['global_documents']; // always global
  if (company) indexes.push(getIndexName(company, team));

  const ext = path.extname(originalName).toLowerCase();
  let parsed = { text: '', title: originalName };

  if (ext === '.pdf') parsed = await pdfParser(filePath);
  else if (ext === '.docx') parsed = await docxParser(filePath);
  else parsed = await textParser(filePath);

  const doc = {
    id: uuidv4(),
    company,
    team,
    project: project || 'general',
    title: parsed.title || originalName,
    content: parsed.text.substring(0, 200000),
    fileType: ext.replace('.', ''),
    uploadedAt: new Date().toISOString(),
    originalPath: `/uploads/${path.basename(filePath)}`
  };

  for (const idx of indexes) {
    await ensureIndex(idx);
    await client.index(idx).addDocuments([doc]);
  }

  return doc;
}

// ---------------------------
// DELETE FUNCTIONS
// ---------------------------

// Delete doc from all Meilisearch indexes
async function deleteDocument(docId) {
  const indexes = await client.getIndexes();

  for (const idx of indexes.results) {
    try {
      await client.index(idx.uid).deleteDocument(docId);
    } catch (err) {}
  }
}

// Delete physical file
function deleteFile(relativePath) {
  const full = path.join(__dirname, relativePath);

  if (fs.existsSync(full)) {
    fs.unlinkSync(full);
  }
}

module.exports = {
  parseAndIndex,
  getMeiliClient: () => client,
  getIndexName,
  deleteDocument,
  deleteFile
};
