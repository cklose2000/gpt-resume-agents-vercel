import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Chat.module.css';

export default function AgentsDemo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    // Focus on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/agents/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: input,
          sessionId: sessionId 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Create assistant message
      const assistantMessage = {
        role: 'assistant',
        content: data.message || data.response,
        queryType: data.queryType,
        responseType: data.type
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update candidates if provided
      if (data.candidates) {
        setCandidates(data.candidates);
      } else if (data.agentResponses) {
        setCandidates(data.agentResponses.map(r => ({
          name: r.name,
          location: r.location,
          salary: '$100K-$120K'
        })));
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`,
        isError: true
      }]);
    } finally {
      setLoading(false);
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🤖 Multi-Agent Resume Assistant</h1>
        <p>Powered by GPT-4.1 with intelligent orchestration</p>
        {candidates.length > 0 && (
          <div className={styles.sessionInfo}>
            Available: {candidates.map(c => c.name).join(', ')}
          </div>
        )}
      </header>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.welcome}>
              <h2>🚀 Ask questions to find and learn about candidates:</h2>
              <ul>
                <li>"List the available candidates"</li>
                <li>"Who has .NET experience?"</li>
                <li>"Tell me about someone's background"</li>
                <li>"Compare their API experience"</li>
                <li>"Who knows React?"</li>
                <li>"What technologies do they use?"</li>
                <li>"Find senior developers"</li>
                <li>"Show me Python developers"</li>
              </ul>
              <p style={{color: '#666', marginTop: '20px', fontSize: '0.9rem'}}>
                <strong>✨ Features:</strong> Intelligent query routing, context awareness, and smart candidate matching
              </p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${styles[message.role]} ${
                message.isError ? styles.error : ''
              }`}
            >
              <div className={styles.messageContent}>
                {message.content}
                {(message.queryType || message.responseType) && (
                  <div className={styles.functionInfo}>
                    <small>
                      Query: {message.queryType} | Response: {message.responseType}
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className={styles.message + ' ' + styles.loading}>
              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className={styles.inputForm}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about candidates or request information..."
            className={styles.input}
            disabled={loading || !sessionId}
            autoFocus
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={loading || !input.trim() || !sessionId}
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}