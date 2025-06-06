// admin-upload.js - Admin interface for uploading resumes

import { useState } from 'react';

export default function AdminUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileSelect = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`resume_${index}`, file);
    });

    try {
      const response = await fetch('/api/admin/upload-resumes', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Upload failed:', error);
      setResults({ 
        error: 'Upload failed', 
        message: 'Upload endpoint not yet implemented. Coming soon!' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📄 Resume Upload Admin</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Upload and process resumes with LLMWhisperer + AI extraction
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          style={{ marginBottom: '1rem' }}
        />
        
        {files.length > 0 && (
          <div>
            <h3>Selected Files ({files.length}):</h3>
            <ul>
              {files.map((file, index) => (
                <li key={index} style={{ padding: '4px 0' }}>
                  {file.name} ({Math.round(file.size / 1024)}KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button 
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        style={{
          padding: '1rem 2rem',
          backgroundColor: uploading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {uploading ? 'Processing...' : 'Upload & Process Resumes'}
      </button>

      {results && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Results:</h3>
          <div style={{ 
            background: results.error ? '#fee' : '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '8px',
            border: results.error ? '1px solid #fcc' : '1px solid #ddd'
          }}>
            <pre style={{ overflow: 'auto', margin: 0 }}>
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>🔧 Features Coming Soon:</h3>
        <ul>
          <li>✅ PDF/DOC resume parsing with LLMWhisperer</li>
          <li>✅ AI-powered content extraction</li>
          <li>✅ Automatic vector embedding generation</li>
          <li>✅ Database storage and indexing</li>
          <li>⏳ File upload API endpoint</li>
          <li>⏳ Batch processing dashboard</li>
          <li>⏳ Progress tracking and logs</li>
        </ul>
      </div>
    </div>
  );
}