import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { FormLimitesDinamicos } from './Form'; // Importando o novo formulário

interface IModalCreateClienteProps {
  open: boolean;
  onOpenChange: () => void;
  contaAnuncioID: string;
}

const ModalAjusteLimite = ({ open, onOpenChange, contaAnuncioID }: IModalCreateClienteProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[300px]">
        <DialogHeader className="border-0">
          <DialogTitle>Limites da Conta</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center pt-10 pb-10">
          <div className="mb-10">
            <img
              src={toAbsoluteUrl('/media/illustrations/22.svg')}
              className="dark:hidden max-h-[120px]"
            />
          </div>
          <FormLimitesDinamicos contaId={contaAnuncioID} onOpenChange={onOpenChange} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalAjusteLimite };
