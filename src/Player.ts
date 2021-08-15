import { Body, Bodies, Engine } from 'matter-js';
import * as p5 from 'p5'
import GameObject from './GameObject'

class Player extends GameObject {
    draw(){};
    update() {

        //A
        if (this.s.keyIsDown(65)) {
            Body.applyForce(this.body, this.body.position, { x: -0.002, y: 0 });
        }
        //D
        if (this.s.keyIsDown(68)) {
            Body.applyForce(this.body, this.body.position, { x: +0.002, y: 0 });
        }
    }
    body: Body;
    lives: number;
    spawnx: number;
    spawny: number;
    //colour: string;
    constructor(s: p5, engine: Engine) {
        // Do some stuff
        super(s, engine, Bodies.rectangle(400, 370, 40, 40, {
            inertia: Infinity, friction: 0.002,
        }), 'blue');
        this.lives = 3;
        this.spawnx = 400;
        this.spawny = 370;
        // this.colour = 'red'
        Body.setMass(this.body, 4)
    }

    hitCheckpoint(x: number, y: number) {
        this.spawnx = x;
        this.spawny = y;
    }

    respawn() {
        Body.translate(this.body, { x: this.spawnx - this.body.position.x, y: this.spawny - this.body.position.y });
    }
    
    //Movement
    //W
    // if (p.keyIsDown(87) && playerGrounded == true && hasSJump == false && engine.world.gravity.y == 1 && doubleJump == true) {
    //     let now = Date.now();
    //     if ((now - jumpTime) > jumpTimer) {
    //         Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -0.06 });
    //         jumpTime = now;
    //     }
    // }
    // if (p.keyIsDown(87) && playerGrounded == false && hasSJump == false && engine.world.gravity.y == 1 && doubleJump == true) {
    //     let now = Date.now();
    //     if ((now - jumpTime) > jumpTimer) {
    //         Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -0.06 });
    //         doubleJump = false;
    //         jumpTime = now;
    //     }

    // }
    // if (playerGrounded == true) {
    //     doubleJump = true;
    //     console.log(this.body.position.x, this.body.position.y)
    // }
}
//update() {
//    this.colour = this.death ? 'lime' : 'green';}


export default Player;