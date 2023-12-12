/* skew constants for 3d simplex functions */
const TWO_PI: f32 = 2.0 * PI;
const HALF_PI: f32 = 0.5 * PI;

fn custom_sin_in2pi(zero_to_2pi: f32) -> f32 {
    let core = glam::vec2(
        zero_to_2pi * (1.0 / HALF_PI) + -1.0,
        zero_to_2pi * (1.0 / HALF_PI) + -3.0,
    );

    let result2 = glam::vec2(
        f32::min(f32::max(-core.x * core.x + 1.0, 0.0), 1.0),
        f32::min(f32::max(-core.y * core.y + 1.0, 0.0), 1.0),
    );

    result2.x - result2.y
}

fn custom_sin(x: f32) -> f32 {
    let zero_to_2pi = x - (x / TWO_PI).floor() * TWO_PI;
    custom_sin_in2pi(zero_to_2pi)
}

fn custom_sin_2(v: glam::Vec2) -> glam::Vec2 {
    let zero_to_2pi = glam::vec2(
        v.x - (v.x / TWO_PI).floor() * TWO_PI,
        v.y - (v.y / TWO_PI).floor() * TWO_PI,
    );
    let result = glam::vec2(
        custom_sin_in2pi(zero_to_2pi.x),
        custom_sin_in2pi(zero_to_2pi.y),
    );

    result
}

fn hash(p: glam::Vec2) -> glam::Vec2 {
    let k = glam::vec2(
        p.dot(glam::vec2(127.1, 311.7)),
        p.dot(glam::vec2(269.5, 183.3)),
    );
    return (custom_sin_2(k) * 43758.5453123).fract() * 2.0 - 1.0;
}

#[wasm_bindgen]
pub fn noise(position: &Vector2) -> f32 {
    let p = glam::vec2(position.x, position.y);

    const K1: f32 = 0.366025404; // (sqrt(3)-1)/2;
    const K2: f32 = 0.211324865; // (3-sqrt(3))/6;
    const ZERO2: glam::Vec2 = glam::vec2(0.0, 0.0);
    const ZERO3: glam::Vec3 = glam::vec3(0.0, 0.0, 0.0);

    let i = (p + (p.x + p.y) * K1).floor();
    let a = p - i + (i.x + i.y) * K2;
    let m = step(a.y, a.x);
    let o = glam::vec2(m, 1.0 - m);
    let b = a - o + K2;
    let c = a - 1.0 + 2.0 * K2;
    let h = (0.5 - glam::vec3(a.dot(a), b.dot(b), c.dot(c))).max(ZERO3);
    let n = h
        * h
        * h
        * h
        * glam::vec3(
            hash(i + ZERO2).dot(a),
            hash(i + o).dot(b),
            hash(i + 1.0).dot(c),
        );
    return n.dot(glam::vec3(70.0, 70.0, 70.0));
}