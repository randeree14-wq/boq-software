"use client";

interface ComingSoonProps {
  elementName: string;
  cardStyle: React.CSSProperties;
}

export default function ComingSoon({ elementName, cardStyle }: ComingSoonProps) {
  return (
    <div style={cardStyle}>
      <h3 style={{ margin: "0 0 8px 0" }}>{elementName}</h3>
      <p style={{ color: "#999", margin: "0" }}>Coming soon – this element will be available in a future update.</p>
    </div>
  );
}