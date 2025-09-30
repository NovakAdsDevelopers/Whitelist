import React, { useEffect, useMemo, useState } from "react";
import { addDays, endOfWeek, format, isSameDay, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

/**
 * CalendarTimeGrid (com grade/escala)
 *
 * - Exibe a semana (Seg → Dom) em colunas, com uma grade de horários.
 * - Recebe um array de "escalas" (peopleSchedules) e converte em eventos recorrentes
 *   para a semana em foco.
 * - Também aceita "events" avulsos (Date start/end) para combinar com a escala.
 *
 * Dependências sugeridas: TailwindCSS + shadcn/ui + date-fns + lucide-react
 */

export type CalendarEvent = {
  id: string | number;
  start: Date; // inclusive
  end: Date; // exclusive
  title?: string;
  color?: string; // tailwind class (ex: "bg-blue-500") ou hex
};

// ----------------- Tipos da escala -----------------
export type ScheduleSegment = {
  /** Dias da semana em padrão JS/date-fns: 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb, 0=Dom */
  days: number[];
  /** HH:mm (24h) */
  start: string;
  /** HH:mm (24h) */
  end: string;
};

export type PersonSchedule = {
  name: string;
  color?: string; // classe Tailwind ou hex
  segments: ScheduleSegment[];
};

export type CalendarTimeGridProps = {
  weekStart?: Date; // default: início da semana local (segunda)
  startHour?: number; // 0-23 (default 0 para cobrir madrugada)
  endHour?: number; // 1-24 (default 24)
  intervalMinutes?: number; // default 60
  peopleSchedules?: PersonSchedule[]; // << recebe a grade
  events?: CalendarEvent[]; // eventos adicionais (opcional)
  timezoneLabel?: string; // texto no cabeçalho (ex: "America/Bahia")
  className?: string;
};

const HOURS_COL_WIDTH = 64; // px
const HEADER_HEIGHT = 56; // px
const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]; // 0..6

function useNowTicker() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60 * 1000);
    return () => clearInterval(i);
  }, []);
}

