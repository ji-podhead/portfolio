varying vec2 vUv;
uniform float time;
uniform vec2 u_resolutions;

// FONT DEFINITIONS AND RENDERER
// Based on the 3x7 font grid from http://www.claudiocc.com/the-1k-notebook-part-i/

#define font_size 20.
#define font_spacing .05
#define STROKEWIDTH 0.05
#define PI 3.14159265359

// Grid coordinates
#define A_ vec2(0.,0.)
#define B_ vec2(1.,0.)
#define C_ vec2(2.,0.)
#define E_ vec2(1.,1.)
#define G_ vec2(0.,2.)
#define H_ vec2(1.,2.)
#define I_ vec2(2.,2.)
#define J_ vec2(0.,3.)
#define K_ vec2(1.,3.)
#define L_ vec2(2.,3.)
#define M_ vec2(0.,4.)
#define N_ vec2(1.,4.)
#define O_ vec2(2.,4.)
#define S_ vec2(0.,6.)
#define T_ vec2(1.,6.)
#define U_ vec2(2.0,6.)

// Letter definitions
#define A(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,J_,p) + t(J_,L_,p);caret.x += 1.0;
#define B(p) t(A_,M_,p) + t(M_,O_,p) + t(O_,I_, p) + t(I_,G_,p);caret.x += 1.0;
#define C(p) t(I_,G_,p) + t(G_,M_,p) + t(M_,O_,p);caret.x += 1.0;
#define D(p) t(C_,O_,p) + t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p);caret.x += 1.0;
#define E(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,L_,p) + t(L_,J_,p);caret.x += 1.0;
#define F(p) t(C_,B_,p) + t(B_,N_,p) + t(G_,I_,p);caret.x += 1.0;
#define G(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,U_,p) + t(U_,S_,p);caret.x += 1.0;
#define H(p) t(A_,M_,p) + t(G_,I_,p) + t(I_,O_,p);caret.x += 1.0;
#define I_char(p) t(E_,E_,p) + t(H_,N_,p);caret.x += 1.0; // Renamed to avoid conflict with coordinate I_
#define J_char(p) t(E_,E_,p) + t(H_,T_,p) + t(T_,S_,p);caret.x += 1.0;
#define K(p) t(A_,M_,p) + t(M_,I_,p) + t(K_,O_,p);caret.x += 1.0;
#define L(p) t(B_,N_,p);caret.x += 1.0;
#define M_char(p) t(M_,G_,p) + t(G_,I_,p) + t(H_,N_,p) + t(I_,O_,p);caret.x += 1.0;
#define N_char(p) t(M_,G_,p) + t(G_,I_,p) + t(I_,O_,p);caret.x += 1.0;
#define O_char(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,G_,p);caret.x += 1.0;
#define P(p) t(S_,G_,p) + t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p);caret.x += 1.0;
#define Q(p) t(U_,I_,p) + t(I_,G_,p) + t(G_,M_,p) + t(M_,O_, p);caret.x += 1.0;
#define R(p) t(M_,G_,p) + t(G_,I_,p);caret.x += 1.0;
#define S_char(p) t(I_,G_,p) + t(G_,J_,p) + t(J_,L_,p) + t(L_,O_,p) + t(O_,M_,p);caret.x += 1.0;
#define T_char(p) t(B_,N_,p) + t(N_,O_,p) + t(G_,I_,p);caret.x += 1.0;
#define U_char(p) t(G_,M_,p) + t(M_,O_,p) + t(O_,I_,p);caret.x += 1.0;
#define V(p) t(G_,J_,p) + t(J_,N_,p) + t(N_,L_,p) + t(L_,I_,p);caret.x += 1.0;
#define W(p) t(G_,M_,p) + t(M_,O_,p) + t(N_,H_,p) + t(O_,I_,p);caret.x += 1.0;
#define X(p) t(G_,O_,p) + t(I_,M_,p);caret.x += 1.0;
#define Y(p) t(G_,M_,p) + t(M_,O_,p) + t(I_,U_,p) + t(U_,S_,p);caret.x += 1.0;
#define Z(p) t(G_,I_,p) + t(I_,M_,p) + t(M_,O_,p);caret.x += 1.0;

// Util functions
#define space(p) caret.x += 1.5;
#define newline(p) caret.x = caret_origin.x; caret.y -= .18;

vec2 caret_origin = vec2(0.1, 0.9);
vec2 caret;
float gtime;

float minimum_distance(vec2 v, vec2 w, vec2 p) {
    float l2 = (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y);
    if (l2 == 0.0) return distance(p, v);
    float t = dot(p - v, w - v) / l2;
    t = clamp(t, 0.0, 1.0);
    vec2 projection = v + t * (w - v);
    return distance(p, projection);
}

float textColor(vec2 from, vec2 to, vec2 p) {
    p *= font_size;
    float inkNess = 0.0;
    float nearLine = minimum_distance(from,to,p);
    inkNess += smoothstep(0., 1., 1. - 14. * (nearLine - STROKEWIDTH));
    inkNess += smoothstep(0., 5., .8 - (nearLine + STROKEWIDTH)); // glow
    return inkNess;
}

vec2 grid(vec2 letterspace) {
    return ( vec2( (letterspace.x / 2.) * .65 , 1.0-((letterspace.y / 2.) * .95) ));
}

float t(vec2 from, vec2 to, vec2 p) {
    if (gtime * 20.0 < caret.x) return 0.0; // Animate in
    return textColor(grid(from), grid(to), p);
}

vec2 r() {
    vec2 pos = vUv;
    pos.y -= caret.y;
    pos.x -= font_spacing*caret.x;
    return pos;
}

void main() {
    gtime = mod(time, 15.0);
    caret = caret_origin;
    float d = 0.0;

    // Example text: "SHADER TEXT"
    S_char(r()); H(r()); A(p); D(p); E(p); R(p); space(p);
    T_char(r()); E(p); X(p); T_char(r());

    vec3 color = vec3(d);
    gl_FragColor = vec4(color, d);
}