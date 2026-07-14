import { useState } from 'react';
import { Send, Search, MessageSquare } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  unread: boolean;
  lastMessage: string;
}

interface Message {
  sender: 'me' | 'them';
  content: string;
  time: string;
}

export default function TeacherMessages() {
  const [selectedContact, setSelectedContact] = useState<string>('1');
  const [typedMessage, setTypedMessage] = useState('');

  const contacts: Contact[] = [
    { id: '1', name: 'Helen Watson (Parent)', role: 'Emma\'s Mother', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80', unread: true, lastMessage: 'Thank you for the update on Emmas math progress!' },
    { id: '2', name: 'Alastair Moody (Safeguarding)', role: 'Safeguarding Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80', unread: false, lastMessage: 'Reviewing the concern log you filed for Noah Ark.' },
    { id: '3', name: 'School Admin Office', role: 'Administration', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80', unread: false, lastMessage: 'Term reports are due by Friday afternoon.' }
  ];

  const [messageThreads, setMessageThreads] = useState<Record<string, Message[]>>({
    '1': [
      { sender: 'me', content: 'Hello Helen, Emma did exceptionally well in the fraction quiz today! She is ready for the advanced worksheet.', time: 'Yesterday, 15:40' },
      { sender: 'them', content: 'Thank you for the update on Emmas math progress! She was telling me how much she enjoyed the class.', time: 'Yesterday, 16:12' }
    ],
    '2': [
      { sender: 'me', content: 'Hi Alastair, I filed a concern log for Noah. He seemed very hungry and disheveled today.', time: 'Today, 11:45' },
      { sender: 'them', content: 'Reviewing the concern log you filed for Noah Ark. I will pull up his history and notify home.', time: 'Today, 12:10' }
    ],
    '3': [
      { sender: 'them', content: 'Hi Team, quick reminder that term progress report cards are due by Friday afternoon.', time: 'Monday, 09:00' }
    ]
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg: Message = {
      sender: 'me',
      content: typedMessage,
      time: 'Just now'
    };

    setMessageThreads(prev => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMsg]
    }));

    setTypedMessage('');
  };

  const activeContact = contacts.find(c => c.id === selectedContact);
  const activeThread = messageThreads[selectedContact] || [];

  return (
    <div className="teacher-messages-wrapper">
      <style>{`
        .teacher-messages-wrapper {
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 14px;
          height: calc(100vh - 200px);
          min-height: 500px;
          display: grid;
          grid-template-columns: 320px 1fr;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        @media (max-width: 768px) {
          .teacher-messages-wrapper {
            grid-template-columns: 1fr;
          }
          .contacts-sidebar-column {
            display: ${selectedContact ? 'none' : 'block'};
          }
          .chat-feed-column {
            display: ${selectedContact ? 'flex' : 'none'};
          }
        }

        .contacts-sidebar-column {
          border-right: 1.5px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          background: #fafaf9;
        }

        .search-contacts-wrap {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          position: relative;
        }

        .search-contacts-input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 13px;
          outline: none;
          background: white;
        }

        .search-contacts-input:focus {
          border-color: #c06d48;
        }

        .search-contacts-icon {
          position: absolute;
          left: 26px;
          top: 26px;
          color: #94a3b8;
        }

        .contacts-list-flow {
          overflow-y: auto;
          flex: 1;
        }

        .contact-tab-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1.5px solid #f1f5f9;
          cursor: pointer;
          transition: background 0.15s;
          background: transparent;
          border-left: 3px solid transparent;
        }

        .contact-tab-item:hover {
          background: #fdfaf7;
        }

        .contact-tab-item.active {
          background: #fdf6f0;
          border-left-color: #c06d48;
        }

        .contact-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
        }

        .contact-text-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .contact-tab-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .contact-tab-role {
          font-size: 11.5px;
          color: #64748b;
        }

        .contact-tab-preview {
          font-size: 12px;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Chat column */
        .chat-feed-column {
          display: flex;
          flex-direction: column;
          background: white;
        }

        .chat-header-bar {
          padding: 16px 24px;
          border-bottom: 1.5px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-scroll-area {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-bubble-row {
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }

        .chat-bubble-row.me {
          align-self: flex-end;
          align-items: flex-end;
        }

        .chat-bubble-row.them {
          align-self: flex-start;
          align-items: flex-start;
        }

        .chat-bubble {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
        }

        .chat-bubble-row.me .chat-bubble {
          background: #c06d48;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-bubble-row.them .chat-bubble {
          background: #f1f5f9;
          color: #0f172a;
          border-bottom-left-radius: 4px;
        }

        .chat-time {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .chat-input-bar-form {
          padding: 16px 24px;
          border-top: 1.5px solid #f1f5f9;
          display: flex;
          gap: 12px;
        }

        .chat-input-field {
          flex: 1;
          padding: 12px 16px;
          border-radius: 24px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          outline: none;
        }

        .chat-input-field:focus {
          border-color: #c06d48;
        }

        .chat-send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #c06d48;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }

        .chat-send-btn:hover {
          background: #a65b39;
        }
      `}</style>

      {/* LEFT COLUMN: CONTACTS */}
      <div className="contacts-sidebar-column">
        <div className="search-contacts-wrap">
          <Search size={14} className="search-contacts-icon" />
          <input type="text" className="search-contacts-input" placeholder="Search chats..." />
        </div>

        <div className="contacts-list-flow">
          {contacts.map((c) => (
            <div 
              key={c.id} 
              className={`contact-tab-item ${selectedContact === c.id ? 'active' : ''}`}
              onClick={() => setSelectedContact(c.id)}
            >
              <img src={c.avatar} alt={c.name} className="contact-avatar" />
              <div className="contact-text-meta">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="contact-tab-name">{c.name}</span>
                  {c.unread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c06d48' }} />}
                </div>
                <span className="contact-tab-role">{c.role}</span>
                <span className="contact-tab-preview">{c.lastMessage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: CHAT PANEL */}
      <div className="chat-feed-column">
        {activeContact ? (
          <>
            <div className="chat-header-bar">
              <img src={activeContact.avatar} alt={activeContact.name} className="contact-avatar" />
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{activeContact.name}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{activeContact.role}</span>
              </div>
            </div>

            <div className="chat-scroll-area">
              {activeThread.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-row ${msg.sender}`}>
                  <div className="chat-bubble">
                    {msg.content}
                  </div>
                  <span className="chat-time">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-bar-form">
              <input 
                type="text" 
                className="chat-input-field" 
                placeholder="Type your message here..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-btn">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <MessageSquare size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <span>Select a conversation to start chat</span>
          </div>
        )}
      </div>
    </div>
  );
}
