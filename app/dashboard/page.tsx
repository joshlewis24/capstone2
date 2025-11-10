"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Header,
  Avatar
} from "@hdfclife-insurance/one-x-ui";
import { Bell, Gear } from "@phosphor-icons/react";
import ClientOnboarding from "@/components/ClientOnboarding";
import ClientListing from "@/components/ClientListing";
import RightSidePanel from "@/components/RightSidePanel";
import Config from "@/components/config";
import DisplayLoader from "@/components/DisplayLoader";

const metadata = {
  title: "Dashboard - Partner Management",
  description: "Dashboard page for managing partners, configurations, and data.",
};
 
// TypeScript interfaces
interface SidebarLink {
  href: string;
  label: string;
  leftSection?: React.ReactNode;
  onClick?: () => void;
}
 
interface SidebarSection {
  title: string;
  color?: string;
  leftSection?: React.ReactNode;
  links: SidebarLink[];
}
 
interface CollapsibleSidebarProps {
  items: SidebarSection[];
  className?: string;
}
 
interface SidebarItemProps {
  item: SidebarSection;
}
 
// Custom chevron icons
const ChevronDown: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);
 
const ChevronRight: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);
 
// Custom Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
 
  const handleSectionClick = (): void => {
    setIsExpanded(!isExpanded);
  };
 
  const handleLinkClick = (link: SidebarLink, e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    if (link.onClick) {
      link.onClick();
    }
  };
 
  return (
    <div className="mb-2">
      {/* Section Header */}
      <div
        className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
        onClick={handleSectionClick}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 text-gray-600">
            {item.leftSection}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {item.title}
          </span>
        </div>
        <div className="w-4 h-4 text-gray-400">
          {isExpanded ? <ChevronDown /> : <ChevronRight />}
        </div>
      </div>
 
      {/* Links */}
      {isExpanded && item.links && (
        <div className="ml-8 space-y-1">
          {item.links.map((link, index) => (
            <a
              key={index}
              href={link.href || "#"}
              onClick={(e) => handleLinkClick(link, e)}
              className="flex items-center gap-3 p-2 hover:bg-blue-50 hover:text-blue-600 rounded-md text-sm text-gray-600 cursor-pointer transition-colors"
            >
              <div className="w-4 h-4">
                {link.leftSection}
              </div>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
 
// Custom CollapsibleSidebar Component
const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ items, className = "" }) => (
  <div className={`bg-white border-r border-gray-200 ${className}`}>
    <div className="p-4">
      {items.map((item, index) => (
        <SidebarItem
          key={index}
          item={item}
        />
      ))}
    </div>
  </div>
);
 
export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false); // mobile right panel
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);

  // Gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const x = e.touches[0].clientX;
    // Start tracking only if: opening gesture near right edge OR closing gesture starts inside panel
    if (!rightPanelOpen && x > window.innerWidth - 40) {
      touchStartXRef.current = x;
    } else if (rightPanelOpen && x < window.innerWidth && x > window.innerWidth - 350) {
      touchStartXRef.current = x; // allow closing swipe from inside panel
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current == null) return;
    touchCurrentXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartXRef.current == null || touchCurrentXRef.current == null) {
      touchStartXRef.current = null;
      touchCurrentXRef.current = null;
      return;
    }
    const delta = touchCurrentXRef.current - touchStartXRef.current; // negative = swipe left
    const absDelta = Math.abs(delta);
    if (!rightPanelOpen && delta < -50) {
      // swipe left from right edge opens
      setRightPanelOpen(true);
    } else if (rightPanelOpen && delta > 60) {
      // swipe right closes
      setRightPanelOpen(false);
    }
    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
  };

  // Hover edge (desktop) to open panel
  const HoverEdge = () => (
    <div
      onMouseEnter={() => setRightPanelOpen(true)}
      className="hidden xl:block fixed top-0 right-0 h-full w-2 z-30 cursor-ew-resize"
      aria-hidden="true"
    />
  );

  // Load saved active page from localStorage
  useEffect(() => {
    const savedPage = localStorage.getItem("activePage");
    if (savedPage) {
      setActivePage(savedPage);
    }
  }, []);
 
  // Save active page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);
 
  return (
    <div
      className="flex flex-col h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <HoverEdge />
      {/* Header */}
      <Header className="py-4 px-4 lg:px-6 border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="flex justify-between items-center w-full">
          {/* Logo + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Image src="/menu.svg" alt="menu" width={24} height={24} priority />
            </button>
            <Image src="/logo.svg" alt="Company Logo" width={110} height={36} priority className="hidden sm:block" />
          </div>
          {/* Right Side */}
          <div className="flex gap-4 sm:gap-6 items-center">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-poppins font-medium text-xs leading-5">Arjun Khadikar</span>
              <span className="font-poppins font-normal text-[10px] leading-4">GET</span>
              <span className="font-poppins font-normal text-[8px] leading-4">Last login : 03/09/2024 12:21 pm</span>
            </div>
            <Avatar withRing />
            <Image src="/power.svg" alt="logout" width={22} height={22} priority className="cursor-pointer" />
          </div>
        </div>
      </Header>
      {/* Sidebar + Content */}
      <div className="flex flex-1 h-full relative overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-72 max-w-[80%] h-full bg-white shadow-xl border-r border-gray-200 animate-slide-in-left overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-sm font-medium text-gray-700">Navigation</span>
                <button
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <CollapsibleSidebar
                className="h-[calc(100%-56px)]"
                items={[
                  {
                    title: "Dashboard",
                    color: "primary",
                    leftSection: <Image src="/home.svg" alt="home" width={18} height={18} priority />,
                    links: [
                      { href: "#", label: "Home", leftSection: <Bell />, onClick: () => { setActivePage("dashboard"); setMobileSidebarOpen(false); } },
                    ],
                  },
                  {
                    title: "Partners",
                    color: "primary",
                    leftSection: <Image src="/handshake.svg" alt="partners" width={18} height={18} priority />,
                    links: [
                      { href: "#", label: "Partner Onboarding", leftSection: <Image src="/contact.svg" alt="home" width={18} height={18} priority />, onClick: () => { setActivePage("clientOnboarding"); setMobileSidebarOpen(false); } },
                      { href: "#", label: "Partner Listing", leftSection: <Image src="/list.svg" alt="home" width={18} height={18} priority />, onClick: () => { setActivePage("clientListing"); setMobileSidebarOpen(false); } },
                      { href: "#", label: "Config Loader", leftSection: <Image src="/excel.svg" alt="home" width={18} height={18} priority />, onClick: () => { setActivePage("config"); setMobileSidebarOpen(false); } },
                      { href: "#", label: "Transformed Data", leftSection: <Image src="/excel.svg" alt="home" width={18} height={18} priority />, onClick: () => { setActivePage("DisplayTransformedData"); setMobileSidebarOpen(false); } },
                    ],
                  },
                  {
                    title: "Settings",
                    color: "gray",
                    leftSection: <Gear />,
                    links: [
                      { href: "#", label: "Notifications", leftSection: <Bell /> },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        )}
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[240px] border-r border-gray-200 bg-white">
          <CollapsibleSidebar
            className="h-full"
            items={[
              {
                title: "Dashboard",
                color: "primary",
                leftSection: <Image src="/home.svg" alt="home" width={18} height={18} priority />,
                links: [
                  { href: "#", label: "Home", leftSection: <Bell />, onClick: () => setActivePage("dashboard") },
                ],
              },
              {
                title: "Partners",
                color: "primary",
                leftSection: <Image src="/handshake.svg" alt="partners" width={18} height={18} priority />,
                links: [
                  { href: "#", label: "Partner Onboarding", leftSection: <Image src="/contact.svg" alt="home" width={18} height={18} priority />, onClick: () => setActivePage("clientOnboarding") },
                  { href: "#", label: "Partner Listing", leftSection: <Image src="/list.svg" alt="home" width={18} height={18} priority />, onClick: () => setActivePage("clientListing") },
                  { href: "#", label: "Config Loader", leftSection: <Image src="/excel.svg" alt="home" width={18} height={18} priority />, onClick: () => setActivePage("config") },
                  { href: "#", label: "Transformed Data", leftSection: <Image src="/excel.svg" alt="home" width={18} height={18} priority />, onClick: () => setActivePage("DisplayTransformedData") },
                ],
              },
              {
                title: "Settings",
                color: "gray",
                leftSection: <Gear />,
                links: [
                  { href: "#", label: "Notifications", leftSection: <Bell /> },
                ],
              },
            ]}
          />
        </div>
        {/* Main Content + Right Panel */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {activePage === "dashboard" && (
              <>
                <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
                <p className="text-sm sm:text-base">Welcome to your dashboard page 🚀</p>
              </>
            )}
            {activePage === "clientOnboarding" && <ClientOnboarding />}
            {activePage === "clientListing" && <ClientListing />}
            {activePage === "config" && <Config />}
            {activePage === "DisplayTransformedData" && <DisplayLoader />}
          </main>
          {/* Desktop Right Panel */}
          <div className="hidden xl:block border-l border-gray-200 bg-white"><RightSidePanel notificationsCount={3} /></div>
        </div>
      </div>
      {/* Mobile Right Panel Overlay */}
      {rightPanelOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setRightPanelOpen(false)}
            aria-hidden="true"
          />
          <div className="relative h-full w-[85%] max-w-sm bg-white shadow-2xl border-l border-gray-200 animate-slide-in-right flex">
            <RightSidePanel notificationsCount={3} />
            <button
              className="absolute top-2 left-2 h-8 w-8 rounded-md flex items-center justify-center bg-white/70 backdrop-blur hover:bg-white shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setRightPanelOpen(false)}
              aria-label="Close panel"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}
      {/* Mobile Bottom Bar for quick access */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around py-2 z-40 text-xs">
        <button className={`flex flex-col items-center gap-0.5 ${activePage==='dashboard'?'text-indigo-600':'text-gray-500'}`} onClick={()=>setActivePage('dashboard')}>🏠<span>Home</span></button>
        <button className={`flex flex-col items-center gap-0.5 ${activePage==='clientListing'?'text-indigo-600':'text-gray-500'}`} onClick={()=>setActivePage('clientListing')}>📄<span>Partners</span></button>
        <button className={`flex flex-col items-center gap-0.5 ${activePage==='config'?'text-indigo-600':'text-gray-500'}`} onClick={()=>setActivePage('config')}>⚙️<span>Config</span></button>
        <button className={`flex flex-col items-center gap-0.5 ${activePage==='DisplayTransformedData'?'text-indigo-600':'text-gray-500'}`} onClick={()=>setActivePage('DisplayTransformedData')}>🗂️<span>Data</span></button>
        <button className={`flex flex-col items-center gap-0.5 ${rightPanelOpen?'text-indigo-600':'text-gray-500'}`} onClick={()=>setRightPanelOpen(o=>!o)}>🔔<span>Panel</span></button>
      </div>
    </div>
  );
}