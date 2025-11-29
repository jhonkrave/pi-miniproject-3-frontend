// Pages/HostMeeting/HostMeeting.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HostMeeting.scss";
import useAuthStore from "../../stores/useAuthStore";
import '../../styles/modals.scss';
import { chatService, type ChatMessage } from '../../lib/chatService';
import { api, type Meeting } from '../../lib/api';
import { authService } from '../../lib/authService';
import { useToast } from '../../context/ToastContext';

const HostMeeting: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();
  const { showToast } = useToast();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [latestMessage, setLatestMessage] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Mock devices list
  const [audioInput, setAudioInput] = useState("default");
  const [audioOutput, setAudioOutput] = useState("default");
  const [videoInput, setVideoInput] = useState("default");

  // ---------------------------
  // MEETING & CHAT LOGIC
  // ---------------------------
  
  useEffect(() => {
      if (user?.uid) {
          setActiveParticipants(prev => {
              if (!prev.includes(user.uid)) return [...prev, user.uid];
              return prev;
          });
      }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
        showToast('Debes iniciar sesión para entrar a una reunión', 'error');
        navigate('/login');
    }
  }, [user, isLoading, navigate, showToast]);

  useEffect(() => {
    const validateAndJoin = async () => {
      if (!id || !user) return;

      try {
        const token = await authService.getIdToken();
        if (!token) {
            showToast('Error de autenticación', 'error');
            return;
        }

        // 1. Get Meeting Details & Validate
        try {
            const meetingData = await api.getMeetingById(id, token);
            
            if (!meetingData) {
                showToast('La reunión no existe o no está disponible', 'error');
                navigate('/');
                return;
            }

            if (meetingData.status === 'ended' || meetingData.status === 'cancelled') {
                 showToast(`La reunión ha sido ${meetingData.status === 'ended' ? 'finalizada' : 'cancelada'}`, 'error');
                 navigate('/');
                 return;
            }

            // Check participant limit
            if (meetingData.participants && meetingData.participants.length >= (meetingData.maxParticipants || 10)) {
                if (!meetingData.participants.includes(user.uid)) {
                     showToast('La reunión está llena', 'error');
                     navigate('/');
                     return;
                }
            }

            setMeeting(meetingData);
            
            // Initialize active participants
            if (meetingData.participants && meetingData.participants.length > 0) {
                setActiveParticipants(prev => {
                    const newSet = new Set([...prev, ...meetingData.participants!]);
                    return Array.from(newSet);
                });
            }

            // Update backend with new participant if necessary (persistence)
            // Note: This relies on the backend supporting updates via this endpoint.
            // If backend strictly controls this, this call might be ignored or fail,
            // but it's the standard way to "join" persistently in this architecture type.
            if (meetingData.participants && !meetingData.participants.includes(user.uid)) {
                const updatedParticipants = [...meetingData.participants, user.uid];
                try {
                    await api.updateMeeting(id, { ...meetingData, participants: updatedParticipants }, token);
                } catch (err) {
                    console.warn("Failed to persist participant join status:", err);
                }
            }

            // 2. Connect to Chat
            chatService.connect(token);
            chatService.joinRoom(id, user.uid);

            // Set up listeners
            // IMPORTANT: We assign this to a variable to cleanup specifically this listener if needed,
            // but chatService doesn't support specific offMessage yet perfectly.
            // The issue of double messages is likely because onMessage adds a NEW listener every time
            // this effect runs (if it re-runs), OR because StrictMode runs effects twice in dev.
            // We should ensure we don't duplicate listeners or messages.
            
            chatService.offMessage(); // Clear previous listeners to avoid duplicates
            chatService.onMessage((msg) => {
                setMessages((prev) => {
                    // Check for duplicates based on timestamp + sender
                    // A simple way is to check if the last message is identical
                    const isDuplicate = prev.some(m => 
                        m.content === msg.content && 
                        m.senderId === msg.senderId && 
                        m.timestamp === msg.timestamp
                    );
                    if (isDuplicate) return prev;
                    
                    // Handle notification logic here inside the state update to ensure access to current state if needed
                    return [...prev, msg];
                });

                setActiveParticipants(prev => {
                    if (!prev.includes(msg.senderId)) return [...prev, msg.senderId];
                    return prev;
                });
                
                // Handle notification side effects outside
                if (!showChat) {
                    setUnreadMessages(prev => prev + 1);
                    setLatestMessage(msg);
                    setTimeout(() => setLatestMessage(null), 4000); // Hide preview after 4s
                }
            });

            // Polling mechanism for participants update
            const pollInterval = setInterval(() => {
                 api.getMeetingById(id, token).then(updatedMeeting => {
                     if (updatedMeeting) {
                         setMeeting(prev => {
                             // Only update if participants changed to avoid re-renders if necessary
                             // Simple comparison of length or JSON stringify
                             if (JSON.stringify(prev?.participants) !== JSON.stringify(updatedMeeting.participants)) {
                                if (updatedMeeting.participants) {
                                    setActiveParticipants(curr => {
                                        const newSet = new Set([...curr, ...updatedMeeting.participants!]);
                                        return Array.from(newSet);
                                    });
                                }
                                return updatedMeeting;
                             }
                             return prev;
                         });
                     }
                 }).catch(err => console.error("Polling error", err));
            }, 5000); // Poll every 5 seconds

            // Listen for user joined/left events to update participant count (Optimistic update)
            chatService.onUserJoined((data) => {
                 console.log('User joined:', data);
                 const joinedUserId = data.userId || data.uid || data.id;
                 if (joinedUserId) {
                     setActiveParticipants(prev => {
                         if (!prev.includes(joinedUserId)) return [...prev, joinedUserId];
                         return prev;
                     });
                 }

                 api.getMeetingById(id, token).then(updatedMeeting => {
                     if (updatedMeeting) setMeeting(updatedMeeting);
                 });
            });

            chatService.onUserLeft((data) => {
                 console.log('User left:', data);
                 api.getMeetingById(id, token).then(updatedMeeting => {
                     if (updatedMeeting) setMeeting(updatedMeeting);
                 });
            });
            
            // Cleanup polling on unmount
            return () => clearInterval(pollInterval);


        } catch (error) {
            console.error('API Error:', error);
            const apiError = error as { status?: number; message?: string };
            
            if (apiError.status === 404) {
                showToast('Reunión no encontrada', 'error');
            } else {
                showToast('Error al cargar la reunión', 'error');
            }
            navigate('/');
        }

      } catch (error) {
        console.error(error);
        showToast('Error al conectar a la reunión', 'error');
        navigate('/');
      }
    };

    if (!isLoading && user) {
        validateAndJoin();
    }

    return () => {
        if (id) chatService.leaveRoom(id);
        chatService.offMessage();
        chatService.offUserJoined();
        chatService.offUserLeft();
        chatService.disconnect();
    };
  }, [id, user, isLoading, navigate, showToast]);

  useEffect(() => {
    if (showChat) {
        setUnreadMessages(0);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  const toggleChat = () => {
      setShowChat(!showChat);
      if (showParticipants) setShowParticipants(false);
  }

  const toggleParticipants = () => {
      setShowParticipants(!showParticipants);
      if (showChat) setShowChat(false);
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !id || !user) return;

    chatService.sendMessage(id, inputValue);
    setInputValue('');
  };

  const confirmExit = async () => {
      if (id) chatService.leaveRoom(id);
      
      // Remove self from participants list in backend
      if (id && user && meeting?.participants) {
          const updatedParticipants = meeting.participants.filter(p => p !== user.uid);
          try {
              const token = await authService.getIdToken();
              if (token) {
                  await api.updateMeeting(id, { ...meeting, participants: updatedParticipants }, token);
              }
          } catch (err) {
              console.warn("Failed to persist participant leave status:", err);
          }
      }

      setShowExitModal(false);
      navigate('/home');
  };

  return (
    <div className="host-wrapper">
      <div className="host-container">
        {/* HEADER */}
        <div className="meeting-header">
           <div className="meeting-info-display">
             <span className="meeting-id">{meeting?.title || id}</span>
             <span className="meeting-divider">|</span>
             <span className="meeting-time">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           </div>
        </div>

        {/* VIDEO GRID */}
        <div className={`video-grid ${showChat ? 'with-chat' : ''}`} style={{ flexWrap: 'wrap', alignContent: 'center' }}>
          
          {/* Render ALL active participants including me */}
          {activeParticipants.map((participantId, index) => {
             const isMe = participantId === user?.uid;
             
             // Try to find name
             const msgInfo = messages.find(m => m.senderId === participantId);
             // If it's me, show my name. If remote, show name from msg or ID.
             const displayName = isMe ? `Tú (${user?.firstName || 'Usuario'})` : (msgInfo?.senderName || `Usuario ${participantId.slice(0,4)}...`);
             const avatarLetter = displayName[0]?.toUpperCase() || 'U';

             return (
                <div key={participantId} className={`video-box ${isMe ? 'host-box' : 'remote-box'} ${!cameraOn && isMe ? 'camera-off' : ''}`} 
                     style={{ maxWidth: activeParticipants.length > 1 ? '45%' : '600px' }}>
                    
                    {isMe && !cameraOn ? (
                        <div className="avatar-placeholder">
                           {avatarLetter}
                        </div>
                    ) : isMe && cameraOn ? (
                         <div className="video-placeholder-content">
                            (Tu Cámara)
                         </div>
                    ) : (
                         <div className="avatar-placeholder" style={{ backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)` }}>
                            {avatarLetter}
                         </div>
                    )}

                    <span className="participant-label">{displayName}</span>
                    
                    {isMe && (
                        <div className="mic-status">
                            {!micOn && (
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>
                            )}
                        </div>
                    )}
                </div>
             );
          })}
        </div>

        {/* CHAT SIDEBAR */}
        {showChat && (
            <div className="chat-sidebar">
                <div className="chat-header">
                    <h3>Chat de la reunión</h3>
                    <button className="close-chat-btn" onClick={() => setShowChat(false)}>✕</button>
                </div>
                <div className="messages-list">
                    {messages.length === 0 && (
                        <div className="empty-chat-msg">No hay mensajes aún.</div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-item ${msg.senderId === user?.uid ? 'mine' : ''}`}>
                            <div className="msg-meta">
                                <span className="msg-name">{msg.senderName}</span>
                                <span className="msg-time">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="msg-content">{msg.content}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input 
                        type="text" 
                        placeholder="Enviar mensaje..." 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button type="submit" disabled={!inputValue.trim()}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        )}

        {/* PARTICIPANTS SIDEBAR */}
        {showParticipants && (
            <div className="chat-sidebar">
                <div className="chat-header">
                    <h3>Personas ({activeParticipants.length})</h3>
                    <button className="close-chat-btn" onClick={() => setShowParticipants(false)}>✕</button>
                </div>
                <div className="messages-list">
                    <div className="participants-list">
                        {activeParticipants.map((participantId, idx) => {
                           // Find user info from messages if available
                           const msgInfo = messages.find(m => m.senderId === participantId);
                           const isMe = participantId === user?.uid;
                           const name = isMe ? `Tú (${user?.firstName || 'Usuario'})` : (msgInfo?.senderName || `Usuario ${participantId.slice(0,4)}`);
                           const avatarLetter = name[0] || 'U';
                           
                           return (
                             <div key={participantId} className="participant-item">
                                <div className="avatar-small" style={{backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`}}>
                                    {avatarLetter}
                                </div>
                                <div className="participant-info">
                                    <span className="participant-name">{name}</span>
                                    <span className="participant-role">{participantId === meeting?.createdBy ? 'Anfitrión' : 'Participante'}</span>
                                </div>
                             </div>
                           );
                        })}
                    </div>
                </div>
            </div>
        )}

        {/* FLOATING CONTROL BAR */}
        <div className="controls-bar-wrapper">
          <div className="controls-bar">
            {/* MICRÓFONO */}
            <button 
              className={`control-btn ${!micOn ? 'btn-danger' : ''}`}
              onClick={() => setMicOn(!micOn)}
              title={micOn ? "Desactivar micrófono" : "Activar micrófono"}
            >
              {micOn ? (
                 <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              ) : (
                 <svg viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              )}
            </button>

            {/* CÁMARA */}
            <button 
              className={`control-btn ${!cameraOn ? 'btn-danger' : ''}`}
              onClick={() => setCameraOn(!cameraOn)}
              title={cameraOn ? "Desactivar cámara" : "Activar cámara"}
            >
              {cameraOn ? (
                 <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              ) : (
                 <svg viewBox="0 0 24 24"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              )}
            </button>

            {/* MESSAGE PREVIEW TOAST */}
            {latestMessage && !showChat && (
                <div className="message-preview-toast">
                    <div className="preview-header">
                        <span className="sender-name">{latestMessage.senderName}</span>
                        <button onClick={() => setLatestMessage(null)}>✕</button>
                    </div>
                    <div className="preview-content">{latestMessage.content}</div>
                </div>
            )}

            {/* SETTINGS */}
            <button 
              className="control-btn"
              onClick={() => setShowSettings(true)}
              title="Configuración"
            >
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>

            {/* PARTICIPANTS TOGGLE */}
            <button 
              className={`control-btn ${showParticipants ? 'active-btn' : ''}`}
              onClick={toggleParticipants}
              title={showParticipants ? "Ocultar participantes" : "Mostrar participantes"}
            >
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </button>

            {/* CHAT TOGGLE */}
            <div style={{position: 'relative'}}>
                <button 
                className={`control-btn ${showChat ? 'active-btn' : ''}`}
                onClick={toggleChat}
                title={showChat ? "Ocultar chat" : "Mostrar chat"}
                >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
                {unreadMessages > 0 && (
                    <span className="notification-dot"></span>
                )}
            </div>

            {/* END CALL */}
            <button className="control-btn btn-end-call" onClick={() => setShowExitModal(true)} title="Finalizar llamada">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="modal-overlay" style={{zIndex: 2000}}>
          <div className="modal-card settings-modal">
            <div className="modal-header">
              <h3>Configuración</h3>
              <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="settings-content">
               <div className="setting-group">
                  <label>🎙️ Micrófono</label>
                  <select value={audioInput} onChange={(e) => setAudioInput(e.target.value)}>
                     <option value="default">Predeterminado - Micrófono interno</option>
                     <option value="external">Micrófono externo (USB)</option>
                  </select>
               </div>
               <div className="setting-group">
                  <label>🔊 Altavoces</label>
                  <select value={audioOutput} onChange={(e) => setAudioOutput(e.target.value)}>
                     <option value="default">Predeterminado - Altavoces</option>
                     <option value="headphones">Auriculares</option>
                  </select>
               </div>
               <div className="setting-group">
                  <label>📹 Cámara</label>
                  <select value={videoInput} onChange={(e) => setVideoInput(e.target.value)}>
                     <option value="default">FaceTime HD Camera</option>
                     <option value="obs">OBS Virtual Camera</option>
                  </select>
               </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowSettings(false)}>Listo</button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT MODAL */}
      {showExitModal && (
        <div className="modal-overlay" style={{zIndex: 2001}}>
          <div className="modal-card" style={{maxWidth: 320, color: '#1f1f1f'}}>
            <div className="modal-header">
              <h3>Finalizar llamada</h3>
            </div>
            <p style={{color: '#444746'}}>¿Estás seguro de que quieres salir de la reunión?</p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowExitModal(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmExit}>Salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostMeeting;
