import { MiscHelp } from '@/partials/misc';

import { DepositosLog } from './blocks';

const DepositosContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <DepositosLog />

      <MiscHelp />
    </div>
  );
};

export { DepositosContent };
