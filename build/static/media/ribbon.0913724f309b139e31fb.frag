varying vec2 vUv;
uniform float time;
uniform vec2 u_resolutions;

#define RIBBON_COLOR vec4(1.0, 1.0, 1.0, 0.5)
#define RIBBON_WIDTH 0.03

float rand(float n){
    return fract(sin(n) * 43758.5453123);
}

float wave(float x, float time_mod, float phase){
    return sin(x + time_mod) * cos(x * 3.0 + time_mod) * sin(x * 0.7 + time_mod) * 0.5;
}

vec4 ribbon(float seed, vec2 uv){
    float phase = rand(seed + 0.2) * 10.0;
    float speedMod = 1.0 + rand(seed + 0.123);
    float width = RIBBON_WIDTH * (seed - 1.0 + 0.1);
    float aa = 1.0 / u_resolutions.y;
    float time_mod = time / 15.0 * speedMod;

    float warpY = uv.y + 0.3 + wave(uv.x * 10.0, time_mod, phase);

    float alpha = 1.0 - seed * 0.22 + 0.25;
    float inRibbon = max(warpY - width, 1.0 - width - warpY);
    inRibbon = smoothstep(0.5 - aa, 0.5 + aa, 1.0 - inRibbon);

    return vec4(RIBBON_COLOR.rgb, mix(alpha, 0.0, 1.0 - inRibbon));
}

void main() {
    vec2 uv = vUv;
    vec4 finalColor = vec4(0.0);

    // Add multiple ribbons together
    finalColor = mix(finalColor, ribbon(1.0, uv), ribbon(1.0, uv).a);
    finalColor = mix(finalColor, ribbon(2.0, uv), ribbon(2.0, uv).a);
    finalColor = mix(finalColor, ribbon(3.0, uv), ribbon(3.0, uv).a);

    gl_FragColor = finalColor;
}