import IGigglingPointsOptions from './IGigglingPointsOptions';
import IProgram from '../IProgram';

import TriangleVertexShader from './../01-Triangle/Shaders/Triangle.vs.glsl';
import TriangleFragmentShader from './../01-Triangle/Shaders/Triangle.fs.glsl';

class GigglingPoints implements IProgram {
	protected gl: WebGLRenderingContext;
	protected options: IGigglingPointsOptions;
	protected vertices: number[] = [];
	protected program: WebGLProgram;
	protected vs: WebGLShader;
	protected fs: WebGLShader;
	protected vertexCount = 5000;

	protected mouseX = 0;
	protected mouseY = 0;

	constructor() {
		this.run = this.run.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
	}

	listen(canvas: HTMLCanvasElement) {
		canvas.addEventListener("mousemove", this.onMouseMove);
	}

	onMouseMove(event: MouseEvent) {
		const canvas = event.target as HTMLCanvasElement;

		this.mouseX = this.map(event.clientX, 0, canvas.width, -1, 1);
		this.mouseY = this.map(event.clientY, 0, canvas.height, 1, -1);
	}

	protected map(value: number, minSrc: number, maxSrc: number, minDst: number, maxDst: number) {
		return (value - minSrc) / (maxSrc - minSrc) * (maxDst - minDst) + minDst;
	}

	init(
		gl: WebGLRenderingContext,
		options: IGigglingPointsOptions
	) {
		this.gl = gl;
		this.options = options;
		return this;
	}

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
		const pointSize = this.gl.getAttribLocation(this.program, 'pointSize');
		this.gl.vertexAttrib1f(pointSize, 1);

		for (let i = 0; i < this.vertexCount; i++) {
			this.vertices.push(Math.random() * 2 - 1);
			this.vertices.push(Math.random() * 2 - 1);
		}

		const coords = this.gl.getAttribLocation(this.program, 'coords');

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
		this.gl.vertexAttribPointer(coords, 2, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(coords);

		const color = this.gl.getUniformLocation(this.program, 'color');
		this.gl.uniform4f(color, ...this.options.color);
	}

	prepare() {
		this.program = this.gl.createProgram();
		this.gl.attachShader(this.program, this.vs);
		this.gl.attachShader(this.program, this.fs);
		this.gl.linkProgram(this.program);
		this.gl.useProgram(this.program);
	}

	run() {
		for (let i = 0; i < this.vertexCount * 2; i += 2) {
			const dx = this.vertices[i] - this.mouseX;
			const dy = this.vertices[i + 1] - this.mouseY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < 0.2) {
				this.vertices[i] = this.mouseX + dx / distance * 0.2;
				this.vertices[i + 1] = this.mouseY + dy / distance * 0.2;
			} else {
				this.vertices[i] += Math.random() * 0.01 - 0.005;
				this.vertices[i + 1] += Math.random() * 0.01 - 0.005;
			}
		}

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
		this.gl.drawArrays(this.gl.POINTS, 0, this.vertexCount);

		requestAnimationFrame(this.run);
	}

	cleanup(canvas: HTMLCanvasElement) {
		canvas.removeEventListener("mousemove", this.onMouseMove);
	}
}

export default GigglingPoints;
