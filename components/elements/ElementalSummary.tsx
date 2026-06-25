"use client";

import type { BoqItem } from "@/types/boq";
import { elementalStructure, getElementById } from "@/lib/elementalStructure";

interface ElementalSummaryProps {
  beamMeasurements?: any[];
  surfaceBedMeasurements?: any[];
  padFootingMeasurements?: any[];
  groundBeamMeasurements?: any[];
  columnMeasurements?: any[];
  wallMeasurements?: any[];
  slabMeasurements?: any[];
  openingMeasurements?: any[];
  boqItems: Record<string, BoqItem>;
  styles: {
    cardStyle: React.CSSProperties;
    tableStyle: React.CSSProperties;
    thStyle: React.CSSProperties;
    tdStyle: React.CSSProperties;
  };
}

export default function ElementalSummary({
  beamMeasurements = [],
  surfaceBedMeasurements = [],
  padFootingMeasurements = [],
  groundBeamMeasurements = [],
  columnMeasurements = [],
  wallMeasurements = [],
  slabMeasurements = [],
  openingMeasurements = [],
  boqItems,
  styles,
}: ElementalSummaryProps) {
  const { cardStyle, tableStyle, thStyle, tdStyle } = styles;

  // Combine all measurements with module label
  const allMeasurements = [
    ...beamMeasurements.map((m) => ({ ...m, module: "Beams" })),
    ...surfaceBedMeasurements.map((m) => ({ ...m, module: "Surface Beds" })),
    ...padFootingMeasurements.map((m) => ({ ...m, module: "Pad Footings" })),
    ...groundBeamMeasurements.map((m) => ({ ...m, module: "Ground Beams" })),
    ...columnMeasurements.map((m) => ({ ...m, module: "Columns" })),
    ...wallMeasurements.map((m) => ({ ...m, module: "Walls" })),
    ...slabMeasurements.map((m) => ({ ...m, module: "Slabs" })),
    ...openingMeasurements.map((m) => ({ ...m, module: "Openings" })),
  ];

  // ============================================
  // FALLBACK: Assign elemental data based on module if missing
  // ============================================
  const moduleToElementalMap: Record<string, { section: string; element: string }> = {
    "Beams": { section: "structural-frame", element: "beams" },
    "Surface Beds": { section: "ground-floor", element: "solid-floors" },
    "Pad Footings": { section: "substructure", element: "pad-footings" },
    "Ground Beams": { section: "substructure", element: "ground-beams" },
    "Columns": { section: "structural-frame", element: "columns" },
    "Slabs": { section: "structural-frame", element: "slabs" },
    "Walls": { section: "internal-divisions", element: "walls" },
    "Openings": { section: "internal-divisions", element: "openings" },
  };

  allMeasurements.forEach((m) => {
    if (!m.elementalSectionId || !m.elementalElementId) {
      const mapping = moduleToElementalMap[m.module];
      if (mapping) {
        m.elementalSectionId = mapping.section;
        m.elementalElementId = mapping.element;
      }
    }
  });

  // Helper to get quantity from measurement
  const getQuantity = (m: any) => {
    if (m.area) return m.area;
    if (m.length) return m.length;
    if (m.quantity) return m.quantity;
    return 0;
  };

  // Helper to get unit from measurement
  const getUnit = (m: any) => {
    if (m.area) return "m²";
    if (m.length) return "m";
    if (m.quantity) return "No.";
    return "-";
  };

  // Group by elemental section and element
  const groupedData: Record<string, Record<string, { measurements: any[]; total: number }>> = {};

  allMeasurements.forEach((m) => {
    const sectionId = m.elementalSectionId || "uncategorised";
    const elementId = m.elementalElementId || "uncategorised";

    if (!groupedData[sectionId]) {
      groupedData[sectionId] = {};
    }
    if (!groupedData[sectionId][elementId]) {
      groupedData[sectionId][elementId] = { measurements: [], total: 0 };
    }
    groupedData[sectionId][elementId].measurements.push(m);
    groupedData[sectionId][elementId].total += getQuantity(m);
  });

  const hasData = Object.keys(groupedData).length > 0;

  // Helper to get element name from id
  const getElementName = (id: string) => {
    const el = getElementById(id);
    return el?.name || id;
  };

  // Helper to get section name from id
  const getSectionName = (id: string) => {
    const section = elementalStructure.find((s) => s.id === id);
    return section?.name || id;
  };

  if (!hasData) {
    return (
      <div style={cardStyle}>
        <h2>Elemental Summary</h2>
        <p>No measurements added yet. Add data in the Elemental Measurement tab.</p>
      </div>
    );
  }

  // Sort sections
  const sortedSections = Object.keys(groupedData).sort();

  // Calculate total quantity across all elements
  let grandTotal = 0;
  sortedSections.forEach((sectionId) => {
    const sectionData = groupedData[sectionId];
    Object.values(sectionData).forEach((elementData) => {
      grandTotal += elementData.total;
    });
  });

  return (
    <div style={cardStyle}>
      <h2>Elemental Summary</h2>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Quantities grouped by AAQS elemental sections and elements.
        <span style={{ marginLeft: "16px", fontWeight: "bold" }}>
          Grand Total: {grandTotal.toFixed(3)}
        </span>
      </p>

      {sortedSections.map((sectionId) => {
        const sectionData = groupedData[sectionId];
        const sectionName = getSectionName(sectionId);
        const sortedElements = Object.keys(sectionData).sort();

        let sectionTotal = 0;
        Object.values(sectionData).forEach((elementData) => {
          sectionTotal += elementData.total;
        });

        return (
          <div key={sectionId} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 12px 0", color: "#0066cc" }}>
              {sectionName}
              <span style={{ color: "#666", fontSize: "14px", marginLeft: "12px" }}>
                Section Total: {sectionTotal.toFixed(3)}
              </span>
            </h3>

            {sortedElements.map((elementId) => {
              const elementData = sectionData[elementId];
              const elementName = getElementName(elementId);

              return (
                <div key={elementId} style={{ marginBottom: "16px" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: "500", margin: "0 0 8px 0" }}>
                    {elementName}
                    <span style={{ color: "#666", fontSize: "13px", marginLeft: "12px" }}>
                      Total: {elementData.total.toFixed(3)}
                    </span>
                  </h4>
                  <table style={tableStyle} border={1} cellPadding={6}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Module</th>
                        <th style={thStyle}>Mark</th>
                        <th style={thStyle}>Quantity</th>
                        <th style={thStyle}>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {elementData.measurements.map((m, idx) => (
                        <tr key={idx}>
                          <td style={tdStyle}>{m.module}</td>
                          <td style={tdStyle}>{m.mark}</td>
                          <td style={tdStyle}>{getQuantity(m).toFixed(3)}</td>
                          <td style={tdStyle}>{getUnit(m)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}