import Canvas from './Canvas/Canvas';
import ICanvasOptions from './Canvas/ICanvasOptions';
import TriangleTransformProgram from './Programs/03-TriangleTransform/TriangleTransformProgram';

const element = document.getElementById('webgl-target') as HTMLCanvasElement;
const options: ICanvasOptions = {
	width: 800,
	height: 400,
};

const can = new Canvas(element, options);
can.program = new TriangleTransformProgram().init(can.gl, {
	pointSize: 10,
	color: [0, 1, 0, 1]
});
can.draw();
