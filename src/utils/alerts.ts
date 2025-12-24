import Swal from 'sweetalert2';

// Fonction pour obtenir la couleur du thème actuel
const getThemeColor = (colorName: string): string => {
  const root = document.documentElement;
  const colorValue = root.style.getPropertyValue(`--color-${colorName}`);
  return colorValue ? `rgb(${colorValue})` : '#ffffff';
};

// Configuration par défaut pour SweetAlert2 avec le thème de l'application
const getDefaultConfig = () => ({
  customClass: {
    popup: 'swal-popup-theme',
    title: 'swal-title-theme',
    htmlContainer: 'swal-content-theme',
    confirmButton: 'swal-button-confirm',
    cancelButton: 'swal-button-cancel',
  },
  buttonsStyling: false,
  background: getThemeColor('bgSecondary'),
});

// Alert de succès
export const showSuccessAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...getDefaultConfig(),
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'OK',
    iconColor: '#10b981',
    customClass: {
      ...getDefaultConfig().customClass,
      confirmButton: 'swal-button-confirm bg-green-600 hover:bg-green-700 text-white',
    },
  });
};

// Alert d'erreur
export const showErrorAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...getDefaultConfig(),
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
    iconColor: '#ef4444',
    customClass: {
      ...getDefaultConfig().customClass,
      confirmButton: 'swal-button-confirm bg-red-600 hover:bg-red-700 text-white',
    },
  });
};

// Alert d'avertissement
export const showWarningAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...getDefaultConfig(),
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'OK',
    iconColor: '#f59e0b',
    customClass: {
      ...getDefaultConfig().customClass,
      confirmButton: 'swal-button-confirm bg-orange-600 hover:bg-orange-700 text-white',
    },
  });
};

// Alert d'information
export const showInfoAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...getDefaultConfig(),
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'OK',
    iconColor: '#3b82f6',
    customClass: {
      ...getDefaultConfig().customClass,
      confirmButton: 'swal-button-confirm bg-blue-600 hover:bg-blue-700 text-white',
    },
  });
};

// Alert de confirmation
export const showConfirmAlert = (
  title: string,
  message?: string,
  confirmButtonText = 'Confirmer',
  cancelButtonText = 'Annuler'
) => {
  return Swal.fire({
    ...getDefaultConfig(),
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    iconColor: '#8b5cf6',
    customClass: {
      ...getDefaultConfig().customClass,
      confirmButton: 'swal-button-confirm bg-blue-600 hover:bg-blue-700 text-white',
      cancelButton: 'swal-button-cancel bg-gray-600 hover:bg-gray-700 text-white ml-3',
    },
  });
};

// Alert de chargement
export const showLoadingAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...getDefaultConfig(),
    title,
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Fermer l'alert
export const closeAlert = () => {
  Swal.close();
};

// Toast notification (notification légère en haut à droite)
export const showToast = (
  icon: 'success' | 'error' | 'warning' | 'info',
  title: string,
  timer = 3000
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    background: getThemeColor('bgSecondary'),
    customClass: {
      popup: 'swal-toast-theme',
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};

// Alert avec HTML personnalisé (pour utiliser des icônes React si nécessaire)
export const showCustomAlert = (config: any) => {
  return Swal.fire({
    ...getDefaultConfig(),
    ...config,
  });
};
