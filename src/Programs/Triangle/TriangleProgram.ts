import ITriangleOptions from './ITriangleOptions';

import TriangleVertexShader from "./Shaders/Triangle.vs.glsl";
import TriangleFragmentShader from "./Shaders/Triangle.fs.glsl";

class TriangleProgram {
	protected vertices: number[] = [];
	protected program: WebGLProgram;
	protected vs: WebGLShader;
	protected fs: WebGLShader;

	constructor(
		private gl: WebGLRenderingContext,
		private options: ITriangleOptions
	) {}

	createShaders() {
		// vertex shader
		this.vs = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.gl.shaderSource(this.vs, TriangleVertexShader);
		this.gl.compileShader(this.vs);

		if (!this.gl.getShaderParameter(this.vs, this.gl.COMPILE_STATUS)) {
			throw new Error(`Failed to compile "TriangleVertexShader": ${this.gl.getShaderInfoLog(this.vs)}`);
		}

		// fragment shader
		this.fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.gl.shaderSource(this.fs, TriangleFragmentShader);
		this.gl.compileShader(this.fs);

		if (!this.gl.getShaderParameter(this.fs, this.gl.COMPILE_STATUS)) {
			throw new Error(`Failed to compile "TriangleFragmentShader": ${this.gl.getShaderInfoLog(this.fs)}`);
		}
	}

	createVertices() {
		const pointSize = this.gl.getAttribLocation(this.program, "pointSize");
		this.gl.vertexAttrib1f(pointSize, this.options.pointSize);

		this.vertices = [
			-0.9, -0.9, 0.0,
			0.9, -0.9, 0.0,
			0.0, 0.9, 0.0
		];

		const coords = this.gl.getAttribLocation(this.program, "coords");
		const buffer = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
		this.gl.vertexAttribPointer(coords, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(coords);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

		const color = this.gl.getUniformLocation(this.program, "color");
		this.gl.uniform4f(color, ...this.options.color);
	}

	use() {
		// prepare
		this.createShaders();

		// do run
		this.program = this.gl.createProgram();
		this.gl.attachShader(this.program, this.vs);
		this.gl.attachShader(this.program, this.fs);
		this.gl.linkProgram(this.program);
		this.gl.useProgram(this.program);

		// when program is done - vertices
		this.createVertices();
	}

	run() {
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
	}
}

export default TriangleProgram;
