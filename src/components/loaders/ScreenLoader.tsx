import { toAbsoluteUrl } from '@/utils';

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center gap-2 justify-center fixed inset-0 z-50 bg-light transition-opacity duration-700 ease-in-out">
      <img
        className="h-[60px] max-w-none"
        src={toAbsoluteUrl('/media/images/new/logo.png')}
        alt="logo"
      />
      <div className="text-gray-500 font-medium text-sm">Carregando...</div>
    </div>
  );
};

export { ScreenLoader };
