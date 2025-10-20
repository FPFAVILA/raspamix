import React, { useState } from 'react';
import { X, Shield, CheckCircle, Clock, AlertCircle, User, CreditCard } from 'lucide-react';
import { AddBalanceModal } from './AddBalanceModal';

interface KYCVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  step1Complete: boolean;
  step2Complete: boolean;
  onStep1Complete: (cpf: string, fullName: string, birthDate: string) => void;
  onStep2Complete: () => void;
}

export const KYCVerificationModal: React.FC<KYCVerificationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  step1Complete,
  step2Complete,
  onStep1Complete,
  onStep2Complete,
}) => {
  const [currentStep, setCurrentStep] = useState(step1Complete ? 2 : 1);
  const [cpf, setCpf] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDepositModal, setShowDepositModal] = useState(false);

  if (!isOpen) return null;

  const progress = step1Complete && step2Complete ? 100 : step1Complete ? 50 : 0;

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }
    if (!fullName || fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Digite seu nome completo';
    }
    if (!birthDate || birthDate.replace(/\D/g, '').length !== 8) {
      newErrors.birthDate = 'Data inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = () => {
    if (!validateStep1()) return;
    onStep1Complete(cpf, fullName, birthDate);
    setCurrentStep(2);
  };

  const handleDepositComplete = () => {
    onStep2Complete();
    setShowDepositModal(false);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 rounded-t-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Verificação de Conta</h2>
                  <p className="text-white/90 text-sm">Complete para liberar saques</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 active:scale-95"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-semibold">Progresso</span>
                <span className="text-white text-sm font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className={`border-2 rounded-2xl p-4 transition-all duration-300 ${
                currentStep === 1 ? 'border-blue-500 bg-blue-50' : step1Complete ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step1Complete ? 'bg-green-500' : currentStep === 1 ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {step1Complete ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Etapa 1: Verificação de Identidade</h3>
                      <p className="text-sm text-gray-600">Confirme seus dados pessoais</p>
                    </div>
                  </div>
                  {step1Complete && (
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Concluída
                    </div>
                  )}
                </div>

                {currentStep === 1 && !step1Complete && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">CPF</label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                        maxLength={14}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                          errors.cpf ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="000.000.000-00"
                      />
                      {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">Nome Completo</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                          errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="João Silva Santos"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">Data de Nascimento</label>
                      <input
                        type="text"
                        value={birthDate}
                        onChange={(e) => setBirthDate(formatDate(e.target.value))}
                        maxLength={10}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                          errors.birthDate ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="DD/MM/AAAA"
                      />
                      {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
                    </div>

                    <button
                      onClick={handleStep1Submit}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
                      style={{ touchAction: 'manipulation' }}
                    >
                      Continuar para Etapa 2
                    </button>
                  </div>
                )}
              </div>

              <div className={`border-2 rounded-2xl p-4 transition-all duration-300 ${
                currentStep === 2 && step1Complete ? 'border-blue-500 bg-blue-50' : step2Complete ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step2Complete ? 'bg-green-500' : currentStep === 2 && step1Complete ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {step2Complete ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <CreditCard className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Etapa 2: Depósito de Verificação</h3>
                      <p className="text-sm text-gray-600">Para confirmar sua identidade</p>
                    </div>
                  </div>
                  {step2Complete && (
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Concluída
                    </div>
                  )}
                </div>

                {currentStep === 2 && step1Complete && !step2Complete && (
                  <div className="space-y-3 mt-4">
                    <div className="bg-blue-100 border border-blue-300 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-blue-800 mb-1 text-sm">Por que preciso depositar?</h4>
                          <p className="text-blue-700 text-xs">
                            O depósito mínimo deve ser feito pelo titular da conta. Esta etapa serve para confirmar sua identidade e liberar saques com segurança. É uma medida padrão de proteção.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-gray-700 font-medium text-center mb-2">
                        Faça um depósito para verificar sua identidade
                      </p>
                      <p className="text-xs text-gray-600 text-center">
                        Após o depósito, sua conta será verificada e você poderá sacar normalmente.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDepositModal(true)}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
                      style={{ touchAction: 'manipulation' }}
                    >
                      Fazer Depósito de Verificação
                    </button>
                  </div>
                )}
              </div>
            </div>

            {step1Complete && step2Complete && (
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Verificação Concluída!</h3>
                <p className="text-green-700 mb-4">
                  Sua conta foi verificada com sucesso. Você já pode realizar saques normalmente.
                </p>
                <button
                  onClick={onComplete}
                  className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition-all active:scale-95 shadow-lg"
                  style={{ touchAction: 'manipulation' }}
                >
                  Continuar para Saque
                </button>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm">Segurança e Privacidade</h4>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li>• Seus dados são criptografados e protegidos</li>
                    <li>• Verificação obrigatória para saques</li>
                    <li>• Processo rápido e seguro</li>
                    <li>• Conformidade com regulamentações</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDepositModal && (
        <AddBalanceModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onDeposit={handleDepositComplete}
          minAmount={20}
          isKYCDeposit={true}
        />
      )}
    </>
  );
};
