import IAbstractOptions from '../IAbstractOptions';

export default interface ITransformWithMatrixOptions extends IAbstractOptions {
	pointSize: number;
	color: [number, number, number, number]; // @todo vec4?
}
