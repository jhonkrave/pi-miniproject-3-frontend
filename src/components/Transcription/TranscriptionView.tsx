import React, { useEffect, useState } from 'react';
import { api, type TranscriptionSegment } from '../../lib/api';
import { authService } from '../../lib/authService';
import './TranscriptionView.scss';

interface TranscriptionViewProps {
  meetingId: string;
  meetingTitle: string;
  onClose: () => void;
}

const TranscriptionView: React.FC<TranscriptionViewProps> = ({ meetingId, meetingTitle, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionSegment[] | string | null>(null);

  useEffect(() => {
    fetchTranscription();
  }, [meetingId]);

  const fetchTranscription = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await authService.getIdToken();
      if (!token) throw new Error('No autenticado');

      const data = await api.getMeetingTranscription(meetingId, token);
      setTranscription(data);
    } catch (err: any) {
      console.error("Error fetching transcription:", err);
      if (err.status === 404) {
          setError('La transcripción no está disponible aún. Es posible que se esté procesando.');
      } else {
          setError('No se pudo cargar la transcripción.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
      if (!transcription) return;

      let content = '';
      if (typeof transcription === 'string') {
          content = transcription;
      } else {
          content = transcription.map(t => `[${t.timestamp}] ${t.speaker}: ${t.text}`).join('\n');
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcription-${meetingId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="transcription-modal" onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>Transcripción: {meetingTitle}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="transcription-content">
            {loading && (
                <div className="loading-state">
                    <div className="spinner">⌛</div>
                    <p>Cargando transcripción...</p>
                </div>
            )}

            {error && (
                <div className="error-state">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && !transcription && (
                <div className="empty-state">
                    <p>No hay contenido disponible.</p>
                </div>
            )}

            {!loading && !error && transcription && (
                <div className="text-content">
                    {typeof transcription === 'string' ? (
                        transcription.split('\n').map((line, i) => <div key={i}>{line}</div>)
                    ) : (
                        transcription.map((seg, idx) => (
                            <div key={idx} className="transcription-segment">
                                <span className="ts-time">[{seg.timestamp}]</span>
                                <span className="ts-name">{seg.speaker}:</span>
                                <span className="ts-text">{seg.text}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>

        <div className="modal-footer">
          {error && (
              <button className="btn btn-primary" onClick={fetchTranscription} style={{marginRight: 'auto'}}>
                  ↻ Reintentar
              </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          {!loading && !error && transcription && (
            <button className="btn btn-primary" onClick={handleDownload}>
                Descargar .txt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptionView;
