varying vec2 vUv;
uniform float time;
uniform vec2 mouse;
uniform vec2 u_resolutions;

// Color palette
vec3 c1 = vec3(0.8, 0.2, 0.2);
vec3 c4 = vec3(2.0/255.0, 95.0/255.0, 152.0/255.0);

// Smooth minimum function to blend shapes
float sMin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// Function to create a circle shape
float circle(in vec2 _st, in float _radius, in vec2 _center){
    return 1.0 - smoothstep(_radius - 0.02, _radius + 0.02, distance(_st, _center));
}

// Main map function defining the scene
float map(vec2 coord, vec2 mouse){
    float circ1 = 1.0 - smoothstep(-0.5, 5.2, distance(coord, vec2(0.5 + sin(time * 0.1), 0.5 + cos(time * 0.1))));
    float circ2 = 1.0 - smoothstep(0.1, 1.5, distance(coord, vec2(0.5, 0.5)));
    float circ3 = circle(coord, 0.8, vec2(0.5, 0.5));

    // Blend the shapes together
    float main = sMin(circ2, circ1, 1.5);
    return sMin(main, circ3, 1.0);
}

void main()	{
    vec2 coord = vUv;
    vec2 mouseFixed = mouse / u_resolutions;

    // Calculate the distance field
    float mapValue = map(coord, mouseFixed);
    float step1 = step(0.0, -mapValue);
    float fractValue = fract(max(0.0, mapValue * 20.0));
    float firstMarch = step1 + fractValue;

    vec3 color = firstMarch * c1;

    // Add a circle based on mouse position
    vec3 circleColor = vec3(circle(coord, 0.1, mouseFixed) * c4);

    gl_FragColor = vec4(color + circleColor, 1.0);
}