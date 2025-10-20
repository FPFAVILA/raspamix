import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useSocialProof } from '../hooks/useSocialProof';
import { ScratchCard } from './ScratchCard';
import { AddBalanceModal } from './AddBalanceModal';
import { WinningScreen } from './WinningScreen';
import { WithdrawModal } from './WithdrawModal';
import { KYCVerificationModal } from './KYCVerificationModal';
import { SocialProofNotifications } from './SocialProofNotifications';
import { PrizesSection } from './PrizesSection';
import { AirPodsWinningModal } from './AirPodsWinningModal';
import {
  Play,
  Plus,
  Sparkles,
  Coins,
  Crown,
  Zap,
  Banknote
} from 'lucide-react';

interface GameDashboardProps {
  user: User | null;
  trackFacebookEvent?: (eventName: string, parameters?: any) => void;
}

// Modal de Prêmio em Dinheiro
interface MoneyPrizeModalProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  trackFacebookEvent?: (eventName: string, parameters?: any) => void;
}

const MoneyPrizeModal: React.FC<MoneyPrizeModalProps> = ({ isOpen, amount, onClose, trackFacebookEvent }) => {
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Vibração se disponível
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }

      // Desabilitar confetti após 5 segundos
      const confettiTimeout = setTimeout(() => setConfetti(false), 5000);

      return () => clearTimeout(confettiTimeout);
    }
  }, [isOpen, amount, trackFacebookEvent]);

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
                i % 4 === 0 ? 'w-3 h-3 bg-accent' :
                i % 4 === 1 ? 'w-2 h-2 bg-green-400' :
                i % 4 === 2 ? 'w-4 h-4 bg-yellow-400' : 'w-2 h-2 bg-green-300'
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
        <div className="bg-accent p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/80"></div>
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">🎉 PARABÉNS! 🎉</h1>
            <p className="text-white/90 text-base">Você ganhou dinheiro!</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 text-center">
          <div className="bg-accent/20 rounded-2xl p-4 mb-4 border border-accent/50">
            <div className="text-4xl mb-3">💰</div>
            <div className="text-3xl font-bold text-accent mb-2">
              R$ {amount.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-gray-600 font-medium">
              Adicionado ao seu saldo!
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Saldo atualizado automaticamente</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Continue jogando para ganhar mais</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Próximo prêmio pode ser o iPhone!</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-accent text-white font-bold py-3 rounded-2xl hover:bg-accent-hover transition-all duration-300 active:scale-95 shadow-modern"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              <span>CONTINUAR JOGANDO</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export const GameDashboard: React.FC<GameDashboardProps> = ({ user, trackFacebookEvent }) => {
  const navigate = useNavigate();
  const [hasValidRegistration, setHasValidRegistration] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  // Verificar se o usuário passou pelo fluxo correto de cadastro
  useEffect(() => {
    const validRegistration = localStorage.getItem('raspadinha_valid_registration');
    const hasUser = localStorage.getItem('raspadinha_user_data');
    const hasGameState = localStorage.getItem('raspadinha_game_state');

    if (validRegistration === 'true' && hasUser && hasGameState) {
      setHasValidRegistration(true);
    } else {
      // Se não tem registro válido, limpar tudo e redirecionar
      localStorage.removeItem('raspadinha_user_data');
      localStorage.removeItem('raspadinha_game_state');
      localStorage.removeItem('raspadinha_registration_bonus');
      localStorage.removeItem('raspadinha_valid_registration');
      setHasValidRegistration(false);
    }
    setIsCheckingRegistration(false);
  }, []);

  const { gameState, startNewCard, completeCard, addBalance, getNextRoundChance, completeKYCStep1, completeKYCStep2 } = useGameState();
  const CARD_COST = 4.90;
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [showWinningScreen, setShowWinningScreen] = useState(false);
  const [showMoneyPrizeModal, setShowMoneyPrizeModal] = useState(false);
  const [showAirPodsModal, setShowAirPodsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [wonAmount, setWonAmount] = useState(0);

  // Verificar se ganhou iPhone
  useEffect(() => {
    const hasRedeemedIphone = localStorage.getItem('iphone_redeemed') === 'true';
    const hasShownWinning = localStorage.getItem('iphone_winning_shown') === 'true';
    
    if (gameState.hasWonIphone && !hasRedeemedIphone && !hasShownWinning) {
      localStorage.setItem('iphone_winning_shown', 'true');
      setShowWinningScreen(true);
    }
  }, [gameState.hasWonIphone]);


  // Verificar se precisa de saldo
  const nextRound = gameState.scratchCardsUsed + 1;
  const needsBalance = gameState.balance < CARD_COST;
  
  // Calcular valor sugerido baseado na rodada
  const getSuggestedAmount = () => {
    // Sempre sugerir apenas o que falta para jogar + pequena margem
    if (needsBalance) {
      const missing = CARD_COST - gameState.balance;
      return Math.max(missing, 1); // Mínimo R$ 1,00
    }
    return 20; // Valor padrão quando não precisa de saldo
  };
  
  const missingAmount = needsBalance ? CARD_COST - gameState.balance : 0;
  const winChance = getNextRoundChance();

  const handlePlayGame = () => {
    // Se não tem saldo suficiente
    if (needsBalance) {
      setShowAddBalanceModal(true);
      return;
    }

    const card = startNewCard();
    if (card) {
      setCurrentCard(card);
    }
  };

  const handleCardComplete = (card: any) => {
    setCurrentCard(null);
    completeCard(card);

    if (card.hasWon) {
      if (card.prizeType === 'iphone') {
        setShowWinningScreen(true);
      } else if (card.prizeType === 'airpods') {
        // AirPods mostra modal próprio
        setShowAirPodsModal(true);
      } else if (card.prizeAmount && card.prizeAmount > 0) {
        setWonAmount(card.prizeAmount);
        setShowMoneyPrizeModal(true);
      }
    }
  };

  const handleAddBalance = (amount: number) => {
    addBalance(amount);
    setShowAddBalanceModal(false);
  };

  const handleWithdraw = (amount: number) => {
    // Aqui você implementaria a lógica de saque
    console.log('Saque solicitado:', amount);
    setShowWithdrawModal(false);
  };
  const handleCloseMoneyPrizeModal = () => {
    setShowMoneyPrizeModal(false);
    setWonAmount(0);
  };


  // Se está jogando, mostrar raspadinha
  if (currentCard) {
    return <ScratchCard card={currentCard} onComplete={handleCardComplete} />;
  }

  // Se está verificando registro, mostrar loading
  if (isCheckingRegistration) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Verificando cadastro...</p>
        </div>
      </div>
    );
  }

  // Se não tem registro válido, mostrar mensagem de acesso negado
  if (!hasValidRegistration) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-md text-center border border-white/20">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Acesso Negado</h2>
          <p className="text-white/80">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  // Se ganhou iPhone, mostrar tela de vitória
  if (showWinningScreen) {
    return (
      <WinningScreen
        user={user}
        onClose={() => setShowWinningScreen(false)}
        onAddBalance={addBalance}
        trackFacebookEvent={trackFacebookEvent}
      />
    );
  }

  return (
    <div className="min-h-screen bg-primary safe-area-top safe-area-bottom">
      
      {/* Header com informações do usuário */}
      <div className="bg-gray-900 backdrop-blur-xl p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-modern">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">
                Olá, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-300 text-sm">
                Bem-vindo de volta ao jogo
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-accent/20 rounded-xl px-3 py-1 border border-accent/50">
              <span className="text-accent text-xs font-bold">🔥 ATIVO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 pb-32">
        {/* Saldo Display */}
        <div className="mx-4 mt-6 mb-6">
          <div className="bg-gray-900 backdrop-blur-2xl rounded-3xl shadow-modern p-6 relative overflow-hidden border border-gray-800">
            {/* Background Effects Premium */}
            <div className="absolute inset-0 bg-accent/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-4">
                <p className="text-gray-300 text-sm font-semibold mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Saldo Disponível
                </p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-modern">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white">
                    R$ {gameState.balance.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowAddBalanceModal(true)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-all duration-300 active:scale-95 border border-gray-700"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-bold">Adicionar Saldo</span>
                </button>

                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-all duration-300 active:scale-95 border border-gray-700 font-bold"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Banknote className="w-5 h-5" />
                  <span>Sacar Saldo</span>
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Seção de Prêmios */}
        <PrizesSection />
      </div>

      {/* Botão de Jogar Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 backdrop-blur-xl border-t border-gray-800 p-4 safe-area-bottom">
        <button
          onClick={handlePlayGame}
          className={`w-full font-bold py-5 rounded-2xl transition-all duration-300 shadow-modern text-lg relative overflow-hidden ${
            gameState.balance >= CARD_COST
              ? 'bg-accent text-white hover:bg-accent-hover hover-lift active:scale-95'
              : 'bg-orange-600 text-white hover:bg-orange-700 hover-lift active:scale-95'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          {gameState.balance >= CARD_COST ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5" />
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">JOGAR AGORA</div>
                <div className="text-sm opacity-90">R$ {CARD_COST.toFixed(2).replace('.', ',')} por jogo</div>
              </div>
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Plus className="w-6 h-6" />
              <div className="text-center">
                <div className="font-bold text-xl">ADICIONAR SALDO</div>
                <div className="text-sm opacity-90">Faltam R$ {missingAmount.toFixed(2).replace('.', ',')}</div>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Modals */}
      <AddBalanceModal
        isOpen={showAddBalanceModal}
        onClose={() => setShowAddBalanceModal(false)}
        onAddBalance={handleAddBalance}
        suggestedAmount={getSuggestedAmount()}
        message={needsBalance ? (
          `Você precisa de mais R$ ${missingAmount.toFixed(2).replace('.', ',')} para jogar a próxima rodada`
        ) : undefined}
        trackFacebookEvent={trackFacebookEvent}
      />

      <MoneyPrizeModal
        isOpen={showMoneyPrizeModal}
        amount={wonAmount}
        onClose={handleCloseMoneyPrizeModal}
        trackFacebookEvent={trackFacebookEvent}
      />

      <AirPodsWinningModal
        isOpen={showAirPodsModal}
        onClose={() => setShowAirPodsModal(false)}
        userName={user.name}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        balance={gameState.balance}
        kycVerified={gameState.kycVerified}
        onOpenKYC={() => setShowKYCModal(true)}
      />

      <KYCVerificationModal
        isOpen={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        onComplete={() => {
          setShowKYCModal(false);
          setShowWithdrawModal(true);
        }}
        step1Complete={gameState.kycStep1Complete}
        step2Complete={gameState.kycStep2Complete}
        onStep1Complete={completeKYCStep1}
        onStep2Complete={completeKYCStep2}
      />
      {/* Notificações Sociais */}
      <SocialProofNotifications />
    </div>
  );
};