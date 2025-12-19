import { useState } from 'react';
import { MdPersonAdd, MdEdit, MdBlock, MdCheckCircle, MdRefresh, MdFolder } from 'react-icons/md';
import type { Utilisateur } from '../../types/utilisateur.types';
import { useUtilisateurs } from '../../hooks/useUtilisateurs';
import { utilisateurService } from '../../services/utilisateur.service';
import CreateAvocatModal from '../../components/features/utilisateurs/Createavocatmodal';
import EditUtilisateurModal from '../../components/features/utilisateurs/Editutilisateurmodal';
import AssignDossiersModal from '../../components/features/utilisateurs/AssignDossiersModal';

export default function UtilisateursList() {
  const { utilisateurs, isLoading, refetch } = useUtilisateurs();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'badge-red';
      case 'AVOCAT': return 'badge-blue';
      case 'CLIENT': return 'badge-gray';
      default: return 'badge-gray';
    }
  };

  const handleToggleStatus = async (user: Utilisateur) => {
    try {
      if (user.est_actif) {
        await utilisateurService.deactivate(user.id);
      } else {
        await utilisateurService.activate(user.id);
      }
      refetch();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification');
    }
  };

  const handleResetPassword = async (userId: string, email: string) => {
    if (!window.confirm(`Réinitialiser le mot de passe de ${email} ?`)) return;
    try {
      const result = await utilisateurService.resetPassword(userId);
      alert(`Nouveau mot de passe temporaire : ${result.temporaryPassword}\n\nEnvoyez-le à l'utilisateur de manière sécurisée.`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la réinitialisation');
    }
  };

  const filteredUsers = utilisateurs.filter(u => {
    if (filterRole && u.type_utilisateur !== filterRole) return false;
    if (filterStatus === 'actif' && !u.est_actif) return false;
    if (filterStatus === 'inactif' && u.est_actif) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" 
             style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 pb-4 border-b border-theme mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-theme-primary mb-2">Utilisateurs</h1>
            <p className="text-theme-secondary">{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            <MdPersonAdd className="text-xl" />
            <span>Créer un avocat</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 pb-6">
          {/* Filtres */}
          <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Rôle</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-2 bg-theme-tertiary border-theme border rounded-lg text-theme-primary focus:ring-2 focus:ring-offset-0"
                >
                  <option value="">Tous</option>
                  <option value="admin">Admin</option>
                  <option value="avocat">Avocat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Statut</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-theme-tertiary border-theme border rounded-lg text-theme-primary focus:ring-2 focus:ring-offset-0"
                >
                  <option value="">Tous</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={refetch}
                  className="w-full px-4 py-2 bg-theme-tertiary border-theme border hover:bg-opacity-80 text-theme-primary rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                  <MdRefresh />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-theme-surface border-theme border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-theme-tertiary">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-theme-secondary uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-theme-secondary uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-theme-secondary uppercase">Rôle</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-theme-secondary uppercase hidden lg:table-cell">Dossiers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-theme-secondary uppercase hidden sm:table-cell">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-theme-secondary uppercase hidden md:table-cell">Créé le</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-theme-secondary uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-theme-tertiary transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {user.prenom?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-theme-primary font-semibold">
                              {user.prenom} {user.nom}
                            </p>
                            {user.avocat?.numero_barreau && (
                              <p className="text-xs text-theme-muted">N° {user.avocat.numero_barreau}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-theme-secondary text-sm">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.type_utilisateur)}`}>
                          {user.type_utilisateur}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {user.type_utilisateur === 'AVOCAT' && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsAssignModalOpen(true);
                            }}
                            className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm transition-all flex items-center space-x-1"
                          >
                            <MdFolder className="text-sm" />
                            <span>Gérer</span>
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.est_actif ? 'badge-green' : 'badge-gray'}`}>
                          {user.est_actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-theme-secondary text-sm hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all"
                            title="Modifier"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg transition-all ${
                              user.est_actif 
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' 
                                : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                            }`}
                            title={user.est_actif ? 'Désactiver' : 'Activer'}
                          >
                            {user.est_actif ? <MdBlock /> : <MdCheckCircle />}
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id, user.email)}
                            className="p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-all"
                            title="Réinitialiser MDP"
                          >
                            <MdRefresh />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateAvocatModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />
      
      {selectedUser && (
        <EditUtilisateurModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          utilisateur={selectedUser}
          onSuccess={refetch}
        />
      )}

      {selectedUser && selectedUser.type_utilisateur === 'AVOCAT' && (
        <AssignDossiersModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedUser(null);
          }}
          utilisateur={selectedUser}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}