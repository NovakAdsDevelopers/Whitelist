import { toAbsoluteUrl } from '@/utils/Assets';
import { useNavigate } from 'react-router';

interface IChannelStatsItem {
  logo: string;
  logoDark?: string;
  info: string;
  desc: string;
  path: string;
}
interface IChannelStatsItems extends Array<IChannelStatsItem> {}

const ChannelStats = () => {
  const navigate = useNavigate();

const items: IChannelStatsItems = [
  { logo: 'facebook.svg', info: '24k', desc: 'Lessons Views', path: '/painel/integracoes/facebook' },
  { logo: 'instagram-03.svg', info: '608', desc: 'New subscribers', path: '/painel/integracoes/instagram' },
  {
    logo: 'tiktok.svg',
    logoDark: 'tiktok-dark.svg',
    info: '2.5k',
    desc: 'Stream audience',
    path: '/painel/integracoes/tiktok'
  }
];


  const renderItem = (item: IChannelStatsItem, index: number) => (
    <div
      key={index}
      onClick={() => navigate(item.path)}
      className="card cursor-pointer flex-row justify-between items-center gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg"
    >
      {item.logoDark ? (
        <>
          <img
            src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
            className="dark:hidden w-[150px] my-4 ms-5"
            alt=""
          />
          <img
            src={toAbsoluteUrl(`/media/brand-logos/${item.logoDark}`)}
            className="light:hidden w-[150px] my-4 ms-5"
            alt=""
          />
        </>
      ) : (
        <img
          src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
          className="w-[150px] my-4 ms-5"
          alt=""
        />
      )}

      <div className="flex flex-col gap-1 pb-4 px-5">
        <span className="text-3xl font-semibold text-gray-900">{item.info}</span>
        <span className="text-2sm font-normal text-gray-700">{item.desc}</span>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>

      {items.map(renderItem)}
    </>
  );
};

export { ChannelStats, type IChannelStatsItem, type IChannelStatsItems };
