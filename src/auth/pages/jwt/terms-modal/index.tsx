import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { KeenIcon } from '@/components';

interface TermsModalProps {
  pdfUrl: string;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal = ({ pdfUrl, onClose, onAccept }: TermsModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [canAccept, setCanAccept] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ===== DEBUG LOGS =====
  useEffect(() => {
    console.log('🧩 [TermsModal] aberto');
    console.log('📄 PDF URL recebida:', pdfUrl);

    const el = containerRef.current;
    const iframe = iframeRef.current;

    if (!el || !iframe) {
      console.warn('⚠️ containerRef ou iframeRef ainda não definidos');
      return;
    }

    // Listener do scroll do container (apenas debug)
    el.addEventListener('scroll', () => {
      console.log('🌀 Scroll detectado na div externa (não deve disparar com PDF em iframe)');
    });

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        console.log('✅ Acesso ao documento interno do iframe bem-sucedido (pouco comum com PDF)');
        iframeDoc.addEventListener('scroll', () => {
          console.log('🟢 Scroll detectado dentro do iframe PDF');
        });
      } else {
        console.warn('⚠️ Não foi possível acessar o documento interno do iframe');
      }
    } catch (err) {
      console.error('🚫 Erro ao acessar conteúdo do iframe (CORS/viewer nativo)', err);
    }

    // Fallback: libera o botão após 5s
    const fallbackTimer = setTimeout(() => {
      console.log('🕒 Fallback: 5s decorrido, habilitando "Aceitar Termos".');
      setCanAccept(true);
    }, 5000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [pdfUrl]);

  // ===== Ações =====
  const handleClose = () => {
    console.log('❎ Modal fechado sem aceitar');
    onClose();
  };

  const handleAcceptClick = () => {
    console.log('⚖️ Clique em "Aceitar Termos" → exibindo confirmação central');
    setShowConfirm(true);
  };

  const handleConfirmAccept = () => {
    console.log('✅ Usuário CONFIRMOU responsabilidade nos termos');
    onAccept();
    onClose();
  };

  const handleCancelConfirm = () => {
    console.log('🚫 Usuário CANCELOU a confirmação');
    setShowConfirm(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-lg"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Termos & Condições</h2>
          <button onClick={handleClose} className="btn btn-icon" aria-label="Fechar">
            <KeenIcon icon="x" />
          </button>
        </div>

        {/* Conteúdo */}
        <div ref={containerRef} className="flex-1 overflow-y-auto">
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            title="Termos e Condições"
            className="w-full h-full"
          />
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <Button onClick={handleClose} variant="secondary">
            Fechar
          </Button>
          <Button
            onClick={handleAcceptClick}
            variant="default"
            disabled={!canAccept}
          >
            {canAccept ? 'Aceitar Termos' : 'Lendo...'}
          </Button>
        </div>
      </motion.div>

      {/* ===== Overlay de Confirmação Central ===== */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={handleCancelConfirm} />

            {/* card */}
            <motion.div
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-[90%] p-6 text-center border border-gray-200"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              role="alertdialog"
              aria-labelledby="confirm-title"
              aria-describedby="confirm-desc"
            >
              <div className="mx-auto mb-3 size-14 rounded-full bg-green-100 flex items-center justify-center">
                <KeenIcon icon="information" className="text-green-700 text-3xl" />
              </div>
              <h3 id="confirm-title" className="text-lg font-semibold mb-2">
                Confirmação de responsabilidade
              </h3>
              <p id="confirm-desc" className="text-sm text-gray-600 dark:text-gray-300">
                Você declara que leu integralmente e concorda com os Termos e Condições apresentados?
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Button variant="secondary" onClick={handleCancelConfirm}>
                  Cancelar
                </Button>
                <Button variant="default" onClick={handleConfirmAccept}>
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
