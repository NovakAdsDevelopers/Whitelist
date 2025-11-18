import { useState, useEffect, useRef } from "react";
import { ConfirmDialog } from "@/components/ui/alert-dialog-confirm";
import { usePutClienteContasAnuncio } from "@/graphql/services/ClienteContaAnuncio";

type EditableCellProps = {
  value: string;
  idAssociacao: string;
  idCliente: string;
};

export function EditableCell({ value, idAssociacao, idCliente }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const { updateClienteContaAnuncio, loading: isSaving } =
    usePutClienteContasAnuncio(Number(idCliente));

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const finishEdit = () => {
    if (draft === value) {
      setEditing(false);
      return;
    }

    triggerRef.current?.click();
    setEditing(false);
  };

  const handleConfirm = async () => {
    try {
      await updateClienteContaAnuncio({
        id: idAssociacao,            // 🔥 id da associação
        nomeContaCliente: draft,     // 🔥 nome atualizado
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente conta anúncio:", error);
    }
  };

  return (
    <>
      <ConfirmDialog
        title="Confirmar alteração?"
        description={
          <div className="space-y-1 text-center">
            <p>
              Alterar de{" "}
              <strong className="text-red-600">{value}</strong> para{" "}
              <strong className="text-green-600">{draft}</strong>?
            </p>
          </div>
        }
        action={handleConfirm}
        textAction={isSaving ? "Salvando..." : "Sim, confirmar"}
        textCancel="Cancelar"
        disabled={isSaving}
      >
        <button
          ref={triggerRef}
          style={{ display: "none" }}
          onClick={() => {}}
        />
      </ConfirmDialog>

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={finishEdit}
          className="border rounded px-1 text-sm w-full"
        />
      ) : (
        <span
          className="cursor-pointer hover:underline hover:underline-offset-2 hover:decoration-dotted"
          onClick={() => setEditing(true)}
          title="Clique para editar"
        >
          {value}
        </span>
      )}
    </>
  );
}
