import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Banknote, X, Shield, Clock } from 'lucide-react';

interface WithdrawSectionProps {
  balance: number;
}

interface WithdrawFormData {
  fullName: string;
  cpf: string;
  bank: string;
  agency: string;
  account: string;
}

export const WithdrawSection: React.FC<WithdrawSectionProps> = ({ balance }) => {
  const CARD_COST = 16.90;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [formData, setFormData] = useState<WithdrawFormData>({
    fullName: '',
    cpf: '',
    bank: '',
    agency: '',
    account: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const minWithdraw = 40;
  const canWithdraw = balance >= minWithdraw;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) newErrors.cpf = 'CPF inválido';
    if (!formData.bank.trim()) newErrors.bank = 'Banco é obrigatório';
    if (!formData.agency.trim()) newErrors.agency = 'Agência é obrigatória';
    if (!formData.account.trim()) newErrors.account = 'Conta é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular dedução do saldo (em uma implementação real)
    // Aqui você faria a chamada para a API de saque
    
    // Mostrar modal de sucesso
    setShowWithdrawModal(false);
    setShowSuccessModal(true);
    
    // Resetar form
    setFormData({
      fullName: '',
      cpf: '',
      bank: '',
      agency: '',
      account: ''
    });
    setIsSubmitting(false);
    
    // Fechar modal de sucesso após 4 segundos
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 4000);
  };

  const popularBanks = [
    'Banco do Brasil',
    'Bradesco',
    'Caixa Econômica Federal',
    'Itaú',
    'Santander',
    'Nubank',
    'Inter',
    'C6 Bank',
    'Banco Original',
    'Banco Pan'
  ];

  return (
    <>
      <div className="mx-4 mb-4">
        <div className="bg-gray-900 backdrop-blur-2xl rounded-3xl shadow-modern border border-gray-800 overflow-hidden">
          {/* Header Clicável */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-5 flex items-center justify-between hover:bg-gray-800 transition-all duration-300 active:scale-[0.99]"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-modern border border-white/20 ${
                canWithdraw 
                  ? 'bg-accent' 
                  : 'bg-gray-700'
              }`}>
                <Banknote className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-lg">Sacar Saldo</h3>
                <p className={`text-sm ${canWithdraw ? 'text-green-300' : 'text-gray-400'}`}>
                  {canWithdraw 
                    ? `R$ ${balance.toFixed(2).replace('.', ',')} disponível` 
                    : `Mínimo R$ ${minWithdraw.toFixed(2).replace('.', ',')}`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {canWithdraw ? (
                <div className="bg-accent text-white px-3 py-1.5 rounded-full text-xs font-bold">
                  ✅ DISPONÍVEL
                </div>
              ) : (
                <div className="bg-gray-600 text-gray-300 px-3 py-1.5 rounded-full text-xs font-bold">
                  🔒 BLOQUEADO
                </div>
              )}
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-white" />
              ) : (
                <ChevronDown className="w-6 h-6 text-white" />
              )}
            </div>
          </button>

          {/* Conteúdo Expansível */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-5 pb-5">
              <div className="border-t border-gray-700 pt-5">
                
                {canWithdraw ? (
                  <div className="space-y-4">
                    {/* Informações do Saque */}
                    <div className="bg-accent/20 rounded-2xl p-4 border border-accent/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="w-5 h-5 text-green-300" />
                        <span className="text-green-200 font-bold text-sm">Saque Seguro</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-green-100">
                          <span>Saldo disponível:</span>
                          <span className="font-bold">R$ {balance.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between text-green-100">
                          <span>Valor mínimo:</span>
                          <span className="font-bold">R$ {minWithdraw.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between text-green-100">
                          <span>Taxa:</span>
                          <span className="font-bold">Grátis</span>
                        </div>
                      </div>
                    </div>

                    {/* Botão de Saque */}
                    <button
                      onClick={() => setShowWithdrawModal(true)}
                      className="w-full bg-accent text-white font-bold py-4 rounded-2xl hover:bg-accent-hover transition-all duration-300 active:scale-95 shadow-modern hover-lift"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Banknote className="w-5 h-5" />
                        <span>SOLICITAR SAQUE</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Informações de Bloqueio */}
                    <div className="bg-gray-800 rounded-2xl p-4 border border-gray-600">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-200 font-bold text-sm">Saque Indisponível</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p>Você precisa de pelo menos R$ {minWithdraw.toFixed(2).replace('.', ',')} para sacar.</p>
                        <p>Faltam: <span className="font-bold text-white">R$ {(minWithdraw - balance).toFixed(2).replace('.', ',')}</span></p>
                      </div>
                    </div>

                    <div className="bg-blue-900 rounded-2xl p-3 border border-blue-700">
                      <p className="text-blue-200 text-sm text-center">
                        💡 Continue jogando para aumentar seu saldo! Próxima raspadinha: R$ {CARD_COST.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Saque */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="relative bg-accent p-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Solicitar Saque</h2>
                    <p className="text-white/80 text-sm">R$ {balance.toFixed(2).replace('.', ',')} disponível</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Formulário */}
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                      errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="Seu nome completo"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                      errors.cpf ? 'border-red-400' : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">
                    Banco
                  </label>
                  <select
                    value={formData.bank}
                    onChange={(e) => setFormData({...formData, bank: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                      errors.bank ? 'border-red-400' : 'border-gray-200 focus:border-emerald-500'
                    }`}
                  >
                    <option value="">Selecione seu banco</option>
                    {popularBanks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">
                      Agência
                    </label>
                    <input
                      type="text"
                      value={formData.agency}
                      onChange={(e) => setFormData({...formData, agency: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                        errors.agency ? 'border-red-400' : 'border-gray-200 focus:border-emerald-500'
                      }`}
                      placeholder="0000"
                    />
                    {errors.agency && <p className="text-red-500 text-xs mt-1">{errors.agency}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">
                      Conta
                    </label>
                    <input
                      type="text"
                      value={formData.account}
                      onChange={(e) => setFormData({...formData, account: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                        errors.account ? 'border-red-400' : 'border-gray-200 focus:border-emerald-500'
                      }`}
                      placeholder="00000-0"
                    />
                    {errors.account && <p className="text-red-500 text-xs mt-1">{errors.account}</p>}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-800 mb-1 text-sm">Informações Importantes:</h4>
                      <ul className="text-blue-700 text-xs space-y-1">
                        <li>• Processamento em até 2 dias úteis</li>
                        <li>• Sem taxas para saques</li>
                        <li>• Dados protegidos e criptografados</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 shadow-modern active:scale-95"
                  style={{ touchAction: 'manipulation' }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Banknote className="w-5 h-5" />
                      CONFIRMAR SAQUE
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            {/* Header de Sucesso */}
            <div className="relative bg-accent p-6 text-center">
              <div className="absolute inset-0 bg-accent/80"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                  <Banknote className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">🎉 Sucesso! 🎉</h2>
                <p className="text-white/90 text-lg">Saque processado com sucesso!</p>
              </div>
            </div>
            
            {/* Conteúdo */}
            <div className="p-6 text-center">
              <div className="bg-green-50 rounded-2xl p-4 mb-4 border border-green-200">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">
                  Saque Confirmado
                </h3>
                <p className="text-green-700 text-sm mb-3">
                  Sua solicitação foi processada com sucesso!
                </p>
                <div className="bg-white rounded-xl p-3 border border-green-300">
                  <div className="text-2xl font-bold text-accent mb-1">
                    R$ {balance.toFixed(2).replace('.', ',')}
                  </div>
                  <p className="text-green-600 text-sm">
                    Será transferido em até 2 dias úteis
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Dados bancários verificados</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Transferência autorizada</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Processamento iniciado</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-800 font-bold text-sm">Informação Importante</span>
                </div>
                <p className="text-blue-700 text-xs">
                  Você receberá uma confirmação por email e o valor será creditado em sua conta bancária em até 2 dias úteis.
                </p>
              </div>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-accent text-white font-bold py-4 rounded-2xl hover:bg-accent-hover transition-all duration-300 active:scale-95 shadow-modern"
                style={{ touchAction: 'manipulation' }}
              >
                ✨ Continuar Jogando
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};