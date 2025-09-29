varying vec2 vUv;
uniform float time;
uniform vec2 u_resolutions;

// Helper functions for hexagonal grid and noise
float hash(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,58.233))) * 13758.5453);
}

float hexagon(vec2 p, float r) {
  const vec3 k = 0.5*vec3(-sqrt(3.0),1.0,sqrt(4.0/3.0));
  p = abs(p);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p)*sign(p.y);
}

vec2 hextile(inout vec2 p) {
  const vec2 sz = vec2(1.0, sqrt(3.0));
  const vec2 hsz = 0.5*sz;
  vec2 p1 = mod(p, sz)-hsz;
  vec2 p2 = mod(p - hsz, sz)-hsz;
  vec2 p3 = dot(p1, p1) < dot(p2, p2) ? p1 : p2;
  vec2 n = ((p3 - p + hsz)/sz);
  p = p3;
  n -= vec2(0.5);
  return round(n*2.0)*0.5;
}

float cellf(vec2 p, vec2 n) {
  const float lw = 0.01;
  return -hexagon(p.yx, 0.5-lw);
}

vec2 df(vec2 p, out vec2 hn0, out vec2 hn1) {
  const float sz = 0.25;
  p /= sz;
  vec2 hp0 = p;
  vec2 hp1 = p+vec2(1.0, sqrt(1.0/3.0));
  hn0 = hextile(hp0);
  hn1 = hextile(hp1);
  float d0 = cellf(hp0, hn0);
  float d1 = cellf(hp1, hn1);
  float d2 = length(hp0);
  float d = min(d0, d1);
  return vec2(d, d2)*sz;
}

// The main visual effect function
vec3 effect(vec2 p, vec2 pp) {
  const float pa = 20.0;
  const float pf = 0.0025;
  float aa = 4.0/u_resolutions.y;
  vec2 hn0;
  vec2 hn1;
  vec2 pb = p + pa*sin(time*pf*vec2(1.0, sqrt(0.5)));
  vec2 d2 = df(pb, hn0, hn1);
  vec3 col = vec3(0.0);
  float h0 = hash(hn1);
  float l = mix(0.25, 0.75, h0);
  if (hn0.x <= hn1.x+0.5) l *= 0.5;
  if (hn0.y <= hn1.y) l *= 0.75;

  col += l;
  col = mix(col, vec3(0.), smoothstep(aa, -aa, d2.x));
  col *= mix(0.5, 1.0, smoothstep(0.01, 0.2, d2.y));
  col *= 1.25*smoothstep(1.5, 0.25, length(pp));

  return col;
}


void main()
{
    vec2 xy = vUv;
    vec2 p = -1. + 2. * xy;
    p.x *= u_resolutions.x/u_resolutions.y;

    vec3 colCubes = effect(p, p);
    vec3 col = colCubes;

    // Dithering and color adjustments
    float gradient = min( xy.y, 0.0 );
    float dither2 = fract(dot(vec2((time*0.1)+0.,xy.y/2./xy.x/sin(time*2.)),gl_FragCoord.xy))-0.5 ;

    col.y = max( 0.0, col.y + gradient * 1.0 );
    col.y = step( 0.5, col.y*col.y + dither2 ) * 0.8 + 0.02;
    col.x = max( 0.0, col.x + gradient * 1.0 );
    col.x = step( 0.5, col.x*col.x + dither2 ) * 0.1 + 0.01;
    col.z = max( 0.0, col.z + gradient * 1.0 );
    col.z = step( 0.5, col.z*col.z + dither2*0.5 ) * 0.1 + 0.02;

    col /= vec3(.4, .4, .3) + 0.5*pow(100.0*xy.x*xy.y*(1.0-xy.x)*(1.0-xy.y), .1 );
    col=mix(col,colCubes,sin(time*0.2));

    gl_FragColor = vec4(col, 1.0 );
}