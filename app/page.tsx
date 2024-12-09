import TabMenu from './components/TabMenu';

export default async function Home() {
  const membersData = await import('../app/data/member.json');
  
  return (
    <main>
      <TabMenu 
        initialData={membersData.default} 
      />
    </main>
  );
}

export const dynamic = 'force-static';