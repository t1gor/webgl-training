import ICanvasOptions from './ICanvasOptions';
import TriangleProgram from '../Programs/Triangle/TriangleProgram';

class Canvas {

	protected gl?: WebGLRenderingContext;

	constructor(
		protected element: HTMLCanvasElement,
		protected options: ICanvasOptions
	) {
		// resize
		// this.element.style.height = `${options.height.toString()}px`;
		// this.element.style.width = `${options.width.toString()}px`;

		// get context & prepare
		this.gl = this.element.getContext("webgl");
		this.gl.viewport(0, 0, this.element.width, this.element.height);
		this.gl.clearColor(1, 0, 0, 1);
	}

	public draw() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		const program = new TriangleProgram(this.gl, {
			pointSize: 15,
			color: [0, 0, 0, 1]
		});
		program.use();
		program.run();
	}
}

export default Canvas;
