import * as p5 from 'p5';

import * as Matter from 'matter-js';

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
var SAT: any = (Matter as any).SAT

let sketch = function (p: p5) {
    // create an engine
    let engine: Matter.Engine;
    let player: Matter.Body;
    //let boxB: Matter.Body;
    let groundA: Matter.Body;
    let groundB: Matter.Body;
    let groundC: Matter.Body;
    let groundD: Matter.Body;
    let gravPower: Matter.Body;
    let sjumpPower: Matter.Body;
    let playerGrounded = false;
    let buttonCD = 0;
    let hasGrav = false;
    let hasSJump = false;
    let lives = 5;

    p.setup = function () {
        p.frameRate(60);
        p.createCanvas(1423, 800);
        engine = Engine.create();
        //render.options.wireframes = false;
        // create two boxes and a ground
        player = Bodies.rectangle(400, 250, 40, 40, { inertia: Infinity, friction: 0.002, render: {

            sprite: {
                texture: 'src/Player.png',
                xScale: 2,
                yScale: 2
            }
        }});
        /*boxB = Bodies.rectangle(400, 100, 40, 40);*/
        groundA = Bodies.rectangle(400, 410, 810, 10, { isStatic: true });
        groundB = Bodies.rectangle(800, 670, 600, 30, { isStatic: true });
        groundC = Bodies.rectangle(1600, 670, 810, 30, { isStatic: true });
        groundD = Bodies.rectangle(1600, 730, 810, 30, { isStatic: true });
        gravPower = Bodies.circle(800, 630, 20, { isStatic: true });
        sjumpPower = Bodies.circle(900, 630, 20, { isStatic: true});
        sjumpPower.isSensor = true
        gravPower.isSensor = true
        Matter.Body.setMass(player, 4)
        World.add(engine.world, [player, /*boxB,*/ groundA, groundB, groundC, groundD, gravPower, sjumpPower]);
        
    };
    //     }
    //   }
    p.draw = function () {
        Engine.update(engine, 30);
        p.background(0);
        p.fill("green");
        p.translate(-player.position.x + innerWidth / 2, 0/*-player.position.y + innerHeight/2*/)

        // Draw all bodies
        // p5 and matter js meeting
        engine.world.bodies.forEach(body => {
            p.beginShape()
            body.vertices.forEach(vertex => {
                p.vertex(vertex.x, vertex.y);
            })
            p.endShape(p.CLOSE);
        });
        //check if grouded
        let collisionA = SAT.collides(player, groundA);
        let collisionB = SAT.collides(player, groundB);
        let collisionC = SAT.collides(player, groundC);
        let collisionD = SAT.collides(player, groundD);
        if (collisionA.collided) {
            playerGrounded = true;
        }
        else if (collisionB.collided) {
            playerGrounded = true;
        }
        else if (collisionC.collided) {
            playerGrounded = true;
        }
        else if (collisionD.collided) {
            playerGrounded = true;
        }
        else {
            playerGrounded = false
        }
        if (player.position.x < 20){
            Matter.Body.translate(player,{ x:0, y: 20});
        }
        //Gravity power
        let collisionGrav = SAT.collides(player, gravPower);
        let collisionSJump = SAT.collides(player, sjumpPower);
        
        if ((collisionGrav.collided && p.keyIsDown(81)) && hasSJump == true) {
            console.log('B')
            hasGrav = true;
            hasSJump = false;
            World.add(engine.world, sjumpPower);
        }
        if (collisionGrav.collided && p.keyIsDown(81)) {
            console.log('A')
            hasGrav = true;
            Matter.Composite.remove(engine.world, gravPower);
        }
        if (collisionSJump.collided && p.keyIsDown(81)) {
            hasSJump = true;
            Matter.Composite.remove(engine.world, sjumpPower);
        }
        if ((collisionSJump.collided && p.keyIsDown(81)) && hasGrav == true) {
            hasSJump = true;
            hasGrav = false;
            World.add(engine.world, gravPower);
        }
        //W
        if (p.keyIsDown(87) && playerGrounded == true) {
            Matter.Body.applyForce(player, player.position, { x: 0, y: -0.05 });
        }
        //A
        if (p.keyIsDown(65)) {
            Matter.Body.applyForce(player, player.position, { x: -0.002, y: 0 });
        }
        //D
        if (p.keyIsDown(68)) {
            Matter.Body.applyForce(player, player.position, { x: +0.002, y: 0 });
        }
        /*
        //S
        if (p.keyIsDown(83)) {
            Matter.Body.applyForce(player, player.position, { x: 0.00, y: 0.005 });
        }
        */

    }

    p.keyPressed = function () {
        //this changes gravity on toggle of E 
        if (p.keyCode == 69 && hasGrav == true) {
            engine.world.gravity.y *= -1;
        }
        //super jump
        if (p.keyCode == 87 && hasSJump == true && playerGrounded == true) {
            Matter.Body.applyForce(player, player.position, { x: 0, y: -0.1 });
        }
        //fullscreens on P
        if (p.keyCode == 80) {
            let fs = p.fullscreen();
            p.fullscreen(!fs);
        }
        //R to reset position
        if (p.keyIsDown(71)) {
            Matter.Body.translate(player,{ x:0, y: 600});
        }
    }
};


let myp5 = new p5(sketch);