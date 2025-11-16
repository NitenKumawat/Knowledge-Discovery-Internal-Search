import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchBar({ onSearch, apiBase }) {
  const [q, setQ] = useState("");

  const [company, setCompany] = useState("");
  const [team, setTeam] = useState("");
  const [project, setProject] = useState("");

  const [companies, setCompanies] = useState([]);
  const [teamsByCompany, setTeamsByCompany] = useState({});
  const [projectsByTeam, setProjectsByTeam] = useState({});

  // Load /meta
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await axios.get(`${apiBase}/meta`);
        setCompanies(res.data.companies || []);
        setTeamsByCompany(res.data.teamsByCompany || {});
        setProjectsByTeam(res.data.projectsByTeam || {});
      } catch (err) {
        console.error("Meta load failed:", err);
      }
    };

    loadMeta();
  }, [apiBase]);

  const teams = company ? teamsByCompany[company] || [] : [];
  const projects = team ? projectsByTeam[team] || [] : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ q, company, team, project });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4  justify-between">
      {/* Search */}
      <input
        className="border p-2 rounded w-1/2"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className=" flex flex-wrap  gap-2 justify-between">
        {/* Company dropdown */}
        <select
          className="border p-2 rounded"
          value={company}
          onChange={(e) => {
            setCompany(e.target.value);
            setTeam("");
            setProject("");
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
          onChange={(e) => {
            setTeam(e.target.value);
            setProject("");
          }}
          disabled={!company}
        >
          <option value="">All Teams</option>
          {teams.map((t, idx) => (
            <option key={idx} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Project dropdown */}
        <select
          className="border p-2 rounded"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          disabled={!team}
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
      </div>
    </form>
  );
}
