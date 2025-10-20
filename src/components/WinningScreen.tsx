import React, { useEffect, useState } from 'react';
import { Trophy, ShieldCheck, Star, Crown, Gift, Sparkles, Award, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface WinningScreenProps {
  user: User;
  onClose: () => void;
  onAddBalance: (amount: number) => void;
  trackFacebookEvent?: (eventName: string, parameters?: any) => void;
}

export const WinningScreen: React.FC<WinningScreenProps> = ({ user, onClose, onAddBalance, trackFacebookEvent }) => {
  const [confetti, setConfetti] = useState(true);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [showCelebration, setShowCelebration] = useState(true);
  const [shouldScrollToButton, setShouldScrollToButton] = useState(false);

  // Efeitos iniciais
  useEffect(() => {
    // Vibração se disponível
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Desabilitar confetti após 8 segundos
    const confettiTimeout = setTimeout(() => setConfetti(false), 8000);
    
    // Alternar animação de pulso
    const pulseInterval = setInterval(() => {
      setPulseAnimation(prev => !prev);
    }, 2000);

    // Celebração inicial
    const celebrationTimeout = setTimeout(() => {
      setShowCelebration(false);
      // Após a celebração, fazer scroll suave para o botão
      setTimeout(() => {
        setShouldScrollToButton(true);
      }, 500);
    }, 5000);
    
    return () => {
      clearTimeout(confettiTimeout);
      clearInterval(pulseInterval);
      clearTimeout(celebrationTimeout);
    };
  }, []);

  // Scroll automático para o botão após a celebração
  useEffect(() => {
    if (shouldScrollToButton) {
      const buttonElement = document.getElementById('prize-button');
      if (buttonElement) {
        buttonElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [shouldScrollToButton]);

  const generateRedemptionCode = () => {
    return `IP13-${user.name.split(' ')[0].toUpperCase()}-${Date.now().toString().slice(-6)}`;
  };

  const handleContinuePlaying = () => {
    if (trackFacebookEvent) {
      trackFacebookEvent('Lead', {
        content_name: 'iPhone 13 Pro Max - Ganhou',
        content_category: 'Prize',
        value: 4899,
        currency: 'BRL'
      });
    }

    onAddBalance(4899);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-primary relative overflow-hidden z-50">
      {/* Background Effects Premium */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gray-900/20"></div>
        <div className="absolute inset-0 bg-accent/5"></div>
      </div>
      
      {/* Confetti Animation Melhorado */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-bounce ${
                i % 6 === 0 ? 'w-3 h-3 bg-accent' :
                i % 6 === 1 ? 'w-2 h-2 bg-green-400' :
                i % 6 === 2 ? 'w-4 h-4 bg-green-300' :
                i % 6 === 3 ? 'w-2 h-2 bg-green-500' :
                i % 6 === 4 ? 'w-3 h-3 bg-yellow-400' : 'w-2 h-2 bg-green-200'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Celebração Inicial */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-6xl font-bold text-white drop-shadow-2xl animate-pulse">
              PARABÉNS!
            </div>
            <div className="text-2xl text-indigo-200 mt-2 animate-pulse">
              Você ganhou o iPhone!
            </div>
          </div>
        </div>
      )}

      <div className="relative z-30 min-h-screen p-2 safe-area-top safe-area-bottom overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto my-2 overflow-hidden border-2 border-indigo-300/50">
          {/* Header Premium com Crown */}
          <div className="bg-accent p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/80"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <Crown className={`w-10 h-10 text-white mx-auto ${pulseAnimation ? 'animate-pulse' : ''}`} />
              </div>
              <h1 className="text-lg font-bold text-white mb-1.5 drop-shadow-lg">PARABÉNS!</h1>
              <p className="text-white/95 text-sm font-semibold drop-shadow">Você é nosso grande vencedor!</p>
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                <Star className="w-3.5 h-3.5 text-green-200" />
                <span className="text-green-200 text-xs font-bold">PRÊMIO EXCLUSIVO</span>
                <Star className="w-3.5 h-3.5 text-green-200" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-3 space-y-3">
            {/* Prize Display */}
            <div className="text-center">
              <div className="bg-gray-900 rounded-xl p-3 mb-2 relative overflow-hidden border border-gray-700">
                <div className="absolute inset-0 bg-accent/10"></div>
                <div className="absolute top-1.5 right-1.5">
                  <Gift className="w-5 h-5 text-accent animate-bounce" />
                </div>
                <div className="relative">
                  <div className="mb-2 flex justify-center">
                    <img
                      src="/iphone_13_PNG31.png"
                      alt="iPhone 13 Pro Max"
                      className="w-20 h-20 object-contain rounded-lg shadow-2xl"
                    />
                  </div>
                  <h2 className="text-base font-bold text-white mb-0.5">iPhone 13 Pro Max</h2>
                  <p className="text-gray-300 text-xs font-medium">128GB - Prata</p>
                  <div className="bg-accent text-white px-3 py-1.5 rounded-full text-xs font-bold mt-2 inline-block shadow-modern">
                    R$ 4.899,00
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs font-medium">
                Premiação exclusiva e limitada!
              </p>
            </div>

            {/* Winner Certificate */}
            <div className="bg-green-50 rounded-xl p-2.5 border border-green-200 shadow-inner">
              <div className="flex items-center gap-1.5 mb-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-800 text-xs">Certificado de Premiação</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ganhador:</span>
                  <span className="font-bold text-gray-800 text-right">{user.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prêmio:</span>
                  <span className="font-bold text-gray-800">iPhone 13 Pro Max</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-bold text-accent">R$ 4.899,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-bold text-gray-800">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Código:</span>
                  <span className="font-mono text-xs bg-green-100 px-1.5 py-0.5 rounded border border-green-300">
                    {generateRedemptionCode()}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Seals */}
            <div className="flex justify-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-green-50 px-2.5 py-1.5 rounded-full border border-green-200">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                <span className="font-medium">Verificado</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-blue-50 px-2.5 py-1.5 rounded-full border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span className="font-medium">Exclusivo</span>
              </div>
            </div>

          </div>

          {/* CTA Button */}
          <div className="p-3 pt-0">
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800 text-sm">Prêmio Creditado!</span>
              </div>
              <p className="text-green-700 text-xs">
                O valor equivalente ao iPhone (R$ 4.899,00) será adicionado ao seu saldo para você continuar jogando e ganhar ainda mais!
              </p>
            </div>

            <button
              id="prize-button"
              onClick={handleContinuePlaying}
              className={`w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent-hover transition-all active:scale-95 shadow-modern text-base hover-lift relative overflow-hidden ${
                pulseAnimation ? 'animate-pulse' : ''
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="relative flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>CONTINUAR JOGANDO</span>
                <Sparkles className="w-5 h-5" />
              </div>
            </button>

            <p className="text-center text-xs text-gray-500 font-medium mt-2">
              Seu saldo será atualizado automaticamente!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};