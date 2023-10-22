import { Color } from '../types/color.type';

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);

export const randomColorHelper = (min: number, max: number) => {
	return {
		r: randomNumber(min, max),
		g: randomNumber(min, max),
		b: randomNumber(min, max),
	};
};

export const hexify = (color: Color) => {
	const { r, g, b } = color;
	const first = r.toString(16).padStart(2, '0');
	const second = g.toString(16).padStart(2, '0');
	const third = b.toString(16).padStart(2, '0');
	return `#${first}${second}${third}`;
};
