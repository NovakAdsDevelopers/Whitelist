import { MiscHelp } from '@/partials/misc';

import { ContasTable } from './blocks';

const AtualizacaoGastosContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <ContasTable />

      {/* <MiscHelp /> */}
    </div>
  );
};

export { AtualizacaoGastosContent };
