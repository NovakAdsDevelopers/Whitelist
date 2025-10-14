import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { KeenIcon } from '@/components';
import { ModalCreateIntegracao } from './create';
import { useMemo, useState } from 'react';
import { TypesGetIntegracoes } from '@/graphql/types/Integracao';
import { FaMeta } from 'react-icons/fa6';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { metaApi } from '@/services/connection';
import { toast } from 'sonner';

// --- Util para mascarar valores sensíveis ---
const mask = (value?: string | null, opts: { show?: boolean; keep?: number } = {}) => {
  const { show = false, keep = 0 } = opts;
  if (!value) return '-';
  if (show) return value;
  if (keep <= 0) return '••••••••••••••••';
  const head = value.slice(0, keep);
  const tail = value.slice(-Math.min(2, value.length - keep));
  const dots = '•'.repeat(Math.max(6, value.length - (keep + tail.length)));
  return `${head}${dots}${tail}`;
};

// --- Util de cópia ---
async function copyToClipboard(text?: string | null) {
  if (!text || text === '-') return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

// --- Componente Copyable ---
function Copyable({
  id,
  copyValue,
  children,
  className
}: {
  id: string;
  copyValue?: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    await copyToClipboard(copyValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      doCopy();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={doCopy}
          onKeyDown={onKeyDown}
          aria-label={copied ? 'Copiado!' : 'Copiar'}
          title={copied ? 'Copiado!' : 'Copiar'}
          className={`truncate cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-sm ${className ?? ''}`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="px-2 py-1 text-xs">
        {copied ? 'Copiado!' : 'Copiar'}
      </TooltipContent>
    </Tooltip>
  );
}

const CardsIntegracao = ({
  syncingAll,
  handleSyncAll,
  integracoes,
  onRemoveIntegracao
}: {
  syncingAll: boolean;
  handleSyncAll: () => void;
  integracoes: TypesGetIntegracoes['GetIntegracoes']['result'];
  onRemoveIntegracao?: (id: string) => Promise<void> | void;
}) => {
  const [show, setShow] = useState(false);

  // estado de loading por card
  const [syncingById, setSyncingById] = useState<Record<string, boolean>>({});

  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const toggleVisible = (id: string) => setVisible((v) => ({ ...v, [id]: !v[id] }));

  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const toggleEnabled = (id: string) => setEnabled((e) => ({ ...e, [id]: !e[id] }));

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggleExpanded = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  const [tab, setTab] = useState<'ALL' | 'CONNECTED' | 'DISCONNECTED'>('ALL');

  const connected = useMemo(
    () => integracoes.filter((i: any) => i.situacao === 'ATIVO'),
    [integracoes]
  );
  const disconnected = useMemo(
    () => integracoes.filter((i: any) => i.situacao !== 'ATIVO'),
    [integracoes]
  );

  const totalAll = integracoes.length;
  const totalConnected = connected.length;
  const totalDisconnected = disconnected.length;

  const list = useMemo(() => {
    if (tab === 'CONNECTED') return connected;
    if (tab === 'DISCONNECTED') return disconnected;
    return integracoes;
  }, [tab, integracoes, connected, disconnected]);

  const handleRemove = async (id: string, title?: string) => {
    const ok = window.confirm(
      `Tem certeza que deseja remover a integração${title ? ` "${title}"` : ''}?`
    );
    if (!ok) return;
    try {
      await (onRemoveIntegracao ?? (() => {}))(id);
    } catch (err) {
      console.error(err);
      alert('Não foi possível remover a integração. Tente novamente.');
    }
  };

  // --- Sincronização individual por integração ---
  async function associateAdAccountsToBMs(id: number) {
    setSyncingById((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await metaApi.post(`/bms/associate-adaccounts/${id}`);
      if (res.status === 200) {
        toast.success(res.data.message || 'Sincronização com o Meta concluída!');
      } else {
        toast.error(res.data.error || 'Erro durante a sincronização com o Meta.');
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          'Erro inesperado ao tentar sincronizar com o Meta.'
      );
    } finally {
      setSyncingById((prev) => ({ ...prev, [id]: false }));
    }
  }

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={200}>
      <div className="w-full flex-col">
        {/* Filtros e botões */}
        <div className="w-full flex flex-row justify-between items-center mb-4">
          <div className="bg-gray-200 dark:bg-gray-700/70 px-1 py-1 rounded-lg text-sm font-medium flex gap-2">
            {[
              { label: 'Todas Aplicações', tab: 'ALL', count: totalAll },
              { label: 'Conectados', tab: 'CONNECTED', count: totalConnected },
              { label: 'Desconectados', tab: 'DISCONNECTED', count: totalDisconnected }
            ].map(({ label, tab: t, count }) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`px-4 py-3 rounded-lg transition ${
                  tab === t ? 'bg-white' : 'bg-gray-200 hover:bg-white'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="light" size="sm" onClick={handleSyncAll} disabled={syncingAll}>
              {syncingAll ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeenIcon icon="arrows-circle" />
                  Sincronizar BMs
                </>
              )}
            </Button>
            <Button size="sm" onClick={() => setShow(true)}>
              <KeenIcon icon="plus" />
              Nova Integração
            </Button>
            <ModalCreateIntegracao open={show} onOpenChange={() => setShow(false)} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {list.map((integracao: any) => {
            const id = String(integracao.id);
            const isVisible = !!visible[id];
            const isExpanded = expandedId === id;
            const syncing = syncingById[id];

            const { title, cor, token, client_id, secret_id, descricao } = integracao;
            const shortDesc = descricao ?? 'Integração do Business Manager do Facebook conectada.';

            return (
              <Card
                key={id}
                className={`relative border rounded-2xl shadow-sm bg-[${cor}] dark:bg-gray-800 overflow-hidden`}
              >
                <CardHeader className="pb-2 border-b-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 border border-1 rounded-md">
                        <FaMeta size={30} />
                      </div>
                      <div className="flex flex-col">
                        <CardTitle className="text-base leading-tight">
                          {title || 'Sem título'}
                        </CardTitle>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {shortDesc}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="w-full flex justify-between items-center pt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(id)}
                        className="gap-1 hover:bg-gray-800/70"
                      >
                        {isExpanded ? (
                          <>
                            Recolher <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Detalhes <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <Button
                        className="border-red-600 text-red-600 bg-white border hover:bg-red-600 hover:text-white hover:border-white/20 focus:ring-red-600"
                        size="sm"
                        onClick={() => handleRemove(id, title)}
                        title="Remover integração"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Excluir</span>
                      </Button>
                    </div>

                    <Switch
                      checked={integracao.situacao === 'ATIVO'}
                      onCheckedChange={() => toggleEnabled(id)}
                    />
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 rounded-xl py-3 px-2 bg-gray-200/70 dark:bg-gray-700/70">
                      {[
                        { label: 'Token', value: token, idSuffix: 'token', keep: 3 },
                        { label: 'Client ID', value: client_id, idSuffix: 'client', keep: 3 },
                        { label: 'Secret ID', value: secret_id, idSuffix: 'secret', keep: 2 }
                      ].map(({ label, value, idSuffix, keep }) => (
                        <div key={idSuffix} className="flex justify-between gap-2 text-sm items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-200">{label}:</span>
                          <Copyable
                            id={`${id}-${idSuffix}`}
                            copyValue={value}
                            className="font-mono bg-gray-100 px-2 py-1 rounded-lg"
                          >
                            <span className="truncate">{mask(value, { show: isVisible, keep })}</span>
                          </Copyable>
                        </div>
                      ))}

                      <div className="flex justify-between items-center mt-4 border-t-2 pt-6">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="default"
                            className="rounded-md"
                            title="Associar contas"
                            onClick={() => associateAdAccountsToBMs(Number(id))}
                            disabled={syncing}
                          >
                            {syncing ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              'Associar contas'
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-md"
                            onClick={() => toggleVisible(id)}
                            title={isVisible ? 'Ocultar' : 'Revelar'}
                          >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <span className="text-sm underline">{integracao.totalAdAccounts} ativos</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export { CardsIntegracao };
