import IAbstractOptions from '../IAbstractOptions';

export default interface IPerspectiveOptions extends IAbstractOptions {
	pointSize: number;
	width: number;
	height: number;
	color: [number, number, number, number]; // @todo vec4?
}
