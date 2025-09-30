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

// Util para mascarar valores sensíveis mantendo um pequeno contexto visual
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

const noop = () => {};

// --- Util de cópia ---
async function copyToClipboard(text?: string | null) {
  if (!text || text === '-') return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback simples
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

// Componente utilitário para qualquer área "copiável" com tooltip de Copiar/Copiado
function Copyable({
  id,
  copyValue,
  children,
  className
}: {
  id: string; // chave única (ex: `${id}-token`)
  copyValue?: string | null; // valor completo a ser copiado
  children: React.ReactNode; // conteúdo visível (pode estar mascarado)
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    await copyToClipboard(copyValue);
    setCopied(true);
    // tempo para voltar ao estado "Copiar"
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

  // visibilidade/máscara por card
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const toggleVisible = (id: string) => setVisible((v) => ({ ...v, [id]: !v[id] }));

  // switch ON/OFF (visual local)
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const toggleEnabled = (id: string) => setEnabled((e) => ({ ...e, [id]: !e[id] }));

  // expand/collapse credenciais
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpanded = (id: string) => setExpanded((ex) => ({ ...ex, [id]: !ex[id] }));

  // ⬇️ NOVO: filtro da listagem
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

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={200}>
      <div className="w-full flex-col">
        <div className="w-full flex flex-row justify-between items-center mb-4">
          {/* ⬇️ Abas de filtro com contadores */}
          <div className="bg-gray-200 dark:bg-gray-700/70 px-1 py-1 rounded-lg text-sm font-medium flex gap-2">
            <button
              onClick={() => setTab('ALL')}
              className={`px-4 py-3 rounded-lg cursor-pointer transition
                ${tab === 'ALL' ? 'bg-white' : 'bg-gray-200 hover:bg-white'}`}
            >
              Todas Aplicações ({totalAll})
            </button>

            <button
              onClick={() => setTab('CONNECTED')}
              className={`px-4 py-3 rounded-lg cursor-pointer transition
                ${tab === 'CONNECTED' ? 'bg-white' : 'bg-gray-200 hover:bg-white'}`}
            >
              Conectados ({totalConnected})
            </button>

            <button
              onClick={() => setTab('DISCONNECTED')}
              className={`px-4 py-3 rounded-lg cursor-pointer transition
                ${tab === 'DISCONNECTED' ? 'bg-white' : 'bg-gray-200 hover:bg-white'}`}
            >
              Desconectados ({totalDisconnected})
            </button>
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

        {/* Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((integracao: any) => {
            const id = String(integracao.id);
            const isVisible = !!visible[id];
            const isEnabled = !!enabled[id];
            const isExpanded = !!expanded[id];

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
                        <span className="text-xs text-gray-600 dark:text-gray-300">{shortDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" />
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="w-full flex flex-row justify-between items-center pt-3">
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
                        aria-label="Remover integração"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Excluir</span>
                      </Button>
                    </div>

                    {/* Usa situacao para estado conectado/desconectado */}
                    <Switch
                      checked={integracao.situacao === 'ATIVO'}
                      onCheckedChange={() => toggleEnabled(id)}
                    />
                  </div>

                  {isExpanded && (
                    <div>
                      <div className="mt-3 space-y-2 rounded-xl py-3 px-2 bg-gray-200/70 dark:bg-gray-700/70">
                        <div className="flex justify-between gap-2 text-sm items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-200">Token:</span>
                          <Copyable id={`${id}-token`} copyValue={token} className="font-mono bg-gray-100 px-2 py-1 rounded-lg">
                            <span className="truncate">{mask(token, { show: isVisible, keep: 3 })}</span>
                          </Copyable>
                        </div>
                        <div className="flex justify-between gap-2 text-sm items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-200">Client ID:</span>
                          <Copyable id={`${id}-client`} copyValue={client_id} className="font-mono bg-gray-100 px-2 py-1 rounded-lg">
                            <span className="truncate">{mask(client_id, { show: isVisible, keep: 3 })}</span>
                          </Copyable>
                        </div>
                        <div className="flex justify-between gap-2 text-sm items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-200">Secret ID:</span>
                          <Copyable id={`${id}-secret`} copyValue={secret_id} className="font-mono bg-gray-100 px-2 py-1 rounded-lg">
                            <span className="truncate">{mask(secret_id, { show: isVisible, keep: 2 })}</span>
                          </Copyable>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm underline">
                            {integracao.totalAdAccounts} contas de anúncios
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-md"
                            onClick={() => toggleVisible(id)}
                            aria-label={isVisible ? 'Ocultar informações sensíveis' : 'Revelar informações sensíveis'}
                            title={isVisible ? 'Ocultar' : 'Revelar'}
                          >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
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