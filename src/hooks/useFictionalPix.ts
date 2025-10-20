import { useState } from 'react';

interface PixData {
  qrcode: string;
  amount: number;
  transactionId: string;
}

interface UseFictionalPixReturn {
  loading: boolean;
  error: string | null;
  pixData: PixData | null;
  createPix: (amount: number) => Promise<PixData>;
  reset: () => void;
}

const generateFictionalPixCode = (amount: number, transactionId: string): string => {
  const baseCode = '00020126580014br.gov.bcb.pix';
  const merchantCode = Math.random().toString(36).substring(2, 15);
  const formattedAmount = amount.toFixed(2);

  return `${baseCode}0114+5563981480126052040000530398654${formattedAmount.replace('.', '')}5802BR5925RASPADINHA PRO LTDA6009SAO PAULO62${transactionId.length}05${transactionId}6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

export const useFictionalPix = (): UseFictionalPixReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);

  const createPix = async (amount: number): Promise<PixData> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const qrcode = generateFictionalPixCode(amount, transactionId);

      const data: PixData = {
        qrcode,
        amount,
        transactionId
      };

      setPixData(data);
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = 'Erro ao gerar código PIX';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const reset = () => {
    setPixData(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    pixData,
    createPix,
    reset
  };
};
