attribute vec4 coords;
attribute float pointSize;

uniform mat4 transformMatrix;

void main(void) {
    gl_Position = transformMatrix * coords;
    gl_PointSize = pointSize;
}
