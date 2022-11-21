import Canvas from './Canvas/Canvas';
import ICanvasOptions from './Canvas/ICanvasOptions';
import PerspectiveProgram from './Programs/06-perspective/PerspectiveProgram';

const element = document.getElementById('webgl-target') as HTMLCanvasElement;
const options: ICanvasOptions = {
	width: 800,
	height: 400,
};

const can = new Canvas(element, options);
can.program = new PerspectiveProgram().init(can.gl, {
	...options,
	pointSize: 10,
	color: [0, 1, 0, 1]
});
can.draw();
