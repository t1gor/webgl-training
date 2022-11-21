attribute vec4 coords;
attribute vec4 colors;
attribute float pointSize;

uniform mat4 transformMatrix;
uniform mat4 perspectiveMatrix;

varying vec4 varyingColors;

void main(void) {
    gl_Position = perspectiveMatrix * transformMatrix * coords;
    gl_PointSize = pointSize;
    varyingColors = colors;
}
