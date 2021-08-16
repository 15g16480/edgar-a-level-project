import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Platform extends GameObject {
    update(): void {}

    constructor(s: p5, engine: Matter.Engine, posX: number, posY: number, height: number, width: number, colour: string) {
        super(s, engine, Bodies.rectangle(posX, posY, height, width, { isStatic: true }), colour);
        //super(s, engine, Bodies.rectangle(300, 400, 10, 10, { isStatic: true }), 'green');
    }
}

export default Platform