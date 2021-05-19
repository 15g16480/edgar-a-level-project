import * as p5 from 'p5';

import * as Matter from 'matter-js';

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let sketch = function (p: p5) {
    // create an engine
    let engine: Matter.Engine;
    let player: Matter.Body;
    let boxB: Matter.Body;
    let groundA: Matter.Body;
    let groundB: Matter.Body;
    let groundC: Matter.Body;
    let finish: Matter.Body;
    let MOVE_LEFT: Matter.Vector;
    let pg: any;
    const LEVEL_WIDTH = 10000;
    let playerGrounded:any;

    p.setup = function () {
        p.frameRate(60);
        p.createCanvas(1423, 800);
        engine = Engine.create();
        // create two boxes and a ground
        player = Bodies.rectangle(400, 250, 40, 40, { inertia: Infinity, friction: 0.002 });
        boxB = Bodies.rectangle(400, 100, 40, 40);
        groundA = Bodies.rectangle(400, 410, 810, 30, { isStatic: true });
        groundB = Bodies.rectangle(800, 670, 600, 30, { isStatic: true });
        groundC = Bodies.rectangle(1600, 670, 810, 30, { isStatic: true });
        finish = Bodies.circle(800, 700, 20, { isStatic: true });
        Matter.Body.setMass(player, 4)
        World.add(engine.world, [player, boxB, groundA, groundB, groundC, finish]);
    };
    //     }
    //   }
    p.draw = function () {
        Engine.update(engine, 30);
        p.background(0);
        p.fill("green");
        p.translate(-player.position.x + innerWidth/2, 0/*-player.position.y + innerHeight/2*/)

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
        if ((player.position.y == groundA.position.y +30) /*&& player.position.x>410 || player.position.x>1220*/){
            playerGrounded = true
        }

        //W
        if (p.keyIsDown(87) && playerGrounded == true) {
            Matter.Body.applyForce(player, player.position, { x: 0, y: -0.02 });
        }
        //A
        if (p.keyIsDown(65)) {
            Matter.Body.applyForce(player, player.position, { x: -0.002, y: 0 });
        }
        //D
        if (p.keyIsDown(68)) {
            Matter.Body.applyForce(player, player.position, { x: +0.002, y: 0 });
        }
        //S
        if (p.keyIsDown(83)) {
            Matter.Body.applyForce(player, player.position, { x: 0.00, y: 0.005 });
        }


    }

    p.keyPressed = function () {
        //this changes gravity on toggle of E 
        if (p.keyCode == 69) {
            engine.world.gravity.y *= -1;
        }
        //fullscreens on P
        if (p.keyCode == 80) {
            let fs = p.fullscreen();
            p.fullscreen(!fs);
        }
        //R to reset position
        /*if (p.keyIsDown(71)) {
            p.reset();
        }*/
    }
};


let myp5 = new p5(sketch);