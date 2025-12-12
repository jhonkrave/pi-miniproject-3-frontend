// Pages/Home/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { authService } from '../../lib/authService';
import { api, type Meeting } from '../../lib/api';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ModalCreateMeeting from '../ModalCreateMeeting/ModalCreateMeeting';
import ModalJoinMeeting from '../ModalJoinMeeting/ModalJoinMeeting'; 
import TranscriptionView from '../../components/Transcription/TranscriptionView';
import { useToast } from '../../context/ToastContext';
import './Home.scss'; 

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [viewTranscriptionId, setViewTranscriptionId] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; meetingId: string | null }>({ isOpen: false, meetingId: null });

  const { user } = useAuthStore();

  const handleForceEndMeeting = async () => {
      if (!confirmModal.meetingId) return;
      
      const meetingToEnd = meetings.find(m => m.id === confirmModal.meetingId);
      if (!meetingToEnd) return;

      try {
          const token = await authService.getIdToken();
          if (token) {
              await api.updateMeeting(meetingToEnd.id, { ...meetingToEnd, status: 'ended' }, token);
              showToast("Reunión finalizada y archivada", "success");
              fetchMeetings();
          }
      } catch (err) { 
          console.error(err);
          showToast("Error al finalizar la reunión", "error");
      } finally {
          setConfirmModal({ isOpen: false, meetingId: null });
      }
  };

  const copyMeetingId = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(id);
      showToast("ID copiado al portapapeles", "success");
  };

  const fetchMeetings = async () => {
    if (!user || !user.uid) return;
    setLoading(true);
    setError(null);
    try {
        const token = await authService.getIdToken();
        if (token) {
            const fetchedMeetings = await api.getMeetings(token);
            setMeetings(Array.isArray(fetchedMeetings) ? fetchedMeetings : []);
        }
    } catch (err) {
        console.error("Error fetching meetings:", err);
        const errorMessage = (err as any)?.message || "Error de conexión";
        setError(`${errorMessage}`);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [user]);

  const handleCreateMeeting = async (data: { title: string; description: string; date: string; time: string }) => {
      if (!user) return;
      try {
          const token = await authService.getIdToken();
          if (!token) return;
          
          const dateTime = new Date(`${data.date}T${data.time}`);
          const payload = {
              title: data.title,
              description: data.description || undefined, 
              startDateTime: dateTime.toISOString()
          };

          const newMeeting = await api.createMeeting(payload, token);
          setIsCreateModalOpen(false);
          
          if (newMeeting && newMeeting.id) {
            showToast("Reunión creada exitosamente", "success");
            navigate(`/meeting/${newMeeting.id}`); 
          } else {
             navigate('/meeting/error-id');
          }
          
      } catch (error) {
          console.error("Error creating meeting:", error);
          showToast(`Error: ${(error as any)?.message || "Desconocido"}`, "error");
      }
  }

  const handleJoinMeeting = (id: string) => {
      setIsJoinModalOpen(false);
      if (id) navigate(`/meeting/${id}`); 
  }
  
  const handleAccessMeeting = (id: string) => {
      navigate(`/meeting/${id}`);
  }

  const filteredMeetings = meetings.filter(m => {
      // Debug logs
      console.log(`Filtering meeting ${m.id} (${m.title}): status=${m.status}, tab=${activeTab}`);
      
      if (activeTab === 'upcoming') {
          return m.status !== 'ended' && m.status !== 'cancelled';
      } else {
          return m.status === 'ended' || m.status === 'cancelled';
      }
  });

  return (
    <DashboardLayout title={`Hola, ${user?.firstName || 'Usuario'} 👋`} subtitle="¿Qué te gustaría hacer hoy?">
        
        {/* Hero Actions */}
        <div className="hero-actions">
            {/* Crear Reunión */}
            <div className="action-card" onClick={() => setIsCreateModalOpen(true)}>
                <div className="icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M12 14v4"></path><path d="M10 16h4"></path></svg>
                </div>
                <div>
                    <h3>Nueva Reunión</h3>
                    <p>Programa una nueva videoconferencia con tu equipo.</p>
                </div>
            </div>

            {/* Unirse */}
            <div className="action-card secondary" onClick={() => setIsJoinModalOpen(true)}>
                <div className="icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                </div>
                <div>
                    <h3>Unirse a Reunión</h3>
                    <p>Ingresa con un código o enlace de invitación.</p>
                </div>
            </div>
        </div>

        {/* Meetings List */}
        <div className="meetings-section-title">
            <div className="tabs">
                <button 
                    className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Próximas Reuniones
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Historial
                </button>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={fetchMeetings} title="Actualizar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            </button>
        </div>

        {loading ? (
            <div style={{textAlign: 'center', padding: 40, color: 'var(--text-secondary)'}}>Cargando tus reuniones...</div>
        ) : error ? (
            <div style={{textAlign: 'center', padding: 20, color: 'var(--error)', background: '#fff0f0', borderRadius: 8}}>
                {error} <button onClick={fetchMeetings} style={{textDecoration: 'underline', marginLeft: 8, background:'none', border:'none', cursor:'pointer', color:'inherit'}}>Reintentar</button>
            </div>
        ) : filteredMeetings.length === 0 ? (
            <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>{activeTab === 'upcoming' ? 'Sin reuniones programadas' : 'No hay historial de reuniones'}</h3>
                {activeTab === 'upcoming' && <p>Crea una nueva reunión para empezar.</p>}
            </div>
        ) : (
            <div className="meetings-grid">
                {filteredMeetings.map(meeting => (
                    <div className={`meeting-card-modern ${meeting.status === 'ended' ? 'ended' : ''}`} key={meeting.id}>
                        <div className="card-header">
                            <h4>{meeting.title}</h4>
                            <span 
                                className={`meeting-id-badge status-${meeting.status || 'scheduled'}`}
                                onClick={(e) => copyMeetingId(meeting.id, e)}
                                title="Copiar ID"
                                style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4}}
                            >
                                {meeting.status === 'ended' ? 'Finalizada' : meeting.status === 'cancelled' ? 'Cancelada' : `ID: ${meeting.id.slice(0,8)}...`}
                                {meeting.status !== 'ended' && meeting.status !== 'cancelled' && (
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                )}
                            </span>
                        </div>
                        
                        <div className="card-time">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span>
                                {new Date(meeting.startDateTime).toLocaleDateString()} • {new Date(meeting.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        
                        <div className="card-actions">
                            {activeTab === 'upcoming' ? (
                                <>
                                    <button className="btn btn-primary" onClick={() => handleAccessMeeting(meeting.id)}>
                                        {meeting.status === 'active' ? 'Unirse ahora' : 'Iniciar'}
                                    </button>
                                    {meeting.createdBy === user?.uid && (
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{maxWidth: '40px', padding: '0 8px'}}
                                            title="Finalizar y archivar"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfirmModal({ isOpen: true, meetingId: meeting.id });
                                            }}
                                        >
                                            🏁
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {meeting.status === 'ended' && (
                                        <button className="btn btn-secondary" onClick={() => setViewTranscriptionId(meeting.id)}>
                                            Ver Transcripción
                                        </button>
                                    )}
                                    {meeting.status === 'cancelled' && <span className="cancelled-label">Cancelada</span>}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}

      {isCreateModalOpen && <ModalCreateMeeting onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateMeeting} />}
      {isJoinModalOpen && <ModalJoinMeeting onClose={() => setIsJoinModalOpen(false)} onJoin={handleJoinMeeting} />}
      
      {viewTranscriptionId && (
        <TranscriptionView 
            meetingId={viewTranscriptionId} 
            meetingTitle={meetings.find(m => m.id === viewTranscriptionId)?.title || 'Reunión'}
            onClose={() => setViewTranscriptionId(null)} 
        />
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="modal-overlay" style={{zIndex: 2002}}>
          <div className="modal-card" style={{maxWidth: 320}}>
            <div className="modal-header">
              <h3>Archivar Reunión</h3>
            </div>
            <p style={{padding: '0 24px', color: '#444746'}}>
                ¿Estás seguro de que quieres finalizar y archivar esta reunión?
                <br/><br/>
                <small>Esto moverá la reunión al historial y no se podrá volver a iniciar.</small>
            </p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmModal({ isOpen: false, meetingId: null })}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleForceEndMeeting}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Home;
