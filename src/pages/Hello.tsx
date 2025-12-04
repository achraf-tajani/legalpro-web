import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

export default function Hello() {
  const { user, logout } = useAuthStore();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchHello = async () => {
      try {
        const response = await api.get('/hello');
        setMessage(response.data.message);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHello();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          {message || 'Chargement...'}
        </h1>
        
        <div className="bg-gray-50 p-4 rounded mb-4">
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Nom:</strong> {user?.nom} {user?.prenom}</p>
          <p><strong>Rôle:</strong> {user?.role}</p>
        </div>
        
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}