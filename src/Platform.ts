import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Platform extends GameObject {
    update(): void {}
    draw(): void { /* draw the wall here */ }
    constructor(s: p5, engine: Matter.Engine) {
        // Do some stuff
        super(s, engine, Bodies.rectangle(300, 400, 10, 10, { isStatic: true }), 'green');
    }
}

export default Platform