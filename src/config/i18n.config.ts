import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // Auth
      'auth.title': 'LegalPro',
      'auth.subtitle': 'Plateforme de gestion juridique',
      'auth.login': 'Connexion',
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.submit': 'Se connecter',
      'auth.loading': 'Connexion en cours...',
      'auth.footer': '© 2025 LegalPro. Tous droits réservés.',

      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.dossiers': 'Dossiers',
      'nav.clients': 'Clients',
      'nav.taches': 'Tâches',
      'nav.factures': 'Factures',
      'nav.documents': 'Documents',
      'nav.calendrier': 'Calendrier',
      'nav.logout': 'Déconnexion',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': "Vue d'ensemble de votre activité",
      'dashboard.dossiersActifs': 'Dossiers Actifs',
      'dashboard.totalClients': 'Total Clients',
      'dashboard.tachesUrgentes': 'Tâches Urgentes',
      'dashboard.facturesImpayees': 'Factures Impayées',
      'dashboard.dossiersRecents': 'Dossiers Récents',
      'dashboard.prochaines': 'Prochaines Échéances',
      'dashboard.dataComingSoon': 'Données à venir...',
      'dashboard.loadingError': 'Erreur lors du chargement des statistiques',

      // Dossiers
      'dossiers.title': 'Dossiers',
      'dossiers.subtitle': 'Gestion de vos dossiers juridiques',
      'dossiers.count': '{{count}} dossier(s) au total',
      'dossiers.new': 'Nouveau Dossier',
      'dossiers.empty': 'Aucun dossier',
      'dossiers.emptyDescription': 'Créez votre premier dossier pour commencer',
      'dossiers.noClient': 'Aucun client',
      'dossiers.loadingError': 'Erreur lors du chargement des dossiers',

      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Une erreur est survenue',
      'common.save': 'Enregistrer',
      'common.cancel': 'Annuler',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.view': 'Voir',
      'common.search': 'Rechercher...',
      'common.actions': 'Actions',
    },
  },
  en: {
    translation: {
      // Auth
      'auth.title': 'LegalPro',
      'auth.subtitle': 'Legal management platform',
      'auth.login': 'Login',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.submit': 'Sign in',
      'auth.loading': 'Signing in...',
      'auth.footer': '© 2025 LegalPro. All rights reserved.',

      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.dossiers': 'Cases',
      'nav.clients': 'Clients',
      'nav.taches': 'Tasks',
      'nav.factures': 'Invoices',
      'nav.documents': 'Documents',
      'nav.calendrier': 'Calendar',
      'nav.logout': 'Logout',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': 'Overview of your activity',
      'dashboard.dossiersActifs': 'Active Cases',
      'dashboard.totalClients': 'Total Clients',
      'dashboard.tachesUrgentes': 'Urgent Tasks',
      'dashboard.facturesImpayees': 'Unpaid Invoices',
      'dashboard.dossiersRecents': 'Recent Cases',
      'dashboard.prochaines': 'Upcoming Deadlines',
      'dashboard.dataComingSoon': 'Data coming soon...',
      'dashboard.loadingError': 'Error loading statistics',

      // Dossiers
      'dossiers.title': 'Cases',
      'dossiers.subtitle': 'Manage your legal cases',
      'dossiers.count': '{{count}} case(s) in total',
      'dossiers.new': 'New Case',
      'dossiers.empty': 'No cases',
      'dossiers.emptyDescription': 'Create your first case to get started',
      'dossiers.noClient': 'No client',
      'dossiers.loadingError': 'Error loading cases',

      // Common
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.search': 'Search...',
      'common.actions': 'Actions',
    },
  },
  ar: {
    translation: {
      // Auth
      'auth.title': 'LegalPro',
      'auth.subtitle': 'منصة إدارة قانونية',
      'auth.login': 'تسجيل الدخول',
      'auth.email': 'البريد الإلكتروني',
      'auth.password': 'كلمة المرور',
      'auth.submit': 'دخول',
      'auth.loading': 'جارٍ تسجيل الدخول...',
      'auth.footer': '© 2025 LegalPro. جميع الحقوق محفوظة.',

      // Navigation
      'nav.dashboard': 'لوحة التحكم',
      'nav.dossiers': 'الملفات',
      'nav.clients': 'العملاء',
      'nav.taches': 'المهام',
      'nav.factures': 'الفواتير',
      'nav.documents': 'المستندات',
      'nav.calendrier': 'التقويم',
      'nav.logout': 'تسجيل الخروج',

      // Dashboard
      'dashboard.title': 'لوحة التحكم',
      'dashboard.subtitle': 'نظرة عامة على نشاطك',
      'dashboard.dossiersActifs': 'الملفات النشطة',
      'dashboard.totalClients': 'إجمالي العملاء',
      'dashboard.tachesUrgentes': 'المهام العاجلة',
      'dashboard.facturesImpayees': 'الفواتير غير المدفوعة',
      'dashboard.dossiersRecents': 'الملفات الأخيرة',
      'dashboard.prochaines': 'المواعيد القادمة',
      'dashboard.dataComingSoon': 'البيانات قادمة قريباً...',
      'dashboard.loadingError': 'خطأ في تحميل الإحصائيات',

      // Dossiers
      'dossiers.title': 'الملفات',
      'dossiers.subtitle': 'إدارة ملفاتك القانونية',
      'dossiers.count': '{{count}} ملف(ات) إجمالاً',
      'dossiers.new': 'ملف جديد',
      'dossiers.empty': 'لا توجد ملفات',
      'dossiers.emptyDescription': 'قم بإنشاء ملفك الأول للبدء',
      'dossiers.noClient': 'لا يوجد عميل',
      'dossiers.loadingError': 'خطأ في تحميل الملفات',

      // Common
      'common.loading': 'جارٍ التحميل...',
      'common.error': 'حدث خطأ',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.delete': 'حذف',
      'common.edit': 'تعديل',
      'common.view': 'عرض',
      'common.search': 'بحث...',
      'common.actions': 'إجراءات',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;