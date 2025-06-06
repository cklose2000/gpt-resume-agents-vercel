import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      gap: '20px'
    }}>
      <h1>GPT Resume Agents Portal</h1>
      <p style={{ textAlign: 'center', maxWidth: '600px', color: '#666' }}>
        Intelligent multi-agent resume search system powered by GPT-4.1
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/chat" style={{ 
          padding: '12px 24px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Chat Interface
        </Link>
        <Link href="/agents-demo" style={{ 
          padding: '12px 24px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          🎉 Multi-Agent Demo
        </Link>
        <Link href="/admin-upload" style={{ 
          padding: '12px 24px', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Upload Resumes
        </Link>
      </div>
    </div>
  );
}