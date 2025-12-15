import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFactures } from '../../hooks/useFactures';
import { MdAdd, MdDownload, MdVisibility } from 'react-icons/md';
import { useClients } from '../../hooks/useClients';
import { useDossiers } from '../../hooks/useDossiers';

export default function FacturesList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { factures, isLoading } = useFactures();
  const { clients } = useClients();
  const { dossiers } = useDossiers();
  const getStatutColor = (statut: string) => {
    switch (statut) {
    case 'payee':
      return 'badge-green';
    case 'envoyee':
      return 'badge-blue';
    case 'en_retard':
      return 'badge-red';
    case 'brouillon':
      return 'badge-gray';
    case 'annulee':
      return 'badge-gray';
    default:
      return 'badge-gray';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'payee': return 'Payée';
      case 'envoyee': return 'Envoyée';
      case 'en_retard': return 'En retard';
      case 'brouillon': return 'Brouillon';
      case 'annulee': return 'Annulée';
      default: return statut;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-theme-primary mb-2">Factures</h1>
          <p className="text-theme-secondary">
            {factures.length} facture(s) au total
          </p>
        </div>
        <button
          onClick={() => navigate('/factures/new')}
          className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all"
        >
          <MdAdd className="text-xl" />
          <span>{t('factures.new')}</span>
        </button>
      </div>

      {/* Liste des factures */}
      {factures.length === 0 ? (
        <div className="bg-theme-surface border-theme border rounded-2xl p-12">
          <div className="text-center text-theme-muted">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-theme-primary mb-2">{t('factures.empty')}</h3>
            <p className="mb-4">{t('factures.emptyDescription')}</p>
            <button
              onClick={() => navigate('/factures/new')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all"
            >
              {t('factures.create.title')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {factures.map((facture) => (
            <div
              key={facture.id}
              className="bg-theme-surface border-theme border rounded-xl p-6 hover:border-opacity-80 transition-all cursor-pointer"
              onClick={() => navigate(`/factures/${facture.id}`)}
            >
              <div className="flex items-center justify-between">
                {/* Info facture */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                     <h3 className="text-xl font-bold text-theme-primary">
                      {t('factures.numero')} {facture.numero}
                    </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutColor(facture.statut)}`}>
                      {getStatutLabel(facture.statut)}
                    </span>
                  </div>
                  <div className="text-sm text-theme-secondary space-y-1">
                  <p>{t('factures.client')}: {clients.find(c => c.id === facture.id_client)?.nom || 'Client inconnu'}</p>
                  <p>{t('factures.dossier')}: {dossiers.find(d => d.id === facture.id_dossier)?.titre || 'Dossier inconnu'}</p>
                    <p>Émise le {new Date(facture.date_emission).toLocaleDateString('fr-FR')}</p>
                    {facture.date_echeance && (
                      <p>Échéance: {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>
                </div>

                {/* Montant */}
                <div className="text-right mr-6">
                  <div className="text-3xl font-bold text-theme-primary">
                    {facture.montant_ttc.toFixed(2)} €
                  </div>
                  <div className="text-sm text-theme-secondary">
                    HT: {facture.montant_ht.toFixed(2)} €
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/factures/${facture.id}`);
                    }}
                    className="p-2 bg-theme-tertiary hover:bg-opacity-80 text-theme-primary rounded-lg transition-all"
                    title="Voir"
                  >
                    <MdVisibility className="text-xl" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Télécharger PDF
                    }}
                     className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all"
                    title="Télécharger PDF"
                  >
                    <MdDownload className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}