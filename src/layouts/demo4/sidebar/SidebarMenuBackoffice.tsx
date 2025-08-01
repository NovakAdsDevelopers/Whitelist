import { KeenIcon } from '@/components/keenicons';
import {
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuTitle
} from '@/components/menu';

interface IMenuItem {
  title: string;
  path?: string;
  active?: boolean;
  children?: IMenuItem[];
}

const SidebarMenuBackoffice = () => {
  const menuItems: IMenuItem[] = [
    {
      title: 'Backoffice',
      children: [
        {
          title: 'Overview',
          path: '/backoffice',
          active: true
        }
      ]
    }
  ];

  const buildMenu = () => {
    return (
      <Menu highlight className="flex-col gap-5">
        {menuItems.map((section, index) => (
          <div className="flex flex-col gap-px" key={index}>
            <MenuItem>
              <div className="px-2.5 text-xs font-medium text-gray-600 mb-1 uppercase">
                {section.title}
              </div>
            </MenuItem>
            {section.children?.map((item, childIndex) => (
              <MenuItem key={childIndex} className={item.active ? 'active' : ''}>
                <MenuLink
                  path={item.path || '#'}
                  className="py-2 px-2.5 rounded-md border border-transparent menu-item-active:border-gray-200 menu-item-active:bg-light menu-link-hover:bg-light menu-link-hover:border-gray-200"
                >
                  <MenuIcon>
                    <KeenIcon icon="menu" /> {/* Defina o ícone desejado aqui */}
                  </MenuIcon>
                  <MenuTitle className="text-2sm text-gray-800 menu-item-active:font-medium menu-item-active:text-primary menu-link-hover:text-primary">
                    {item.title}
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    );
  };

  return <div className="flex flex-col gap-7.5 px-2">{buildMenu()}</div>;
};

export { SidebarMenuBackoffice };
