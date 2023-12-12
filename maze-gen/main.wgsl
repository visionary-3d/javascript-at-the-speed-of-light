// https://www.shadertoy.com/view/4djSRW
fn coin_flip(p: vec2<f32>) -> f32 {
	var p3  = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return step(0.5, fract((p3.x + p3.y) * p3.z));
}

fn random_carve_cell_walls(cell_coords: vec2<i32>) {
    let cell_index = get_cell_index(cell_coords);

    let size = i32(uniforms.maze_size);
    let num_walls = i32(uniforms.num_walls);

    const t_wall_type: i32 = 0; // top
    const r_wall_type: i32 = 1; // right

    const b_wall_type: i32 = 0; // bottom
    const l_wall_type: i32 = 1; // left

    //  is_on_edge -> vec2(is_most_left_edge, is_most_bottom_edge)
    var is_on_edge = cell_coords == vec2(0);

    let bottom_not_left = coin_flip(vec2<f32>(cell_coords));

    // main body: bottom and left edges
    let b_wall_index = cell_index * 2 + b_wall_type;
    let l_wall_index = cell_index * 2 + l_wall_type;

    let carve_bottom = mix(bottom_not_left, 1.0, f32(is_on_edge.x));
    let carve_left = mix(1.0 - bottom_not_left, 1.0, f32(is_on_edge.y));

    walls_array.values[b_wall_index] = u32(bottom_not_left);
    walls_array.values[l_wall_index] = u32(1.0 - bottom_not_left);
}


@compute @workgroup_size(8, 8) // 64
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  random_carve_cell_walls(vec2<i32>(global_id.xy));
}