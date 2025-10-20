import React from 'react';
import { Wallet, Plus, TrendingUp, Sparkles, Coins } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
  onAddBalance: () => void;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, onAddBalance }) => {
  const CARD_COST = 16.90;
  
  return (
    <div className="mx-4 mb-6">
      <div className="bg-gray-900 backdrop-blur-2xl rounded-3xl shadow-modern p-5 relative overflow-hidden border border-gray-800">
        {/* Background Effects Premium */}
        <div className="absolute inset-0 bg-accent/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-modern">
                <Coins className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg border border-white">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div>
              <p className="text-gray-300 text-sm font-semibold mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Saldo Disponível
              </p>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-white">
                  R$ {balance.toFixed(2).replace('.', ',')}
                </p>
                <div className="bg-accent/20 rounded-2xl px-3 py-1 border border-accent shadow-lg">
                  <span className="text-accent text-xs font-bold">ATIVO</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onAddBalance}
            className="group bg-accent text-white px-5 py-4 rounded-2xl flex items-center gap-3 hover:bg-accent-hover transition-all duration-300 active:scale-95 shadow-modern hover-lift relative overflow-hidden"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="relative flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-bold">Adicionar</span>
            </div>
          </button>
        </div>
        
        <div className="relative z-10 mt-5 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="font-medium">Cada raspadinha: R$ {CARD_COST.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="font-medium">Jogos possíveis:</span>
              <span className="font-bold text-white text-lg">
                {Math.floor(balance / CARD_COST)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};