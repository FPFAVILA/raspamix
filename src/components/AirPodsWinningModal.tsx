import React, { useEffect, useState } from 'react';
import { Gift, CheckCircle, Coins } from 'lucide-react';

interface AirPodsWinningModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const AirPodsWinningModal: React.FC<AirPodsWinningModalProps> = ({ isOpen, onClose, userName }) => {
  const [confetti, setConfetti] = useState(true);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Vibração se disponível
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Desabilitar confetti após 5 segundos
    const confettiTimeout = setTimeout(() => setConfetti(false), 5000);

    // Alternar animação de pulso
    const pulseInterval = setInterval(() => {
      setPulseAnimation(prev => !prev);
    }, 2000);

    return () => {
      clearTimeout(confettiTimeout);
      clearInterval(pulseInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      {/* Confetti Animation */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-bounce ${
                i % 4 === 0 ? 'w-3 h-3 bg-purple-500' :
                i % 4 === 1 ? 'w-2 h-2 bg-green-400' :
                i % 4 === 2 ? 'w-4 h-4 bg-yellow-400' : 'w-2 h-2 bg-blue-300'
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

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-600/80"></div>
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">🎉 PARABÉNS! 🎉</h1>
            <p className="text-white/90 text-base">Você ganhou um prêmio!</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 text-center">
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 mb-4 border-2 border-purple-300">
            <div className="mb-3 flex justify-center">
              <img
                src="/airpods-pro-2-hero-select-202409_FMT_WHH-Photoroom.png"
                alt="AirPods Pro"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-purple-900 mb-1">AirPods Pro</h2>
            <p className="text-purple-700 text-sm font-medium mb-3">2ª Geração - USB-C</p>
            <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold inline-block shadow-lg">
              R$ 1.899,00
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-800 text-sm">Valor Creditado!</span>
            </div>
            <p className="text-green-700 text-xs">
              O valor de R$ 1.899,00 foi adicionado ao seu saldo. Continue jogando para ganhar ainda mais prêmios!
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Coins className="w-4 h-4 text-purple-600" />
              <span>Saldo atualizado automaticamente</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Continue jogando para ganhar mais</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Próximo prêmio pode ser o iPhone!</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-full bg-purple-600 text-white font-bold py-3 rounded-2xl hover:bg-purple-700 transition-all duration-300 active:scale-95 shadow-lg ${
              pulseAnimation ? 'animate-pulse' : ''
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5" />
              <span>CONTINUAR JOGANDO</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
