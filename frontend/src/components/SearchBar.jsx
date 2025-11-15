import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchBar({ onSearch, apiBase }) {
  const [q, setQ] = useState("");

  const [company, setCompany] = useState("");
  const [team, setTeam] = useState("");
  const [project, setProject] = useState("");

  const [companies, setCompanies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);   // ✅ added

  // Load /meta
  useEffect(() => {
    if (!apiBase) {
      console.error("SearchBar missing apiBase prop");
      return;
    }

    const loadMeta = async () => {
      try {
        const res = await axios.get(`${apiBase}/meta`);
        setCompanies(res.data.companies || []);
        setTeams(res.data.teams || []);
        setProjects(res.data.projects || []);     // ✅ store project list
      } catch (err) {
        console.error("Meta load failed:", err);
      }
    };

    loadMeta();
  }, [apiBase]);

  // Filter teams by company selected
  const filteredTeams = company
    ? teams.filter((t) => t.company === company)
    : teams;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ q, company, team, project });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4 flex-wrap">

      {/* Search */}
      <input
        className="border p-2 rounded"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* Company dropdown */}
      <select
        className="border p-2 rounded"
        value={company}
        onChange={(e) => {
          setCompany(e.target.value);
          setTeam(""); // reset
        }}
      >
        <option value="">All Companies</option>
        {companies.map((c, idx) => (
          <option key={idx} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Team dropdown */}
      <select
        className="border p-2 rounded"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
      >
        <option value="">All Teams</option>
        {filteredTeams.map((t, idx) => (
          <option key={idx} value={t.team}>
            {t.team}
          </option>
        ))}
      </select>

      {/* Project dropdown */}
      <select
        className="border p-2 rounded"
        value={project}
        onChange={(e) => setProject(e.target.value)}
      >
        <option value="">All Projects</option>
        {projects.map((p, idx) => (
          <option key={idx} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Search Button */}
      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        Search
      </button>

    </form>
  );
}
