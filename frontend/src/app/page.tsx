import { CgeData } from '@/lib/types';
import { getCgeData } from '@/lib/api';
import { DashboardContent } from '@/components/DashboardContent';

export default async function Home() {
  const data: CgeData = await getCgeData();

  return <DashboardContent initialData={data} />;
}
