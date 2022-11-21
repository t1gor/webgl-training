attribute vec4 coords;
attribute vec4 colors;
attribute float pointSize;

uniform mat4 transformMatrix;

varying vec4 varyingColors;

void main(void) {
    gl_Position = transformMatrix * coords;
    gl_PointSize = pointSize;
    varyingColors = colors;
}
