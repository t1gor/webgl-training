precision mediump float;

uniform vec4 color;

varying vec4 varyingColors;

void main(void) {
    gl_FragColor = varyingColors;
}
