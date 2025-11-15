import React from 'react';
import { 
  FaFilePdf, 
  FaFileVideo, 
  FaFileAudio, 
  FaFileImage, 
  FaFileAlt, 
  FaFile 
} from 'react-icons/fa';

export default function FilePreview({ doc, onClose }) {
  const { title, project, team, company, fileType, originalPath, content } = doc;

  const renderPreview = () => {
    if(['png','jpg','jpeg','gif','webp'].includes(fileType)) {
      return <img src={`http://localhost:4000${originalPath}`} alt={title} className="max-w-full max-h-[60vh] object-contain mx-auto" />;
    }

    if(['mp4','webm','mov'].includes(fileType)) {
      return <video src={`http://localhost:4000${originalPath}`} controls className="max-w-full max-h-[60vh] mx-auto" />;
    }

    if(['mp3','wav','ogg'].includes(fileType)) {
      return <audio src={`http://localhost:4000${originalPath}`} controls className="w-full" />;
    }

    if(fileType === 'pdf') {
      return <iframe src={`http://localhost:4000${originalPath}`} className="w-full h-[70vh]" title={title} />;
    }

    if(content && content.trim().length > 0) {
      return <div className="whitespace-pre-wrap text-sm text-slate-800 max-h-[60vh] overflow-auto">{content}</div>;
    }

    // Unknown / unsupported file type
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
        <FaFile size={64} className="mb-4" />
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm mt-1">{fileType.toUpperCase() || 'Unknown File'}</p>
        <p className="text-sm mt-1">{project} • {team} • {company}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
      <div className="w-[90%] max-w-4xl bg-white rounded p-6 max-h-[90vh] overflow-auto shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="text-sm text-slate-500">{project} • {team} • {company}</div>
          </div>
          <button className="text-slate-600" onClick={onClose}>Close</button>
        </div>

        <div className="mt-4">
          {renderPreview()}
        </div>

        <div className="mt-6">
          <a href={`http://localhost:4000${originalPath}`} target="_blank" rel="noreferrer" className="underline text-sky-600">
            Open full file
          </a>
        </div>
      </div>
    </div>
  );
}
