import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import type { Facture } from '../../../types/facture.types';

interface InvoiceTemplateProps {
  facture: Facture;
  cabinetInfo?: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    siret?: string;
    tva?: string;
  };
  clientInfo?: {
    nom: string;
    prenom?: string;
    adresse?: string;
    ville?: string;
    code_postal?: string;
  };
}

export default function InvoiceTemplate({ 
  facture, 
  cabinetInfo = {
    nom: 'Cabinet Juridique',
    adresse: '123 Avenue des Champs-Élysées, 75008 Paris',
    telephone: '+33 1 23 45 67 89',
    email: 'contact@cabinet-juridique.fr',
    siret: '123 456 789 00012',
    tva: 'FR12345678901'
  },
  clientInfo = {
    nom: 'Client',
    prenom: '',
    adresse: 'Adresse client',
    ville: 'Ville',
    code_postal: '00000'
  }
}: InvoiceTemplateProps) {

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'payee': return 'PAYÉE';
      case 'envoyee': return 'ENVOYÉE';
      case 'en_retard': return 'EN RETARD';
      case 'brouillon': return 'BROUILLON';
      case 'annulee': return 'ANNULÉE';
      default: return statut.toUpperCase();
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'payee': return '#10b981';
      case 'envoyee': return '#3b82f6';
      case 'en_retard': return '#ef4444';
      case 'brouillon': return '#6b7280';
      case 'annulee': return '#64748b';
      default: return '#6b7280';
    }
  };

  // URL pour le QR code (ex: lien vers la facture en ligne)
  const qrCodeUrl = `https://app.legalpro.com/factures/${facture.id}`;

  return (
    <div id="invoice-template" style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '210mm',
      margin: '0 auto',
      padding: '20mm',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      position: 'relative'
    }}>
      {/* Watermark statut */}
      {facture.statut !== 'envoyee' && facture.statut !== 'payee' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          fontSize: '120px',
          fontWeight: 'bold',
          color: getStatutColor(facture.statut),
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0
        }}>
          {getStatutLabel(facture.statut)}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* En-tête */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '40px',
          paddingBottom: '30px',
          borderBottom: '3px solid #4f46e5'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#4f46e5',
              margin: '0 0 10px 0'
            }}>
              {cabinetInfo.nom}
            </h1>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>{cabinetInfo.adresse}</p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>Tél: {cabinetInfo.telephone}</p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>Email: {cabinetInfo.email}</p>
            {cabinetInfo.siret && (
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#94a3b8' }}>SIRET: {cabinetInfo.siret}</p>
            )}
            {cabinetInfo.tva && (
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#94a3b8' }}>TVA: {cabinetInfo.tva}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              backgroundColor: getStatutColor(facture.statut),
              color: 'white',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              marginBottom: '15px'
            }}>
              {getStatutLabel(facture.statut)}
            </div>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              margin: '0 0 10px 0',
              color: '#1e293b'
            }}>
              FACTURE
            </h2>
            <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>N° {facture.numero}</p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>
              Date: {new Date(facture.date_emission).toLocaleDateString('fr-FR')}
            </p>
            {facture.date_echeance && (
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>
                Échéance: {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>

        {/* Client */}
        <div style={{ 
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#64748b',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Facturé à
          </h3>
          <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
            {clientInfo.nom} {clientInfo.prenom}
          </p>
          {clientInfo.adresse && (
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>{clientInfo.adresse}</p>
          )}
          {clientInfo.code_postal && clientInfo.ville && (
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>
              {clientInfo.code_postal} {clientInfo.ville}
            </p>
          )}
        </div>

        {/* Tableau des prestations */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginBottom: '30px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#4f46e5', color: 'white' }}>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Description
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                width: '80px'
              }}>
                Qté
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                width: '120px'
              }}>
                Prix Unit.
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                width: '120px'
              }}>
                Total
              </th>
            </tr>
          </thead>
            <tbody>
            {facture.details?.lignes && facture.details.lignes.length > 0 ? (
                facture.details.lignes.map((ligne, index) => (
                <tr key={index} style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                }}>
                    <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                        {ligne.description}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {ligne.type}
                    </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', color: '#64748b' }}>
                    {ligne.quantite}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', color: '#64748b' }}>
                    {ligne.prix_unitaire.toFixed(2)} €
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#1e293b' }}>
                    {ligne.prix_total.toFixed(2)} €
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={4} style={{ 
                    padding: '30px', 
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontStyle: 'italic'
                }}>
                    Aucun détail disponible pour cette facture
                </td>
                </tr>
            )}
            </tbody>
        </table>

        {/* Totaux */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '40px'
        }}>
          <div style={{ flex: 1 }}>
            {/* QR Code */}
            <div style={{ textAlign: 'center' }}>
              <QRCodeSVG 
                value={qrCodeUrl} 
                size={120}
                level="H"
                includeMargin={true}
              />
              <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px' }}>
                Scanner pour voir en ligne
              </p>
            </div>
          </div>

          <div style={{ width: '400px' }}>
            <div style={{ 
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '14px',
                color: '#64748b'
              }}>
                <span>Sous-total HT</span>
                <span style={{ fontWeight: 'bold' }}>{facture.montant_ht.toFixed(2)} €</span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '14px',
                color: '#64748b'
              }}>
                <span>TVA ({facture.taux_tva}%)</span>
                <span style={{ fontWeight: 'bold' }}>
                  {(facture.montant_ttc - facture.montant_ht).toFixed(2)} €
                </span>
              </div>

              {facture.reduction > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '14px',
                  color: '#10b981'
                }}>
                  <span>Remise</span>
                  <span style={{ fontWeight: 'bold' }}>- {facture.reduction.toFixed(2)} €</span>
                </div>
              )}

              {facture.details?.montant_avance_avocat && facture.details.montant_avance_avocat > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '14px',
                  color: '#3b82f6'
                }}>
                  <span>Avancé par l'avocat</span>
                  <span style={{ fontWeight: 'bold' }}>
                    - {facture.details.montant_avance_avocat.toFixed(2)} €
                  </span>
                </div>
              )}

              <div style={{ 
                borderTop: '2px solid #4f46e5',
                paddingTop: '15px',
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                <span>TOTAL TTC</span>
                <span style={{ color: '#4f46e5' }}>{facture.montant_ttc.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barcode */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Barcode 
            value={facture.numero} 
            height={50}
            width={1.5}
            fontSize={14}
            background="#ffffff"
            lineColor="#1e293b"
          />
        </div>

        {/* Notes */}
        {facture.notes && (
          <div style={{ 
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#fffbeb',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '8px'
          }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              color: '#92400e',
              marginBottom: '8px'
            }}>
              Notes
            </h4>
            <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>
              {facture.notes}
            </p>
          </div>
        )}

        {/* Pied de page */}
        <div style={{ 
          borderTop: '2px solid #e2e8f0',
          paddingTop: '20px',
          fontSize: '11px',
          color: '#94a3b8',
          textAlign: 'center'
        }}>
          <p style={{ margin: '5px 0' }}>
            Conditions de paiement : {facture.conditions || 'Paiement à 30 jours par virement bancaire'}
          </p>
          <p style={{ margin: '5px 0' }}>
            En cas de retard de paiement, des pénalités de 3 fois le taux d'intérêt légal seront appliquées.
          </p>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
            Merci de votre confiance
          </p>
        </div>
      </div>
    </div>
  );
}