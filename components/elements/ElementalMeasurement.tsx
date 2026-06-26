"use client";

import { useState } from "react";
import { elementalStructure } from "@/lib/elementalStructure";
import ElementSection from "./ElementSection";
import ComingSoon from "./ComingSoon";
import type { CostPlanComponent } from "@/types/boq";

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
  editingBeamId: any;
  setEditingBeamId: any;
  newBeam: any;
  updateBeam: any;
  resetBeam: any;
  beamMeasurements: any;
  setBeamMeasurements: any;
  newBeamMeas: any;
  updateBeamMeas: any;
  resetBeamMeas: any;
  editingBeamMeasurementId: any;
  setEditingBeamMeasurementId: any;
  
  surfaceBedTypes: any;
  setSurfaceBedTypes: any;
  editingSurfaceBedId: any;
  setEditingSurfaceBedId: any;
  newSurfaceBed: any;
  updateSurfaceBed: any;
  resetSurfaceBed: any;
  surfaceBedMeasurements: any;
  setSurfaceBedMeasurements: any;
  newSurfaceBedMeas: any;
  updateSurfaceBedMeas: any;
  resetSurfaceBedMeas: any;
  editingSurfaceBedMeasurementId: any;
  setEditingSurfaceBedMeasurementId: any;
  
  padFootingTypes: any;
  setPadFootingTypes: any;
  editingPadFootingId: any;
  setEditingPadFootingId: any;
  newPadFooting: any;
  updatePadFooting: any;
  resetPadFooting: any;
  padFootingMeasurements: any;
  setPadFootingMeasurements: any;
  newPadFootingMeas: any;
  updatePadFootingMeas: any;
  resetPadFootingMeas: any;
  editingPadFootingMeasurementId: any;
  setEditingPadFootingMeasurementId: any;
  
  groundBeamTypes: any;
  setGroundBeamTypes: any;
  editingGroundBeamId: any;
  setEditingGroundBeamId: any;
  newGroundBeam: any;
  updateGroundBeam: any;
  resetGroundBeam: any;
  groundBeamMeasurements: any;
  setGroundBeamMeasurements: any;
  newGroundBeamMeas: any;
  updateGroundBeamMeas: any;
  resetGroundBeamMeas: any;
  editingGroundBeamMeasurementId: any;
  setEditingGroundBeamMeasurementId: any;
  
  columnTypes: any;
  setColumnTypes: any;
  editingColumnId: any;
  setEditingColumnId: any;
  newColumn: any;
  updateColumn: any;
  resetColumn: any;
  columnMeasurements: any;
  setColumnMeasurements: any;
  newColumnMeas: any;
  updateColumnMeas: any;
  resetColumnMeas: any;
  editingColumnMeasurementId: any;
  setEditingColumnMeasurementId: any;
  
  wallTypes: any;
  setWallTypes: any;
  editingWallId: any;
  setEditingWallId: any;
  newWall: any;
  updateWall: any;
  resetWall: any;
  wallMeasurements: any;
  setWallMeasurements: any;
  newWallMeas: any;
  updateWallMeas: any;
  resetWallMeas: any;
  editingWallMeasurementId: any;
  setEditingWallMeasurementId: any;
  
  slabTypes: any;
  setSlabTypes: any;
  editingSlabId: any;
  setEditingSlabId: any;
  newSlab: any;
  updateSlab: any;
  resetSlab: any;
  slabMeasurements: any;
  setSlabMeasurements: any;
  newSlabMeas: any;
  updateSlabMeas: any;
  resetSlabMeas: any;
  editingSlabMeasurementId: any;
  setEditingSlabMeasurementId: any;
  
  openingTypes: any;
  setOpeningTypes: any;
  editingOpeningId: any;
  setEditingOpeningId: any;
  newOpening: any;
  updateOpening: any;
  resetOpening: any;
  openingMeasurements: any;
  setOpeningMeasurements: any;
  newOpeningMeas: any;
  updateOpeningMeas: any;
  resetOpeningMeas: any;
  editingOpeningMeasurementId: any;
  setEditingOpeningMeasurementId: any;
  
  // Cost Plan Components
  costPlanComponents?: CostPlanComponent[];
  setCostPlanComponents?: React.Dispatch<React.SetStateAction<CostPlanComponent[]>>;
  
  styles: any;
}

export default function ElementalMeasurement({ 
  styles, 
  costPlanComponents = [],
  setCostPlanComponents,
  ...moduleProps 
}: ElementalMeasurementProps) {
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
            <SlabModule
              slabTypes={moduleProps.slab.slabTypes}
              setSlabTypes={moduleProps.slab.setSlabTypes}
              editingSlabId={moduleProps.slab.editingSlabId}
              setEditingSlabId={moduleProps.slab.setEditingSlabId}
              newSlab={moduleProps.slab.newSlab}
              updateSlab={moduleProps.slab.updateSlab}        // <-- Must be passed
              resetSlab={moduleProps.slab.resetSlab}          // <-- Must be passed
              slabMeasurements={moduleProps.slab.slabMeasurements}
              setSlabMeasurements={moduleProps.slab.setSlabMeasurements}
              newSlabMeas={moduleProps.slab.newSlabMeas}
              updateSlabMeas={moduleProps.slab.updateSlabMeas} // <-- Must be passed
              resetSlabMeas={moduleProps.slab.resetSlabMeas}   // <-- Must be passed
              editingSlabMeasurementId={moduleProps.slab.editingSlabMeasurementId}
              setEditingSlabMeasurementId={moduleProps.slab.setEditingSlabMeasurementId}
              styles={styles}
            />
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

  // Test function to add dummy components
  const testAddComponents = () => {
    if (!setCostPlanComponents) {
      alert("setCostPlanComponents is not available!");
      return;
    }
    
    const testComponents: CostPlanComponent[] = [
      {
        id: `test-${Date.now()}-1`,
        measurementId: 999,
        mark: "TEST1",
        module: "Walls",
        elementalSectionId: "internal-divisions",
        elementalElementId: "walls",
        description: "TEST: Common brickwork - Single Skin",
        unit: "m²",
        qty: 50,
        rate: 350,
        amount: 17500,
      },
      {
        id: `test-${Date.now()}-2`,
        measurementId: 999,
        mark: "TEST1",
        module: "Walls",
        elementalSectionId: "internal-wall-finishes",
        elementalElementId: "wall-finishes",
        description: "TEST: Plaster & Paint - side 1",
        unit: "m²",
        qty: 50,
        rate: 120,
        amount: 6000,
      },
      {
        id: `test-${Date.now()}-3`,
        measurementId: 999,
        mark: "TEST1",
        module: "Walls",
        elementalSectionId: "internal-wall-finishes",
        elementalElementId: "wall-finishes",
        description: "TEST: Plaster & Tiling - side 2",
        unit: "m²",
        qty: 50,
        rate: 450,
        amount: 22500,
      },
    ];
    
    setCostPlanComponents((prev) => [...prev, ...testComponents]);
    console.log("Added test components:", testComponents);
    console.log("Total components now:", costPlanComponents.length + testComponents.length);
    alert(`Added ${testComponents.length} test components. Total: ${costPlanComponents.length + testComponents.length}`);
  };

  // Debug: log current components
  console.log("ElementalMeasurement - costPlanComponents:", costPlanComponents);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2>Elemental Measurement</h2>
        <div>
          <span style={{ marginRight: "16px", color: "#666", fontSize: "14px" }}>
            Components: {costPlanComponents?.length || 0}
          </span>
          <button
            onClick={testAddComponents}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Add Test Components
          </button>
        </div>
      </div>
      
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