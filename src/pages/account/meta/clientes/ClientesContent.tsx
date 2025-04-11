import { MiscHelp } from '@/partials/misc';
import { ClientesLog } from './blocks';

const ClientesContent = () => {

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <ClientesLog />
      <MiscHelp />
    </div>
  );
};

export { ClientesContent };
