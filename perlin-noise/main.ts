import { Vector2 } from '../../render/math/Vector2';
import { Vector3 } from '../../render/math/Vector3';

const hashP1 = new Vector2(127.1, 311.7);
const hashP2 = new Vector2(269.5, 183.3);
const hashResult = new Vector2(0, 0);

const vec2_0 = new Vector2(0, 0);
const vec2_1 = new Vector2(0, 0);
const vec2_2 = new Vector2(0, 0);

const a = new Vector2(0, 0);
const i = new Vector2(0, 0);
const o = new Vector2(0, 0);
const b = new Vector2(0, 0);
const c = new Vector2(0, 0);
const z = new Vector2(0, 0);
const y = new Vector2(0, 0);
const h = new Vector3(0, 0, 0);
const n = new Vector3(0, 0, 0);
const s = new Vector3(0, 0, 0);
const k = new Vector3(0, 0, 0);
const d = new Vector3(70.0, 70.0, 70.0);

const PI: number = 3.14159265359;
const TWO_PI: number = 2.0 * PI;
const HALF_PI: number = 0.5 * PI;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function clamp_2(value: Vector2, min: Vector2, max: Vector2): Vector2 {
  const clampedX = clamp(value.x, min.x, max.x);
  const clampedY = clamp(value.y, min.y, max.y);
  return vec2_2.set(clampedX, clampedY);
}

function custom_sin_in2pi(zeroTo2PI: number): number {
    const core: Vector2 = vec2_0.set(
        zeroTo2PI * (1.0 / HALF_PI) + -1.0,
        zeroTo2PI * (1.0 / HALF_PI) + -3.0
    );
    const result2: Vector2 = vec2_1.set(
        Math.min(Math.max(-core.x * core.x + 1.0, 0.0), 1.0),
        Math.min(Math.max(-core.y * core.y + 1.0, 0.0), 1.0)
    );
    return result2.x - result2.y;
}

function custom_sin(x: number): number {
    const zeroTo2PI: number = x - Math.floor(x / TWO_PI) * TWO_PI;
    return custom_sin_in2pi(zeroTo2PI);
}

function custom_sin_2(v: Vector2): Vector2 {
    const zeroTo2PI: Vector2 = o.set(
        v.x - Math.floor(v.x / TWO_PI) * TWO_PI,
        v.y - Math.floor(v.y / TWO_PI) * TWO_PI
    );
    return b.set( 
        custom_sin_in2pi(zeroTo2PI.x),
        custom_sin_in2pi(zeroTo2PI.y)
    );
}

function dot(a: Vector2, b: Vector2): number {
  return a.x * b.x + a.y * b.y;
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash(p: Vector2) {
  hashResult.set(dot(p, hashP1), dot(p, hashP2))
  hashResult.x = 2 * fract(custom_sin(hashResult.x) * 43758.5453123) - 1;
  hashResult.y = 2 * fract(custom_sin(hashResult.y) * 43758.5453123) - 1;

  return hashResult;
}

function step(edge: number, x: number): number {
  return x < edge ? 0 : 1;
}

export default function simplexNoise(p: Vector2): number {
  const K1 = 0.366025404; // (sqrt(3)-1)/2;
  const K2 = 0.211324865; // (3-sqrt(3))/6;

  const sum1 = (p.x + p.y) * K1;
  i.copy(p).addScalar(sum1).floor();

  const sum2 = (i.x + i.y) * K2;
  a.copy(p).sub(i).addScalar(sum2);

  const m = step(a.y, a.x);

  o.set(m, 1.0 - m);
  b.copy(a).sub(o).addScalar(K2);
  c.copy(a).addScalar(2.0 * K2 - 1.0);

  h.set(
    0.5 - dot(a, a),
    0.5 - dot(b, b),
    0.5 - dot(c, c)
  ).max(s.setScalar(0));

  const iHash = hash(i);
  const idota = dot(iHash, a);

  o.add(i)
  const oHash = hash(o)
  const odotb = dot(oHash, b)

  i.addScalar(1)
  const niHash = hash(i)
  const nidotc = dot(niHash, c)

  k.set(idota, odotb, nidotc)

  s.copy(h)
  n.copy(h.multiply(s).multiply(s).multiply(s)).multiply(k);

  return n.dot(d);
}
