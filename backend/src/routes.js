const express = require('express');
const multer = require('multer');
const path = require('path');
const ingest = require('./ingest');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Serve uploads publicly
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Single upload
router.post('/upload', upload.single('file'), async (req,res)=>{
  try{
    const { company, team, project } = req.body;
    const doc = await ingest.parseAndIndex(req.file.path, {
      originalName: req.file.originalname,
      company, team, project
    });
    res.json({ ok:true, doc });
  } catch(err){
    res.status(500).json({ ok:false, error: err.message });
  }
});

// Bulk upload
router.post('/upload/bulk', upload.array('files'), async (req,res)=>{
  try{
    const { company, team, project } = req.body;
    const results = [];
    for(const f of req.files){
      const doc = await ingest.parseAndIndex(f.path, {
        originalName: f.originalname,
        company, team, project
      });
      results.push(doc);
    }
    res.json({ ok:true, count: results.length, docs: results });
  } catch(err){
    res.status(500).json({ ok:false, error: err.message });
  }
});

// Search
router.get('/search', async (req,res)=>{
  try{
    const { q="", company, team, project, limit=20 } = req.query;
    const indexName = ingest.getIndexName(company, team);
    const index = ingest.getMeiliClient().index(indexName);

    let filters = [];
    if(company) filters.push(`company = "${company}"`);
    if(team) filters.push(`team = "${team}"`);
    if(project) filters.push(`project = "${project}"`);

    const results = await index.search(q, {
      limit: Number(limit),
      filter: filters.length ? filters.join(' AND ') : undefined
    });

    res.json({ ok:true, hits: results.hits, total: results.estimatedTotalHits });
  } catch(err){
    res.status(500).json({ ok:false, error: err.message });
  }
});

// Meta endpoint
router.get('/meta', async (req,res)=>{
  try{
    const index = ingest.getMeiliClient().index('global_documents');
    const docs = await index.getDocuments({ limit:1000 });
    const companies = [...new Set(docs.results.map(d=>d.company).filter(Boolean))];
    const teams = docs.results.map(d=>({ team:d.team, company:d.company })).filter(d=>d.team);
    res.json({ companies, teams, total: docs.results.length });
  } catch(err){
    res.status(500).json({ ok:false, error: err.message });
  }
});

module.exports = router;
