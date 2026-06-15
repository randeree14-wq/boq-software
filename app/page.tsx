"use client";

import { useState } from "react";

type BeamType = {
  id: number;
  name: string;
  width: number;
  depth: number;
  reinfKg: number;
  formworkFinish: string;
  concreteClass: string;
};

type BeamMeasurement = {
  id: number;
  mark: string;
  beamTypeId: number;
  length: number;
};
type PadFootingType = {
  id: number;
  name: string;

  padLength: number;
  padWidth: number;
  padDepth: number;

  excavationLength: number;
  excavationWidth: number;
  excavationDepth: number;

  concreteClass: string;
  reinfKg: number;

  formworkRequired: boolean;
  blindingRequired: boolean;
  blindingThickness: number;

  soilPoison: boolean;
  backfill: boolean;
};

type PadFootingMeasurement = {
  id: number;
  mark: string;
  padFootingTypeId: number;
  quantity: number;
};
type BoqItem = {
  item: string;
  unit: string;
  qty: number;
};

type SurfaceBedType = {
  id: number;
  name: string;
  category: string;
  thickness: number;
  concreteClass: string;
  meshType: string;
  dpm: boolean;
  soilPoison: boolean;
  layer1Material: string;
  layer1Thickness: number;
  layer2Material: string;
  layer2Thickness: number;
  layer3Material: string;
  layer3Thickness: number;
  powerfloat: boolean;
  screedRequired: boolean;
  screedThickness: number;
  screedType: string;
  tileRequired: boolean;
  tilePcSum: number;
};

type SurfaceBedMeasurement = {
  id: number;
  mark: string;
  surfaceBedTypeId: number;
  area: number;
};

export default function Home() {
  const [beamTypes, setBeamTypes] = useState<BeamType[]>([
    {
      id: 1,
      name: "Main Roof Beam",
      width: 230,
      depth: 500,
      reinfKg: 120,
      formworkFinish: "Smooth",
      concreteClass: "25MPa/19mm",
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [newBeam, setNewBeam] = useState({
    name: "",
    width: 230,
    depth: 500,
    reinfKg: 120,
    formworkFinish: "Smooth",
    concreteClass: "25MPa/19mm",
  });

  const [measurements, setMeasurements] = useState<BeamMeasurement[]>([]);
const [surfaceBedTypes, setSurfaceBedTypes] = useState<SurfaceBedType[]>([]);
const [surfaceBedMeasurements, setSurfaceBedMeasurements] = useState<
  SurfaceBedMeasurement[]
>([]);
const [editingSurfaceBedId, setEditingSurfaceBedId] =
  useState<number | null>(null);
  const [newMeasurement, setNewMeasurement] = useState({
    
    mark: "",
    beamTypeId: 0,
    length: 0,
  });

const [newSurfaceBed, setNewSurfaceBed] = useState({
  name: "",
  category: "Internal",
  thickness: 170,
  concreteClass: "35MPa/19mm",
  meshType: "Ref193",
  dpm: true,
  soilPoison: true,
  layer1Material: "",
  layer1Thickness: 0,
  layer2Material: "",
  layer2Thickness: 0,
  layer3Material: "",
  layer3Thickness: 0,
  powerfloat: true,
  screedRequired: false,
  screedThickness: 40,
  screedType: "Normal",
  tileRequired: false,
  tilePcSum: 0,
});
const [newSurfaceBedMeasurement, setNewSurfaceBedMeasurement] = useState({
  mark: "",
  surfaceBedTypeId: 0,
  area: 0,
});
const [padFootingTypes, setPadFootingTypes] = useState<PadFootingType[]>([]);

const [padFootingMeasurements, setPadFootingMeasurements] = useState<
  PadFootingMeasurement[]
>([]);

const [editingPadFootingId, setEditingPadFootingId] =
  useState<number | null>(null);

const [newPadFooting, setNewPadFooting] = useState({
  name: "",

  padLength: 1200,
  padWidth: 1200,
  padDepth: 400,

  excavationLength: 1800,
  excavationWidth: 1800,
  excavationDepth: 800,

  concreteClass: "30MPa/19mm",
  reinfKg: 120,

  formworkRequired: true,
  blindingRequired: true,
  blindingThickness: 50,

  soilPoison: false,
  backfill: true,
});

const [newPadFootingMeasurement, setNewPadFootingMeasurement] =
  useState({
    mark: "",
    padFootingTypeId: 0,
    quantity: 0,
  });
  function addBeamType() {
    if (!newBeam.name) return;

    if (editingId !== null) {
      setBeamTypes(
        beamTypes.map((beam) =>
          beam.id === editingId ? { ...beam, ...newBeam } : beam
        )
      );
      setEditingId(null);
    } else {
      setBeamTypes([
        ...beamTypes,
        {
          id: beamTypes.length + 1,
          ...newBeam,
        },
      ]);
    }

    setNewBeam({
      name: "",
      width: 230,
      depth: 500,
      reinfKg: 120,
      formworkFinish: "Smooth",
      concreteClass: "25MPa/19mm",
    });
  }

  function editBeamType(id: number) {
    const beam = beamTypes.find((b) => b.id === id);
    if (!beam) return;

    setNewBeam({
      name: beam.name,
      width: beam.width,
      depth: beam.depth,
      reinfKg: beam.reinfKg,
      formworkFinish: beam.formworkFinish,
      concreteClass: beam.concreteClass,
    });

    setEditingId(id);
  }

  function deleteBeamType(id: number) {
    setBeamTypes(beamTypes.filter((beam) => beam.id !== id));
    setMeasurements(measurements.filter((m) => m.beamTypeId !== id));
  }
function addMeasurement() {
  if (!newMeasurement.mark) return;
  if (newMeasurement.beamTypeId === 0) return;

  setMeasurements([
    ...measurements,
    {
      id: measurements.length + 1,
      ...newMeasurement,
    },
  ]);

  setNewMeasurement({
    mark: "",
    beamTypeId: 0,
    length: 0,
  });
}

function addSurfaceBedType() {
  if (!newSurfaceBed.name) return;

  if (editingSurfaceBedId !== null) {
    setSurfaceBedTypes(
      surfaceBedTypes.map((sb) =>
        sb.id === editingSurfaceBedId
          ? { ...sb, ...newSurfaceBed }
          : sb
      )
    );

    setEditingSurfaceBedId(null);
  } else {
    setSurfaceBedTypes([
      ...surfaceBedTypes,
      {
        id: surfaceBedTypes.length + 1,
        ...newSurfaceBed,
      },
    ]);
  }

  setNewSurfaceBed({
    name: "",
    category: "Internal",
    thickness: 170,
    concreteClass: "35MPa/19mm",
    meshType: "Ref193",
    dpm: true,
    soilPoison: true,
    layer1Material: "",
    layer1Thickness: 0,
    layer2Material: "",
    layer2Thickness: 0,
    layer3Material: "",
    layer3Thickness: 0,
    powerfloat: true,
    screedRequired: false,
    screedThickness: 40,
    screedType: "Normal",
    tileRequired: false,
    tilePcSum: 0,
  });
}

function editSurfaceBedType(id: number) {
  const sb = surfaceBedTypes.find((s) => s.id === id);

  if (!sb) return;

  setNewSurfaceBed({
    name: sb.name,
    category: sb.category,
    thickness: sb.thickness,
    concreteClass: sb.concreteClass,
    meshType: sb.meshType,
    dpm: sb.dpm,
    soilPoison: sb.soilPoison,
    layer1Material: sb.layer1Material,
    layer1Thickness: sb.layer1Thickness,
    layer2Material: sb.layer2Material,
    layer2Thickness: sb.layer2Thickness,
    layer3Material: sb.layer3Material,
    layer3Thickness: sb.layer3Thickness,
    powerfloat: sb.powerfloat,
    screedRequired: sb.screedRequired,
    screedThickness: sb.screedThickness,
    screedType: sb.screedType,
    tileRequired: sb.tileRequired,
    tilePcSum: sb.tilePcSum,
  });

  setEditingSurfaceBedId(id);
}

function deleteSurfaceBedType(id: number) {
  setSurfaceBedTypes(surfaceBedTypes.filter((sb) => sb.id !== id));
}

function addSurfaceBedMeasurement() {
  if (!newSurfaceBedMeasurement.mark) return;
  if (newSurfaceBedMeasurement.surfaceBedTypeId === 0) return;

  setSurfaceBedMeasurements([
    ...surfaceBedMeasurements,
    {
      id: surfaceBedMeasurements.length + 1,
      ...newSurfaceBedMeasurement,
    },
  ]);


  setNewSurfaceBedMeasurement({
    mark: "",
    surfaceBedTypeId: 0,
    area: 0,
  });
}

function resetPadFootingForm() {
  setNewPadFooting({
    name: "",

    padLength: 1200,
    padWidth: 1200,
    padDepth: 400,

    excavationLength: 1800,
    excavationWidth: 1800,
    excavationDepth: 800,

    concreteClass: "30MPa/19mm",
    reinfKg: 120,

    formworkRequired: true,
    blindingRequired: true,
    blindingThickness: 50,

    soilPoison: false,
    backfill: true,
  });
}

function addPadFootingType() {
  if (!newPadFooting.name) return;

  setPadFootingTypes([
    ...padFootingTypes,
    {
      id: padFootingTypes.length + 1,
      ...newPadFooting,
    },
  ]);

  resetPadFootingForm();
  

  if (editingPadFootingId !== null) {
    setPadFootingTypes(
      padFootingTypes.map((pf) =>
        pf.id === editingPadFootingId
          ? { ...pf, ...newPadFooting }
          : pf
      )
    );

    setEditingPadFootingId(null);
  } else {
    setPadFootingTypes([
      ...padFootingTypes,
      {
        id: padFootingTypes.length + 1,
        ...newPadFooting,
      },
    ]);
  }

  resetPadFootingForm();
}
function addPadFootingMeasurement() {
  if (!newPadFootingMeasurement.mark) return;
  if (newPadFootingMeasurement.padFootingTypeId === 0) return;

  setPadFootingMeasurements([
    ...padFootingMeasurements,
    {
      id: padFootingMeasurements.length + 1,
      ...newPadFootingMeasurement,
    },
  ]);

  setNewPadFootingMeasurement({
    mark: "",
    padFootingTypeId: 0,
    quantity: 0,
  });
}
function editPadFootingType(id: number) {
  const pf = padFootingTypes.find((p) => p.id === id);

  if (!pf) return;

  setNewPadFooting({
    name: pf.name,

    padLength: pf.padLength,
    padWidth: pf.padWidth,
    padDepth: pf.padDepth,

    excavationLength: pf.excavationLength,
    excavationWidth: pf.excavationWidth,
    excavationDepth: pf.excavationDepth,

    concreteClass: pf.concreteClass,
    reinfKg: pf.reinfKg,

    formworkRequired: pf.formworkRequired,
    blindingRequired: pf.blindingRequired,
    blindingThickness: pf.blindingThickness,

    soilPoison: pf.soilPoison,
    backfill: pf.backfill,
  });

  setEditingPadFootingId(id);
}

function deletePadFootingType(id: number) {
  setPadFootingTypes(padFootingTypes.filter((pf) => pf.id !== id));
  setPadFootingMeasurements(
    padFootingMeasurements.filter((m) => m.padFootingTypeId !== id)
  );
}
const beamBoqItems: Record<string, BoqItem> = {};

const surfaceBedBoqItems: Record<string, BoqItem> = {};
surfaceBedMeasurements.forEach((m) => {
  const sb = surfaceBedTypes.find(
    (s) => s.id === m.surfaceBedTypeId
  );

  if (!sb) return;

  const concrete =
    m.area * (sb.thickness / 1000);

  if (sb.layer1Material) {
    const item = `${sb.layer1Thickness}mm ${sb.layer1Material} compacted`;

    if (!surfaceBedBoqItems[item]) {
      surfaceBedBoqItems[item] = {
        item,
        unit: "m²",
        qty: 0,
      };
    }

    surfaceBedBoqItems[item].qty += m.area;
  }

  if (sb.layer2Material) {
    const item = `${sb.layer2Thickness}mm ${sb.layer2Material} compacted`;

    if (!surfaceBedBoqItems[item]) {
      surfaceBedBoqItems[item] = {
        item,
        unit: "m²",
        qty: 0,
      };
    }

    surfaceBedBoqItems[item].qty += m.area;
  }

  if (sb.layer3Material) {
    const item = `${sb.layer3Thickness}mm ${sb.layer3Material} compacted`;

    if (!surfaceBedBoqItems[item]) {
      surfaceBedBoqItems[item] = {
        item,
        unit: "m²",
        qty: 0,
      };
    }

    surfaceBedBoqItems[item].qty += m.area;
  }

  if (sb.dpm) {
    const item = "DPM under surface beds";

    if (!surfaceBedBoqItems[item]) {
      surfaceBedBoqItems[item] = {
        item,
        unit: "m²",
        qty: 0,
      };
    }

    surfaceBedBoqItems[item].qty += m.area;
  }

  if (sb.soilPoison) {
    const item = "Soil poisoning under surface beds";

    if (!surfaceBedBoqItems[item]) {
      surfaceBedBoqItems[item] = {
        item,
        unit: "m²",
        qty: 0,
      };
    }

    surfaceBedBoqItems[item].qty += m.area;
  }

  if (sb.meshType !== "None") {
    const item = `${sb.meshType} mesh reinforcement`;

    if (!surfaceBedBoqItems[item]) {
      surfaceBedBoqItems[item] = {
        item,
        unit: "m²",
        qty: 0,
      };
    }

    surfaceBedBoqItems[item].qty += m.area;
  }

  const concreteItem =
    `${sb.concreteClass} concrete in surface beds`;

  if (!surfaceBedBoqItems[concreteItem]) {
    surfaceBedBoqItems[concreteItem] = {
      item: concreteItem,
      unit: "m³",
      qty: 0,
    };
  }

  surfaceBedBoqItems[concreteItem].qty += concrete;

  if (sb.powerfloat) {
    if (sb.screedRequired) {
  const item =
    `${sb.screedThickness}mm screed ${sb.screedType}`;

  if (!surfaceBedBoqItems[item]) {
    surfaceBedBoqItems[item] = {
      item,
      unit: "m²",
      qty: 0,
    };
  }

  surfaceBedBoqItems[item].qty += m.area;
}if (sb.tileRequired) {
  const item =
    `Tiles PC Sum R${sb.tilePcSum}/m²`;

  if (!surfaceBedBoqItems[item]) {
    surfaceBedBoqItems[item] = {
      item,
      unit: "m²",
      qty: 0,
    };
  }

  surfaceBedBoqItems[item].qty += m.area;
}
    const item = "Powerfloat finish";

    if (!surfaceBedBoqItems[item]) {
      surfaceBedBoqItems[item] = {
        item,
        unit: "m²",
        qty: 0,
      };
    }

    surfaceBedBoqItems[item].qty += m.area;
  }
});
const padFootingBoqItems: Record<string, BoqItem> = {};
padFootingMeasurements.forEach((m) => {
  const pf = padFootingTypes.find(
    (p) => p.id === m.padFootingTypeId
  );

  if (!pf) return;

  const qty = m.quantity;

  const padConcrete =
    (pf.padLength / 1000) *
    (pf.padWidth / 1000) *
    (pf.padDepth / 1000) *
    qty;

  const excavation =
    (pf.excavationLength / 1000) *
    (pf.excavationWidth / 1000) *
    (pf.excavationDepth / 1000) *
    qty;

  const reinforcement =
    (padConcrete * pf.reinfKg) / 1000;

  const concreteItem =
    `${pf.concreteClass} concrete in pad footings`;

  if (!padFootingBoqItems[concreteItem]) {
    padFootingBoqItems[concreteItem] = {
      item: concreteItem,
      unit: "m³",
      qty: 0,
    };
  }

  padFootingBoqItems[concreteItem].qty += padConcrete;

  const excavationItem = "Excavation for pad footings";

  if (!padFootingBoqItems[excavationItem]) {
    padFootingBoqItems[excavationItem] = {
      item: excavationItem,
      unit: "m³",
      qty: 0,
    };
  }

  padFootingBoqItems[excavationItem].qty += excavation;

  const reinforcementItem =
    "Reinforcement to pad footings";

  if (!padFootingBoqItems[reinforcementItem]) {
    padFootingBoqItems[reinforcementItem] = {
      item: reinforcementItem,
      unit: "t",
      qty: 0,
    };
  }

  padFootingBoqItems[reinforcementItem].qty +=
    reinforcement;
});
  measurements.forEach((m) => {
    const beam = beamTypes.find((b) => b.id === m.beamTypeId);
    if (!beam) return;

    const widthM = beam.width / 1000;
    const depthM = beam.depth / 1000;

    const concrete = widthM * depthM * m.length;
    const formwork = m.length * (2 * depthM + widthM);
    const reinforcement = (concrete * beam.reinfKg) / 1000;

    const concreteItem = `${beam.concreteClass} concrete in beams`;
    const formworkItem = `${beam.formworkFinish} formwork to sides and soffits of beams`;
    const reinforcementItem = "Reinforcement allowance to beams";

    if (!beamBoqItems[concreteItem]) {
      beamBoqItems[concreteItem] = { item: concreteItem, unit: "m³", qty: 0 };
    }

    if (!beamBoqItems[formworkItem]) {
      beamBoqItems[formworkItem] = { item: formworkItem, unit: "m²", qty: 0 };
    }

    if (!beamBoqItems[reinforcementItem]) {
      beamBoqItems[reinforcementItem] = {
        item: reinforcementItem,
        unit: "t",
        qty: 0,
      };
    }

    beamBoqItems[concreteItem].qty += concrete;
    beamBoqItems[formworkItem].qty += formwork;
    beamBoqItems[reinforcementItem].qty += reinforcement;
  });

  return (
    <main style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>BOQ Measurement Software</h1>

      <h2>Beam Type Library</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Beam type name"
          value={newBeam.name}
          onChange={(e) => setNewBeam({ ...newBeam, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Width mm"
          value={newBeam.width}
          onChange={(e) =>
            setNewBeam({ ...newBeam, width: Number(e.target.value) })
          }
        />

        <input
          type="number"
          placeholder="Depth mm"
          value={newBeam.depth}
          onChange={(e) =>
            setNewBeam({ ...newBeam, depth: Number(e.target.value) })
          }
        />

        <input
          type="number"
          placeholder="Reinf kg/m³"
          value={newBeam.reinfKg}
          onChange={(e) =>
            setNewBeam({ ...newBeam, reinfKg: Number(e.target.value) })
          }
        />

        <select
          value={newBeam.formworkFinish}
          onChange={(e) =>
            setNewBeam({ ...newBeam, formworkFinish: e.target.value })
          }
        >
          <option>Smooth</option>
          <option>Rough</option>
          <option>Special</option>
        </select>

        <select
          value={newBeam.concreteClass}
          onChange={(e) =>
            setNewBeam({ ...newBeam, concreteClass: e.target.value })
          }
        >
          <option>25MPa/19mm</option>
          <option>30MPa/19mm</option>
          <option>35MPa/19mm</option>
        </select>

        <button onClick={addBeamType}>
          {editingId !== null ? "Update Beam Type" : "Save Beam Type"}
        </button>
      </div>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Beam Type</th>
            <th>Width mm</th>
            <th>Depth mm</th>
            <th>Reinf kg/m³</th>
            <th>Formwork Finish</th>
            <th>Concrete Class</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {beamTypes.map((beam) => (
            <tr key={beam.id}>
              <td>{beam.name}</td>
              <td>{beam.width}</td>
              <td>{beam.depth}</td>
              <td>{beam.reinfKg}</td>
              <td>{beam.formworkFinish}</td>
              <td>{beam.concreteClass}</td>
              <td>
                <button onClick={() => editBeamType(beam.id)}>Edit</button>
                <button
                  onClick={() => deleteBeamType(beam.id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ marginTop: "40px" }} />

      <h2>Beam Measurements</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Mark"
          value={newMeasurement.mark}
          onChange={(e) =>
            setNewMeasurement({ ...newMeasurement, mark: e.target.value })
          }
        />

        <select
          value={newMeasurement.beamTypeId}
          onChange={(e) =>
            setNewMeasurement({
              ...newMeasurement,
              beamTypeId: Number(e.target.value),
            })
          }
        >
          <option value={0}>Select Beam Type</option>

          {beamTypes.map((beam) => (
            <option key={beam.id} value={beam.id}>
              {beam.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Length (m)"
          value={newMeasurement.length}
          onChange={(e) =>
            setNewMeasurement({
              ...newMeasurement,
              length: Number(e.target.value),
            })
          }
        />

        <button onClick={addMeasurement}>Add Measurement</button>
      </div>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Mark</th>
            <th>Beam Type</th>
            <th>Length</th>
          </tr>
        </thead>

        <tbody>
          {measurements.map((m) => {
            const beam = beamTypes.find((b) => b.id === m.beamTypeId);

            return (
              <tr key={m.id}>
                <td>{m.mark}</td>
                <td>{beam?.name}</td>
                <td>{m.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr style={{ marginTop: "40px" }} />

      <h2>Generated BOQ Summary</h2>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>BOQ Item</th>
            <th>Unit</th>
            <th>Total Quantity</th>
          </tr>
        </thead>

        <tbody>
          {Object.values(beamBoqItems).map((row) => (
            <tr key={row.item}>
              <td>{row.item}</td>
              <td>{row.unit}</td>
              <td>{row.qty.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ marginTop: "60px" }} />

<h1>Surface Bed Module</h1>
<h2>Surface Bed Type Library</h2>

<div style={{ marginBottom: "20px" }}>
  <input
    placeholder="Surface bed name"
    value={newSurfaceBed.name}
    onChange={(e) =>
      setNewSurfaceBed({ ...newSurfaceBed, name: e.target.value })
    }
  />

  <select
    value={newSurfaceBed.category}
    onChange={(e) =>
      setNewSurfaceBed({ ...newSurfaceBed, category: e.target.value })
    }
  >
    <option>Internal</option>
    <option>External</option>
    <option>Wet Area</option>
    <option>Balcony</option>
    <option>Roof Slab</option>
  </select>

  <input
    type="number"
    placeholder="Thickness mm"
    value={newSurfaceBed.thickness}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        thickness: Number(e.target.value),
      })
    }
  />

  <select
    value={newSurfaceBed.concreteClass}
    onChange={(e) =>
      setNewSurfaceBed({ ...newSurfaceBed, concreteClass: e.target.value })
    }
  >
    <option>25MPa/19mm</option>
    <option>30MPa/19mm</option>
    <option>35MPa/19mm</option>
  </select>

  <select
    value={newSurfaceBed.meshType}
    onChange={(e) =>
      setNewSurfaceBed({ ...newSurfaceBed, meshType: e.target.value })
    }
  >
    <option>None</option>
    <option>Ref193</option>
    <option>Ref245</option>
    <option>Ref395</option>
  </select>

  <label>
    DPM
    <input
      type="checkbox"
      checked={newSurfaceBed.dpm}
      onChange={(e) =>
        setNewSurfaceBed({ ...newSurfaceBed, dpm: e.target.checked })
      }
    />
  </label>

  <label>
    Soil Poison
    <input
      type="checkbox"
      checked={newSurfaceBed.soilPoison}
      onChange={(e) =>
        setNewSurfaceBed({
          ...newSurfaceBed,
          soilPoison: e.target.checked,
        })
      }
    />
  </label>

  <br />

  <h3>Layerworks</h3>

  <select
    value={newSurfaceBed.layer1Material}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        layer1Material: e.target.value,
      })
    }
  >
    <option value="">No Layer 1</option>
    <option>G5</option>
    <option>G6</option>
    <option>G7</option>
    <option>Selected Fill</option>
    <option>Imported Fill</option>
  </select>

  <input
    type="number"
    placeholder="Layer 1 thickness"
    value={newSurfaceBed.layer1Thickness}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        layer1Thickness: Number(e.target.value),
      })
    }
  />

  <select
    value={newSurfaceBed.layer2Material}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        layer2Material: e.target.value,
      })
    }
  >
    <option value="">No Layer 2</option>
    <option>G5</option>
    <option>G6</option>
    <option>G7</option>
    <option>Selected Fill</option>
    <option>Imported Fill</option>
  </select>

  <input
    type="number"
    placeholder="Layer 2 thickness"
    value={newSurfaceBed.layer2Thickness}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        layer2Thickness: Number(e.target.value),
      })
    }
  />

  <select
    value={newSurfaceBed.layer3Material}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        layer3Material: e.target.value,
      })
    }
  >
    <option value="">No Layer 3</option>
    <option>G5</option>
    <option>G6</option>
    <option>G7</option>
    <option>Selected Fill</option>
    <option>Imported Fill</option>
  </select>

  <input
    type="number"
    placeholder="Layer 3 thickness"
    value={newSurfaceBed.layer3Thickness}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        layer3Thickness: Number(e.target.value),
      })
    }
  />

  <h3>Finishes</h3>

  <label>
    Powerfloat
    <input
      type="checkbox"
      checked={newSurfaceBed.powerfloat}
      onChange={(e) =>
        setNewSurfaceBed({
          ...newSurfaceBed,
          powerfloat: e.target.checked,
        })
      }
    />
  </label>

  <label>
    Screed Required
    <input
      type="checkbox"
      checked={newSurfaceBed.screedRequired}
      onChange={(e) =>
        setNewSurfaceBed({
          ...newSurfaceBed,
          screedRequired: e.target.checked,
        })
      }
    />
  </label>

  <input
    type="number"
    placeholder="Screed thickness"
    value={newSurfaceBed.screedThickness}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        screedThickness: Number(e.target.value),
      })
    }
  />

  <select
    value={newSurfaceBed.screedType}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        screedType: e.target.value,
      })
    }
  >
    <option>Normal</option>
    <option>To Falls</option>
  </select>

  <label>
    Tile Required
    <input
      type="checkbox"
      checked={newSurfaceBed.tileRequired}
      onChange={(e) =>
        setNewSurfaceBed({
          ...newSurfaceBed,
          tileRequired: e.target.checked,
        })
      }
    />
  </label>

  <input
    type="number"
    placeholder="Tile PC Sum R/m²"
    value={newSurfaceBed.tilePcSum}
    onChange={(e) =>
      setNewSurfaceBed({
        ...newSurfaceBed,
        tilePcSum: Number(e.target.value),
      })
    }
  />

  <br />

  <button onClick={addSurfaceBedType}>
  {editingSurfaceBedId !== null
    ? "Update Surface Bed Type"
    : "Save Surface Bed Type"}
</button>
</div>
<table border={1} cellPadding={8}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Thickness</th>
      <th>Concrete</th>
      <th>Mesh</th>
      <th>DPM</th>
      <th>Soil Poison</th>
      <th>Layer 1</th>
      <th>Layer 2</th>
      <th>Layer 3</th>
      <th>Powerfloat</th>
      <th>Screed</th>
      <th>Tiles</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {surfaceBedTypes.map((sb) => (
      <tr key={sb.id}>
        <td>{sb.name}</td>
        <td>{sb.category}</td>
        <td>{sb.thickness}mm</td>
        <td>{sb.concreteClass}</td>
        <td>{sb.meshType}</td>
        <td>{sb.dpm ? "Yes" : "No"}</td>
        <td>{sb.soilPoison ? "Yes" : "No"}</td>
        <td>
          {sb.layer1Material
            ? `${sb.layer1Thickness}mm ${sb.layer1Material}`
            : "-"}
        </td>
        <td>
          {sb.layer2Material
            ? `${sb.layer2Thickness}mm ${sb.layer2Material}`
            : "-"}
        </td>
        <td>
          {sb.layer3Material
            ? `${sb.layer3Thickness}mm ${sb.layer3Material}`
            : "-"}
        </td>
        <td>{sb.powerfloat ? "Yes" : "No"}</td>
        <td>
          {sb.screedRequired
            ? `${sb.screedThickness}mm ${sb.screedType}`
            : "No"}
        </td>
        <td>
  {sb.tileRequired
    ? `PC Sum R${sb.tilePcSum}/m²`
    : "No"}
</td>

<td>
  <button
    onClick={() => editSurfaceBedType(sb.id)}
  >
    Edit
  </button>

  <button
    onClick={() => deleteSurfaceBedType(sb.id)}
    style={{ marginLeft: "5px" }}
  >
    Delete
  </button>
</td>

</tr>
        
    ))}
  </tbody>
</table>
<hr style={{ marginTop: "40px" }} />

<h2>Surface Bed Measurements</h2>
<div style={{ marginBottom: "20px" }}>
  <input
    placeholder="Mark"
    value={newSurfaceBedMeasurement.mark}
    onChange={(e) =>
      setNewSurfaceBedMeasurement({
        ...newSurfaceBedMeasurement,
        mark: e.target.value,
      })
    }
  />

  <select
    value={newSurfaceBedMeasurement.surfaceBedTypeId}
    onChange={(e) =>
      setNewSurfaceBedMeasurement({
        ...newSurfaceBedMeasurement,
        surfaceBedTypeId: Number(e.target.value),
      })
    }
  >
    <option value={0}>Select Surface Bed Type</option>

    {surfaceBedTypes.map((sb) => (
      <option key={sb.id} value={sb.id}>
        {sb.name}
      </option>
    ))}
  </select>

  <input
    type="number"
    placeholder="Area (m²)"
    value={newSurfaceBedMeasurement.area}
    onChange={(e) =>
      setNewSurfaceBedMeasurement({
        ...newSurfaceBedMeasurement,
        area: Number(e.target.value),
      })
    }
  />

  <button onClick={addSurfaceBedMeasurement}>
    Add Measurement
  </button>
</div>

<table border={1} cellPadding={8}>
  <thead>
    <tr>
      <th>Mark</th>
      <th>Surface Bed Type</th>
      <th>Area</th>
    </tr>
  </thead>

  <tbody>
    {surfaceBedMeasurements.map((m) => {
      const sb = surfaceBedTypes.find(
        (s) => s.id === m.surfaceBedTypeId
      );

      return (
        <tr key={m.id}>
          <td>{m.mark}</td>
          <td>{sb?.name}</td>
          <td>{m.area}</td>
        </tr>
      );
    })}
  </tbody>
</table>

<h2>Generated Surface Bed BOQ</h2>

<table border={1} cellPadding={8}>
  <thead>
    <tr>
      <th>BOQ Item</th>
      <th>Unit</th>
      <th>Total Quantity</th>
    </tr>
  </thead>

  <tbody>
    {Object.values(surfaceBedBoqItems).map((row) => (
      <tr key={row.item}>
        <td>{row.item}</td>
        <td>{row.unit}</td>
        <td>{row.qty.toFixed(3)}</td>
      </tr>
    ))}
  </tbody>
</table>
...
<hr style={{ marginTop: "60px" }} />

<h1>Pad Footing Module</h1>

<h2>Pad Footing Type Library</h2><div style={{ marginBottom: "20px" }}>
  <input
    placeholder="Pad Footing Name"
    value={newPadFooting.name}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        name: e.target.value,
      })
    }
  />

  <h3>Pad Size (mm)</h3>

  <input
    type="number"
    placeholder="Length"
    value={newPadFooting.padLength}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        padLength: Number(e.target.value),
      })
    }
  />

  <input
    type="number"
    placeholder="Width"
    value={newPadFooting.padWidth}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        padWidth: Number(e.target.value),
      })
    }
  />

  <input
    type="number"
    placeholder="Depth"
    value={newPadFooting.padDepth}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        padDepth: Number(e.target.value),
      })
    }
  />

  <h3>Excavation Size (mm)</h3>

  <input
    type="number"
    placeholder="Exc Length"
    value={newPadFooting.excavationLength}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        excavationLength: Number(e.target.value),
      })
    }
  />

  <input
    type="number"
    placeholder="Exc Width"
    value={newPadFooting.excavationWidth}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        excavationWidth: Number(e.target.value),
      })
    }
  />

  <input
    type="number"
    placeholder="Exc Depth"
    value={newPadFooting.excavationDepth}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        excavationDepth: Number(e.target.value),
      })
    }
  />

  <h3>Concrete & Reinforcement</h3>

  <select
    value={newPadFooting.concreteClass}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        concreteClass: e.target.value,
      })
    }
  >
    <option>25MPa/19mm</option>
    <option>30MPa/19mm</option>
    <option>35MPa/19mm</option>
  </select>

  <input
    type="number"
    placeholder="Reinf kg/m³"
    value={newPadFooting.reinfKg}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        reinfKg: Number(e.target.value),
      })
    }
  />

  <br />
  <br />

  <label>
    Formwork Required
    <input
      type="checkbox"
      checked={newPadFooting.formworkRequired}
      onChange={(e) =>
        setNewPadFooting({
          ...newPadFooting,
          formworkRequired: e.target.checked,
        })
      }
    />
  </label>

  <label style={{ marginLeft: "20px" }}>
    Blinding Required
    <input
      type="checkbox"
      checked={newPadFooting.blindingRequired}
      onChange={(e) =>
        setNewPadFooting({
          ...newPadFooting,
          blindingRequired: e.target.checked,
        })
      }
    />
  </label>

  <input
    type="number"
    placeholder="Blinding Thickness"
    value={newPadFooting.blindingThickness}
    onChange={(e) =>
      setNewPadFooting({
        ...newPadFooting,
        blindingThickness: Number(e.target.value),
      })
    }
  />

  <label style={{ marginLeft: "20px" }}>
    Soil Poison
    <input
      type="checkbox"
      checked={newPadFooting.soilPoison}
      onChange={(e) =>
        setNewPadFooting({
          ...newPadFooting,
          soilPoison: e.target.checked,
        })
      }
    />
  </label>

  <label style={{ marginLeft: "20px" }}>
    Backfill
    <input
      type="checkbox"
      checked={newPadFooting.backfill}
      onChange={(e) =>
        setNewPadFooting({
          ...newPadFooting,
          backfill: e.target.checked,
        })
      }
    />
  </label>

  <br />
  <br />

  <button onClick={addPadFootingType}>
    {editingPadFootingId !== null
      ? "Update Pad Footing"
      : "Save Pad Footing"}
  </button>
</div>
<table border={1} cellPadding={8}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Pad Size</th>
      <th>Excavation Size</th>
      <th>Concrete</th>
      <th>Reinf kg/m³</th>
      <th>Formwork</th>
      <th>Blinding</th>
      <th>Soil Poison</th>
      <th>Backfill</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {padFootingTypes.map((pf) => (
      <tr key={pf.id}>
        <td>{pf.name}</td>
        <td>
          {pf.padLength} x {pf.padWidth} x {pf.padDepth}mm
        </td>
        <td>
          {pf.excavationLength} x {pf.excavationWidth} x{" "}
          {pf.excavationDepth}mm
        </td>
        <td>{pf.concreteClass}</td>
        <td>{pf.reinfKg}</td>
        <td>{pf.formworkRequired ? "Yes" : "No"}</td>
        <td>
          {pf.blindingRequired
            ? `${pf.blindingThickness}mm`
            : "No"}
        </td>
        <td>{pf.soilPoison ? "Yes" : "No"}</td>
        <td>{pf.backfill ? "Yes" : "No"}</td>
        <td>
          <button onClick={() => editPadFootingType(pf.id)}>
            Edit
          </button>

          <button
            onClick={() => deletePadFootingType(pf.id)}
            style={{ marginLeft: "5px" }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
<hr style={{ marginTop: "40px" }} />

<h2>Pad Footing Measurements</h2>

<div style={{ marginBottom: "20px" }}>
  <input
    placeholder="Mark"
    value={newPadFootingMeasurement.mark}
    onChange={(e) =>
      setNewPadFootingMeasurement({
        ...newPadFootingMeasurement,
        mark: e.target.value,
      })
    }
  />

  <select
    value={newPadFootingMeasurement.padFootingTypeId}
    onChange={(e) =>
      setNewPadFootingMeasurement({
        ...newPadFootingMeasurement,
        padFootingTypeId: Number(e.target.value),
      })
    }
  >
    <option value={0}>Select Pad Footing Type</option>

    {padFootingTypes.map((pf) => (
      <option key={pf.id} value={pf.id}>
        {pf.name}
      </option>
    ))}
  </select>

  <input
    type="number"
    placeholder="Quantity"
    value={newPadFootingMeasurement.quantity}
    onChange={(e) =>
      setNewPadFootingMeasurement({
        ...newPadFootingMeasurement,
        quantity: Number(e.target.value),
      })
    }
  />

  <button onClick={addPadFootingMeasurement}>
    Add Measurement
  </button>
</div>
<table border={1} cellPadding={8}>
  <thead>
    <tr>
      <th>Mark</th>
      <th>Pad Footing Type</th>
      <th>Quantity</th>
    </tr>
  </thead>

  <tbody>
    {padFootingMeasurements.map((measurement) => {
      const pf = padFootingTypes.find(
        (p) => p.id === measurement.padFootingTypeId
      );

      return (
        <tr key={measurement.id}>
          <td>{measurement.mark}</td>
          <td>{pf?.name}</td>
          <td>{measurement.quantity}</td>
        </tr>
      );
    })}
  </tbody>
</table>
<hr style={{ marginTop: "40px" }} />

<h2>Generated Pad Footing BOQ</h2>

<table border={1} cellPadding={8}>
  <thead>
    <tr>
      <th>BOQ Item</th>
      <th>Unit</th>
      <th>Total Quantity</th>
    </tr>
  </thead>
<tbody>
  {(Object.values(padFootingBoqItems) as BoqItem[]).map((row) => (
    <tr key={row.item}>
      <td>{row.item}</td>
      <td>{row.unit}</td>
      <td>{row.qty.toFixed(3)}</td>
    </tr>
  ))}
</tbody>
</table>

    </main>
  );
}