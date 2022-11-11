import Canvas from './Canvas/Canvas';
import ICanvasOptions from './Canvas/ICanvasOptions';
import GigglingPoints from './Programs/02-GiglingPoints/GigglingPoints';

const element = document.getElementById('webgl-target') as HTMLCanvasElement;
const options: ICanvasOptions = {
	width: 800,
	height: 400,
};

const can = new Canvas(element, options);
can.program = new GigglingPoints().init(can.gl, {color: [0, 0, 0, 1]});

can.draw();
