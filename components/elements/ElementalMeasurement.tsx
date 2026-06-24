"use client";

import { elementalStructure } from "@/lib/elementalStructure";
import ElementSection from "./ElementSection";
import ComingSoon from "./ComingSoon";

// Import all module components
import BeamModule from "@/components/modules/BeamModule";
import SurfaceBedModule from "@/components/modules/SurfaceBedModule";
import PadFootingModule from "@/components/modules/PadFootingModule";
import GroundBeamModule from "@/components/modules/GroundBeamModule";
import ColumnModule from "@/components/modules/ColumnModule";
import WallModule from "@/components/modules/WallModule";
import SlabModule from "@/components/modules/SlabModule";
import OpeningsModule from "@/components/modules/OpeningsModule";

interface ElementalMeasurementProps {
  // All module props – we'll pass them through
  beamTypes: any;
  setBeamTypes: any;
  // ... etc – we'll pass all props from page.tsx
  styles: any;
  // We'll use a generic approach: pass all module props via a spread
  moduleProps: any;
}

export default function ElementalMeasurement({ styles, moduleProps }: ElementalMeasurementProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles;
  const stylesObj = { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle };

  // Helper to render a section's elements
  const renderElement = (element: any) => {
    switch (element.id) {
      case "substructure":
        return (
          <div>
            <PadFootingModule {...moduleProps.padFooting} styles={stylesObj} />
            <GroundBeamModule {...moduleProps.groundBeam} styles={stylesObj} />
          </div>
        );
      case "ground-floor":
        return <SurfaceBedModule {...moduleProps.surfaceBed} styles={stylesObj} />;
      case "structural-frame":
        return (
          <div>
            <ColumnModule {...moduleProps.column} styles={stylesObj} />
            <BeamModule {...moduleProps.beam} styles={stylesObj} />
            <SlabModule {...moduleProps.slab} styles={stylesObj} />
          </div>
        );
      case "internal-divisions":
        return (
          <div>
            <WallModule {...moduleProps.wall} styles={stylesObj} />
            <OpeningsModule {...moduleProps.openings} styles={stylesObj} />
          </div>
        );
      default:
        return <ComingSoon elementName={element.name} cardStyle={cardStyle} />;
    }
  };

  return (
    <div>
      <h2>Elemental Measurement</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Measure quantities by building element. The system will automatically generate the detailed trade-based BOQ.
      </p>

      {elementalStructure.map((section) => (
        <div key={section.id} style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 16px 0", color: "#0066cc" }}>
            {section.name}
          </h2>
          {section.elements.map((element) => (
            <ElementSection key={element.id} element={element} cardStyle={cardStyle}>
              {renderElement(element)}
            </ElementSection>
          ))}
        </div>
      ))}
    </div>
  );
}