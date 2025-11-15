import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const apiBase = import.meta.env.VITE_API_BASE;

  const fetchDocs = async (filters = {}) => {
    const params = { limit, offset, ...filters };

    const res = await axios.get(`${apiBase}/search`, { params });

    setResults(res.data.hits);
    setTotal(res.data.total);
  };

  // Load all docs initially
  useEffect(() => {
    fetchDocs({});
  }, [offset]);

  return (
    <div>
      <SearchBar onSearch={filters => {
        setOffset(0);
        fetchDocs(filters);
      }}/>

      {/* Render results */}
      <div className="mt-4">
        {results.map((doc) => (
          <div key={doc.id} className="p-3 border mb-2 rounded">
            <b>{doc.title}</b>
            <div className="text-sm text-gray-500">
              {doc.company} • {doc.team} • {doc.project}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
