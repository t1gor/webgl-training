import TriangleTransformOptions from './TriangleTransformOptions';
import IProgram from '../IProgram';

import TriangleVertexShader from "./Shaders/Triangle.vs.glsl";
import TriangleFragmentShader from "./Shaders/Triangle.fs.glsl";

class TriangleTransformProgram implements IProgram {
	private options: TriangleTransformOptions;
	protected vertices: number[] = [];
	protected program: WebGLProgram;
	protected vs: WebGLShader;
	protected fs: WebGLShader;
	private _gl: WebGLRenderingContext;

	private angle = 0;

	constructor() {
		this.run = this.run.bind(this);
	}

	init(
		gl: WebGLRenderingContext,
		options: TriangleTransformOptions
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

		this.vertices = [
			-0.9, -0.9, 0.0,
			0.9, -0.9, 0.0,
			0.0, 0.9, 0.0
		];

		const coords = this._gl.getAttribLocation(this.program, "coords");
		const buffer = this._gl.createBuffer();

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this.vertices), this._gl.STATIC_DRAW);
		this._gl.vertexAttribPointer(coords, 3, this._gl.FLOAT, false, 0, 0);
		this._gl.enableVertexAttribArray(coords);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

		const color = this._gl.getUniformLocation(this.program, "color");
		this._gl.uniform4f(color, ...this.options.color);
	}

	prepare() {
		this.program = this._gl.createProgram();
		this._gl.attachShader(this.program, this.vs);
		this._gl.attachShader(this.program, this.fs);
		this._gl.linkProgram(this.program);
		this._gl.useProgram(this.program);
	}

	rotateZ(angle: number) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const matrix = new Float32Array([
			cos,  sin, 0, 0,
			-sin, cos, 0, 0,
			0,    0,   1, 0,
			0,    0,   0, 1
		]);

		const transformMatrix = this._gl.getUniformLocation(this.program, "transformMatrix");
		this._gl.uniformMatrix4fv(transformMatrix, false, matrix);
	}

	rotateY(angle: number) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const matrix = new Float32Array([
			cos,  0, sin, 0,
			0,    1,   0, 0,
			-sin, 0, cos, 0,
			0,    0,   0, 1
		]);

		const transformMatrix = this._gl.getUniformLocation(this.program, "transformMatrix");
		this._gl.uniformMatrix4fv(transformMatrix, false, matrix);
	}

	run() {
		this.rotateY(this.angle += 0.01);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
		this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);

		requestAnimationFrame(this.run);
	}

	listen() {
		console.log('Nothing to do here');
	}

	cleanup() {
		console.log('Nothing to do here');
	}
}

export default TriangleTransformProgram;
