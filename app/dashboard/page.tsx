
"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Header,
  Avatar
} from "@hdfclife-insurance/one-x-ui";
import { Bell, Gear } from "@phosphor-icons/react";
import ClientOnboarding from "@/components/ClientOnboarding";
import ClientListing from "@/components/ClientListing";

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

// Custom CollapsibleSidebar Component (replacing the OneX UI version)
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

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header className="py-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Image src="/menu.svg" alt="menu" width={30} height={30} priority />
            <Image src="/logo.svg" alt="Company Logo" width={120} height={40} priority />
          </div>

          {/* Right Side */}
          <div className="flex gap-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right ">
                <span className="font-poppins font-medium text-xs leading-5">
                  Sanjoy Guru
                </span>
                <span className="font-poppins font-normal text-[10px] leading-4">
                  Key Account Manager
                </span>
                <span className="font-poppins font-normal text-[8px] leading-4">
                  Last login : 03/09/2024 12:21 pm
                </span>
              </div>
              <Avatar withRing />
            </div>
            <Image src="/power.svg" alt="logout" width={24} height={24} priority />
          </div>
        </div>
      </Header>

      {/* Sidebar + Content */}
      <div className="flex flex-1 h-full">
        {/* Sidebar */}
        <div className="w-[240px]">
          <CollapsibleSidebar
            className="h-full"
            items={[
              {
                title: "Dashboard",
                color: "primary",
                leftSection: (
                  <Image src="/home.svg" alt="home" width={18} height={18} priority />
                ),
                links: [
                  {
                    href: "#",
                    label: "Home",
                    leftSection: <Bell />,
                    onClick: () => setActivePage("dashboard"),
                  },
                ],
              },
              {
                title: "Partners",
                color: "primary",
                leftSection: (
                  <Image src="/handshake.svg" alt="partners" width={18} height={18} priority />
                ),
                links: [
                  {
                    href: "#",
                    label: "Partner Onboarding",
                    leftSection: <Bell />,
                    onClick: () => setActivePage("clientOnboarding"),
                  },
                  {
                    href: "#",
                    label: "Partner Listing",
                    leftSection: <Bell />,
                    onClick: () => setActivePage("clientListing"),
                  },
                ],
              },
              {
                title: "Settings",
                color: "gray",
                leftSection: <Gear />,
                links: [
                  {
                    href: "#",
                    label: "Notifications",
                    leftSection: <Bell />,
                  },
                ],
              },
            ]}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activePage === "dashboard" && (
            <>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p>Welcome to your dashboard page 🚀</p>
            </>
          )}
          {activePage === "clientOnboarding" && <ClientOnboarding />}
          {activePage === "clientListing" && <ClientListing /> }
        </main>
      </div>
    </div>
  );
}