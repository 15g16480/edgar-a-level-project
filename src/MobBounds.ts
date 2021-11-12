import * as Matter from 'matter-js';
import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class MobBounds extends GameObject {

    length: number;
    update(): void {}
    
    constructor(s: p5, engine: Matter.Engine, posX: number, posY: number, height: number, width: number, colour: string) {
        super(s, engine, Bodies.rectangle(posX, posY, height, width, { isStatic: true, collisionFilter:{'category':3, 'mask':4} }), colour);
        this.length = width;
        // super(s, engine, Bodies.rectangle(800, 670, 600, 30, { isStatic: true }), 'green');
        // super(s, engine, Bodies.rectangle(400, 410, 810, 30, { isStatic: true }), 'green');
        // super(s, engine, Bodies.rectangle(1600, 670, 810, 30, { isStatic: true }), 'green');
        // super(s, engine, Bodies.rectangle(480, 1000, 1000, 30, { isStatic: true }), 'green');
    };
    // collisionFilter = {
    //     'group': -1,
    //     'category': 2,
    //     'mask': 1,
    //   };
}

export default MobBounds