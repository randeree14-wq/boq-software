"use client";

import { ReactNode } from "react";
import TopNav from "./TopNav";

interface AppShellProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pageStyle: React.CSSProperties;
  tabBarStyle: React.CSSProperties;
  tabButtonStyle: (isActive: boolean) => React.CSSProperties;
  headerContent?: ReactNode;
}

export default function AppShell({
  children,
  activeTab,
  setActiveTab,
  pageStyle,
  tabBarStyle,
  tabButtonStyle,
  headerContent,
}: AppShellProps) {
  return (
    <main style={pageStyle}>
      {headerContent}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        styles={{ tabBarStyle, tabButtonStyle }}
      />
      <div style={{ marginTop: "20px" }}>{children}</div>
    </main>
  );
}