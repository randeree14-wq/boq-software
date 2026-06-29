"use client";

import React from "react";
import BeamModule from "@/components/modules/BeamModule";
import SlabModule from "@/components/modules/SlabModule";
import PadFootingModule from "@/components/modules/PadFootingModule";
import GroundBeamModule from "@/components/modules/GroundBeamModule";
import ColumnModule from "@/components/modules/ColumnModule";
import WallModule from "@/components/modules/WallModule";
import SurfaceBedModule from "@/components/modules/SurfaceBedModule";
import OpeningsModule from "@/components/modules/OpeningsModule";

interface ElementalMeasurementProps {
  styles: any;
  moduleProps: {
    beam?: any;
    groundBeam?: any;
    padFooting?: any;
    column?: any;
    slab?: any;
    surfaceBed?: any;
    wall?: any;
    openings?: any;
  };
}

export default function ElementalMeasurement({
  styles,
  moduleProps = {},
}: ElementalMeasurementProps) {
  const { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle } = styles || {};
  const stylesObj = { cardStyle, formGridStyle, tableStyle, thStyle, tdStyle };

  // Helper to safely render a module
  const renderModule = (moduleName: string, ModuleComponent: any, props: any) => {
    if (!props) {
      console.warn(`Module "${moduleName}" props are undefined, skipping render`);
      return null;
    }
    return <ModuleComponent {...props} styles={stylesObj} />;
  };

  // Helper to safely get props with defaults
  const safeProps = (props: any, defaults: any = {}) => {
    if (!props) return defaults;
    return { ...defaults, ...props };
  };

  return (
    <div>
      {/* WALLS */}
      {renderModule(
        "Wall",
        WallModule,
        safeProps(moduleProps.wall, {
          wallTypes: [],
          setWallTypes: () => {},
          editingWallId: null,
          setEditingWallId: () => {},
          newWall: {},
          updateWall: () => {},
          resetWall: () => {},
          wallMeasurements: [],
          setWallMeasurements: () => {},
          newWallMeas: {},
          updateWallMeas: () => {},
          resetWallMeas: () => {},
          editingWallMeasurementId: null,
          setEditingWallMeasurementId: () => {},
        })
      )}

      {/* SLABS */}
      {renderModule(
        "Slab",
        SlabModule,
        safeProps(moduleProps.slab, {
          slabTypes: [],
          setSlabTypes: () => {},
          editingSlabId: null,
          setEditingSlabId: () => {},
          newSlab: {},
          updateSlab: () => {},
          resetSlab: () => {},
          slabMeasurements: [],
          setSlabMeasurements: () => {},
          newSlabMeas: {},
          updateSlabMeas: () => {},
          resetSlabMeas: () => {},
          editingSlabMeasurementId: null,
          setEditingSlabMeasurementId: () => {},
        })
      )}

      {/* BEAMS */}
      {renderModule(
        "Beam",
        BeamModule,
        safeProps(moduleProps.beam, {
          beamTypes: [],
          setBeamTypes: () => {},
          editingBeamId: null,
          setEditingBeamId: () => {},
          newBeam: {},
          updateBeam: () => {},
          resetBeam: () => {},
          beamMeasurements: [],
          setBeamMeasurements: () => {},
          newBeamMeas: {},
          updateBeamMeas: () => {},
          resetBeamMeas: () => {},
          editingBeamMeasurementId: null,
          setEditingBeamMeasurementId: () => {},
        })
      )}

      {/* GROUND BEAMS */}
      {renderModule(
        "GroundBeam",
        GroundBeamModule,
        safeProps(moduleProps.groundBeam, {
          groundBeamTypes: [],
          setGroundBeamTypes: () => {},
          editingGroundBeamId: null,
          setEditingGroundBeamId: () => {},
          newGroundBeam: {},
          updateGroundBeam: () => {},
          resetGroundBeam: () => {},
          groundBeamMeasurements: [],
          setGroundBeamMeasurements: () => {},
          newGroundBeamMeas: {},
          updateGroundBeamMeas: () => {},
          resetGroundBeamMeas: () => {},
          editingGroundBeamMeasurementId: null,
          setEditingGroundBeamMeasurementId: () => {},
        })
      )}

      {/* PAD FOOTINGS */}
      {renderModule(
        "PadFooting",
        PadFootingModule,
        safeProps(moduleProps.padFooting, {
          padFootingTypes: [],
          setPadFootingTypes: () => {},
          editingPadFootingId: null,
          setEditingPadFootingId: () => {},
          newPadFooting: {},
          updatePadFooting: () => {},
          resetPadFooting: () => {},
          padFootingMeasurements: [],
          setPadFootingMeasurements: () => {},
          newPadFootingMeas: {},
          updatePadFootingMeas: () => {},
          resetPadFootingMeas: () => {},
          editingPadFootingMeasurementId: null,
          setEditingPadFootingMeasurementId: () => {},
        })
      )}

      {/* COLUMNS */}
      {renderModule(
        "Column",
        ColumnModule,
        safeProps(moduleProps.column, {
          columnTypes: [],
          setColumnTypes: () => {},
          editingColumnId: null,
          setEditingColumnId: () => {},
          newColumn: {},
          updateColumn: () => {},
          resetColumn: () => {},
          columnMeasurements: [],
          setColumnMeasurements: () => {},
          newColumnMeas: {},
          updateColumnMeas: () => {},
          resetColumnMeas: () => {},
          editingColumnMeasurementId: null,
          setEditingColumnMeasurementId: () => {},
        })
      )}

      {/* SURFACE BEDS */}
      {renderModule(
        "SurfaceBed",
        SurfaceBedModule,
        safeProps(moduleProps.surfaceBed, {
          surfaceBedTypes: [],
          setSurfaceBedTypes: () => {},
          editingSurfaceBedId: null,
          setEditingSurfaceBedId: () => {},
          newSurfaceBed: {},
          updateSurfaceBed: () => {},
          resetSurfaceBed: () => {},
          surfaceBedMeasurements: [],
          setSurfaceBedMeasurements: () => {},
          newSurfaceBedMeas: {},
          updateSurfaceBedMeas: () => {},
          resetSurfaceBedMeas: () => {},
          editingSurfaceBedMeasurementId: null,
          setEditingSurfaceBedMeasurementId: () => {},
        })
      )}

      {/* OPENINGS */}
      {renderModule(
        "Opening",
        OpeningsModule,
        safeProps(moduleProps.openings, {
          openingTypes: [],
          setOpeningTypes: () => {},
          editingOpeningId: null,
          setEditingOpeningId: () => {},
          newOpening: {},
          updateOpening: () => {},
          resetOpening: () => {},
          openingMeasurements: [],
          setOpeningMeasurements: () => {},
          newOpeningMeas: {},
          updateOpeningMeas: () => {},
          resetOpeningMeas: () => {},
          editingOpeningMeasurementId: null,
          setEditingOpeningMeasurementId: () => {},
        })
      )}
    </div>
  );
}