const express = require('express');
const multer = require('multer');
const path = require('path');
const ingest = require('./ingest');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Serve uploads publicly
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -----------------------------
// Single Upload
// -----------------------------
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { company, team, project } = req.body;

    const doc = await ingest.parseAndIndex(req.file.path, {
      originalName: req.file.originalname,
      company,
      team,
      project
    });

    res.json({ ok: true, doc });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -----------------------------
// Bulk Upload
// -----------------------------
router.post('/upload/bulk', upload.array('files'), async (req, res) => {
  try {
    const { company, team, project } = req.body;
    const results = [];

    for (const f of req.files) {
      const doc = await ingest.parseAndIndex(f.path, {
        originalName: f.originalname,
        company,
        team,
        project
      });
      results.push(doc);
    }

    res.json({ ok: true, count: results.length, docs: results });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -----------------------------
// Search
// -----------------------------
router.get('/search', async (req, res) => {
  try {
    const { q = "", company, team, project, limit = 20, offset = 0 } = req.query;

    const indexName = ingest.getIndexName(company, team);
    const index = ingest.getMeiliClient().index(indexName);

    let filters = [];
    if (company) filters.push(`company = "${company}"`);
    if (team) filters.push(`team = "${team}"`);
    if (project) filters.push(`project = "${project}"`);

    const results = await index.search(q, {
      limit: Number(limit),
      offset: Number(offset),
      filter: filters.length ? filters.join(" AND ") : undefined
    });

    res.json({
      ok: true,
      hits: results.hits,
      total: results.estimatedTotalHits,
      limit: Number(limit),
      offset: Number(offset)
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -----------------------------
// META — used for dropdowns
// -----------------------------
router.get('/meta', async (req, res) => {
  try {
    const index = ingest.getMeiliClient().index('global_documents');
    const docs = await index.getDocuments({ limit: 10000 });

    const allDocs = docs.results;

    // Unique company list
    const companies = [
      ...new Set(allDocs.map(d => d.company).filter(Boolean))
    ];

    // Teams grouped by company
    const teamsByCompany = {};

    allDocs.forEach(d => {
      if (!d.company || !d.team) return;

      if (!teamsByCompany[d.company]) {
        teamsByCompany[d.company] = new Set();
      }
      teamsByCompany[d.company].add(d.team);
    });

    // Convert Set → Array
    Object.keys(teamsByCompany).forEach(c => {
      teamsByCompany[c] = [...teamsByCompany[c]];
    });

    // Projects grouped by team
    const projectsByTeam = {};

    allDocs.forEach(d => {
      if (!d.team || !d.project) return;

      if (!projectsByTeam[d.team]) {
        projectsByTeam[d.team] = new Set();
      }
      projectsByTeam[d.team].add(d.project);
    });

    // Convert Set → Array
    Object.keys(projectsByTeam).forEach(t => {
      projectsByTeam[t] = [...projectsByTeam[t]];
    });

    res.json({
      companies,
      teamsByCompany,
      projectsByTeam,
      total: allDocs.length
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});


// -----------------------------
// DELETE DOCUMENT (Meili + Disk)
// -----------------------------
router.delete('/delete/:id', async (req, res) => {
  try {
    const docId = req.params.id;

    // Fetch original doc (always in global index)
    const globalIndex = ingest.getMeiliClient().index('global_documents');
    const doc = await globalIndex.getDocument(docId);

    if (!doc) {
      return res.status(404).json({ ok: false, error: "Document not found" });
    }

    // Delete from Meilisearch (all indexes)
    await ingest.deleteDocument(docId);

    // Delete physical file
    if (doc.originalPath) {
      ingest.deleteFile(doc.originalPath);
    }

    res.json({ ok: true, deleted: docId });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
