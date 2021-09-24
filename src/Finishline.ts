import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class FinishLine extends GameObject {
    update(): void {}

    constructor(s: p5, engine: Matter.Engine, posX: number, posY: number, height: number, width: number, colour: string) {
        super(s, engine, Bodies.rectangle(posX, posY, height, width, { isStatic: true, isSensor: true}), colour);
        //super(s, engine, Bodies.circle(1400, 440, 20, { isStatic: true }), 'green');
    }
}
export default FinishLine