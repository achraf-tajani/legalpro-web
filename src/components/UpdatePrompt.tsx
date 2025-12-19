import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-4">
      <span>Nouvelle version disponible !</span>
      <button
        onClick={() => updateServiceWorker(true)}
        className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50"
      >
        Mettre à jour
      </button>
    </div>
  );
}