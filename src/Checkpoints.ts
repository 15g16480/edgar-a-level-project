import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Checkpoint extends GameObject {
    update(): void {}

    constructor(s: p5, engine: Matter.Engine, posX: number, posY: number, radius: number, colour: string) {
        super(s, engine, Bodies.circle(posX, posY, radius, { isStatic: true }), colour);
        //super(s, engine, Bodies.circle(1400, 440, 20, { isStatic: true }), 'green');
    }
}
export default Checkpoint