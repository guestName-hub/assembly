'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import Image from 'next/image';
interface AssemblyMember {
  deptCd: string;
  empNm: string;
  engNm: string;
  hjNm: string;
  jpgLink: string;
  origNm: string;
  reeleGbnNm: string;
  imgType?: string;
}

interface TabMenuProps {
  initialData: AssemblyMember[];
}

const MemberCard = ({ member }: { member: AssemblyMember }) => (
  <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow bg-white">
    <div className="flex flex-row items-center gap-4">
      <Image src={`./assembly/${member.deptCd}.${member.imgType || 'jpg'}`} alt={member.empNm} width={100} height={100} />
      <div className="flex flex-col">
        <p className="font-medium text-lg">{member.empNm}</p>
        <p className="text-gray-600">{member.origNm}</p>
        <p className="text-gray-500">{member.reeleGbnNm}</p>
      </div>
    </div>
  </div>
);

export default function TabMenu({ initialData }: TabMenuProps) {
  const [selectedRegion, setSelectedRegion] = useState(0);

  // 제외할 의원 목록
  const excludedMembers = ['김예지', '안철수', '김상욱'];
  
  // 제외 의원을 필터링한 데이터
  const filteredInitialData = initialData.filter(member => !excludedMembers.includes(member.empNm));

  // 지역 목록 생성 (전체 + 고유 지역 + 비례대표)
  const regions = ['전체', ...new Set(
    filteredInitialData
      .map(member => {
        if (member.origNm === '비례대표') {
          return '비례대표';
        }
        return member.origNm ? member.origNm.split(' ')[0] : '';
      })
      .filter(Boolean)
  )].filter(region => region !== '비례대표');
  regions.push('비례대표');

  // 선택된 지역에 따라 데이터 필터링
  const getFilteredData = (region: string) => {
    if (region === '전체') return filteredInitialData;
    if (region === '비례대표') return filteredInitialData.filter(member => member.origNm === '비례대표');
    return filteredInitialData.filter(member => member.origNm?.startsWith(region));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">국회의원 지역별 조회</h1>
        
        <Tab.Group selectedIndex={selectedRegion} onChange={setSelectedRegion}>
          <Tab.List className="flex flex-wrap space-x-2 rounded-xl bg-white p-1 shadow">
            {regions.map((region) => (
              <Tab
                key={region}
                className={({ selected }) =>
                  `rounded-lg py-2.5 text-sm font-medium leading-5 px-4
                  ${selected
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {region === '전체' 
                  ? `전체 (${filteredInitialData.length})`
                  : `${region} (${getFilteredData(region).length})`
                }
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {regions.map((region, idx) => (
              <Tab.Panel
                key={idx}
                className="rounded-xl bg-white/50 p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredData(region).map((member, index) => (
                    <MemberCard key={index} member={member} />
                  ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
