import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Mob extends GameObject {
    update(): void {}

    isAlive: boolean;
    constructor(s: p5, engine: Matter.Engine, posX: number, posY: number, height: number, width: number, colour: string) {
        // Do some stuff
        super(s, engine, Bodies.rectangle(posX, posY, height, width, { friction: 0 , inertia: Infinity}), colour);
        this.isAlive=true
    }
}

export default Mob