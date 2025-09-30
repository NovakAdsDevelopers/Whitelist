import { metaApi } from '@/services/connection';
import { CardsIntegracao } from './partials/TableLog';
import { toast } from 'sonner';
import { useState } from 'react';
import { useQueryIntegracoes } from '@/graphql/services/Integracao';

const PainelIntegracoesContent = () => {
  const [syncingAll, setSyncingAll] = useState(false);

  const { data, loading, error } = useQueryIntegracoes({
    type: 'facebook',
    pagination: { pagina: null, quantidade: null }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const integracoes = data?.GetIntegracoes?.result ?? [];

  const handleSyncAll = async () => {
    setSyncingAll(true);
    try {
      const res = await metaApi.post('/sync-bms');

      if (res.status === 200) {
        toast.success(res.data.message || 'BMs sincronizadas com sucesso!');
      } else {
        toast.error(res.data.error || 'Erro ao sincronizar BMs.');
      }
    } catch (err) {
      toast.error('Erro inesperado ao sincronizar BMs.');
    } finally {
      setSyncingAll(false);
    }
  };

  return (
    <div>
      <CardsIntegracao
        syncingAll={syncingAll}
        handleSyncAll={handleSyncAll}
        integracoes={integracoes}
      />
    </div>
  );
};

export { PainelIntegracoesContent };
