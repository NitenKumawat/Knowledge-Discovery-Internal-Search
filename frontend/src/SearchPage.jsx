import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";

export default function SearchPage() {
  const [hits, setHits] = useState([]);
  const [total, setTotal] = useState(0);
 const [limit] = useState(10);

  const [offset, setOffset] = useState(0);

  const apiBase = import.meta.env.VITE_API_BASE;

  const fetchDocs = async (filters = {}) => {
    try {
      const params = { limit, offset, ...filters };
      const res = await axios.get(`${apiBase}/search`, { params });

      setHits(res.data.hits);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  useEffect(() => {
    fetchDocs({});
  }, [offset]);

  return (
    <div className="p-4">

      <SearchBar
        apiBase={apiBase}
        onSearch={(filters) => {
          setOffset(0);
          fetchDocs(filters);
        }}
      />

      <ResultsList
        apiBase={apiBase}   // <-- FIXED: MUST PASS THIS
        results={{ hits, total }}
        onDelete={(id) => {
          setHits(hits.filter(d => d.id !== id));
          setTotal(total - 1);
        }}
      />

      <div className="flex justify-between mt-4">
        <button
          disabled={offset === 0}
          onClick={() => setOffset(offset - limit)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          disabled={offset + limit >= total}
          onClick={() => setOffset(offset + limit)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        Showing {offset + 1} – {Math.min(offset + limit, total)} of {total}
      </p>

    </div>
  );
}
