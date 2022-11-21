import { mat4 } from 'gl-matrix';

import IPerspectiveOptions from './IPerspectiveOptions';

import IProgram from '../IProgram';
import TriangleVertexShader from "./Shaders/Triangle.vs.glsl";
import TriangleFragmentShader from "./Shaders/Triangle.fs.glsl";

class PerspectiveProgram implements IProgram {
	private options: IPerspectiveOptions;
	protected vertices: number[] = [
		0.88, -0.25, -0.18,     1, 0, 0, 1,
		0.9, 0.25, 0,           1, 0, 0, 1,
		0.88, -0.25, 0.18,      1, 0, 0, 1,

		0.85, -0.25, 0.29,      1, 1, 0, 1,
		0.78, 0.25, 0.45,       1, 1, 0, 1,
		0.67, -0.25, 0.6,       1, 1, 0, 1,

		0.6, -0.25, 0.67,       0, 1, 0, 1,
		0.45, 0.25, 0.78,       0, 1, 0, 1,
		0.29, -0.25, 0.85,      0, 1, 0, 1,

		0.18, -0.25, 0.88,      0, 1, 1, 1,
		0, 0.25, 0.9,           0, 1, 1, 1,
		-0.18, -0.25, 0.88,     0, 1, 1, 1,

		-0.29, -0.25, 0.85,     0, 0, 1, 1,
		-0.45, 0.25, 0.78,      1, 1, 0, 1,
		-0.6, -0.25, 0.67,      0, 0, 1, 1,

		-0.67, -0.25, 0.6,      1, 0, 1, 1,
		-0.78, 0.25, 0.45,      1, 0, 1, 1,
		-0.85, -0.25, 0.29,     1, 0, 1, 1,

		-0.88, -0.25, 0.18,     1, 0.5, 0, 1,
		-0.9, 0.25, 0,          1, 0.5, 0, 1,
		-0.88, -0.25, -0.18,    1, 0.5, 0, 1,

		-0.85, -0.25, -0.29,    0, 0.5, 1, 1,
		-0.78, 0.25, -0.45,     0, 0.5, 1, 1,
		-0.67, -0.25, -0.6,     0, 0.5, 1, 1,

		-0.6, -0.25, -0.67,     0, 1, 0.5, 1,
		-0.45, 0.25, -0.78,     0, 1, 0.5, 1,
		-0.29, -0.25, -0.85,    0, 1, 0.5, 1,

		-0.18, -0.25, -0.88,    1, 0, 0.5, 1,
		0, 0.25, -0.9,          1, 0, 0.5, 1,
		0.18, -0.25, -0.88,     1, 0, 0.5, 1,

		0.29, -0.25, -0.85,     0.5, 1, 0, 1,
		0.45, 0.25, -0.78,      0.5, 1, 0, 1,
		0.6, -0.25, -0.67,      0.5, 1, 0, 1,

		0.67, -0.25, -0.6,      0.5, 0, 1, 1,
		0.78, 0.25, -0.45,      0.5, 0, 1, 1,
		0.85, -0.25, -0.29,     0.5, 0, 1, 1
	];
	protected colors: number[] = [];
	protected program: WebGLProgram;
	protected vs: WebGLShader;
	protected fs: WebGLShader;
	private _gl: WebGLRenderingContext;

	private angle = mat4.create();
	private vertexCount = 36;

	constructor() {
		this.run = this.run.bind(this);
	}

	init(
		gl: WebGLRenderingContext,
		options: IPerspectiveOptions
	) {
		this._gl = gl;
		this.options = options;
		return this;
	}

	createShaders() {
		// vertex shader
		this.vs = this._gl.createShader(this._gl.VERTEX_SHADER);
		this._gl.shaderSource(this.vs, TriangleVertexShader);
		this._gl.compileShader(this.vs);

		if (!this._gl.getShaderParameter(this.vs, this._gl.COMPILE_STATUS)) {
			throw new Error(`Failed to compile "TriangleVertexShader": ${this._gl.getShaderInfoLog(this.vs)}`);
		}

		// fragment shader
		this.fs = this._gl.createShader(this._gl.FRAGMENT_SHADER);
		this._gl.shaderSource(this.fs, TriangleFragmentShader);
		this._gl.compileShader(this.fs);

		if (!this._gl.getShaderParameter(this.fs, this._gl.COMPILE_STATUS)) {
			throw new Error(`Failed to compile "TriangleFragmentShader": ${this._gl.getShaderInfoLog(this.fs)}`);
		}
	}

	createVertices() {
		const pointSize = this._gl.getAttribLocation(this.program, "pointSize");
		this._gl.vertexAttrib1f(pointSize, this.options.pointSize);

		const coords = this._gl.getAttribLocation(this.program, "coords");
		const buffer = this._gl.createBuffer();

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this.vertices), this._gl.STATIC_DRAW);
		this._gl.vertexAttribPointer(coords, 3, this._gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
		this._gl.enableVertexAttribArray(coords);
		// this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

		const colorsLocation = this._gl.getAttribLocation(this.program, "colors");
		this._gl.vertexAttribPointer(colorsLocation, 4, this._gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3);
		this._gl.enableVertexAttribArray(colorsLocation);

		const perspectiveMatrix = mat4.create();
		mat4.perspective(perspectiveMatrix, 1, this.options.width / this.options.height, 0.1, 10);

		const perspectiveLocation = this._gl.getUniformLocation(this.program, "perspectiveMatrix");
		this._gl.uniformMatrix4fv(perspectiveLocation, false, perspectiveMatrix);

		mat4.translate(this.angle, this.angle, [0, 0, -2]);
	}

	prepare() {
		this.program = this._gl.createProgram();
		this._gl.attachShader(this.program, this.vs);
		this._gl.attachShader(this.program, this.fs);
		this._gl.linkProgram(this.program);
		this._gl.useProgram(this.program);
	}

	run() {
		mat4.rotateX(this.angle, this.angle, -0.013);
		mat4.rotateY(this.angle, this.angle, 0.013);
		mat4.rotateZ(this.angle, this.angle, 0.01);

		const transformMatrix = this._gl.getUniformLocation(this.program, "transformMatrix");
		this._gl.uniformMatrix4fv(transformMatrix, false, this.angle);

		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
		this._gl.enable(this._gl.DEPTH_TEST);
		this._gl.drawArrays(this._gl.TRIANGLES, 0, this.vertexCount);

		requestAnimationFrame(this.run);
	}

	listen() {
		console.log('Nothing to do here');
	}

	cleanup() {
		console.log('Nothing to do here');
	}
}

export default PerspectiveProgram;
