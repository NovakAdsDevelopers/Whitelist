import { Options, IOptionsItems } from '../../home/get-started';
import CalendarTimeGrid, { PersonSchedule } from './partials/Calendar';

const DashoboardMetaContent = () => {
 const SEG = 1, TER = 2, QUA = 3, QUI = 4, SEX = 5, SAB = 6, DOM = 0;

const schedules: PersonSchedule[] = [
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


  return (
  <div>
    <div className='w-full'>
      <CalendarTimeGrid peopleSchedules={schedules} />
    </div>
  </div>
)
};

export { DashoboardMetaContent };
