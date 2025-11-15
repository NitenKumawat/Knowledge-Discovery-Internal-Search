import React, { useState } from 'react';
import FilePreview from './FilePreview';
import { 
  FaFilePdf, 
  FaFileVideo, 
  FaFileAudio, 
  FaFileImage, 
  FaFileAlt, 
  FaFile 
} from 'react-icons/fa';

export default function ResultsList({ results }) {
  const [open, setOpen] = useState(null);

  if (!results || !results.hits) 
    return <div className="py-8 text-slate-500">Run a search to see results.</div>;

  const renderRowPreview = (hit) => {
    const { fileType, content } = hit;

    if(['png','jpg','jpeg','gif','webp'].includes(fileType)) {
      return <div className="flex items-center gap-2 text-gray-600"><FaFileImage /> Image File</div>;
    }
    if(['mp4','webm','mov'].includes(fileType)) {
      return <div className="flex items-center gap-2 text-gray-600"><FaFileVideo /> Video File</div>;
    }
    if(['mp3','wav','ogg'].includes(fileType)) {
      return <div className="flex items-center gap-2 text-gray-600"><FaFileAudio /> Audio File</div>;
    }
    if(fileType === 'pdf') {
      return <div className="flex items-center gap-2 text-gray-600"><FaFilePdf /> PDF File</div>;
    }
    // Text/code files
    if(content && content.trim().length > 0) {
      return <div className="text-sm text-slate-700 line-clamp-3">{content.slice(0, 150)}{content.length > 150 ? '…' : ''}</div>;
    }
    // Unknown / unsupported
    return <div className="flex items-center gap-2 text-gray-600"><FaFile /> {fileType.toUpperCase() || 'File'}</div>;
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between mb-3">
        <h2 className="text-lg font-medium">Results</h2>
        <div className="text-sm text-slate-500">{results.total} results</div>
      </div>

      <ul className="space-y-3">
        {results.hits.map(hit => (
          <li key={hit.id} className="p-3 border rounded hover:bg-slate-50 flex justify-between items-center">
            <div>
              <div className="font-semibold">{hit.title}</div>
              <div className="text-sm text-slate-500">{hit.project} • {hit.team} • {hit.fileType}</div>
              <div className="mt-2">{renderRowPreview(hit)}</div>
            </div>
            <button onClick={() => setOpen(hit)} className="px-2 py-1 border rounded">Preview</button>
          </li>
        ))}
      </ul>

      {open && <FilePreview doc={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
