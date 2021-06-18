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
    let mobA: Matter.Body;
    let groundA: Matter.Body;
    let groundB: Matter.Body;
    let groundC: Matter.Body;
    let groundD: Matter.Body;
    let top: Matter.Body;
    let bottom: Matter.Body;
    let gravPower: Matter.Body;
    let sjumpPower: Matter.Body;
    let playerGrounded = false;
    let buttonCD = 0;
    let hasGrav = false;
    let hasSJump = false;
    let lives = 5;
    let gravPowerInvalid = false;
    let sjumpPowerInvalid = false;
    let height = 800;
    let width = 1423;
    let jumpTime = 0;
    let jumpTimer = 300;
    let sjumpTimer = 700;
    let gravTime = 0;
    let gravTimer = 1000;
    let death = false;
    let playerpng;
    let spawnx = 400;
    let spawny = 250;

    p.setup = function () {
        p.frameRate(60);
        //moves canvas to fit the webpage
        let cnv = p.createCanvas(window.innerWidth+10, window.innerHeight+99);
        cnv.position(-10,-20)
        engine = Engine.create();
        //render.options.wireframes = false;
        // create player
        player = Bodies.rectangle(spawnx, spawny, 40, 40, {
            inertia: Infinity, friction: 0.002, 
            render: {
                fillStyle: 'red',
                strokeStyle: 'blue',
                lineWidth: 3,
            }

            /*sprite: {
                texture: 'Player.png',
                xScale: 1,
                yScale: 1
            }*/
        });
        mobA = Bodies.rectangle(900, 300, 40, 40 ,{inertia: Infinity, friction: 0});
        groundA = Bodies.rectangle(400, 410, 810, 30, { isStatic: true });
        groundB = Bodies.rectangle(800, 670, 600, 30, { isStatic: true });
        groundC = Bodies.rectangle(1600, 670, 810, 30, { isStatic: true });
        groundD = Bodies.rectangle(1600, 480, 810, 30, { isStatic: true });
        bottom = Bodies.rectangle(-500, 1170, 10000, 500, { isStatic: true });
        top = Bodies.rectangle(-500, -230, 10000, 500, { isStatic: true });
        gravPower = Bodies.circle(800, 630, 20, { isStatic: true });
        sjumpPower = Bodies.circle(900, 630, 20, { isStatic: true });
        sjumpPower.isSensor = true
        gravPower.isSensor = true
        Matter.Body.setMass(player, 4)
        World.add(engine.world, [player, mobA, groundA, groundB, groundC, groundD, gravPower, sjumpPower, top, bottom]);

    };
    p.draw = function () {
        Engine.update(engine, 30);
        p.background(0);
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
        let collisionbottom = SAT.collides(player, bottom);
        let collisiontop = SAT.collides(player, top);
        let collisionmob = SAT.collides(player, mobA);
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
        if (collisionbottom.collided) {
            death = true
        }
        if (collisiontop.collided) {
            death = true
        }
        if (death == true){
            Matter.Body.translate(player, { x: spawnx-player.position.x, y: spawny-player.position.y });
        }
        if (collisionmob.collided && Math.round(player.position.y) == Math.round(mobA.position.y) - 39) {
            console.log('works')
        }
        else if (collisionmob.collided && Math.round(player.position.y) == Math.round(mobA.position.y) - 40) {
            console.log('works')
        }
        if (collisionmob.collided && Math.round(player.position.y) !== Math.round(mobA.position.y) - 40 && Math.round(player.position.y) !== Math.round(mobA.position.y) - 39) {
            death = true
        }
        
        //R to reset position
        if (p.keyIsDown(71)) {
            Matter.Body.translate(player, { x: player.position.x-spawnx, y: player.position.y-spawny });
        }
        //Gravity power
        let collisionGrav = SAT.collides(player, gravPower);
        let collisionSJump = SAT.collides(player, sjumpPower);

        if (collisionGrav.collided && p.keyIsDown(81) && gravPowerInvalid == false) {
            hasGrav = true;
            Matter.Composite.remove(engine.world, gravPower);
            gravPowerInvalid = true
        }
        if ((collisionGrav.collided && p.keyIsDown(81)) && hasSJump == true && gravPowerInvalid == true) {
            hasGrav = true;
            hasSJump = false;
            World.add(engine.world, sjumpPower);
            gravPowerInvalid = false;
        }
        if (collisionSJump.collided && p.keyIsDown(81) && sjumpPowerInvalid == false) {
            hasSJump = true;
            Matter.Composite.remove(engine.world, sjumpPower);
            sjumpPowerInvalid = true
        }
        if ((collisionSJump.collided && p.keyIsDown(81)) && hasGrav == true && sjumpPowerInvalid == true) {
            hasSJump = true;
            hasGrav = false;
            World.add(engine.world, gravPower);
            sjumpPowerInvalid = false;
        }
        //W
        if (p.keyIsDown(87) && playerGrounded == true && hasSJump == false && engine.world.gravity.y == 1) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: -0.05 });
                jumpTime = now;
            }
        }
        //super jump
        if (p.keyIsDown(87) && hasSJump == true && playerGrounded == true) {
            let now = Date.now();
            if ((now - jumpTime) > sjumpTimer) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: -0.1 });
                jumpTime = now;
            }
        }
        //gravity jump
        if (p.keyIsDown(87) && hasGrav == true && playerGrounded == true && engine.world.gravity.y == -1) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: 0.05 });
                jumpTime = now;
            }
        }
        //A
        if (p.keyIsDown(65)) {
            Matter.Body.applyForce(player, player.position, { x: -0.002, y: 0 });
        }
        //D
        if (p.keyIsDown(68)) {
            Matter.Body.applyForce(player, player.position, { x: +0.002, y: 0 });
        }
    }

    p.keyPressed = function () {
        //this changes gravity on toggle of E 
        if (p.keyCode == 69 && hasGrav == true) {
            let now = Date.now();
            if ((now - gravTime) > gravTimer) {
                engine.world.gravity.y *= -1;
                gravTime = now;
            }
        }
        //fullscreens on P
        if (p.keyCode == 80) {
            let fs = p.fullscreen();
            p.fullscreen(!fs);
        }
        //R to reset position
        /*if (p.keyIsDown(71)) {
            Matter.Body.translate(player, { x: 0, y: height + (player.bounds.max.y - player.bounds.min.y) });
            Matter.Body.translate(player, { x: 0, y: -height - (player.bounds.max.y - player.bounds.min.y) });
            Matter.Body.translate(player, { x: width + (player.bounds.max.x - player.bounds.min.x), y: 0 });
            Matter.Body.translate(player, { x: -width - (player.bounds.max.x - player.bounds.min.x), y: 0 });
        }*/
    }
};


let myp5 = new p5(sketch);