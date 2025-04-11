import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/utils';
import { useState } from 'react';

interface IModalCreateClienteProps {
  open: boolean;
  onClose: () => void;
}

const ModalMoneyTransfer = ({ open, onClose }: IModalCreateClienteProps) => {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<'entrada' | 'realocacao' | 'saida' | null>(null);

  const handleTipoSelect = (value: 'entrada' | 'realocacao' | 'saida') => {
    setTipo(value);
  };

  const handleClose = () => {
    setStep(1);
    setTipo(null);
    onClose();
  };

  const getTitle = () => {
    if (step === 1) return 'Movimentação';
    if (tipo === 'entrada') return 'Movimentação de Entrada';
    if (tipo === 'realocacao') return 'Movimentação de Realocação';
    if (tipo === 'saida') return 'Movimentação de Saída';
    return 'Movimentação';
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground mb-4">Selecione o tipo de transação:</p>
          <div className="flex gap-2">
            <Button
              variant={tipo === 'entrada' ? 'default' : 'outline'}
              onClick={() => handleTipoSelect('entrada')}
            >
              Entrada
            </Button>
            <Button
              variant={tipo === 'realocacao' ? 'default' : 'outline'}
              onClick={() => handleTipoSelect('realocacao')}
            >
              Realocação
            </Button>
            <Button
              variant={tipo === 'saida' ? 'default' : 'outline'}
              onClick={() => handleTipoSelect('saida')}
            >
              Saída
            </Button>
          </div>
        </div>
      );
    }

    // Step 2: conteúdo específico por tipo
    return (
      <div className="w-full">
        {tipo === 'entrada' && (
          <div className="w-full flex flex-col">
            <div className="w-full flex flex-col gap-2 mb-4">
              <label htmlFor="">Tipo:</label>
              <select name="" id="" className="w-full rounded-md border px-4 py-2 shadow-sm">
                <option value="">Selecione</option>
                <option value="">Depósito</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="">Valor do depósito</label>
              <input
                type="text"
                className="px-4 py-1 border-b-2 decoration-n"
                placeholder="Insira seu valor aqui"
              />
            </div>
            <hr className="my-4" />
            <div>
              <h2 className=''>Resumo da operação</h2>
              <div>
                <span>Fee</span>
                <div>
                  <span>5%</span>
                  <span>R$ 28.000,00</span>
                </div>
              </div>
              <div>
                <span>Depósito inserido</span>
                <div>
                  <span>R$ 28.000,00</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {tipo === 'realocacao' && <p>Formulário de realocação aqui</p>}
        {tipo === 'saida' && <p>Formulário de saída aqui</p>}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center pt-6 pb-10">
          {step === 1 && (
            <img
              src={toAbsoluteUrl('/media/illustrations/22.svg')}
              className="dark:hidden max-h-[120px] mb-6"
              alt=""
            />
          )}

          {renderStepContent()}

          {/* Botões de ação */}
          <div className="flex justify-between mt-10 w-full">
            {step === 1 ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Fechar
                </Button>
                <Button onClick={() => setStep(2)} disabled={!tipo}>
                  Avançar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button onClick={() => alert('Finalizado!')}>Finalizar</Button>
              </>
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalMoneyTransfer };
