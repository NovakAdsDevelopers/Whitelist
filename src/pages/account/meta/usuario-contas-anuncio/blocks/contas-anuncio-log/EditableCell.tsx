import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

type EditableCellProps = {
  value: string;
  onConfirm: (newValue: string) => void;
};

export function EditableCell({ value, onConfirm }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const finishEdit = () => {
    if (draft === value) {
      setEditing(false);
      return;
    }

    toast("Confirmar alteração?", {
      description: `Deseja alterar o nome de "${value}" para "${draft}"?`,
      action: {
        label: "Confirmar",
        onClick: () => onConfirm(draft),
      },
    });

    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={finishEdit}
        className="border rounded px-1 text-sm w-full"
      />
    );
  }

  return (
    <span
      className="cursor-pointer hover:underline hover:underline-offset-2 hover:decoration-dotted"
      onClick={() => setEditing(true)}
      title="Clique para editar"
    >
      {value}
    </span>
  );
}
