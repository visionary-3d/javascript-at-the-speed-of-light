#include <iostream>
#include <vector>
#include <array>
#include <stack>
#include <cmath>
#include <random>
#include "libs/glm/glm.hpp"

using namespace glm;

const float PI = 3.14159265359;
const float TWO_PI = 2.0 * PI;
const float HALF_PI = 0.5 * PI;

float custom_sin_in2pi(float zero_to_2pi)
{
    vec2 core = vec2(
        zero_to_2pi * (1.0f / HALF_PI) + -1.0f,
        zero_to_2pi * (1.0f / HALF_PI) + -3.0f);

    vec2 result2 = vec2(
        std::min(std::max(-core.x * core.x + 1.0f, 0.0f), 1.0f),
        std::min(std::max(-core.y * core.y + 1.0f, 0.0f), 1.0f));

    return result2.x - result2.y;
}

float custom_sin(float x)
{
    float zero_to_2pi = x - (x / TWO_PI) * TWO_PI;
    return custom_sin_in2pi(zero_to_2pi);
}

vec2 custom_sin_2(const vec2 &v)
{
    vec2 zero_to_2pi = vec2(
        v.x - (v.x / TWO_PI) * TWO_PI,
        v.y - (v.y / TWO_PI) * TWO_PI);
    vec2 result = vec2(
        custom_sin_in2pi(zero_to_2pi.x),
        custom_sin_in2pi(zero_to_2pi.y));

    return result;
}

vec2 hash(vec2 p) // replace this by something better
{
    vec2 pi = vec2(dot(p, vec2(127.1f, 311.7f)), dot(p, vec2(269.5f, 183.3f)));
    return -1.f + 2.f * fract(custom_sin_2(pi) * 43758.5453123f);
}

namespace Noise
{
    float noise(float x, float y)
    {
        vec2 p(x, y);
        vec2 i = floor(p + (p.x + p.y) * K1);
        vec2 a = p - i + (i.x + i.y) * K2;
        float m = step(a.y, a.x);
        vec2 o = vec2(m, 1.0 - m);
        vec2 b = a - o + K2;
        vec2 c = a - 1.f + 2.f * K2;
        vec3 h = max(0.5f - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.f);
        vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.f)));
        return dot(n, vec3(70.f));
    }
}

