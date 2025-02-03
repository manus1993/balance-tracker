import { useEffect, useRef } from 'react';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
import useSettings from '../../Hooks/useSettings';

export const DASHBOARD_ID = 'a798f125-ff32-4e0c-b4bb-4f02f97fc4aa';
export const CHARTS_BASE_URL = 'https://charts.mongodb.com/charts-project-0-ctspf/';

type PlainObject = { [key: string]: any };

export function MongoChart() {
  const { account } = useSettings();
  const chartContainer = useRef<HTMLDivElement>(null);
  const sdk = new ChartsEmbedSDK({
    baseUrl: CHARTS_BASE_URL,
  });
  const filter: PlainObject = { group: account };
  useEffect(() => {
    const chart = sdk.createDashboard({
      dashboardId: DASHBOARD_ID,
      heightMode: 'fixed',
      height: '1000px',
      widthMode: 'scale',
      theme: 'light',
      filter,
    });

    if (chartContainer.current) {
      chart.render(chartContainer.current).catch((err: any) => console.error('Error rendering chart:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  return <div ref={chartContainer} style={{ height: '1000px', width: '100%' }} />;
}
