import React, { useState } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { api } from '../../lib/api';
import { authService } from '../../lib/authService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import './Profile.scss';
import ModalEditProfile from '../ModalEditProfile/ModalEditProfile';
import ModalDeleteAccount from '../ModalDeleteAccount/ModalDeleteAccount';
import { useToast } from '../../context/ToastContext';

const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!user) return null;

  const getMemberSince = () => {
    if (user.createdAt) {
      return new Date(user.createdAt).toLocaleDateString();
    }
    if (user.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString();
    }
    return 'Recientemente';
  };

  const handleSaveProfile = async (updatedData: any) => {
      try {
        const token = await authService.getIdToken();
        if (!token || !user.uid) return;

        // 1. Update Password if provided
        if (updatedData.password && updatedData.password.trim().length > 0) {
            try {
                await authService.updateUserPassword(updatedData.password);
                showToast("Contraseña actualizada", "success");
            } catch (err) {
                console.error("Password update error:", err);
                if ((err as any).code === 'auth/requires-recent-login') {
                    showToast("Para cambiar la contraseña debes volver a iniciar sesión", "error");
                    // Optionally redirect to login or show re-auth modal
                    return; 
                }
                showToast("Error al actualizar contraseña", "error");
                return;
            }
        }

        // 2. Update Email if changed
        if (updatedData.email && updatedData.email !== user.email) {
            try {
                await authService.verifyBeforeUpdateEmail(updatedData.email);
                showToast("Se ha enviado un correo de verificación a tu nueva dirección. Por favor confírmalo para aplicar el cambio.", "info");
            } catch (err) {
                console.error("Email update error:", err);
                if ((err as any).code === 'auth/requires-recent-login') {
                    showToast("Para cambiar el correo debes volver a iniciar sesión", "error");
                    return;
                }
                showToast("Error al actualizar correo", "error");
                return;
            }
        }

        // 3. Update Backend Profile
        let updatedUser;
        try {
            // Clean data before sending (remove password)
            const { password, ...dataToSend } = updatedData;
            
            // Try to update existing profile
            updatedUser = await api.updateProfile(user.uid, dataToSend, token);
        } catch (updateError) {
            // If user doesn't exist (404), try to create it
            if ((updateError as any).status === 404) {
                console.warn("User profile not found in backend (404), attempting to recreate...");
                
                const signupData = {
                    ...updatedData,
                    email: updatedData.email || user.email,
                    uid: user.uid,
                    // Ensure required fields are present
                    firstName: updatedData.firstName || user.firstName || 'Usuario',
                    lastName: updatedData.lastName || user.lastName || 'Nuevo',
                    age: updatedData.age || 18
                };
                delete signupData.password; // Don't send password to backend signup if not needed/handled
                
                try {
                    const signupResponse = await api.signup(signupData);
                    updatedUser = signupResponse.user;
                    showToast("Perfil recreado y actualizado correctamente", "success");
                } catch (signupError) {
                    if ((signupError as any).status === 409) {
                         showToast("Error crítico: El correo ya existe en la base de datos con otro ID.", "error");
                         return; 
                    }
                    throw signupError;
                }
            } else {
                throw updateError;
            }
        }

        if (updatedUser) {
            setUser(updatedUser); // Update global store
            setIsEditModalOpen(false); // Explicitly close modal
            if (!updatedUser.firstName) showToast("Perfil actualizado", "success");
        }
        
      } catch (error) {
        console.error("Error updating profile:", error);
        showToast("Error al actualizar el perfil", "error");
      }
  };

  const handleDeleteAccount = async () => {
      try {
        const token = await authService.getIdToken();
        if (!token || !user.uid) return;
        
        await api.deleteAccount(user.uid, token);
        await authService.logout();
        // Auth listener will redirect to login
        showToast("Cuenta eliminada correctamente", "info");
      } catch (error) {
          console.error("Error deleting account:", error);
          showToast("No se pudo eliminar la cuenta", "error");
      }
  }

  return (
    <DashboardLayout title="Mi Perfil" subtitle="Gestiona tu información personal">
        
        <div className="profile-grid">
            
            {/* Left Card */}
            <div className="profile-card">
                <div className="avatar-large">
                    {user.firstName ? user.firstName[0] : (user.email?.[0].toUpperCase() || 'U')}
                </div>
                <h2>{user.firstName} {user.lastName}</h2>
                <span className="user-email">{user.email}</span>

                <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(true)} style={{width: '100%'}}>
                    Editar Perfil
                </button>

                <div className="divider"></div>

                <div className="profile-stats">
                    <div>
                        <strong>{user.age || '-'}</strong>
                        <span>Edad</span>
                    </div>
                    <div>
                        <strong>{getMemberSince()}</strong>
                        <span>Miembro desde</span>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div>
                <div className="details-card">
                    <div className="card-header">
                        <h3>Información Personal</h3>
                    </div>
                    <div className="details-content">
                        <div className="detail-item">
                            <label>Nombre</label>
                            <span>{user.firstName || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Apellido</label>
                            <span>{user.lastName || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Correo Electrónico</label>
                            <span>{user.email}</span>
                        </div>
                        <div className="detail-item">
                            <label>ID de Usuario</label>
                            <span style={{fontFamily: 'monospace', fontSize: 12}}>{user.uid}</span>
                        </div>
                    </div>
                </div>

                <div className="danger-zone">
                    <div>
                        <h4>Eliminar Cuenta</h4>
                        <p>Esta acción es irreversible. Perderás todos tus datos.</p>
                    </div>
                    <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
                        Eliminar
                    </button>
                </div>
            </div>

        </div>

        {isEditModalOpen && (
            <ModalEditProfile 
                onClose={() => setIsEditModalOpen(false)}
                initialData={{
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    age: user.age,
                    email: user.email
                }}
                onSave={handleSaveProfile}
            />
        )}

        {isDeleteModalOpen && (
            <ModalDeleteAccount 
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        )}

    </DashboardLayout>
  );
};

export default Profile;
