import { MiscHelp } from '@/partials/misc';

import { ContasAnuncioLog } from './blocks';

const ContasAnuncioContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <ContasAnuncioLog />

      <MiscHelp />
    </div>
  );
};

export { ContasAnuncioContent };
