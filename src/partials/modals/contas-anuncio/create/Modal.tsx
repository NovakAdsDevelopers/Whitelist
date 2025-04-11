import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { FormCreateContasAnuncio } from './Form'; // Importando o novo formulário

interface IModalCreateContasAnuncioProps {
  open: boolean;
  onOpenChange: () => void;
}

const ModalCreateContasAnuncio = ({ open, onOpenChange }: IModalCreateContasAnuncioProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[300px]">
        <DialogHeader className="border-0">
          <DialogTitle>Criar Nova Conta</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center pt-10 pb-10">
          <div className="mb-10">
            <img
              src={toAbsoluteUrl('/media/illustrations/22.svg')}
              className="dark:hidden max-h-[120px]"
            />
          </div>

          <FormCreateContasAnuncio />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalCreateContasAnuncio };
