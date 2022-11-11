import IAbstractOptions from '../IAbstractOptions';

export default interface ITriangleOptions extends IAbstractOptions {
	pointSize: number;
	color: [number, number, number, number]; // @todo vec4?
}
