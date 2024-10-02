"use client";
import { useState } from "react";
import SideNav from "./_components/SideNav";
import Header from "./_components/Header";

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
    <div className="bg-slate-100 h-screen poppins">
      <div className="md:w-64 fixed">
        <SideNav isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div>
        <Header toggleSidebar={toggleSidebar} />
        {children}
      </div>
    </div>
  );
}

export default Layout;
