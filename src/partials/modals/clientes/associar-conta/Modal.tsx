// Código atualizado para ModalAssociateAccount e FormCreateCliente
// Inclui suporte a Select com portal e campo de nome vinculado à conta

// ==========================
// ModalAssociateAccount.tsx
// ==========================
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { FormCreateCliente } from './Form';

interface IModalCreateClienteProps {
  open: boolean;
  onOpenChange: () => void;
}

const ModalAssociateAccount = ({ open, onOpenChange }: IModalCreateClienteProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] overflow-visible">
        <DialogHeader className="border-0">
          <DialogTitle>Associar conta de anúncio</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center pt-4 pb-10 overflow-visible">
          <FormCreateCliente onOpenChange={onOpenChange} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalAssociateAccount };


