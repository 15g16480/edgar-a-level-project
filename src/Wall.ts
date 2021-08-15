import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Wall extends GameObject {
    update(): void {}
    draw(): void { /* draw the wall here */ }
    constructor(s: p5, engine: Matter.Engine) {
        // Do some stuff
        super(s, engine, Bodies.rectangle(0, 400, 100, 1000, { isStatic: true }), 'green');
    }
}

export default Wall