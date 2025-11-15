import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const [company, setCompany] = useState("");
  const [team, setTeam] = useState("");
  const [project, setProject] = useState("");
  const [allCompanies, setAllCompanies] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState("");
  const apiBase = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    axios
      .get(`${apiBase}/meta`)
      .then((res) => {
        setAllCompanies(res.data.companies || []);
        setAllTeams(res.data.teams || []);
      })
      .catch((err) => {
        console.error("Failed to fetch meta:", err);
      });
  }, []);

  const filteredTeams = allTeams.filter((t) => t.company === company);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const handleUpload = async () => {
    if (files.length === 0 || !company || !team) {
      return setStatus("❗ Select company, team & files");
    }
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("company", company);
    form.append("team", team);
    form.append("project", project || "general");

    setStatus("Uploading & indexing...");
    try {
      const res = await axios.post(`${apiBase}/upload/bulk`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(`✔ Indexed ${res.data.count} files`);
      setFiles([]);
    } catch (err) {
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Upload Marketing Documents</h2>

      <input
        list="companyList"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        className="w-full p-3 border rounded mb-3"
      />
      <datalist id="companyList">
        {allCompanies.map((c, i) => (
          <option key={i} value={c} />
        ))}
      </datalist>

      <input
        list="teamList"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        placeholder="Team"
        className="w-full p-3 border rounded mb-3"
      />
      <datalist id="teamList">
        {filteredTeams.map((t, i) => (
          <option key={i} value={t.team} />
        ))}
      </datalist>

      <input
        type="text"
        value={project}
        onChange={(e) => setProject(e.target.value)}
        placeholder="Project / Topic"
        className="w-full p-3 border rounded mb-3"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        className={`h-40 border-2 border-dashed rounded-xl flex items-center justify-center ${
          drag ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-gray-100"
        }`}
      >
        <div className="text-center">
          <p className="text-sm">Drag & Drop files here</p>
          <label
            htmlFor="fileInput"
            className="text-blue-600 underline cursor-pointer"
          >
            or click to browse
          </label>
          <input
            type="file"
            id="fileInput"
            multiple
            className="hidden"
            onChange={(e) =>
              setFiles([...files, ...Array.from(e.target.files)])
            }
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          {files.map((f, i) => (
            <p key={i}>{f.name}</p>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-5 w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload & Index
      </button>
      <p className="mt-3 text-sm text-gray-700">{status}</p>
    </div>
  );
}
