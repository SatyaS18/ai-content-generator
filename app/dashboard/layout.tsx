import { useState } from "react";
import SideNav from "./_components/SideNav";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalUsage, setTotalUsage] = useState<number>(0);
  const [userSubscription, setUserSubscription] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div>
      <div>
        <SideNav isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      {children}
    </div>
  );
}

export default Layout;
