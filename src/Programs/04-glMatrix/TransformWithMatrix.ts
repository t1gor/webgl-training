import { mat4 } from 'gl-matrix';

import ITransformWithMatrixOptions from './ITransformWithMatrixOptions';

import IProgram from '../IProgram';
import TriangleVertexShader from "./Shaders/Triangle.vs.glsl";
import TriangleFragmentShader from "./Shaders/Triangle.fs.glsl";

class TransformWithMatrix implements IProgram {
	private options: ITransformWithMatrixOptions;
	protected vertices: number[] = [];
	protected program: WebGLProgram;
	protected vs: WebGLShader;
	protected fs: WebGLShader;
	private _gl: WebGLRenderingContext;

	private angle = mat4.create();
	private vertexCount = 30;

	constructor() {
		this.run = this.run.bind(this);
	}

	init(
		gl: WebGLRenderingContext,
		options: ITransformWithMatrixOptions
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

		this.vertices = [];
		for (let i = 0; i < this.vertexCount; i++) {
			this.vertices.push(Math.random() * 2 - 1);
			this.vertices.push(Math.random() * 2 - 1);
			this.vertices.push(Math.random() * 2 - 1);
		}

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

	run() {
		mat4.rotateX(this.angle, this.angle, -0.013);
		mat4.rotateY(this.angle, this.angle, 0.013);
		mat4.rotateZ(this.angle, this.angle, 0.01);

		const transformMatrix = this._gl.getUniformLocation(this.program, "transformMatrix");
		this._gl.uniformMatrix4fv(transformMatrix, false, this.angle);

		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
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

export default TransformWithMatrix;
