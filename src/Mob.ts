import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Mob extends GameObject {
    update(): void {}
    draw(): void { /* draw the wall here */ }
    isAlive: boolean;
    constructor(s: p5, engine: Matter.Engine) {
        super(s, engine, Bodies.rectangle(1100, 630, 40, 40, { inertia: Infinity, friction: 0 }), 'purple');
    }
}

export default Mob