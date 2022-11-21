import ICanvasOptions from './ICanvasOptions';
import IProgram from '../Programs/IProgram';

class Canvas {
	protected _gl?: WebGLRenderingContext;
	private _program: IProgram;

	constructor(
		protected element: HTMLCanvasElement,
		protected options: ICanvasOptions
	) {
		// resize
		this.element.style.height = `${options.height.toString()}px`;
		this.element.style.width = `${options.width.toString()}px`;

		// get context & prepare
		this._gl = this.element.getContext("webgl");
		this._gl.viewport(0, 0, this.element.width, this.element.height);
		this._gl.clearColor(0, 0, 0, 1);
	}

	get gl() {
		return this._gl;
	}

	set program(value: IProgram) {
		this._program = value;

		this._program.listen(this.element);
	}

	public draw() {
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);

		this._program.createShaders();
		this._program.prepare();
		this._program.createVertices();
		this._program.run();
	}

	tearDown() {
		this.program.cleanup(this.element);
	}
}

export default Canvas;
