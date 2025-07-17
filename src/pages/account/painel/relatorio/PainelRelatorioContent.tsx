import { Options, IOptionsItems } from '../../home/get-started';

const DashoboardMetaContent = () => {
  const items: IOptionsItems = [
    {
      icon: 'subtitle',
      title: 'Overview',
      desc: 'A Broad Perspective on Our Comprehensive Security Features and Policies.',
      path: '/account/security/overview'
    },
    {
      icon: 'icon',
      title: 'Allowed IP Addresses',
      desc: 'Specify and Restrict Access Through Authorized IP Address Filtering.',
      path: '/account/security/allowed-ip-addresses'
    },
    {
      icon: 'setting',
      title: 'Privacy Settings',
      desc: 'Customize Your Privacy with User-Controlled Settings and Preferences.',
      path: '/account/security/privacy-settings'
    },
    {
      icon: 'desktop-mobile',
      title: 'Trusted Devices',
      desc: 'Identify and Authorize Devices for Enhanced Account Security.',
      path: '/account/security/device-management'
    }
  ];

  return (
    <>
      <Options items={items} dropdown={false} />
    </>
  );
};

export { DashoboardMetaContent };
