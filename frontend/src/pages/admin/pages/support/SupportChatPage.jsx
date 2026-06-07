import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';

const SupportChatPage = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const wsRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const host = window.location.host;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${host}/ws/support/chat/admin/`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setStatus('Connected');
      // Simulate receiving initial sessions
      setSessions([
        { id: '1', user: 'guest_123', unread: 2, isOnline: true },
        { id: '2', user: 'john_doe', unread: 0, isOnline: false }
      ]);
      setMessages({
        '1': [{ sender: 'user', message: 'Hello, I need help with building a PC.', timestamp: new Date().toISOString() }],
        '2': [{ sender: 'Support', message: 'How can I assist you?', timestamp: new Date().toISOString() }]
      });
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          const sessionId = data.session_id || '1'; // fallback for demo
          setMessages(prev => ({
            ...prev,
            [sessionId]: [...(prev[sessionId] || []), data]
          }));
          
          if (activeSession !== sessionId) {
            setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, unread: s.unread + 1 } : s));
            showToast(`New message from ${sessionId}`, 'info');
          }
        }
      } catch (e) {
        console.error('WebSocket message parsing failed:', e);
      }
    };

    wsRef.current.onclose = () => setStatus('Disconnected');

    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [activeSession, showToast]);

  const selectSession = (id) => {
    setActiveSession(id);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, unread: 0 } : s));
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeSession || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const payload = {
      type: 'chat_message',
      session_id: activeSession,
      message: input,
      sender: 'Support',
      timestamp: new Date().toISOString()
    };

    wsRef.current.send(JSON.stringify(payload));
    setMessages(prev => ({
      ...prev,
      [activeSession]: [...(prev[activeSession] || []), payload]
    }));
    setInput('');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Realtime Support Chat</h2>
      <div style={{ padding: '10px', background: status === 'Connected' ? '#dcfce7' : '#fee2e2', color: status === 'Connected' ? '#166534' : '#991b1b', marginBottom: '20px', borderRadius: '4px' }}>
        Status: {status}
      </div>

      <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
        
        {/* Sidebar for Sessions */}
        <div style={{ width: '300px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>Active Customers</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {sessions.map(s => (
              <div 
                key={s.id} 
                onClick={() => selectSession(s.id)}
                style={{ 
                  padding: '15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                  background: activeSession === s.id ? '#f8fafc' : 'white',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: s.isOnline ? '#16a34a' : '#94a3b8', marginRight: '8px' }}></span>
                  {s.user}
                </div>
                {s.unread > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{s.unread}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
          {activeSession ? (
            <>
              <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                Chatting with Session ID: {activeSession}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {(messages[activeSession] || []).map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: '15px', textAlign: msg.sender === 'Support' ? 'right' : 'left' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{msg.sender} - {new Date(msg.timestamp).toLocaleTimeString()}</span>
                    <div style={{ 
                      background: msg.sender === 'Support' ? '#0ea5e9' : '#f1f5f9', 
                      color: msg.sender === 'Support' ? 'white' : '#1e293b',
                      padding: '10px 15px', borderRadius: '8px', display: 'inline-block', marginTop: '5px'
                    }}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} style={{ display: 'flex', padding: '15px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a response..." style={{ flex: 1, padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Send</button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Select a customer to start chatting
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SupportChatPage;
