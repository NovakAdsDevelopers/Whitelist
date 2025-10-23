import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { FormCreateIntegracao } from './Form'; // Importando o novo formulário

interface IModalCreateIntegracaoProps {
  open: boolean;
  onOpenChange: () => void;
}

const ModalCreateIntegracao = ({ open, onOpenChange }: IModalCreateIntegracaoProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px]">
        <DialogHeader className="border">
          <DialogTitle>Nova Integração</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center pt-5 pb-10">
          <FormCreateIntegracao onOpenChange={onOpenChange} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalCreateIntegracao };
