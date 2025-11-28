// Pages/HostMeeting/HostMeeting.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HostMeeting.scss";
import useAuthStore from "../../stores/useAuthStore";
import '../../styles/modals.scss'; // Import modal styles

const HostMeeting: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false); // State for custom modal
  
  const [messages, setMessages] = useState<Array<{sender: string, text: string, time: string}>>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg = {
      sender: user?.displayName || user?.email || "Yo",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const confirmExit = () => {
      setShowExitModal(false);
      navigate('/home');
  };

  return (
    <div className="host-wrapper">
      <div className="host-container">

        {/* VIDEO GRID */}
        <div className="video-grid">
          
          {/* Current User Box */}
          <div className={`video-box host-box ${!cameraOn ? 'camera-off' : ''}`}>
              {!cameraOn ? (
                <div className="avatar-placeholder">
                   {user?.firstName ? user.firstName[0] : (user?.email?.[0].toUpperCase() || 'U')}
                </div>
              ) : (
                 // Simulación de video (en producción aquí iría el elemento <video>)
                 <div style={{width:'100%', height:'100%', background:'#202124', display:'flex', alignItems:'center', justifyContent:'center', color:'#5f6368'}}>
                    (Tu Cámara)
                 </div>
              )}
              <span className="participant-label">Tú ({user?.firstName || 'Usuario'})</span>
          </div>
          
          {/* Placeholder for other participants */}
          <div className="video-box empty-box">
             <div style={{width: 60, height: 60, borderRadius: '50%', border: '2px dashed #5f6368', display:'flex', alignItems:'center', justifyContent:'center'}}>
                👤
             </div>
             <span>Esperando a otros...</span>
          </div>

        </div>

        {/* CHAT SIDEBAR */}
        {showChat && (
          <div className="chat-container">
            <div className="chat-header">
              <span className="chat-title">Mensajes en la llamada</span>
              <button onClick={() => setShowChat(false)} style={{background:'none', border:'none', cursor:'pointer'}}>✖</button>
            </div>
            
            <div className="chat-messages">
              {messages.length === 0 ? (
                  <p className="chat-empty-state">Los mensajes solo son visibles para los participantes de la llamada.</p>
              ) : (
                  messages.map((msg, index) => (
                    <div className="chat-message" key={index}>
                        <div className="message-info">
                            <div className="row">
                                <span className="chat-name">{msg.sender}</span>
                                <span className="chat-hour">{msg.time}</span>
                            </div>
                            <p className="chat-text">{msg.text}</p>
                        </div>
                    </div>
                  ))
              )}
            </div>

            <div className="chat-input-row">
              <input 
                type="text" 
                placeholder="Envía un mensaje a todos" 
                className="chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="chat-send" onClick={handleSendMessage}>
                 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </div>
        )}

        {/* CONTROL BAR */}
        <div className="controls-bar">
          
          <div className="meeting-info-display">
             <div className="meeting-time" style={{fontSize: 14, fontWeight: 500}}>
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} | {id}
             </div>
          </div>

          <div className="control-buttons">
            {/* MICRÓFONO */}
            <div 
              className={`control-btn ${!micOn ? 'btn-off' : ''}`}
              onClick={() => setMicOn(!micOn)}
              title={micOn ? "Desactivar micrófono" : "Activar micrófono"}
            >
              {micOn ? (
                 <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              ) : (
                 <svg viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              )}
            </div>

            {/* CÁMARA */}
            <div 
              className={`control-btn ${!cameraOn ? 'btn-off' : ''}`}
              onClick={() => setCameraOn(!cameraOn)}
              title={cameraOn ? "Desactivar cámara" : "Activar cámara"}
            >
              {cameraOn ? (
                 <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              ) : (
                 <svg viewBox="0 0 24 24"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              )}
            </div>

            {/* CHAT TOGGLE */}
            <div 
              className={`control-btn ${showChat ? 'active' : ''}`}
              onClick={() => setShowChat(!showChat)}
              title="Chat con todos"
            >
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>

          </div>

          <button className="end-meeting-btn" onClick={() => setShowExitModal(true)}>
             <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
             <span style={{marginLeft: 8}}>Salir</span>
          </button>

        </div>
      </div>

      {/* EXIT MODAL */}
      {showExitModal && (
        <div className="modal-overlay" style={{zIndex: 2000}}>
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
