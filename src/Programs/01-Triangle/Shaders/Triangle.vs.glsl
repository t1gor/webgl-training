attribute vec4 coords;
attribute float pointSize;

void main(void) {
    gl_Position = coords;
    gl_PointSize = pointSize;
}
