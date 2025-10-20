import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { User } from './types';
import { RegistrationForm } from './components/RegistrationForm';
import { GameDashboard } from './components/GameDashboard';

const USER_STORAGE_KEY = 'raspadinha_user_data';
const REGISTRATION_BONUS_KEY = 'raspadinha_registration_bonus';
const VALID_REGISTRATION_KEY = 'raspadinha_valid_registration';

// Facebook Pixel Events - Simplificado com Desduplicação
const trackFacebookEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Gerar event_id único para desduplicar frontend + backend
      const eventId = parameters?.event_id || `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const eventParams = { ...parameters, event_id: eventId };

      window.fbq('track', eventName, eventParams);
      console.log(`📊 [FB PIXEL] Evento: ${eventName} | ID: ${eventId}`);

      if (eventName === 'Purchase') {
        console.log(`💰 [FB PIXEL] COMPRA: R$ ${parameters?.value || 0}`);
      }
    } catch (error) {
      console.error('Erro no Facebook Pixel:', error);
    }
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      const validRegistration = localStorage.getItem(VALID_REGISTRATION_KEY);

      if (savedUser && validRegistration === 'true') {
        const userData = JSON.parse(savedUser);
        console.log('👤 Usuário encontrado no localStorage:', userData.name);
        setUser(userData);

        // Se já está registrado e tenta acessar /cadastro, redireciona para /dashboard
        if (location.pathname === '/cadastro') {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário salvo:', error);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(VALID_REGISTRATION_KEY);
      localStorage.removeItem(REGISTRATION_BONUS_KEY);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.pathname]);

  const handleRegister = (newUser: User) => {
    console.log('📝 Registrando novo usuário:', newUser.name);

    // Marcar que o usuário completou o fluxo correto de cadastro
    localStorage.setItem(VALID_REGISTRATION_KEY, 'true');

    const initialGameState = {
      balance: 16.90,
      scratchCardsUsed: 0,
      hasWonIphone: false
    };
    localStorage.setItem('raspadinha_game_state', JSON.stringify(initialGameState));
    localStorage.setItem(REGISTRATION_BONUS_KEY, 'true');

    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      console.log('💾 Usuário salvo no localStorage');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }

    setUser(newUser);
    navigate('/dashboard', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/cadastro" element={<RegistrationForm onRegister={handleRegister} />} />
      <Route
        path="/dashboard"
        element={<GameDashboard user={user} trackFacebookEvent={trackFacebookEvent} />}
      />
      <Route path="/" element={<GameDashboard user={user} trackFacebookEvent={trackFacebookEvent} />} />
      <Route path="*" element={<GameDashboard user={user} trackFacebookEvent={trackFacebookEvent} />} />
    </Routes>
  );
}

export default App;