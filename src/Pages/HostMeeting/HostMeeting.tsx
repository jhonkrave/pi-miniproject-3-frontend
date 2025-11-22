import React, { useState } from "react";
import "./HostMeeting.scss";

// Componente para simular un mensaje de chat
const ChatMessage: React.FC = () => (
    <div className="message">
        <div className="avatar">
            {/* Se asume que este archivo existe en tu proyecto */}
            <img src="/avatars/user1.png" alt="Avatar" /> 
        </div>
        <div className="message-content">
            <div className="metadata">
                <p className="name">James Valencia</p>
                <span className="time">10:15 AM</span>
            </div>
            <p className="text">Buen día!</p>
        </div>
    </div>
);

const HostMeeting: React.FC = () => {
    // El chat está abierto por defecto según la imagen
    const [showChat, setShowChat] = useState(true); 

    // Icono SVG para la cámara
    const CameraIcon = () => (
        <svg className="icon-camera" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15V9C22 7.89543 21.1046 7 20 7Z" stroke="#1B2A41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 11L20 13V11L16 9" stroke="#1B2A41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    // Icono SVG para el micrófono
    const MicIcon = () => (
        <svg className="icon-mic" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C9.79086 2 8 3.79086 8 6V11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11V6C16 3.79086 14.2091 2 12 2Z" stroke="#1B2A41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 11C19 14.866 15.866 18 12 18C8.13401 18 5 14.866 5 11" stroke="#1B2A41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18V22" stroke="#1B2A41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    // Icono SVG para el chat
    const ChatIcon = () => (
        <svg className="icon-chat" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z" stroke="#1B2A41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    // Icono SVG para el logo de TeamLink en el chat
    const TeamLinkIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="#1B2A41" strokeWidth="1.5"/>
            <path d="M7 10L17 10" stroke="#1B2A41" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7 14L17 14" stroke="#1B2A41" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );

    return (
        // Contenedor de pantalla completa para el fondo degradado
        <div className="host-wrapper-centered">

            {/* ⭐ MARCO CENTRALIZADO: Simula el .home-frame ⭐ */}
            <div className="meeting-frame">

                {/* Contenido principal (Grid de videos + Chat) */}
                <div className="meeting-content">
                    
                    {/* GRID DE PARTICIPANTES */}
                    <div className="participants-grid">
                        <div className="participant-box">PARTICIPANTE 1</div>
                        {/* PARTICIPANTE 2 (El Host) - Imagen ficticia */}
                        <div className="participant-box host-camera">
                            <img 
                                src="placeholder:man-in-blue-shirt-smiling" 
                                alt="Anfitrión" 
                                className="host-video-feed"
                            />
                        </div>
                        <div className="participant-box">PARTICIPANTE 3</div>
                        <div className="participant-box">PARTICIPANTE 4</div>
                    </div>

                    {/* PANEL DE CHAT */}
                    {showChat && (
                        <div className="chat-panel">
                            <div className="chat-header">
                                <span>Chat</span>
                                <div className="chat-logo">
                                    <TeamLinkIcon />
                                    TeamLink
                                </div>
                            </div>

                            <div className="chat-messages">
                                <ChatMessage />
                            </div>

                            <div className="chat-input-area">
                                <div className="chat-input-group">
                                    <input type="text" placeholder="Escribe un mensaje..." />
                                    <button className="btn-send">Enviar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ⭐ CONTROLES INFERIORES - Ahora dentro del marco ⭐ */}
                <div className="controls-bar">
                    
                    <div className="meeting-id">
                        Reunión ID: <strong>83672293</strong>
                    </div>

                    <div className="buttons">
                        {/* Botón Prender cámara */}
                        <div className="control-btn">
                            <CameraIcon />
                            <span>Prender cámara</span>
                        </div>
                        
                        {/* Botón Prender micrófono */}
                        <div className="control-btn">
                            <MicIcon />
                            <span>Prender micrófono</span>
                        </div>

                        {/* Botón Mensajes (toggle chat) */}
                        <div 
                            className="control-btn"
                            onClick={() => setShowChat(!showChat)}
                        >
                            <ChatIcon />
                            <span>Mensajes</span>
                        </div>
                    </div>

                    {/* BOTÓN FINALIZAR REUNIÓN */}
                    <button className="end-meeting-btn">
                        Finalizar Reunión
                    </button>

                </div>
            </div>
        </div>
    );
};

export default HostMeeting;