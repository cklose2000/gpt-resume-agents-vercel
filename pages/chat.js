import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Chat.module.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [shownCount, setShownCount] = useState(0);
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
          sessionId
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server')
      }
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || data.response,
          functionCalled: data.functionCalled,
          candidatesFound: data.candidatesFound || data.total_found
        }]);
        
        // Update shown count if provided
        if (data.shownCandidatesCount !== undefined) {
          setShownCount(data.shownCandidatesCount);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${data.message || 'Something went wrong'}`,
          isError: true
        }]);
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
        <h1>💬 Resume Search Assistant</h1>
        <p>Natural language resume search and analysis</p>
        {shownCount > 0 && (
          <p className={styles.sessionInfo}>
            Already shown: {shownCount} candidates in this conversation
          </p>
        )}
      </header>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.welcome}>
              <h2>Welcome! Try asking:</h2>
              <ul>
                <li>"How many senior React developers do you have?"</li>
                <li>"Show me backend developers with API experience"</li>
                <li>"Rank the top 5 Python developers"</li>
                <li>"Any SQL devs?" (typos are handled naturally)</li>
                <li>"Show me other developers" (excludes previously shown)</li>
                <li>"Find candidates with machine learning experience"</li>
              </ul>
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
                {message.functionCalled && (
                  <div className={styles.functionInfo}>
                    <small>
                      Used: {message.functionCalled}
                      {message.candidatesFound !== undefined && 
                        ` (Found: ${message.candidatesFound})`
                      }
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
            placeholder="Ask about candidates..."
            className={styles.input}
            disabled={loading || !sessionId}
            autoFocus
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={loading || !input.trim() || !sessionId}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}