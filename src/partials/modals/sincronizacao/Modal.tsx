import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { metaApi } from '@/services/connection';
import { toast } from 'sonner';
import { KeenIcon } from '@/components';
import ChosenBMs from './ChosenBMs';

type Option = { label: string; value: string };

interface IModalSincronizacaoPersonalizadaProps {
  open: boolean;
  onOpenChange: () => void;
}

const ModalSincronizacaoPersonalizada = ({
  open,
  onOpenChange
}: IModalSincronizacaoPersonalizadaProps) => {
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // guarda as opções selecionadas do react-select
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  async function handleCustomSync() {
    if (!date) {
      toast.error('Por favor, selecione uma data.');
      return;
    }

    const bmIds = selectedOptions.map((o) => o.value);
    const query =
      bmIds.length > 0 ? `/sync-ads?date=${date}&bm=${bmIds.join(',')}` : `/sync-ads?date=${date}`;

    setIsLoading(true);
    try {
      const res = await metaApi.get(query);
      if (res.status === 200) {
        toast.success(res.data.message || 'Sincronização personalizada concluída!');
      } else {
        toast.error(res.data.error || 'Erro na sincronização personalizada.');
      }
    } catch {
      toast.error('Erro inesperado durante a sincronização personalizada.');
    } finally {
      setIsLoading(false);
      onOpenChange();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      
    >
      <DialogContent className="max-w-[360px]">
        <DialogHeader className="border-0">
          <DialogTitle>Sincronização Personalizada</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-stretch pb-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-left">
              Escolha uma data para sincronizar:
            </label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          {/* <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-left">
              Selecionar BMs <span className="text-muted-foreground">(opcional)</span>
            </label>
            <ChosenBMs onChange={(opts) => setSelectedOptions(opts)} />
          </div> */}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="light" onClick={onOpenChange}>
              Cancelar
            </Button>
            <Button onClick={handleCustomSync} disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeenIcon icon="arrows-circle" className="mr-1" />
                  Sincronizar
                </>
              )}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalSincronizacaoPersonalizada };
