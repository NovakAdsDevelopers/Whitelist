import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toAbsoluteUrl } from '@/utils';
import { FormClienteContaAnuncioEdit } from './Form';

interface IModalClienteContaAnuncioEditProps {
  open: boolean;
  onClose: () => void;
  id: string | null;
  idCliente: string;
}

const ModalClienteContaAnuncioEdit = ({
  open,
  onClose,
  id,
  idCliente
}: IModalClienteContaAnuncioEditProps) => {
  if (!id) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-0">
          <DialogTitle>Editar Associação</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center pt-8 pb-10">
          <div className="mb-6">
            <img
              src={toAbsoluteUrl('/media/illustrations/22.svg')}
              className="dark:hidden max-h-[100px]"
              alt="Edit Illustration"
            />
          </div>
          <FormClienteContaAnuncioEdit onClose={onClose} idAssociacao={id} idCliente={idCliente} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalClienteContaAnuncioEdit };
