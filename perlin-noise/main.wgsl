const PI: f32 = 3.14159265359;
const TWO_PI: f32 = 2.0 * PI;
const HALF_PI: f32 = 0.5 * PI;

fn clamp_2(value: vec2<f32>, min: vec2<f32>, max: vec2<f32>) -> vec2<f32> {
    return vec2(clamp(value.x, min.x, max.x), clamp(value.y, min.y, max.y));
}

fn custom_sin_in2pi(zeroTo2PI: f32) -> f32 {
    let core: vec2<f32> = vec2(zeroTo2PI, zeroTo2PI) * vec2(1.0 / HALF_PI, 1.0 / HALF_PI) + vec2(-1.0, -3.0);
    let result2: vec2<f32> = clamp_2(-core * core + vec2(1.0, 1.0), vec2(0.0), vec2(1.0));
    return result2.x - result2.y;
}

fn custom_sin(x: f32) -> f32 {
    let zeroTo2PI: f32 = x - floor(x / TWO_PI) * TWO_PI;
    return custom_sin_in2pi(zeroTo2PI);
}

fn custom_sin_2(v: vec2<f32>) -> vec2<f32> {
    let zeroTo2PI: vec2<f32> = v - floor(v / vec2(TWO_PI, TWO_PI)) * vec2(TWO_PI, TWO_PI);
    return vec2(custom_sin_in2pi(zeroTo2PI.x), custom_sin_in2pi(zeroTo2PI.y));
}

fn hash(p : vec2<f32>) -> vec2<f32> {
    let k = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(custom_sin_2(k) * 43758.5453123);
}

fn noise(p : vec2<f32>) -> f32 {
    const K1 : f32 = 0.366025404; // (sqrt(3)-1)/2;
    const K2 : f32 = 0.211324865; // (3-sqrt(3))/6;

    let i : vec2<f32> = floor(p + (p.x + p.y) * K1);
    let a : vec2<f32> = p - i + (i.x + i.y) * K2;
    let m : f32 = step(a.y, a.x);
    let o : vec2<f32> = vec2(m, 1.0 - m);
    let b : vec2<f32> = a - o + K2;
    let c : vec2<f32> = a - 1.0 + 2.0 * K2;
    let h : vec3<f32> = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), vec3(0.0));
    let n : vec3<f32> = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}

@compute @workgroup_size(64) // 64
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {

    let index = global_id.x;

    let a = firstVector.values[index];
    let b = secondVector.values[index];
    
    resultVector.values[index] = noise(vec2(a, b));
    
}