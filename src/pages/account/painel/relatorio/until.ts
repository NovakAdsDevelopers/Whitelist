const MONTHS_ABBR = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const dd = (n: number) => String(n).padStart(2, '0');

export function formatRangeLabel(startISO: string | null , endISO: string | null) {
  if (!startISO || !endISO) return '';

  const start = new Date(startISO);
  const end = new Date(endISO);

  const sD = start.getDate();
  const sM = start.getMonth();
  const sY = start.getFullYear();

  const eD = end.getDate();
  const eM = end.getMonth();
  const eY = end.getFullYear();

  const sameYear = sY === eY;
  const sameMonth = sameYear && sM === eM;
  const sameDay = sameMonth && sD === eD;

  // 🔹 0) Mesmo dia, mês e ano → "17 de ago/2025"
  if (sameDay) {
    return `${dd(sD)} de ${MONTHS_ABBR[sM]}/${sY}`;
  }

  // 1) Mesmo mês e ano → "18-19 de ago/2025"
  if (sameMonth) {
    return `${dd(sD)}-${dd(eD)} de ${MONTHS_ABBR[eM]}/${eY}`;
  }

  // 2) Mesmo ano, meses diferentes → "18 de jul - 19 de ago de 2025"
  if (sameYear) {
    return `${dd(sD)} de ${MONTHS_ABBR[sM]} - ${dd(eD)} de ${MONTHS_ABBR[eM]} de ${eY}`;
  }

  // 3) Anos diferentes → "30/12/2025 - 02/01/2026"
  return `${dd(sD)}/${dd(sM + 1)}/${sY} - ${dd(eD)}/${dd(eM + 1)}/${eY}`;
}
