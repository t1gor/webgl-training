import IAbstractOptions from '../IAbstractOptions';

export default interface ITransformAndColoredOptions extends IAbstractOptions {
	pointSize: number;
	color: [number, number, number, number]; // @todo vec4?
}
