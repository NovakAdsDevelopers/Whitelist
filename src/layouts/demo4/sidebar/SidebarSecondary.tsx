import { useViewport } from '@/hooks';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { SidebarMenuDefault } from '.';
import { SidebarMenuMeta } from './SidebarMenuMeta';
import { SidebarMenuDashboard } from './SidebarMenuDashboard'; // Comentado pois não será mais usado
import { SidebarMenuPainel } from './SidebarMenuPainel';
import { SidebarMenuBackoffice } from './SidebarMenuBackoffice';
import { useAuthContext } from '@/auth';

const SidebarSecondary = () => {
  const { pathname } = useLocation();
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.tipo === 'ADMIN';
  const [viewportHeight] = useViewport();
  const offset = 0;
  const [scrollableHeight, setScrollableHeight] = useState<number>(0);

  useEffect(() => {
    const availableHeight = viewportHeight - offset;
    setScrollableHeight(availableHeight);
  }, [viewportHeight]);

  return (
    <div className="flex items-stretch grow shrink-0 justify-center ps-1.5 my-5 me-1.5">
      <div
        className="scrollable-y-auto grow"
        style={{
          ...(scrollableHeight > 0 && { height: `${scrollableHeight}px` })
        }}
      >
        {pathname === '/' ? ( <SidebarMenuMeta /> ) : 
        pathname.startsWith('/meta/') ? (<SidebarMenuMeta /> ) :
         pathname === '/dashboard' ? (<SidebarMenuDashboard />) : 
         pathname === '/painel' || pathname.startsWith('/painel/') || currentUser?.tipo === 'ADMIN' ? ( <SidebarMenuPainel /> ) : 
         pathname === '/backoffice' || pathname.startsWith('/backoffice/') || currentUser?.tipo === 'ADMIN' ? ( <SidebarMenuBackoffice /> ) : 
         (<SidebarMenuDefault /> )}
      </div>
    </div>
  );
};

export { SidebarSecondary };
