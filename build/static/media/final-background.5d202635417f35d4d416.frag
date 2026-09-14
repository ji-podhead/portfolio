varying vec2 vUv;
uniform float time;
uniform vec2 u_resolutions;

// Function to generate pseudo-random numbers
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise function
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// Fractional Brownian Motion (FBM) to create cloud-like patterns
#define OCTAVES 6
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;

    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    vec2 st = vUv;
    st.x *= u_resolutions.x / u_resolutions.y; // aspect ratio correction

    vec3 color = vec3(0.0);

    // Animate the noise field over time
    vec2 q = vec2(0.0);
    q.x = fbm( st + 0.00*time );
    q.y = fbm( st + vec2(1.0) );

    vec2 r = vec2(0.0);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);

    float f = fbm(st+r);

    // Create the final color, mixing a dark base with hints of the primary color
    color = mix(vec3(0.01, 0.02, 0.03), // Dark blue/green base
                vec3(0.0, 0.15, 0.08), // Primary color highlight
                clamp((f*f)*2.0,0.0,1.0));

    color = mix(color,
                vec3(0.0, 0.0, 0.0),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.1, 0.2, 0.2), // Lighter teal highlights
                clamp(length(r.x),0.0,1.0));

    color *= (f*f*f+.6*f*f+.5*f);

    gl_FragColor = vec4(color, 1.0);
}