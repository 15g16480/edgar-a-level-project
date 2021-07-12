import { Body, Bodies } from 'matter-js';
import * as p5 from 'p5'

import drawBody from './drawBody';

class Player {
    body: Matter.Body;
    lives: number;
    spawnx: number;
    spawny: number;

    constructor() {
        // Do some stuff
        this.lives = 3;
        this.spawnx = 400;
        this.spawny = 370;

        this.body = Bodies.rectangle(this.spawnx, this.spawny, 40, 40, {
            inertia: Infinity, friction: 0.002,
            /*sprite: {
                texture: 'Player.png',
                xScale: 1,
                yScale: 1
            }*/
        });
        Body.setMass(this.body, 4)
    }

    hitCheckpoint(x: number, y: number) {
        this.spawnx = x;
        this.spawny = y;
    }

    respawn() {
        Body.translate(this.body, { x: this.spawnx - this.body.position.x, y: this.spawny - this.body.position.y });
    }

    draw(p: p5) {
        //A
        if (p.keyIsDown(65)) {
            Body.applyForce(this.body, this.body.position, { x: -0.002, y: 0 });
        }
        //D
        if (p.keyIsDown(68)) {
            Body.applyForce(this.body, this.body.position, { x: +0.002, y: 0 });
        }

        drawBody(p, this.body, 'green');

    }
}

export default Player;