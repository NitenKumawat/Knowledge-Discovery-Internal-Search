import React, { useState } from "react";
import SearchPage from "./SearchPage";
import FileUploader from "./components/FileUploader";

export default function App() {
  const MEILI_DASHBOARD = import.meta.env.VITE_MEILI_HOST;
  // example: http://127.0.0.1:7700

  return (
    <div className="min-h-screen py-10 bg-gradient-to-r from-red-300 to-green-300">
      <div className="max-w-5xl mx-auto space-y-6 my-8 flex flex-col items-center text-center">
        {/* 🏷 TITLE */}
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Knowledge Discovery — Internal Search
        </h1>

        {/* ⭐ SUBTITLE */}
        <p className="text-md text-slate-700 font-medium">
          Fast smart-search across your organization’s files & documents.
        </p>

        {/* LINE */}
        <hr className="w-1/2 border-slate-500/40 my-4" />

        {/* 🔘 OPEN MEILISEARCH BUTTON */}
        <a
          href={MEILI_DASHBOARD}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition"
        >
          Open Meilisearch Dashboard
        </a>
      </div>

      <main className="max-w-5xl mx-auto space-y-6">
        <FileUploader />
        <SearchPage />
      </main>
    </div>
  );
}
