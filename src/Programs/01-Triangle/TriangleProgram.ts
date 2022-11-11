import ITriangleOptions from './ITriangleOptions';
import IProgram from '../IProgram';

import TriangleVertexShader from "./Shaders/Triangle.vs.glsl";
import TriangleFragmentShader from "./Shaders/Triangle.fs.glsl";

class TriangleProgram implements IProgram {
	private options: ITriangleOptions;
	protected vertices: number[] = [];
	protected program: WebGLProgram;
	protected vs: WebGLShader;
	protected fs: WebGLShader;
	private _gl: WebGLRenderingContext;

	init(
		gl: WebGLRenderingContext,
		options: ITriangleOptions
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

	run() {
		this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);
	}
}

export default TriangleProgram;
