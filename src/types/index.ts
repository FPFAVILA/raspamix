export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  registeredAt: Date;
}

export interface GameState {
  balance: number;
  scratchCardsUsed: number;
  hasWonIphone: boolean;
  kycVerified: boolean;
  kycStep1Complete: boolean;
  kycStep2Complete: boolean;
  kycData?: {
    cpf: string;
    fullName: string;
    birthDate: string;
  };
}

export interface ScratchCard {
  id: string;
  cost: number;
  grid: ScratchBlock[];
  isCompleted: boolean;
  hasWon: boolean;
  prizeAmount?: number;
  prizeType?: 'money' | 'iphone' | 'airpods';
}

export interface ScratchBlock {
  id: number;
  isRevealed: boolean;
  symbol: string;
  position: { x: number; y: number };
}

export interface SocialProofNotification {
  id: string;
  user: string;
  prize: string;
  timestamp: Date;
}