import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { FormCreateCliente } from './Form'; // Importando o novo formulário

interface IModalCreateClienteProps {
  open: boolean;
  onOpenChange: () => void;
}

const ModalAssociateAccount = ({ open, onOpenChange }: IModalCreateClienteProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px]">
        <DialogHeader className="border-0">
          <DialogTitle>Associar conta de anuncio</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center pt-4 pb-10">
          <FormCreateCliente onOpenChange={onOpenChange} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalAssociateAccount };
