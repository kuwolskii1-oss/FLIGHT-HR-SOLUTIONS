/**
 * The Parts page's engine scene: a generic high-bypass turbofan (illustrative, no maker's model,
 * no logos or text) on a transport stand in a clean warehouse, built in code with three.js.
 *
 * Browser only, and heavy: viewer.ts loads this module with a dynamic import() once the stage is
 * near the viewport and WebGL is available. Colours come from the --pv-* tokens in tokens.css,
 * read at runtime (readPalette), so no colour value lives in this file.
 *
 * Units: the fan tip diameter D = 1. The engine axis is world Z and the inlet faces +Z, so the
 * camera's azimuth 45 is the front three-quarter view and 135 the back right. Everything static is
 * merged into one mesh per material (about twenty draw calls); there are no real-time shadows: a
 * soft contact shadow is painted once into a small canvas texture under the stand.
 */
import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  Fog,
  Group,
  HemisphereLight,
  LatheGeometry,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  RepeatWrapping,
  Scene,
  SpotLight,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type Texture,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { STOPS as STOP_AZIMUTHS } from "./viewer-config";

/* ------------------------------------------------------------------ palette (tokens.css) */

const PALETTE_KEYS = [
  "fog",
  "floor",
  "floor-mottle",
  "floor-joint",
  "floor-line",
  "wall",
  "wall-rib",
  "plinth",
  "rack",
  "rack-beam",
  "crate",
  "wrap",
  "bin",
  "cowl",
  "lip",
  "liner",
  "duct",
  "fan",
  "spinner",
  "core",
  "cavity",
  "heat-straw",
  "heat-bronze",
  "heat-blue",
  "stand",
  "zinc",
  "steel",
  "rubber",
  "shadow",
  "light-key",
  "light-fill",
  "light-sky",
  "light-ground",
] as const;
export type PaletteKey = (typeof PALETTE_KEYS)[number];
export type Palette = Record<PaletteKey, string>;

/** Reads the --pv-* tokens as computed on `el` (custom properties inherit, so the section works). */
export function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  const out = {} as Palette;
  for (const k of PALETTE_KEYS) out[k] = cs.getPropertyValue(`--pv-${k}`).trim();
  return out;
}

/* ------------------------------------------------------------------ public types */

export type Insets = { top: number; right: number; bottom: number; left: number };
export type Point = { x: number; y: number; visible: boolean };
export type Rect = { left: number; top: number; right: number; bottom: number };

export interface EngineStage {
  readonly canvas: HTMLCanvasElement;
  /** Size in CSS px, the device pixel ratio to render at, and the stage areas the engine must keep clear of. */
  setSize(width: number, height: number, dpr: number, insets: Insets): void;
  /** Camera azimuth in degrees (unwrapped values are fine: 405 is 45). */
  setAzimuth(deg: number): void;
  render(): void;
  /** The callout anchor for a stop (index 0..3), projected at the current camera, in CSS px. */
  anchor(stop: number): Point;
  /** The rig's projected bounds at the current camera, in CSS px. */
  bounds(): Rect;
  dispose(): void;
}

export type StageOptions = {
  /** Keep the drawing buffer (only the offline poster renderer needs it, for toDataURL). */
  preserveDrawingBuffer?: boolean;
  /** Allow software rendering (tests and the poster renderer run on SwiftShader). */
  allowSoftware?: boolean;
};

const FOV = 24; // vertical, degrees: a long lens keeps the engine's proportions true
const ELEVATION = MathUtils.degToRad(13);

/* ------------------------------------------------------------------ geometry helpers */

const tmpQ = new Quaternion();
const tmpE = new Euler();
const tmpS = new Vector3();
const tmpP = new Vector3();

/** A transform matrix from a position, Euler rotation (radians, XYZ) and optional scale. */
function tf(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1): Matrix4 {
  tmpE.set(rx, ry, rz);
  tmpQ.setFromEuler(tmpE);
  tmpS.set(s, s, s);
  tmpP.set(x, y, z);
  return new Matrix4().compose(tmpP, tmpQ, tmpS);
}

type Bucket = { geos: BufferGeometry[]; keepColor: boolean; keepUv: boolean };

/** Collects geometry per material; flush() merges each bucket into a single mesh. */
class Batch {
  private buckets = new Map<string, Bucket>();
  add(key: string, geo: BufferGeometry, m?: Matrix4) {
    if (m) geo.applyMatrix4(m);
    let b = this.buckets.get(key);
    if (!b) {
      b = { geos: [], keepColor: false, keepUv: false };
      this.buckets.set(key, b);
    }
    b.geos.push(geo);
  }
  flag(key: string, opts: Partial<Pick<Bucket, "keepColor" | "keepUv">>) {
    const b = this.buckets.get(key) ?? { geos: [], keepColor: false, keepUv: false };
    Object.assign(b, opts);
    this.buckets.set(key, b);
  }
  /**
   * Merges each bucket into one mesh. With `ao`, a baked occlusion factor per vertex is written as
   * a vertex colour (multiplied into any colour already there) and the material uses it.
   */
  flush(materials: Record<string, Material>, parent: Group, ao?: (x: number, y: number, z: number, ny: number, key: string) => number) {
    for (const [key, b] of this.buckets) {
      if (!b.geos.length) continue;
      const prepared = b.geos.map((geo) => {
        for (const name of Object.keys(geo.attributes)) {
          if (name === "position" || name === "normal") continue;
          if (name === "color" && b.keepColor) continue;
          if (name === "uv" && b.keepUv) continue;
          geo.deleteAttribute(name);
        }
        if (!geo.index) {
          const n = geo.attributes.position.count;
          const idx = new Array<number>(n);
          for (let i = 0; i < n; i++) idx[i] = i;
          geo.setIndex(idx);
        }
        return geo;
      });
      const merged = mergeGeometries(prepared, false);
      prepared.forEach((g) => g.dispose());
      if (!merged) continue;
      if (ao) {
        const pos = merged.attributes.position;
        const nor = merged.attributes.normal;
        const had = merged.attributes.color;
        const c = new Float32Array(pos.count * 3);
        for (let i = 0; i < pos.count; i++) {
          const f = ao(pos.getX(i), pos.getY(i), pos.getZ(i), nor.getY(i), key);
          c[i * 3] = f * (had ? had.getX(i) : 1);
          c[i * 3 + 1] = f * (had ? had.getY(i) : 1);
          c[i * 3 + 2] = f * (had ? had.getZ(i) : 1);
        }
        merged.setAttribute("color", new Float32BufferAttribute(c, 3));
        (materials[key] as MeshStandardMaterial).vertexColors = true;
      }
      const mesh = new Mesh(merged, materials[key]);
      mesh.name = key;
      mesh.matrixAutoUpdate = false;
      parent.add(mesh);
    }
    this.buckets.clear();
  }
}

/* ------------------------------------------------------------------ the engine */

// Distances along the engine are "aft of the inlet highlight" (0 at the lip, 2.83 at the plug tip).
// mz() shortens the drafting profile's inlet to about 0.45 D, the proportion of a modern short
// inlet, and shifts everything behind the fan forward by 0.18 D.
const mz = (z: number) => (z <= 0.09 ? z : z <= 0.66 ? 0.09 + (z - 0.09) * (0.39 / 0.57) : z - 0.18);
const Y0 = 1.25;
/** Engine-local axial coordinate (+ forward) of a point `zAft` behind the inlet lip. */
const Z = (zAft: number) => Y0 - mz(zAft);

/** A surface of revolution about the engine axis from (radius, zAft) pairs. */
function lathe(pts: [number, number][], segments = 96): BufferGeometry {
  const g = new LatheGeometry(
    pts.map(([r, z]) => new Vector2(r, Z(z))),
    segments,
  );
  g.rotateX(Math.PI / 2); // lathe +Y becomes world +Z (forward)
  return g;
}

function heatTint(g: BufferGeometry, z0: number, z1: number, p: Palette) {
  const pos = g.attributes.position;
  const straw = col(p["heat-straw"]);
  const bronze = col(p["heat-bronze"]);
  const blue = col(p["heat-blue"]);
  const c = new Color();
  const arr = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = MathUtils.clamp((Y0 - pos.getZ(i) - mz(z0)) / (mz(z1) - mz(z0)), 0, 1);
    if (t < 0.5) c.lerpColors(straw, bronze, t * 2);
    else c.lerpColors(bronze, blue, (t - 0.5) * 2);
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new Float32BufferAttribute(arr, 3));
  return g;
}

/** Wide-chord fan blade: twisted, cambered and wrapped onto the cylinder at each radius. */
function bladeGeometry(rHub: number, rTip: number, zFan: number): BufferGeometry {
  const NS = 14;
  const NC = 10;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let side = 0; side < 2; side++) {
    for (let i = 0; i <= NS; i++) {
      const s = i / NS;
      const r = rHub + (rTip - rHub) * s;
      const chord = MathUtils.lerp(0.13, 0.21, Math.pow(s, 0.8));
      const beta = MathUtils.degToRad(MathUtils.lerp(22, 63, Math.pow(s, 0.85)));
      const sweep = 0.035 * s * s;
      for (let j = 0; j <= NC; j++) {
        const u = j / NC;
        const along = (u - 0.5) * chord;
        const thick =
          (side ? 1 : -1) * 0.5 * MathUtils.lerp(0.014, 0.004, s) * Math.sin(Math.PI * Math.min(1, u * 1.15));
        const camber = 0.06 * chord * 4 * u * (1 - u) + thick;
        const tan = along * Math.sin(beta) + camber * Math.cos(beta);
        const ax = along * Math.cos(beta) - camber * Math.sin(beta) + sweep;
        const phi = tan / r;
        pos.push(r * Math.cos(phi), r * Math.sin(phi), Z(zFan) - ax);
      }
    }
  }
  const row = NC + 1;
  const sideN = (NS + 1) * row;
  for (let side = 0; side < 2; side++)
    for (let i = 0; i < NS; i++)
      for (let j = 0; j < NC; j++) {
        const a = side * sideN + i * row + j;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;
        if (side) idx.push(a, c, b, b, c, d);
        else idx.push(a, b, c, b, d, c);
      }
  for (let j = 0; j < NC; j++) {
    const a = NS * row + j;
    const b = sideN + NS * row + j;
    idx.push(a, a + 1, b, a + 1, b + 1, b);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** A painted spiral on the spinner (a generic rotation cue every fan carries; no marks). */
function swirlGeometry(): BufferGeometry {
  const pts: Vector3[] = [];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const zA = 0.31 + 0.25 * t;
    const r = 0.162 * Math.sqrt(Math.min(1, (zA - 0.3) / 0.3)) + 0.0025;
    const a = t * Math.PI * 1.25;
    pts.push(new Vector3(r * Math.cos(a), r * Math.sin(a), Z(zA)));
  }
  const pos: number[] = [];
  for (let i = 0; i < N; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const w = 0.01 + 0.022 * (i / N);
    const n = new Vector3(a.x, a.y, 0).normalize();
    const side = new Vector3().subVectors(b, a).cross(n).normalize().multiplyScalar(w);
    pos.push(...a.clone().add(side).toArray(), ...a.clone().sub(side).toArray(), ...b.clone().add(side).toArray());
    pos.push(...a.clone().sub(side).toArray(), ...b.clone().sub(side).toArray(), ...b.clone().add(side).toArray());
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

const H = 1.02; // engine centreline above the floor

function buildEngine(batch: Batch, p: Palette) {
  const at = (m: Matrix4) => m.premultiply(new Matrix4().makeTranslation(0, H, 0));
  const E = (key: string, g: BufferGeometry, m = new Matrix4()) => batch.add(key, g, at(m));

  // Nacelle outer skin (fan cowl and thrust reverser sleeve), aft to forward.
  E(
    "cowl",
    lathe(
      [
        [0.482, 1.9],
        [0.503, 1.8],
        [0.525, 1.7],
        [0.565, 1.45],
        [0.598, 1.15],
        [0.615, 0.85],
        [0.624, 0.55],
        [0.623, 0.35],
        [0.614, 0.2],
        [0.6, 0.1],
      ],
      128,
    ),
  );
  // Inlet lip, polished: outer shoulder, highlight, throat.
  E(
    "lip",
    lathe(
      [
        [0.6, 0.1],
        [0.594, 0.07],
        [0.588, 0.05],
        [0.572, 0.018],
        [0.553, 0.002],
        [0.54, 0.0],
        [0.527, 0.006],
        [0.516, 0.022],
        [0.508, 0.048],
        [0.503, 0.09],
      ],
      128,
    ),
  );
  // Inlet duct (acoustic liner) to the fan face, then the bypass duct to the fan nozzle.
  E("liner", lathe([[0.503, 0.09], [0.5, 0.2], [0.502, 0.4], [0.505, 0.55], [0.506, 0.66]]));
  E("duct", lathe([[0.506, 0.66], [0.505, 0.95], [0.495, 1.4], [0.478, 1.9]]));
  E("cowl", lathe([[0.478, 1.9], [0.482, 1.9]]));
  // Spinner (ogive) with its painted swirl.
  E(
    "spinner",
    lathe(
      [
        [0.0, 0.3],
        [0.03, 0.305],
        [0.06, 0.325],
        [0.09, 0.36],
        [0.12, 0.41],
        [0.145, 0.47],
        [0.158, 0.53],
        [0.162, 0.6],
      ],
      64,
    ),
  );
  E("swirl", swirlGeometry());
  E("core", lathe([[0.162, 0.6], [0.17, 0.66], [0.172, 0.72], [0.0, 0.72]], 64));

  // Fan: 22 wide-chord blades, merged into one geometry.
  const blade = bladeGeometry(0.165, 0.497, 0.62);
  for (let i = 0; i < 22; i++) E("fan", blade.clone(), tf(0, 0, 0, 0, 0, (i / 22) * Math.PI * 2));
  blade.dispose();

  // Splitter lip, dark core inlet, dark annulus behind the fan (blade gaps read as depth).
  E("lip", lathe([[0.27, 0.86], [0.285, 0.78], [0.292, 0.8], [0.3, 0.9]], 64));
  E("cavity", lathe([[0.27, 0.86], [0.2, 0.95]], 64));
  E("cavity", lathe([[0.172, 0.72], [0.2, 0.95]], 64));
  E("cavity", lathe([[0.172, 0.74], [0.5, 0.74]], 64));
  // Outlet guide vanes.
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const m = tf(Math.cos(a) * 0.395, Math.sin(a) * 0.395, Z(0.98), 0, 0, a - Math.PI / 2);
    m.multiply(new Matrix4().makeRotationX(0.15));
    E("duct", new BoxGeometry(0.004, 0.2, 0.07), m);
  }

  // Core cowl, core nozzle (heat tinted), the dark exhaust annulus and the plug.
  E(
    "core",
    lathe(
      [
        [0.3, 0.9],
        [0.318, 1.2],
        [0.332, 1.55],
        [0.336, 1.8],
        [0.328, 2.0],
        [0.3, 2.2],
        [0.262, 2.36],
        [0.24, 2.42],
      ],
      96,
    ),
  );
  E(
    "hot",
    heatTint(
      lathe([
        [0.262, 2.3],
        [0.245, 2.4],
        [0.236, 2.46],
        [0.232, 2.47],
      ]),
      2.3,
      2.47,
      p,
    ),
  );
  E("cavity", lathe([[0.232, 2.47], [0.228, 2.4], [0.18, 2.36]], 64));
  E(
    "hot",
    heatTint(
      lathe(
        [
          [0.172, 2.34],
          [0.17, 2.45],
          [0.16, 2.55],
          [0.13, 2.65],
          [0.09, 2.74],
          [0.045, 2.8],
          [0.0, 2.83],
        ],
        64,
      ),
      2.34,
      2.83,
      p,
    ),
  );

  // Panel split lines on the nacelle: inlet to fan cowl, fan cowl to thrust reverser.
  for (const [zA, r] of [
    [0.52, 0.6248],
    [1.12, 0.6008],
  ] as const) {
    E("seam", new TorusGeometry(r, 0.0022, 6, 128), tf(0, 0, Z(zA)));
  }

  // The mount lug at 12 o'clock on the turbine rear frame (the fan frame mount sits under the cowl).
  E("steel", new RoundedBoxGeometry(0.08, 0.07, 0.12, 2, 0.012), tf(0, 0.355, Z(2.12)));
}

/* ------------------------------------------------------------------ the transport stand */

/** The stand's frame (for the contact shadow) and the rig's overall front and rear. */
type StandExtents = { zF: number; zR: number; rail: number; zFront: number; zRear: number };

function buildStand(batch: Batch): StandExtents {
  const zF = Z(0.12);
  const zR = Z(2.72);
  const L = zF - zR;
  const zc = (zF + zR) / 2;
  const RX = 0.52; // rail half spacing
  const tube = (w: number, h: number, d: number, m: Matrix4, key = "stand") =>
    batch.add(key, new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.18), m);
  const rod = (r: number, len: number, m: Matrix4, key = "zinc", seg = 16) =>
    batch.add(key, new CylinderGeometry(r, r, len, seg), m);
  /** A straight member between two points (square tube). */
  const member = (a: Vector3, b: Vector3, w: number, key = "stand") => {
    const dir = new Vector3().subVectors(b, a);
    const len = dir.length();
    const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize());
    const m = new Matrix4().compose(new Vector3().addVectors(a, b).multiplyScalar(0.5), q, new Vector3(1, 1, 1));
    batch.add(key, new RoundedBoxGeometry(w, len, w, 2, w * 0.18), m);
  };

  // Base frame: two longitudinal rails and three cross members.
  const yBase = 0.21;
  for (const x of [-RX, RX]) tube(0.09, 0.11, L, tf(x, yBase, zc));
  for (const z of [zF - 0.05, zc, zR + 0.05]) tube(RX * 2 + 0.1, 0.09, 0.09, tf(0, yBase, z));
  // Corner gussets.
  for (const x of [-1, 1])
    for (const z of [zF - 0.05, zR + 0.05]) {
      const m = tf(x * (RX - 0.09), yBase + 0.05, z - Math.sign(z - zc) * 0.09, 0, Math.PI / 4, 0);
      batch.add("stand", new BoxGeometry(0.16, 0.012, 0.03), m);
    }

  // Swivel casters: top plate, swivel, fork, tyred wheel and hub.
  const wheel = new LatheGeometry(
    [
      [0.0, -0.028],
      [0.052, -0.028],
      [0.062, -0.026],
      [0.07, -0.02],
      [0.074, -0.01],
      [0.075, 0.0],
      [0.074, 0.01],
      [0.07, 0.02],
      [0.062, 0.026],
      [0.052, 0.028],
      [0.0, 0.028],
    ].map(([r, y]) => new Vector2(r, y)),
    28,
  );
  for (const x of [-RX, RX])
    for (const z of [zF - 0.16, zR + 0.16]) {
      tube(0.13, 0.014, 0.13, tf(x, 0.152, z), "steel");
      rod(0.03, 0.03, tf(x, 0.132, z), "steel");
      for (const s of [-1, 1]) tube(0.012, 0.09, 0.085, tf(x + s * 0.036, 0.085, z + 0.012), "steel");
      batch.add("rubber", wheel.clone(), tf(x, 0.075, z + 0.02, 0, 0, Math.PI / 2));
      rod(0.03, 0.062, tf(x, 0.075, z + 0.02, 0, 0, Math.PI / 2), "zinc", 18);
    }
  wheel.dispose();

  // Levelling jacks at the four corners, just clear of the floor.
  for (const x of [-RX - 0.09, RX + 0.09])
    for (const z of [zF - 0.05, zR + 0.05]) {
      tube(0.08, 0.02, 0.06, tf(x - Math.sign(x) * 0.03, yBase + 0.03, z), "stand");
      rod(0.014, 0.19, tf(x, 0.13, z), "zinc");
      rod(0.04, 0.016, tf(x, 0.03, z), "steel", 20);
    }

  // Tow bar: an A-frame hinged at the front cross member, folded up and leaning back.
  const hingeZ = zF + 0.02;
  const eye = new Vector3(0, yBase + 0.44, hingeZ + 0.22);
  for (const s of [-1, 1]) {
    member(new Vector3(s * 0.26, yBase + 0.02, hingeZ + 0.03), eye.clone().add(new Vector3(s * 0.035, -0.04, -0.01)), 0.038);
    rod(0.022, 0.07, tf(s * 0.26, yBase + 0.02, hingeZ + 0.03, 0, 0, Math.PI / 2), "zinc");
  }
  batch.add("zinc", new TorusGeometry(0.05, 0.012, 10, 24), tf(eye.x, eye.y + 0.03, eye.z, 0.28, 0, 0));

  // Shock mounts (rubber between steel plates) and the upper cradle rails.
  const yUp = 0.35;
  for (const x of [-RX, RX])
    for (const z of [zF - 0.42, zc, zR + 0.42]) {
      tube(0.1, 0.012, 0.1, tf(x, 0.272, z), "zinc");
      rod(0.046, 0.05, tf(x, 0.302, z), "rubber", 18);
      tube(0.1, 0.012, 0.1, tf(x, 0.332, z), "zinc");
    }
  for (const x of [-RX, RX]) tube(0.075, 0.075, L - 0.3, tf(x, yUp + 0.02, zc - 0.05));
  const zTr = Z(1.0); // forward yoke at the fan case
  const zAft = Z(2.12); // aft mount under the turbine rear frame
  for (const z of [zTr, zAft, Z(0.55)]) tube(RX * 2, 0.06, 0.06, tf(0, yUp + 0.02, z));

  // Forward yoke: outriggers, uprights and trunnions at 3 and 9 o'clock, with diagonal braces.
  for (const s of [-1, 1]) {
    tube(0.3, 0.075, 0.075, tf(s * 0.64, yUp + 0.02, zTr));
    tube(0.075, H - yUp + 0.05, 0.075, tf(s * 0.75, (H + yUp) / 2 + 0.02, zTr));
    tube(0.12, 0.12, 0.12, tf(s * 0.75, H, zTr), "stand");
    rod(0.036, 0.16, tf(s * 0.66, H, zTr, 0, 0, Math.PI / 2), "zinc", 20);
    rod(0.05, 0.02, tf(s * 0.815, H, zTr, 0, 0, Math.PI / 2), "steel", 20);
    member(new Vector3(s * RX, yUp + 0.04, zTr + 0.36), new Vector3(s * 0.75, H - 0.2, zTr + 0.02), 0.05);
    member(new Vector3(s * RX, yUp + 0.04, zTr - 0.36), new Vector3(s * 0.75, H - 0.2, zTr - 0.02), 0.05);
  }

  // Forward saddle under the inlet cowl: two posts and a curved rubber pad.
  const zSad = Z(0.55);
  for (const s of [-1, 1]) tube(0.07, 0.08, 0.07, tf(s * 0.3, 0.43, zSad));
  batch.add("stand", new TorusGeometry(0.66, 0.024, 8, 36, Math.PI * 0.34), tf(0, H, zSad, 0, 0, Math.PI * 1.33));
  batch.add("rubber", new TorusGeometry(0.635, 0.016, 8, 36, Math.PI * 0.3), tf(0, H, zSad, 0, 0, Math.PI * 1.35));

  // Aft mount: an A-frame to a half hoop under the core, with a rubber saddle inside it.
  batch.add("stand", new TorusGeometry(0.37, 0.03, 10, 48, Math.PI), tf(0, H, zAft, 0, 0, Math.PI));
  batch.add("rubber", new TorusGeometry(0.338, 0.012, 8, 40, Math.PI * 0.6), tf(0, H, zAft, 0, 0, Math.PI * 1.2));
  for (const s of [-1, 1]) {
    member(new Vector3(s * RX, yUp + 0.04, zAft), new Vector3(s * 0.37, H, zAft), 0.06);
    tube(0.1, 0.05, 0.1, tf(s * 0.37, H + 0.01, zAft), "steel");
  }

  // Lifting eyes on the upper rails.
  for (const x of [-RX, RX])
    for (const z of [zF - 0.3, zR + 0.3])
      batch.add("zinc", new TorusGeometry(0.035, 0.009, 8, 18), tf(x, yUp + 0.09, z, 0, Math.PI / 2, 0));

  return { zF, zR, rail: RX, zFront: Math.max(zF + 0.25, Z(0) + 0.02), zRear: Math.min(zR, Z(2.83)) };
}

/* ------------------------------------------------------------------ the warehouse */

function buildWarehouse(batch: Batch) {
  // Scale: D = 1 is a fan of about 1.8 m, so a pallet position is about 0.67 D wide and a rack
  // level about 0.85 D high. The hall is 24 D (about 43 m) square, 6 D high.
  const ROOM = 12;
  const WALL_H = 6;
  const BAY = 1.5;
  const DEPTH = 0.6;
  const LEVELS = [0.9, 1.75, 2.6];
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 4; k++) {
    const rot = new Matrix4().makeRotationY((k * Math.PI) / 2);
    const W = (key: string, g: BufferGeometry, m: Matrix4) => batch.add(key, g, m.premultiply(rot));
    const zw = -ROOM;
    // Insulated cladding with standing ribs over a concrete plinth.
    W("wall", new PlaneGeometry(ROOM * 2, WALL_H), tf(0, WALL_H / 2, zw));
    W("plinth", new BoxGeometry(ROOM * 2, 0.7, 0.16), tf(0, 0.35, zw + 0.08));
    for (let x = -ROOM + 0.2; x < ROOM; x += 0.32)
      W("wall-rib", new BoxGeometry(0.06, WALL_H - 0.7, 0.05), tf(x, 0.7 + (WALL_H - 0.7) / 2, zw + 0.025));
    // A sectional door in the middle of the wall (horizontal panels), racking either side.
    const doorW = 4.2;
    const doorH = 3.4;
    W("door", new BoxGeometry(doorW, doorH, 0.06), tf(0, doorH / 2, zw + 0.1));
    for (let y = 0.42; y < doorH; y += 0.42) W("door-line", new BoxGeometry(doorW, 0.025, 0.02), tf(0, y, zw + 0.14));
    for (const sx of [-1, 1]) W("rack", new BoxGeometry(0.14, doorH + 0.14, 0.14), tf(sx * (doorW / 2 + 0.07), (doorH + 0.14) / 2, zw + 0.12));
    W("rack", new BoxGeometry(doorW + 0.28, 0.14, 0.14), tf(0, doorH + 0.07, zw + 0.12));
    // Pallet racking: slate uprights and beams, stock on the floor and three levels.
    const zr = zw + 0.35 + DEPTH / 2;
    for (const side of [-1, 1]) {
      const x0 = side * (doorW / 2 + 0.6);
      const bays = 6;
      for (let b = 0; b <= bays; b++) {
        const x = x0 + side * b * BAY;
        for (const dz of [-DEPTH / 2, DEPTH / 2]) W("rack", new BoxGeometry(0.05, 3.05, 0.05), tf(x, 1.525, zr + dz));
      }
      for (let b = 0; b < bays; b++) {
        const xc = x0 + side * (b + 0.5) * BAY;
        for (const y of LEVELS) for (const dz of [-DEPTH / 2, DEPTH / 2]) W("rack-beam", new BoxGeometry(BAY, 0.07, 0.035), tf(xc, y, zr + dz));
        for (const y of [0, ...LEVELS]) {
          for (const dx of [-0.36, 0.36]) {
            const r = rnd();
            if (r < 0.2) continue;
            const h = 0.42 + rnd() * 0.3;
            const key = r < 0.5 ? "crate" : r < 0.8 ? "wrap" : "bin";
            W("crate-base", new BoxGeometry(0.66, 0.07, 0.56), tf(xc + dx, y + 0.07, zr));
            W(key, new BoxGeometry(0.62, h, 0.52), tf(xc + dx, y + 0.105 + h / 2, zr));
          }
        }
      }
    }
  }
}

/**
 * Baked occlusion for the rig (no shadow maps at run time): faces that look down are darker, and
 * the parts of the stand under the engine sit in its shade, most of all near the centre line.
 * Coordinates are rig-local (engine centreline at y = H, the inlet towards +z).
 */
function occlusion(x: number, y: number, z: number, ny: number, key: string): number {
  const smooth = (a: number, b: number, v: number) => {
    const t = MathUtils.clamp((v - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  let f = 0.66 + 0.34 * smooth(-0.9, 0.5, ny);
  const underEngine = y < H - 0.25 && z < Z(0.05) && z > Z(2.6);
  if (underEngine && (key === "stand" || key === "zinc" || key === "steel" || key === "rubber")) {
    const cover = 1 - smooth(0.45, 0.8, Math.abs(x)); // 1 right under the nacelle, 0 clear of it
    const low = 1 - smooth(0.2, H - 0.25, y) * 0.35; // lower parts get less sky
    f *= 1 - 0.45 * cover * low;
  }
  // The lower half of the nacelle and core is shaded by the engine itself.
  if (key === "cowl" || key === "core" || key === "lip" || key === "hot") f *= 0.82 + 0.18 * smooth(H - 0.55, H + 0.1, y);
  return f;
}

/* ------------------------------------------------------------------ textures */

function col(v: string): Color {
  const c = new Color(0.5, 0.5, 0.5);
  if (v) {
    try {
      c.setStyle(v);
    } catch {}
  }
  return c;
}

/** Polished concrete: soft mottling, saw-cut joints every 3 D, a faint trowel sheen. */
function floorTexture(p: Palette, maxAniso: number): Texture {
  const S = 512;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const x = cv.getContext("2d")!;
  x.fillStyle = p.floor;
  x.fillRect(0, 0, S, S);
  // Mottling: many large, faint blobs (deterministic).
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  x.globalAlpha = 0.05;
  x.fillStyle = p["floor-mottle"];
  for (let i = 0; i < 900; i++) {
    const r = 4 + rnd() * 26;
    x.beginPath();
    x.arc(rnd() * S, rnd() * S, r, 0, Math.PI * 2);
    x.fill();
  }
  x.fillStyle = p.wrap;
  x.globalAlpha = 0.035;
  for (let i = 0; i < 500; i++) {
    const r = 3 + rnd() * 18;
    x.beginPath();
    x.arc(rnd() * S, rnd() * S, r, 0, Math.PI * 2);
    x.fill();
  }
  // Saw-cut joints on the tile's edges (the tile repeats every 3 D).
  x.globalAlpha = 0.9;
  x.fillStyle = p["floor-joint"];
  x.fillRect(0, 0, S, 2);
  x.fillRect(0, 0, 2, S);
  x.globalAlpha = 1;
  const t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.anisotropy = Math.min(8, maxAniso);
  return t;
}

/**
 * The contact shadow: the stand's footprint and the engine's ambient occlusion painted once into a
 * small canvas (blurred with shadowBlur, which every browser supports) and laid on the floor.
 */
function contactShadow(p: Palette, ext: StandExtents): { tex: Texture; w: number; d: number; z: number } {
  const w = 3.6;
  const d = ext.zFront - ext.zRear + 2;
  const S = 256;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = Math.round((S * d) / w);
  const x = cv.getContext("2d")!;
  const k = S / w; // px per D
  const zc = (ext.zFront + ext.zRear) / 2;
  const px = (vx: number) => S / 2 + vx * k;
  // The plane lies flat with its texture's top edge towards -z, so the front (+z) is drawn low.
  const pz = (vz: number) => cv.height / 2 + (vz - zc) * k;
  const OFF = 4000;
  const soft = (blur: number, alpha: number, draw: () => void) => {
    x.save();
    x.shadowColor = p.shadow;
    x.shadowBlur = blur;
    x.shadowOffsetX = OFF;
    x.globalAlpha = alpha;
    x.translate(-OFF, 0);
    x.fillStyle = p.shadow;
    draw();
    x.restore();
  };
  const rect = (x0: number, z0: number, x1: number, z1: number) =>
    x.fillRect(px(Math.min(x0, x1)), pz(Math.min(z0, z1)), Math.abs(x1 - x0) * k, Math.abs(z1 - z0) * k);
  // Ambient occlusion under the whole rig: broad and very soft.
  soft(64, 0.5, () => rect(-0.78, ext.zR - 0.15, 0.78, ext.zF + 0.15));
  // Under the engine itself, a little denser along its length.
  soft(34, 0.38, () => {
    x.beginPath();
    x.ellipse(px(0), pz(Z(1.3)), 0.5 * k, 1.25 * k, 0, 0, Math.PI * 2);
    x.fill();
  });
  // The frame: rails and cross members sit low, so their shadow is fairly crisp.
  soft(8, 0.4, () => {
    for (const s of [-1, 1]) rect(s * ext.rail - 0.05, ext.zR, s * ext.rail + 0.05, ext.zF);
    for (const z of [ext.zF - 0.05, (ext.zF + ext.zR) / 2, ext.zR + 0.05]) rect(-ext.rail - 0.05, z - 0.05, ext.rail + 0.05, z + 0.05);
  });
  // Casters and jack pads: tight, dark contact patches.
  soft(3, 0.75, () => {
    for (const s of [-1, 1])
      for (const z of [ext.zF - 0.16 + 0.02, ext.zR + 0.16 + 0.02]) {
        x.beginPath();
        x.ellipse(px(s * ext.rail), pz(z), 0.03 * k, 0.065 * k, 0, 0, Math.PI * 2);
        x.fill();
      }
  });
  const t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  return { tex: t, w, d, z: zc };
}

/* ------------------------------------------------------------------ the stage */

/** True when this browser can make a WebGL context we are willing to use. */
export function canRenderWebGL(allowSoftware = false): boolean {
  try {
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl2", { failIfMajorPerformanceCaveat: !allowSoftware }) ??
      c.getContext("webgl", { failIfMajorPerformanceCaveat: !allowSoftware });
    const ok = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

export function createEngineStage(canvas: HTMLCanvasElement, p: Palette, opts: StageOptions = {}): EngineStage {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: !opts.allowSoftware,
    preserveDrawingBuffer: !!opts.preserveDrawingBuffer,
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new Scene();
  const fog = col(p.fog);
  scene.background = fog.clone();
  scene.fog = new Fog(fog.clone(), 10, 40);
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.5;
  pmrem.dispose();

  const camera = new PerspectiveCamera(FOV, 16 / 9, 0.1, 80);

  // Materials, one per bucket.
  const M: Record<string, Material> = {
    cowl: new MeshPhysicalMaterial({ color: col(p.cowl), roughness: 0.4, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, side: DoubleSide }),
    seam: new MeshStandardMaterial({ color: col(p.core), roughness: 0.6, metalness: 0.3 }),
    lip: new MeshStandardMaterial({ color: col(p.lip), roughness: 0.16, metalness: 1 }),
    liner: new MeshStandardMaterial({ color: col(p.liner), roughness: 0.78, metalness: 0.2, side: DoubleSide }),
    duct: new MeshStandardMaterial({ color: col(p.duct), roughness: 0.62, metalness: 0.3, side: DoubleSide }),
    fan: new MeshStandardMaterial({ color: col(p.fan), roughness: 0.3, metalness: 1, side: DoubleSide, envMapIntensity: 1 }),
    spinner: new MeshPhysicalMaterial({ color: col(p.spinner), roughness: 0.25, metalness: 0.2, clearcoat: 1 }),
    swirl: new MeshStandardMaterial({ color: col(p.cowl), roughness: 0.4, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }),
    core: new MeshStandardMaterial({ color: col(p.core), roughness: 0.38, metalness: 0.75 }),
    hot: new MeshStandardMaterial({ vertexColors: true, roughness: 0.42, metalness: 1, side: DoubleSide }),
    cavity: new MeshStandardMaterial({ color: col(p.cavity), roughness: 1, metalness: 0, side: DoubleSide }),
    stand: new MeshPhysicalMaterial({ color: col(p.stand), roughness: 0.5, metalness: 0.05, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
    zinc: new MeshStandardMaterial({ color: col(p.zinc), roughness: 0.34, metalness: 0.9 }),
    steel: new MeshStandardMaterial({ color: col(p.steel), roughness: 0.42, metalness: 0.85 }),
    rubber: new MeshStandardMaterial({ color: col(p.rubber), roughness: 0.88, metalness: 0 }),
    wall: new MeshStandardMaterial({ color: col(p.wall), roughness: 0.9 }),
    "wall-rib": new MeshStandardMaterial({ color: col(p["wall-rib"]), roughness: 0.85 }),
    plinth: new MeshStandardMaterial({ color: col(p.plinth), roughness: 0.95 }),
    door: new MeshStandardMaterial({ color: col(p.wrap), roughness: 0.6, metalness: 0.2 }),
    "door-line": new MeshStandardMaterial({ color: col(p["wall-rib"]), roughness: 0.7 }),
    rack: new MeshStandardMaterial({ color: col(p.rack), roughness: 0.55, metalness: 0.2 }),
    "rack-beam": new MeshStandardMaterial({ color: col(p["rack-beam"]), roughness: 0.5, metalness: 0.15 }),
    crate: new MeshStandardMaterial({ color: col(p.crate), roughness: 0.9 }),
    "crate-base": new MeshStandardMaterial({ color: col(p.plinth), roughness: 0.9 }),
    wrap: new MeshStandardMaterial({ color: col(p.wrap), roughness: 0.5 }),
    bin: new MeshStandardMaterial({ color: col(p.bin), roughness: 0.7 }),
    line: new MeshStandardMaterial({ color: col(p["floor-line"]), roughness: 0.7 }),
  };

  // The rig: engine and stand, merged per material, centred on the origin.
  const rig = new Group();
  const batch = new Batch();
  batch.flag("hot", { keepColor: true });
  buildEngine(batch, p);
  const ext = buildStand(batch);
  batch.flush(M, rig, occlusion);
  const zCentre = (ext.zFront + ext.zRear) / 2;
  rig.position.z = -zCentre;
  rig.updateMatrixWorld(true);
  scene.add(rig);

  // Sample points of the rig (world space) for framing.
  const hull: Vector3[] = [];
  const bbMin = new Vector3(Infinity, Infinity, Infinity);
  const bbMax = new Vector3(-Infinity, -Infinity, -Infinity);
  rig.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    const pos = mesh.geometry.attributes.position;
    const step = Math.max(1, Math.floor(pos.count / 500));
    for (let i = 0; i < pos.count; i += step) {
      const v = new Vector3().fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      hull.push(v);
      bbMin.min(v);
      bbMax.max(v);
    }
  });
  const target = new Vector3(0, (bbMin.y + bbMax.y) / 2, 0);

  // Warehouse, floor, bay markings and the contact shadow.
  const room = new Group();
  const wb = new Batch();
  buildWarehouse(wb);
  const bayW = 3.2;
  const bayD = 5.2;
  for (const s of [-1, 1]) {
    wb.add("line", new PlaneGeometry(0.06, bayD + 0.06), tf((s * bayW) / 2, 0.003, 0, -Math.PI / 2));
    wb.add("line", new PlaneGeometry(bayW + 0.06, 0.06), tf(0, 0.003, (s * bayD) / 2, -Math.PI / 2));
  }
  wb.flush(M, room);
  scene.add(room);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const floorTex = floorTexture(p, maxAniso);
  floorTex.repeat.set(40 / 3, 40 / 3);
  const floorMat = new MeshStandardMaterial({ color: 0xffffff, map: floorTex, roughness: 0.5, metalness: 0, envMapIntensity: 0.7 });
  const floor = new Mesh(new PlaneGeometry(40, 40), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const shadow = contactShadow(p, ext);
  const shadowMat = new MeshBasicMaterial({ map: shadow.tex, transparent: true, depthWrite: false, toneMapped: false, fog: false });
  const shadowMesh = new Mesh(new PlaneGeometry(shadow.w, shadow.d), shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, 0.004, shadow.z - zCentre);
  scene.add(shadowMesh);

  // Lights travel with the camera, as in a turntable shoot: every stop is lit the same way.
  const lightRig = new Group();
  const key = new DirectionalLight(col(p["light-key"]), 1.5);
  key.position.set(4, 7, 5);
  const fill = new DirectionalLight(col(p["light-fill"]), 0.35);
  fill.position.set(-6, 2.5, 3);
  const rim = new DirectionalLight(col(p["light-fill"]), 1.1);
  rim.position.set(-2, 4, -7);
  lightRig.add(key, fill, rim, key.target, fill.target, rim.target);
  scene.add(lightRig);
  scene.add(new HemisphereLight(col(p["light-sky"]), col(p["light-ground"]), 0.3));
  // A high bay lamp over the stand: a soft pool of light that holds the eye on the engine.
  const bay = new SpotLight(col(p["light-key"]), 110, 0, 0.62, 1, 2);
  bay.position.set(0, 9, 0);
  bay.target.position.set(0, 0, 0);
  scene.add(bay, bay.target);

  // Callout anchors on the engine surface: the upper inlet lip for the front stops, the upper rim
  // of the core exhaust nozzle for the rear stops, on the side of the ring that faces the label
  // (118 degrees round from the right for 45 and 135, 62 for 225 and 315).
  const anchors = STOP_AZIMUTHS.map((az) => {
    const front = Math.cos(MathUtils.degToRad(az)) > 0;
    const a = MathUtils.degToRad(az === 45 || az === 135 ? 118 : 62);
    const r = front ? 0.566 : 0.236;
    const z = front ? Z(0.012) : Z(2.465);
    return new Vector3(Math.cos(a) * r, H + Math.sin(a) * r, z - zCentre);
  });

  let width = 1;
  let height = 1;
  let az = 45;
  let dist = 8;
  const ndc = new Vector3();

  const place = (deg: number) => {
    const a = MathUtils.degToRad(deg);
    camera.position.set(
      target.x + dist * Math.cos(ELEVATION) * Math.sin(a),
      target.y + dist * Math.sin(ELEVATION),
      target.z + dist * Math.cos(ELEVATION) * Math.cos(a),
    );
    camera.lookAt(target);
    lightRig.rotation.y = a;
    camera.updateMatrixWorld();
  };

  // Camera-space coordinates of the hull for a given azimuth (they do not depend on the distance
  // or the aspect, so they are computed once): x right, y up, z towards the camera.
  type View = { x: Float32Array; y: Float32Array; z: Float32Array };
  const viewOf = (deg: number, stride: number): View => {
    const a = MathUtils.degToRad(deg);
    const dir = new Vector3(Math.cos(ELEVATION) * Math.sin(a), Math.sin(ELEVATION), Math.cos(ELEVATION) * Math.cos(a));
    const right = new Vector3(Math.cos(a), 0, -Math.sin(a));
    const up = new Vector3().crossVectors(dir, right);
    const n = Math.ceil(hull.length / stride);
    const v: View = { x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n) };
    const q = new Vector3();
    for (let i = 0, j = 0; i < hull.length; i += stride, j++) {
      q.subVectors(hull[i], target);
      v.x[j] = q.dot(right);
      v.y[j] = q.dot(up);
      v.z[j] = q.dot(dir);
    }
    return v;
  };
  const stopViews = STOP_AZIMUTHS.map((d) => viewOf(d, 1));
  const orbitViews: View[] = [];
  for (let d = 0; d < 360; d += 15) orbitViews.push(viewOf(d, 3));
  let zMax = 0;
  for (const v of [...stopViews, ...orbitViews]) for (let i = 0; i < v.z.length; i++) zMax = Math.max(zMax, v.z[i]);

  /**
   * Fit: the shortest distance at which the rig at the four stops spans at most 90 % of the clear
   * area (the stage minus the insets) in each direction, centred in it, and at which no azimuth
   * of the orbit reaches the edge of that area. Then the view is shifted so the stops' bounds sit
   * in the middle of the clear area.
   */
  const fit = (insets: Insets) => {
    const aw = Math.max(1, width - insets.left - insets.right);
    const ah = Math.max(1, height - insets.top - insets.bottom);
    const aspect = aw / ah;
    const tanV = Math.tan(MathUtils.degToRad(FOV / 2));
    const tanH = tanV * aspect;
    const box = { x0: 0, x1: 0, y0: 0, y1: 0 };
    const measure = (views: View[], d: number) => {
      box.x0 = box.y0 = Infinity;
      box.x1 = box.y1 = -Infinity;
      for (const v of views)
        for (let i = 0; i < v.x.length; i++) {
          const depth = d - v.z[i];
          const nx = v.x[i] / (depth * tanH);
          const ny = v.y[i] / (depth * tanV);
          if (nx < box.x0) box.x0 = nx;
          if (nx > box.x1) box.x1 = nx;
          if (ny < box.y0) box.y0 = ny;
          if (ny > box.y1) box.y1 = ny;
        }
      return box;
    };
    const test = (d: number) => {
      const b = measure(stopViews, d);
      if ((b.x1 - b.x0) / 2 > 0.9 || (b.y1 - b.y0) / 2 > 0.9) return null;
      const cx = (b.x0 + b.x1) / 2;
      const cy = (b.y0 + b.y1) / 2;
      const o = measure(orbitViews, d);
      if (Math.max(o.x1 - cx, cx - o.x0) > 1 || Math.max(o.y1 - cy, cy - o.y0) > 1) return null;
      return { cx, cy };
    };
    let lo = zMax + 0.3;
    let hi = 80;
    for (let i = 0; i < 26; i++) {
      const mid = (lo + hi) / 2;
      if (test(mid)) hi = mid;
      else lo = mid;
    }
    dist = hi;
    const c = test(hi) ?? { cx: 0, cy: 0 };
    camera.aspect = aspect;
    camera.setViewOffset(aw, ah, -insets.left + (c.cx * aw) / 2, -insets.top - (c.cy * ah) / 2, width, height);
    camera.near = Math.max(0.1, dist - zMax - 2);
    camera.far = dist + 40;
    camera.updateProjectionMatrix();
    const f = scene.fog as Fog;
    f.near = dist + 1;
    f.far = dist + 22;
  };

  const stage: EngineStage = {
    canvas,
    setSize(w, h, dpr, insets) {
      width = Math.max(1, w);
      height = Math.max(1, h);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      fit(insets);
      place(az);
    },
    setAzimuth(deg) {
      az = deg;
      place(az);
    },
    render() {
      renderer.render(scene, camera);
    },
    anchor(stop) {
      const v = anchors[((stop % 4) + 4) % 4];
      ndc.copy(v).project(camera);
      return {
        x: ((ndc.x + 1) / 2) * width,
        y: ((1 - ndc.y) / 2) * height,
        visible: ndc.z < 1 && Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1,
      };
    },
    bounds() {
      let l = Infinity;
      let t = Infinity;
      let r = -Infinity;
      let b = -Infinity;
      for (let i = 0; i < hull.length; i += 2) {
        ndc.copy(hull[i]).project(camera);
        const x = ((ndc.x + 1) / 2) * width;
        const y = ((1 - ndc.y) / 2) * height;
        if (x < l) l = x;
        if (x > r) r = x;
        if (y < t) t = y;
        if (y > b) b = y;
      }
      return { left: l, top: t, right: r, bottom: b };
    },
    dispose() {
      scene.traverse((o) => {
        const mesh = o as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
      });
      for (const m of Object.values(M)) m.dispose();
      floorMat.dispose();
      shadowMat.dispose();
      floorTex.dispose();
      shadow.tex.dispose();
      envRT.dispose();
      renderer.dispose();
    },
  };
  return stage;
}
