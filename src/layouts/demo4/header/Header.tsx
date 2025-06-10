import { KeenIcon } from '@/components';
import { Container } from '@/components/container';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { useDemo4Layout } from '../';

const Header = () => {
  const { setMobileSidebarOpen } = useDemo4Layout();

  const handleMobileSidebarOpen = () => {
    setMobileSidebarOpen(true);
  };

  return (
    <header className="flex lg:hidden items-center fixed z-10 top-0 start-0 end-0 shrink-0 bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark] h-[--tw-header-height]">
      <Container className="flex items-center justify-between flex-wrap gap-3">
        <Link to="/">
          <img
            src={toAbsoluteUrl('/media/images/new/logo.png')}
            className="dark:hidden max-h-[30px]"
          />
          <img
            src={toAbsoluteUrl('/media/images/new/logo.png')}
            className="hidden dark:block max-h-[30px]"
          />
        </Link>

        <button
          onClick={handleMobileSidebarOpen}
          className="btn btn-icon btn-light btn-clear btn-sm me-2"
        >
          <KeenIcon icon="menu" />
        </button>
      </Container>
    </header>
  );
};

export { Header };
