// Pages/HostMeeting.tsx
import React from "react";
import "./HostMeeting.scss";

const HostMeeting: React.FC = () => {

  const [cameraOn, setCameraOn] = React.useState(true);
  const [micOn, setMicOn] = React.useState(true);
  const [showChat, setShowChat] = React.useState(false);

  return (
    <div className="host-wrapper">
      <div className="host-container">

        {/* ===================== */}
        {/*       VIDEO GRID      */}
        {/* ===================== */}
        <div className="video-grid">

          <div className="video-box"><span className="participant-label">PARTICIPANTE 1</span></div>
          <div className="video-box host-box"><span className="participant-label">ANFITRIÓN</span></div>
          <div className="video-box"><span className="participant-label">PARTICIPANTE 4</span></div>
          <div className="video-box"><span className="participant-label">PARTICIPANTE 3</span></div>

        </div>

        {/* ===================== */}
        {/*         CHAT          */}
        {/* ===================== */}
        {showChat && (
          <div className="chat-container">

            <div className="chat-header">
              <span className="chat-title">Chat</span>
            </div>

            <div className="chat-divider"></div>

            <div className="chat-messages">
              <div className="chat-message">
                
                <img 
                  src="/Imagenes/usuario.png"
                  className="chat-avatar"
                  alt="User"
                />

                <div className="message-info">
                  <div className="row">
                    <span className="chat-name">James Valencia</span>
                    <span className="chat-hour">10:15 AM</span>
                  </div>
                  <p className="chat-text">Buen día!</p>
                </div>

              </div>
            </div>

            <div className="chat-input-row">
              <input 
                type="text" 
                placeholder="Escribe un mensaje" 
                className="chat-input"
              />
              <button className="chat-send">Enviar</button>
            </div>

          </div>
        )}

        {/* =============================== */}
        {/*       PANEL DE CONTROLES        */}
        {/* =============================== */}
        <div className="controls-bar">

          <div className="meeting-id">
            <strong>Reunión ID:</strong> 83672293
          </div>

          <div className="control-buttons">

            {/* CÁMARA */}
            <div 
              className="control-btn"
              onClick={() => setCameraOn(!cameraOn)}
            >
              <img 
                src={cameraOn ? "/Imagenes/cam_on.png" : "/Imagenes/cam_off.png"} 
                className="control-img"
              />
              <span className="control-label">
                {cameraOn ? "Apagar cámara" : "Prender cámara"}
              </span>
            </div>

            {/* MICRÓFONO */}
            <div 
              className="control-btn"
              onClick={() => setMicOn(!micOn)}
            >
              <img 
                src={micOn ? "/Imagenes/mic_on.png" : "/Imagenes/mic_off.png"} 
                className="control-img"
              />
              <span className="control-label">
                {micOn ? "Apagar micrófono" : "Prender micrófono"}
              </span>
            </div>

            {/* MENSAJES */}
            <div 
              className="control-btn"
              onClick={() => setShowChat(!showChat)}
            >
              <img 
                src="/Imagenes/messages.png"
                className="control-img"
              />
              <span className="control-label">Mensajes</span>
            </div>

          </div>

          <button className="end-meeting-btn">
            🛑 Finalizar Reunión
          </button>

        </div>

      </div>
    </div>
  );
};

export default HostMeeting;
