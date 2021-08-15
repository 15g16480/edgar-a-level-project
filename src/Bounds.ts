import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Bounds extends GameObject {
    update(): void {}
    draw(): void { /* draw the wall here */ }
    constructor(s: p5, engine: Matter.Engine) {
        // Do some stuff
        super(s, engine, Bodies.rectangle(-500, 1170, 10000, 500, { isStatic: true }),'green');
    }
}
export default Bounds