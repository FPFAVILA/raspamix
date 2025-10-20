import React, { useState, useEffect } from 'react';
import { User } from '../types';
import {
  Gift,
  Crown,
  Clock,
  Mail,
  User as UserIcon,
  Shield,
  CheckCircle,
  AlertCircle,
  Award,
  CreditCard
} from 'lucide-react';

interface RegistrationFormProps {
  onRegister: (user: User) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  // Timer state - 15 minutos (900 segundos)
  const [timeLeft, setTimeLeft] = useState(900);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer urgency level
  const getTimerUrgency = () => {
    if (timeLeft <= 180) return 'critical'; // 3 minutes
    if (timeLeft <= 300) return 'high'; // 5 minutes
    if (timeLeft <= 600) return 'medium'; // 10 minutes
    return 'low';
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');

    if (numbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) return false;

    return true;
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value.trim().length < 3) {
          newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
          newErrors.name = 'Nome deve conter apenas letras';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Email inválido';
        } else {
          delete newErrors.email;
        }
        break;

      case 'cpf':
        if (!value.trim()) {
          newErrors.cpf = 'CPF é obrigatório';
        } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) {
          newErrors.cpf = 'Formato: 000.000.000-00';
        } else if (!validateCPF(value)) {
          newErrors.cpf = 'CPF inválido';
        } else {
          delete newErrors.cpf;
        }
        break;

      case 'password':
        if (!value.trim()) {
          newErrors.password = 'Senha é obrigatória';
        } else if (value.length < 6) {
          newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleFieldChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));

    if (touched[field]) {
      validateField(field, formattedValue);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const allTouched = { name: true, email: true, cpf: true, password: true };
    setTouched(allTouched);

    validateField('name', formData.name);
    validateField('email', formData.email);
    validateField('cpf', formData.cpf);
    validateField('password', formData.password);

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const user: User = {
      id: `user_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      registeredAt: new Date()
    };

    setShowSuccess(true);
    setTimeout(() => {
      onRegister(user);
    }, 1500);

    setIsSubmitting(false);
  };

  const timerUrgency = getTimerUrgency();

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-3 relative overflow-hidden safe-area-top safe-area-bottom">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 text-center animate-bounce border border-white/20 shadow-2xl">
              <CheckCircle className="w-20 h-20 text-accent mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-2">🎉 Cadastro Realizado! 🎉</h2>
              <p className="text-white/80">Preparando seu bônus de R$ 16,90...</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div className={`bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 ${showSuccess ? 'opacity-20' : ''} transition-opacity duration-500`}>
          {/* Premium Header - Compacto */}
          <div className="bg-gradient-to-br from-accent via-accent to-accent-hover p-3 text-center relative overflow-hidden">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-1.5 shadow-2xl border border-white/30">
                <Crown className="w-6 h-6 text-white animate-pulse" />
              </div>

              <h1 className="text-lg font-bold text-white mb-2 drop-shadow-2xl">
                Raspadinha<span className="text-yellow-300">PRO</span>
              </h1>

              {/* Bonus Badge - Compacto */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <Gift className="w-4 h-4 text-yellow-300 animate-bounce" />
                  <span className="text-white font-bold text-xs drop-shadow-lg">BÔNUS EXCLUSIVO</span>
                </div>
                <div className="text-xl font-bold text-white mb-0.5 drop-shadow-2xl">
                  R$ 16,90
                </div>
                <div className="text-white/90 text-xs font-medium drop-shadow-lg">
                  + 1 Raspadinha Premium
                </div>
              </div>
            </div>
          </div>

          {/* Timer Bar - Compacto */}
          <div className={`p-2 relative overflow-hidden ${
            timerUrgency === 'critical' ? 'bg-gradient-to-r from-red-600 to-red-500' :
            timerUrgency === 'high' ? 'bg-gradient-to-r from-orange-600 to-orange-500' :
            timerUrgency === 'medium' ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' :
            'bg-gradient-to-r from-gray-700 to-gray-600'
          }`}>
            <div className="relative flex items-center justify-center gap-2 text-sm">
              <Clock className={`w-4 h-4 text-white ${timerUrgency === 'critical' ? 'animate-pulse' : ''}`} />
              <span className="text-white font-bold">
                {timerUrgency === 'critical' ? '⚠️' : 'Expira:'}
              </span>
              <span className={`font-mono font-bold text-white ${timerUrgency === 'critical' ? 'animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Form Section - Compacto */}
          <div className="p-3 bg-gray-900/50 backdrop-blur-sm">
            <div className="text-center mb-2">
              <h2 className="text-base font-bold text-white drop-shadow-lg">
                Cadastre-se Agora
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Name Field */}
              <div className="relative">
                <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.01]' : ''}`}>
                  <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10 ${
                    focusedField === 'name' ? 'text-accent' : 'text-white/50'
                  }`} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => handleFieldBlur('name')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border-2 transition-all duration-300 text-white text-sm placeholder-white/50 focus:outline-none ${
                      errors.name && touched.name
                        ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                        : focusedField === 'name'
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
                        : 'border-white/20 hover:border-white/30 hover:bg-white/15'
                    }`}
                    placeholder="Nome completo"
                    autoComplete="name"
                  />
                  {formData.name && !errors.name && touched.name && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-pulse" />
                  )}
                </div>
                {errors.name && touched.name && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs animate-slide-in-right">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10 ${
                    focusedField === 'email' ? 'text-accent' : 'text-white/50'
                  }`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => handleFieldBlur('email')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border-2 transition-all duration-300 text-white text-sm placeholder-white/50 focus:outline-none ${
                      errors.email && touched.email
                        ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                        : focusedField === 'email'
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
                        : 'border-white/20 hover:border-white/30 hover:bg-white/15'
                    }`}
                    placeholder="seu@email.com"
                    inputMode="email"
                    autoComplete="email"
                  />
                  {formData.email && !errors.email && touched.email && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-pulse" />
                  )}
                </div>
                {errors.email && touched.email && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs animate-slide-in-right">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* CPF Field */}
              <div className="relative">
                <div className={`relative transition-all duration-300 ${focusedField === 'cpf' ? 'scale-[1.01]' : ''}`}>
                  <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10 ${
                    focusedField === 'cpf' ? 'text-accent' : 'text-white/50'
                  }`} />
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleFieldChange('cpf', e.target.value)}
                    onFocus={() => setFocusedField('cpf')}
                    onBlur={() => handleFieldBlur('cpf')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border-2 transition-all duration-300 text-white text-sm placeholder-white/50 focus:outline-none ${
                      errors.cpf && touched.cpf
                        ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                        : focusedField === 'cpf'
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
                        : 'border-white/20 hover:border-white/30 hover:bg-white/15'
                    }`}
                    placeholder="CPF: 000.000.000-00"
                    maxLength={14}
                    inputMode="numeric"
                  />
                  {formData.cpf && !errors.cpf && touched.cpf && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-pulse" />
                  )}
                </div>
                {errors.cpf && touched.cpf && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs animate-slide-in-right">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.cpf}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
                  <Shield className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10 ${
                    focusedField === 'password' ? 'text-accent' : 'text-white/50'
                  }`} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => handleFieldBlur('password')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border-2 transition-all duration-300 text-white text-sm placeholder-white/50 focus:outline-none ${
                      errors.password && touched.password
                        ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                        : focusedField === 'password'
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
                        : 'border-white/20 hover:border-white/30 hover:bg-white/15'
                    }`}
                    placeholder="Senha (mínimo 6 caracteres)"
                    autoComplete="new-password"
                  />
                  {formData.password && !errors.password && touched.password && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-pulse" />
                  )}
                </div>
                {errors.password && touched.password && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs animate-slide-in-right">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Submit Button - Compacto */}
              <button
                type="submit"
                disabled={isSubmitting || timeLeft === 0}
                className="w-full bg-gradient-to-r from-accent via-accent to-accent-hover text-white font-bold py-3.5 rounded-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-accent/50 relative overflow-hidden group mt-3"
                style={{ touchAction: 'manipulation' }}
              >
                <div className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Processando...</span>
                    </>
                  ) : timeLeft === 0 ? (
                    <span className="text-sm">Oferta Expirada</span>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 animate-bounce" />
                      <span className="text-sm drop-shadow-lg">
                        {timerUrgency === 'critical' ? 'ÚLTIMOS MINUTOS!' : 'GARANTIR BÔNUS'}
                      </span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Benefits - Compacto */}
            <div className="mt-2.5 bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
              <h3 className="font-bold text-white text-xs mb-1.5 text-center flex items-center justify-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-accent" />
                <span>Vantagens Exclusivas</span>
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white/90 text-xs">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <span>Raspadinha Premium</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/90 text-xs">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <span>Chance de ganhar iPhone</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/90 text-xs">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <span>Prêmios até R$ 5.000</span>
                </div>
              </div>
            </div>

            {/* Security Badge - Compacto */}
            <div className="mt-2 flex items-center justify-center gap-1.5 text-white/60 text-xs">
              <Shield className="w-3 h-3 text-accent" />
              <span>Dados 100% protegidos</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};