function parseHHmm(base: Date, hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function CalendarTimeGrid({
  weekStart,
  startHour = 0,
  endHour = 24,
  intervalMinutes = 60,
  peopleSchedules = defaultPeopleSchedules,
  events = [],
  timezoneLabel = "America/Bahia",
  className,
}: CalendarTimeGridProps) {
  useNowTicker();

  const today = new Date();
  const start = useMemo(
    () => startOfWeek(weekStart ?? today, { weekStartsOn: 1 }),
    [weekStart, today]
  );
  const end = useMemo(() => endOfWeek(start, { weekStartsOn: 1 }), [start]);
  const locale = ptBR;

  // Converte a escala (peopleSchedules) em eventos (CalendarEvent) para a semana atual
  const scheduleEvents: CalendarEvent[] = useMemo(() => {
    const out: CalendarEvent[] = [];

    peopleSchedules.forEach((person, personIdx) => {
      person.segments.forEach((seg, segIdx) => {
        seg.days.forEach((dow) => {
          // dow: 0=Dom .. 6=Sáb (padrão JS)
          // Nossa grade renderiza Seg(1)→Dom(0) dentro da semana com startOfWeek({weekStartsOn:1}).
          // Para obter a data do "dow" dentro da semana exibida:
          const target = dow === 0 ? addDays(start, 6) : addDays(start, dow - 1);

          const dStart = parseHHmm(target, seg.start);
          const dEnd = parseHHmm(target, seg.end);

          out.push({
            id: `${personIdx}-${segIdx}-${dow}-${seg.start}`,
            start: dStart,
            end: dEnd,
            title: person.name,
            color: person.color,
          });
        });
      });
    });

    return out;
  }, [peopleSchedules, start]);

  const allEvents = useMemo(() => [...scheduleEvents, ...events], [scheduleEvents, events]);

  const gridRows = useMemo(() => {
    const totalMinutes = (endHour - startHour) * 60;
    return Math.ceil(totalMinutes / intervalMinutes);
  }, [endHour, startHour, intervalMinutes]);

  // posição vertical em % dentro do dia
  function yPos(date: Date) {
    const minutesFromStart = (date.getHours() - startHour) * 60 + date.getMinutes();
    const pct = (minutesFromStart / ((endHour - startHour) * 60)) * 100;
    return clamp(pct, 0, 100);
  }

  return (
    <Card className={`w-full overflow-hidden ${className ?? ""}`}>
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <div className="font-medium">
            Semana de {format(start, "dd LLL", { locale })} a {format(end, "dd LLL", { locale })}
          </div>
        </div>
        <div className="text-xs opacity-70">{timezoneLabel}</div>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `${HOURS_COL_WIDTH}px repeat(7, minmax(0, 1fr))` }}
      >
        {/* Cabeçalho dias */}
        <div style={{ height: HEADER_HEIGHT }} className="border-r bg-muted/40" />
        {[...Array(7)].map((_, i) => {
          const d = addDays(start, i);
          const isToday = isSameDay(d, today);
          return (
            <div
              key={i}
              style={{ height: HEADER_HEIGHT }}
              className={`border-r p-2 ${isToday ? "bg-primary/5" : "bg-muted/20"}`}
            >
              <div className="text-xs uppercase tracking-wide opacity-70">
                {DAY_LABELS[d.getDay()]}
              </div>
              <div className="font-semibold">{format(d, "dd LLL", { locale })}</div>
            </div>
          );
        })}

        {/* Coluna das horas + linhas horizontais */}
        <div className="border-r relative">
          {[...Array(gridRows + 1)].map((_, i) => {
            const minutes = i * intervalMinutes;
            const h = Math.floor(minutes / 60) + startHour;
            const m = minutes % 60;
            const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            const top = (i / gridRows) * 100;
            return (
              <div key={i} className="absolute left-0 right-0" style={{ top: `${top}%` }}>
                <div className="pr-2 text-right text-[11px] text-muted-foreground">{label}</div>
                <div className="border-t" />
              </div>
            );
          })}
          <div style={{ paddingTop: HEADER_HEIGHT }} />
        </div>

        {/* Colunas por dia */}
        {[...Array(7)].map((_, col) => {
          const dayDate = addDays(start, col);
          return (
            <div key={col} className="relative border-r" style={{ minHeight: 800 }}>
              {/* linhas da grade */}
              {[...Array(gridRows + 1)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t opacity-40"
                  style={{ top: `${(i / gridRows) * 100}%` }}
                />
              ))}

              {/* eventos do dia */}
              {allEvents
                .filter((ev) => isSameDay(ev.start, dayDate))
                .map((ev) => {
                  const top = yPos(ev.start);
                  const bottom = 100 - yPos(ev.end);
                  const height = Math.max(2, 100 - (top + bottom));
                  const isHex = ev.color?.startsWith("#");
                  const colorClass = isHex ? undefined : ev.color ?? "bg-blue-500";
                  const style = isHex ? { backgroundColor: ev.color } : {};
                  return (
                    <div
                      key={ev.id}
                      className={`absolute left-1 right-1 rounded-xl shadow text-xs text-white p-2 ${
                        colorClass || ""
                      }`}
                      style={{ top: `${top}%`, height: `${height}%`, ...style }}
                    >
                      <div className="font-semibold text-[11px] leading-4">{ev.title}</div>
                      <div className="opacity-90">
                        {format(ev.start, "HH:mm")}–{format(ev.end, "HH:mm")}
                      </div>
                    </div>
                  );
                })}

              <div style={{ paddingTop: HEADER_HEIGHT }} />
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="p-3 flex flex-wrap gap-3 pl-16">
        {peopleSchedules.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className={`w-3 h-3 rounded ${p.color?.startsWith("#") ? "" : p.color ?? "bg-blue-500"}`}
              style={p.color?.startsWith("#") ? { backgroundColor: p.color } : {}}
            />
            <span className="font-medium">{p.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ----------------- Escala padrão baseada no que você passou -----------------
const SEG = 1, TER = 2, QUA = 3, QUI = 4, SEX = 5, SAB = 6, DOM = 0;

export const defaultPeopleSchedules: PersonSchedule[] = [
  {
    name: "Adrianna Maria",
    color: "bg-emerald-500",
    segments: [
      { days: [SEG, TER, QUA, QUI, SEX], start: "15:00", end: "18:59" },
      { days: [SEG, TER, QUA, QUI, SEX], start: "20:00", end: "23:59" },
      { days: [SAB], start: "08:00", end: "11:59" },
    ],
  },
  {
    name: "Gabriel Rivas",
    color: "bg-sky-500",
    segments: [
      { days: [SEG, TER, QUA, QUI, SEX, SAB], start: "00:00", end: "02:59" },
      { days: [SEG, TER, QUA, QUI, SEX, SAB], start: "04:00", end: "06:59" },
    ],
  },
  {
    name: "Maiana Nascimento",
    color: "bg-fuchsia-500",
    segments: [
      { days: [SEG, TER, QUA, QUI, SEX], start: "06:00", end: "10:59" },
      { days: [SEG, TER, QUA, QUI, SEX], start: "12:00", end: "14:59" },
      { days: [DOM], start: "08:00", end: "11:59" },
    ],
  },
  {
    name: "Nadja Boaventura",
    color: "bg-orange-500",
    segments: [
      { days: [QUA, QUI, SEX], start: "11:00", end: "14:59" },
      { days: [QUA, QUI, SEX], start: "16:00", end: "19:59" },
      { days: [SAB, DOM], start: "13:00", end: "16:59" },
      { days: [SAB, DOM], start: "18:00", end: "22:59" },
    ],
  },
];

// ----------------- Exemplo de uso -----------------
// import CalendarTimeGrid, { PersonSchedule } from "./CalendarTimeGrid";
// const schedules: PersonSchedule[] = defaultPeopleSchedules;
// <CalendarTimeGrid peopleSchedules={schedules} startHour={0} endHour={24} intervalMinutes={60} />
