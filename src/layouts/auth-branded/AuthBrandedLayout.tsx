import { Link, Outlet } from 'react-router-dom';
import { Fragment, useMemo, useState, useEffect } from 'react';
import { toAbsoluteUrl } from '@/utils';
import useBodyClasses from '@/hooks/useBodyClasses';
import { AuthBrandedLayoutProvider } from './AuthBrandedLayoutProvider';
import { motion } from 'framer-motion';

const Layout = () => {
  useBodyClasses('dark:bg-coal-500');

  const backgroundImage = useMemo(() => {
    const isWoman = Math.random() > 0.5;
    return toAbsoluteUrl(
      isWoman ? '/media/images/new/panel-woman.png' : '/media/images/new/panel-men.png'
    );
  }, []);

  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000); // texto aparece 1s depois da imagem

    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      <style>
        {`
          .branded-bg {
            background-image: url('${backgroundImage}');
            background-position: bottom;
          }

          @media (min-width: 1024px) {
            .branded-bg {
              background-size: contain;
              background-repeat: no-repeat;
            }
          }

          @media (max-width: 1023px) {
            .branded-bg {
              background-size: cover;
              background-repeat: no-repeat;
              background-position: top;
            }
          }
        `}
      </style>

      <div className="grid lg:grid-cols-2 grow">
        <div className="flex justify-center items-center p-8 lg:p-10 order-2 lg:order-1">
          <Outlet />
        </div>

        {/* Imagem de fundo com fade */}
        <motion.div
          className="relative order-1 pb-60 lg:order-2 overflow-hidden lg:rounded-xl lg:border lg:border-gray-200 lg:m-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="branded-bg absolute inset-0 z-0" />

          {/* Texto com animação, visível só em telas grandes */}
          {showText && (
            <motion.div
              className="hidden lg:flex relative z-10 w-full flex-col p-8 gap-4 backdrop-blur-sm bg-white/40 rounded-xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Link to="/">
                <img
                  src={toAbsoluteUrl('/media/images/new/logo.png')}
                  className="h-[28px] max-w-none"
                  alt="Logo Novak"
                />
              </Link>

              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-gray-900">Novak Portal</h3>
                <div className="text-base font-medium text-gray-600">
                  Plataforma para gestão e controle de contas de anúncios.
                  <br />
                  Garanta acesso <span className="text-gray-900 font-semibold">seguro</span> e{' '}
                  <span className="text-gray-900 font-semibold">eficiente</span> ao painel de
                  administração <span className="text-primary font-semibold">Novak</span>.
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Fragment>
  );
};

const AuthBrandedLayout = () => (
  <AuthBrandedLayoutProvider>
    <Layout />
  </AuthBrandedLayoutProvider>
);

export { AuthBrandedLayout };
