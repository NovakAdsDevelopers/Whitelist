import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect, useRef, useState } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Tempo {
  minutos: number;
  segundos: number;
}

export function useTempoRestante() {
  const [tempo, setTempo] = useState<Tempo>({ minutos: 0, segundos: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let targetTime = 0; // timestamp da próxima sync (ms)

    const init = async () => {
      try {
        const res = await fetch('http://localhost:4000/meta/tempo-restante-sync');
        const json = await res.json(); // { minutos, segundos, totalMs }
        console.log('⏱ resposta da API:', json);

        // garante que temos um número válido
        const ms = Number(json.totalMs);
        if (isNaN(ms) || ms <= 0) {
          console.error('totalMs inválido:', json.totalMs);
          return;
        }

        targetTime = Date.now() + ms;

        const tick = () => {
          const diff = Math.max(0, targetTime - Date.now()); // ms restantes
          const s = Math.floor(diff / 1000);
          setTempo({ minutos: Math.floor(s / 60), segundos: s % 60 });

          if (s === 0 && timerRef.current) clearInterval(timerRef.current);
        };

        tick(); // primeira atualização instantânea
        timerRef.current = setInterval(tick, 1000);
      } catch (err) {
        console.error('Erro ao buscar tempo restante:', err);
      }
    };

    init();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return tempo;
}
