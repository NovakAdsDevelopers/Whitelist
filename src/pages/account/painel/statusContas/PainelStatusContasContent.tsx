import { Options, IOptionsItems } from '../../home/get-started';
import { TableInative } from './partials/tableInative';
import { TableActive } from './partials/tableActive';


const PainelStatusContasContent = () => {

  return (
    <div>
      <div>
        <TableInative />
      </div>
      <div className='mt-8'>
        <TableActive />
      </div>
    </div>
  );
};

export { PainelStatusContasContent };
