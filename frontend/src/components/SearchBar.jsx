import React, { useState } from "react";
import axios from "axios";

export default function SearchBar({ onResults }) {
  const [q,setQ]=useState("");
  const [company,setCompany]=useState("");
  const [team,setTeam]=useState("");
const apiBase = import.meta.env.VITE_API_BASE;

 const handleSearch = async e => {
  e.preventDefault();
  const params = { q, company, team, limit: 20 };

  try {
    const res = await axios.get(`${apiBase}/search`, { params });
    onResults(res.data);
  } catch (err) {
    console.error("Search failed:", err);
  }
};


  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search documents..." className="flex-1 border p-2 rounded"/>
      <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" className="border p-2 rounded"/>
      <input value={team} onChange={e=>setTeam(e.target.value)} placeholder="Team" className="border p-2 rounded"/>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
    </form>
  )
}
