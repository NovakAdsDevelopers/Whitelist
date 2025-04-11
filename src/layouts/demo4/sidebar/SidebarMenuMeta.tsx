import { KeenIcon } from '@/components/keenicons';
import {
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components/menu';
import { useLanguage } from '@/i18n';

interface IDropdownItem {
  title: string;
  path: string;
  icon: string;
  active?: boolean;
}

interface IMenuItem {
  title: string;
  path?: string;
  active?: boolean;
  children?: IMenuItem[];
}

const SidebarMenuMeta = () => {
  const menuItems: IMenuItem[] = [
    {
      title: 'Meta',
      children: [
        {
          title: 'Dashboard',
          path: '/meta/dashboard',
          active: false
        },
        {
          title: 'Clientes',
          path: '/meta/clientes',
          active: false
        },
        {
          title: 'Contas de Anuncio',
          path: '/meta/contas-anuncio',
          active: false
        },
        {
          title: 'Atualização de Gastos',
          path: '/meta/gastos',
          active: false
        }
      ]
    }
    // {
    //   title: 'SECURITY',
    //   children: [
    //     {
    //       title: 'Data Encryption',
    //       path: '/account/billing/enterprise'
    //     },
    //     {
    //       title: 'Text',
    //       path: '/account/security/overview'
    //     },
    //     {
    //       title: 'Access Control',
    //       path: '/account/security/privacy-settings'
    //     },
    //     {
    //       title: 'Incident Response',
    //       path: '/account/security/current-sessions'
    //     }
    //   ]
    // },
    // {
    //   title: 'ANALYTICS',
    //   children: [
    //     {
    //       title: 'Fetching Data',
    //       path: '/account/members/team-info'
    //     },
    //     {
    //       title: 'Custom Reports',
    //       path: '/account/home/user-profile'
    //     },
    //     {
    //       title: 'Real Time Analytics',
    //       path: '/account/home/settings-enterprise'
    //     },
    //     {
    //       title: 'Exportin Data',
    //       path: '/account/members/import-members'
    //     },
    //     {
    //       title: 'Dashboard Integration',
    //       path: '/account/members/team-info'
    //     }
    //   ]
    // }
  ];

  const buildMenu = () => {
    return (
      <Menu highlight={true} className="flex-col gap-5">
        {menuItems.map((heading, index) => {
          return (
            <div className="flex flex-col gap-px" key={index}>
              <MenuItem>
                <div className="px-2.5 text-xs font-medium text-gray-600 mb-1 uppercase">
                  {heading.title}
                </div>
              </MenuItem>
              {heading.children?.map((item, index) => {
                return (
                  <MenuItem key={index} className={item.active ? 'active' : ''}>
                    <MenuLink
                      path={item.path}
                      className="py-2 px-2.5 rounded-md border border-transparent menu-item-active:border-gray-200 menu-item-active:bg-light menu-link-hover:bg-light menu-link-hover:border-gray-200 "
                    >
                      <MenuIcon>
                        <KeenIcon icon="" />
                      </MenuIcon>
                      <MenuTitle className="text-2sm text-gray-800 menu-item-active:font-medium menu-item-active:text-primary menu-link-hover:text-primary">
                        {item.title}
                      </MenuTitle>
                    </MenuLink>
                  </MenuItem>
                );
              })}
            </div>
          );
        })}
      </Menu>
    );
  };

  return <div className="flex flex-col gap-7.5 px-2">{buildMenu()}</div>;
};

export { SidebarMenuMeta };
