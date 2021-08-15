import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Ground extends GameObject {
    update(): void {}
    draw(): void { /* draw the wall here */ }
    constructor(s: p5, engine: Matter.Engine) {
        // Do some stuff
        super(s, engine, Bodies.rectangle(1600, 480, 810, 30, { isStatic: true }), 'green');
        super(s, engine, Bodies.rectangle(800, 670, 600, 30, { isStatic: true }), 'green');
        super(s, engine, Bodies.rectangle(400, 410, 810, 30, { isStatic: true }), 'green');
        super(s, engine, Bodies.rectangle(1600, 670, 810, 30, { isStatic: true }), 'green');
        super(s, engine, Bodies.rectangle(480, 1000, 1000, 30, { isStatic: true }), 'green');
    }
}

export default Ground