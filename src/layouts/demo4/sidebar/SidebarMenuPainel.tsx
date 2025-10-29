import { useAuthContext } from '@/auth';
import { KeenIcon } from '@/components/keenicons';
import {
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuTitle
} from '@/components/menu';
import { useLanguage } from '@/i18n';

interface IMenuItem {
  title: string;
  path?: string;
  active?: boolean;
  children?: IMenuItem[];
}

const SidebarMenuPainel = () => {
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.tipo === 'ADMIN';

  const menuItems: IMenuItem[] = [
    {
      title: 'Paineis',
      children: [
        {
          title: 'Relatórios',
          path: '/painel/relatorios'
        },
        // 🔒 Só admins veem este item
        ...(isAdmin
          ? [
              {
                title: 'Integrações',
                path: '/painel/integracoes'
              }
            ]
          : []),
        {
          title: 'Solicitações',
          path: '/painel/solicitacoes'
        },
        {
          title: 'Status de Contas',
          path: '/painel/status-contas'
        },
        {
          title: 'Gestão de Contas',
          path: '/painel/gestao-contas'
        },
        {
          title: 'Resumo de Contas',
          path: '/painel/resumo-contas'
        },
        {
          title: 'Extrato Financeiro',
          path: '/painel/extrato-financeiro'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-7.5 px-2">
      <Menu highlight={true} className="flex-col gap-5">
        {menuItems.map((heading, index) => (
          <div className="flex flex-col gap-px" key={index}>
            <MenuItem>
              <div className="px-2.5 text-xs font-medium text-gray-600 mb-1 uppercase">
                {heading.title}
              </div>
            </MenuItem>
            {heading.children?.map((item, subIndex) => (
              <MenuItem key={subIndex} className={item.active ? 'active' : ''}>
                <MenuLink
                  path={item.path}
                  className="py-2 px-2.5 rounded-md border border-transparent menu-item-active:border-gray-200 menu-item-active:bg-light menu-link-hover:bg-light menu-link-hover:border-gray-200"
                >
                  <MenuIcon>
                    <KeenIcon icon="" />
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
    </div>
  );
};

export { SidebarMenuPainel };
