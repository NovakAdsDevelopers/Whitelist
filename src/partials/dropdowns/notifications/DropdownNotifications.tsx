import { useLanguage } from '@/i18n';
import { KeenIcon } from '@/components';
import { Menu, MenuItem, MenuSub, MenuToggle } from '@/components/menu';
import { Tab, TabPanel, Tabs, TabsList } from '@/components/tabs';
import { DropdownCrud2 } from '@/partials/dropdowns/general';
import { DropdownNotificationsAll } from './DropdownNotificationsAll';
import { DropdownNotificationsInbox } from './DropdownNotificationsInbox';
import { DropdownNotificationsTeam } from './DropdownNotificationsTeam';
import { DropdownNotificationsFollowing } from './DropdownNotificationsFollowing';

interface IDropdownNotificationProps {
  menuTtemRef: any;
}

const DropdownNotifications = ({ menuTtemRef }: IDropdownNotificationProps) => {
  const { isRTL } = useLanguage();

  const handleClose = () => {
    if (menuTtemRef.current) {
      menuTtemRef.current.hide(); // Call the closeMenu method to hide the submenu
    }
  };

  const buildHeader = () => {
    return (
      <div className="flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5 border-b border-b-gray-200">
        Notificações
        <button className="btn btn-sm btn-icon btn-light btn-clear shrink-0" onClick={handleClose}>
          <KeenIcon icon="cross" />
        </button>
      </div>
    );
  };

  const buildTabs = () => {
    return (
      <Tabs defaultValue={1} className="">
        <TabsList className="justify-between px-5 mb-2">
          <div className="flex items-center gap-5">
            <Tab value={1}>Todas</Tab>
            <Tab value={2} className="relative">
              Caixa de entrada
              <span className="badge badge-dot badge-success size-[5px] absolute top-2 rtl:start-0 end-0 transform translate-y-1/2 translate-x-full"></span>
            </Tab>
          </div>
        </TabsList>
        <TabPanel value={1}>
          <DropdownNotificationsAll />
        </TabPanel>
        <TabPanel value={2}>
          <DropdownNotificationsInbox />
        </TabPanel>
      </Tabs>
    );
  };

  return (
    <MenuSub rootClassName="w-full max-w-[460px]" className="light:border-gray-300">
      {buildHeader()}
      {buildTabs()}
    </MenuSub>
  );
};

export { DropdownNotifications };
