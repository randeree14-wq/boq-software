"use client";

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  styles: {
    tabBarStyle: React.CSSProperties;
    tabButtonStyle: (isActive: boolean) => React.CSSProperties;
  };
}

export default function TopNav({ activeTab, setActiveTab, styles }: TopNavProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "measurement", label: "Elemental Measurement" },
    { id: "boq", label: "Detailed BOQ" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Project Settings" },
  ];

  const { tabBarStyle, tabButtonStyle } = styles;

  return (
    <div style={tabBarStyle}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={tabButtonStyle(activeTab === tab.id)}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}