import ITriangleOptions from './01-Triangle/ITriangleOptions';

export default interface IProgram {
	init(gl: WebGLRenderingContext, options: ITriangleOptions): IProgram;
	createShaders(): void;
	prepare(): void;
	createVertices(): void;
	run(): void;
}
