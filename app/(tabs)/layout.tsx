import TabBar from "@/components/tab-bar";

// tabs 폴더 안에 파일들만 영향을 받음
export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <TabBar />
    </div>
  );
}
