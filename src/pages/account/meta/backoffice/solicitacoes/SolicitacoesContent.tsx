import { MiscHelp } from '@/partials/misc';
import { UsuariosLog } from './blocks';


const UsuariosContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <UsuariosLog />

      <MiscHelp />
    </div>
  );
};

export { UsuariosContent };
