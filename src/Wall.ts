import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import drawBody from './drawBody';
import GameObject from './GameObject'

class Wall extends GameObject {
    update(): void {}

    constructor(s: p5, engine: Matter.Engine, posX: number, posY: number, height: number, width: number, colour: string) {
        super(s, engine, Bodies.rectangle(posX, posY, height, width, { isStatic: true }), colour);
        //super(s, engine, Bodies.rectangle(0, 400, 100, 1000, { isStatic: true }), 'green');
    }
}

export default Wall