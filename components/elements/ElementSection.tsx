"use client";

import type { ElementalElement } from "@/types/elemental";
import ComingSoon from "./ComingSoon";

interface ElementSectionProps {
  element: ElementalElement;
  children?: React.ReactNode;
  cardStyle: React.CSSProperties;
}

export default function ElementSection({ element, children, cardStyle }: ElementSectionProps) {
  if (element.status === "coming-soon") {
    return <ComingSoon elementName={element.name} cardStyle={cardStyle} />;
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>{element.name}</h2>
      {element.description && <p style={{ color: "#666", margin: "0 0 16px 0", fontSize: "14px" }}>{element.description}</p>}
      <div>{children}</div>
    </div>
  );
}