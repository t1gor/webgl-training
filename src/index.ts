import Canvas from './Canvas/Canvas';
import ICanvasOptions from './Canvas/ICanvasOptions';

const element = document.getElementById('webgl-target') as HTMLCanvasElement;
const options: ICanvasOptions = {
	width: 800,
	height: 400,
};

const can = new Canvas(element, options);

console.log(can);

can.draw();
