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
    //create bodies
    let player: Matter.Body;
    let mobA: Matter.Body;
    let mobB: Matter.Body;
    let groundA: Matter.Body;
    let groundB: Matter.Body;
    let groundC: Matter.Body;
    let groundD: Matter.Body;
    let groundE: Matter.Body;
    let groundF: Matter.Body;
    let groundG: Matter.Body;
    let groundH: Matter.Body;
    let top: Matter.Body;
    let bottom: Matter.Body;
    let gravPower: Matter.Body;
    let sjumpPower: Matter.Body;
    let checkpointA: Matter.Body;
    let checkpointB: Matter.Body;
    let buttonCD = 0;
    let hasGrav = false;
    let hasSJump = false;
    let lives = 3;
    let gravPowerInvalid = false;
    let sjumpPowerInvalid = false;
    let jumpTime = 0;
    let jumpTimer = 200;
    let sjumpTimer = 300;
    let gravTime = 0;
    let gravTimer = 1000;
    let collisionFix = 0;
    let collisionFixer = 1;
    let death = false;
    let mobADeath = false;
    let mobBDeath = false;
    let playerpng;
    let spawnx = 400;
    let spawny = 370;
    let playerGrounded = false;
    let doubleJump = false;
    let livesLost = false;
    let invulnerablity = 0;
    let invulnerablilityTimer = 500;

    p.setup = function () {
        p.frameRate(60);
        //moves canvas to fit the webpage
        let cnv = p.createCanvas(window.innerWidth + 10, window.innerHeight + 99);
        cnv.position(-10, -20)
        engine = Engine.create();
        //render.options.wireframes = false;
        // create player
        player = Bodies.rectangle(spawnx, spawny, 40, 40, {
            inertia: Infinity, friction: 0.000,
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
        mobA = Bodies.rectangle(900, 630, 40, 40, { inertia: Infinity, friction: 0 });
        mobB = Bodies.rectangle(1100, 630, 40, 40, { inertia: Infinity, friction: 0 });
        groundA = Bodies.rectangle(400, 410, 810, 30, {
            isStatic: true, render: {
                fillStyle: 'red',
                strokeStyle: 'blue',
                lineWidth: 3
            }
        });
        groundB = Bodies.rectangle(800, 670, 600, 30, { isStatic: true });
        groundC = Bodies.rectangle(1600, 670, 810, 30, { isStatic: true });
        groundD = Bodies.rectangle(1600, 480, 810, 30, { isStatic: true });
        /*groundE = Bodies.rectangle(400, 1000, 810, 30, { isStatic: true });
        groundF = Bodies.rectangle(1600, 480, 810, 30, { isStatic: true });
        groundG = Bodies.rectangle(1600, 480, 810, 30, { isStatic: true });
        groundH = Bodies.rectangle(1600, 480, 810, 30, { isStatic: true });*/
        bottom = Bodies.rectangle(-500, 1170, 10000, 500, { isStatic: true });
        top = Bodies.rectangle(-500, -230, 10000, 500, { isStatic: true });
        gravPower = Bodies.circle(800, 630, 20, { isStatic: true });
        sjumpPower = Bodies.circle(900, 630, 20, { isStatic: true });
        checkpointA = Bodies.circle(1300, 630, 20, { isStatic: true });
        checkpointB = Bodies.circle(1400, 630, 20, { isStatic: true });
        checkpointA.isSensor = true
        checkpointB.isSensor = true
        sjumpPower.isSensor = true
        gravPower.isSensor = true
        Matter.Body.setMass(player, 4)
        World.add(engine.world, [player, mobA, mobB, groundA, groundB, groundC, groundD, /*groundE, groundF, groundG, groundH,*/ gravPower, sjumpPower, top, bottom, checkpointA, checkpointB]);

        //collisions for checkpoint saving
        Matter.Events.on(engine, "collisionEnd", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.id || pair.bodyB.id == player.id)
                .forEach(pair => {
                    let possibleCheckpoint = pair.bodyA.id == player.id ? pair.bodyB : pair.bodyA;
                    if (possibleCheckpoint.id == checkpointA.id || possibleCheckpoint.id == checkpointB.id) {
                        spawnx = possibleCheckpoint.position.x;
                        spawny = possibleCheckpoint.position.y;
                    }
                });
        });

        //collisions for the player being grounded
        Matter.Events.on(engine, "collisionStart", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.id || pair.bodyB.id == player.id)
                .forEach(pair => {
                    let possibleGrounding = pair.bodyA.id == player.id ? pair.bodyB : pair.bodyA;
                    if (possibleGrounding.id == groundA.id || possibleGrounding.id == groundB.id) {
                        playerGrounded = true;
                        //doubleJump = true;
                    }
                });
        });
        Matter.Events.on(engine, "collisionStart", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.id || pair.bodyB.id == player.id)
                .forEach(pair => {
                    let possibleGrounding = pair.bodyA.id == player.id ? pair.bodyB : pair.bodyA;
                    if (possibleGrounding.id == groundC.id || possibleGrounding.id == groundD.id) {
                        playerGrounded = true;
                        //doubleJump = true;
                    }
                });
        });
        Matter.Events.on(engine, "collisionEnd", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.id || pair.bodyB.id == player.id)
                .forEach(pair => {
                    let possibleGrounding = pair.bodyA.id == player.id ? pair.bodyB : pair.bodyA;
                    if (possibleGrounding.id == groundA.id || possibleGrounding.id == groundB.id) {
                        playerGrounded = false;
                    }
                });
        });
        Matter.Events.on(engine, "collisionEnd", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.id || pair.bodyB.id == player.id)
                .forEach(pair => {
                    let possibleGrounding = pair.bodyA.id == player.id ? pair.bodyB : pair.bodyA;
                    if (possibleGrounding.id == groundC.id || possibleGrounding.id == groundD.id) {
                        playerGrounded = false;
                    }
                });
        });

        //collisions for playing hit ceiling/floor
        Matter.Events.on(engine, "collisionStart", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.id || pair.bodyB.id == player.id)
                .forEach(pair => {
                    let edgeOfVerticalMap = pair.bodyA.id == player.id ? pair.bodyB : pair.bodyA;
                    if (edgeOfVerticalMap.id == top.id || edgeOfVerticalMap.id == bottom.id) {
                        death = true;
                    }
                });
        });
        // Matter.Events.on(engine, "collisionStart", function (event) {
        //     event.pairs
        //         .filter(pair => pair.bodyA.id == player.id || pair.bodyB.id == player.id)
        //         .forEach(pair => {
        //             let mobCollides = pair.bodyA.id == player.id ? pair.bodyB : pair.bodyA;
        //             if (mobCollides.id == mobA.id || mobCollides.id == mobB.id) {

        //                     if (Math.round(player.position.y) >= Math.round(mobA.position.y) - 30 && mobADeath == false) {
        //                         death = true
        //                     }
        //                     else if (death == false && Math.round(player.position.y) <= Math.round(mobA.position.y) - 30 && mobADeath == false) {
        //                         Matter.Composite.remove(engine.world, mobA);
        //                         mobADeath = true;
        //                     }
        //                     else if (Math.round(player.position.y) >= Math.round(mobB.position.y) - 30 && mobBDeath == false) {
        //                         death = true
        //                     }
        //                     else if (death == false && Math.round(player.position.y) <= Math.round(mobB.position.y) - 30 && mobBDeath == false) {
        //                         Matter.Composite.remove(engine.world, mobB);
        //                         mobBDeath = true;
        //                     }


        //             }
        //         });
        // });
        p.fill(220)
        p.text('whagwan',10,10,70,80)
    };
    p.draw = function () {
        Engine.update(engine, 30);
        p.background(51);
        p.frameRate(60)
        p.translate(-player.position.x + innerWidth / 2, 0/*-player.position.y + innerHeight/2*/)

        function drawBody(body: Matter.Body, colour: string) {
            p.fill(colour);
            p.beginShape()
            body.vertices.forEach(vertex => {
                p.vertex(vertex.x, vertex.y);
            })
            p.endShape(p.CLOSE);
        }

        // let player: Matter.Body;
        // let mobA: Matter.Body;
        // let mobB: Matter.Body;
        // let groundA: Matter.Body;
        // let groundB: Matter.Body;
        // let groundC: Matter.Body;
        // let groundD: Matter.Body;
        // let top: Matter.Body;
        // let bottom: Matter.Body;
        // let gravPower: Matter.Body;
        // let sjumpPower: Matter.Body;
        // let checkpointA: Matter.Body;
        // let checkpointB: Matter.Body;

        // Draw all bodies
        // p5 and matter js meeting
        engine.world.bodies.forEach(body => {
            drawBody(body, 'grey');
        });

        drawBody(player, 'green');
        drawBody(mobA, 'red');
        drawBody(mobB, 'red');

        //mob collision
        let collisionmobA = SAT.collides(player, mobA);
        let collisionmobB = SAT.collides(player, mobB);

        //mob collision 
        if (collisionmobA.collided && mobADeath == false) {
            let now = Date.now();
            if ((now - collisionFix) > collisionFixer) {
                if (Math.round(player.position.y) >= Math.round(mobA.position.y) - 30) {
                    livesLost = true
                }
                else if (death == false && Math.round(player.position.y) <= Math.round(mobA.position.y) - 30) {
                    Matter.Composite.remove(engine.world, mobA);
                    mobADeath = true;
                }
                collisionFix = now;
            }

        }
        if (collisionmobB.collided && mobBDeath == false) {
            let now = Date.now();
            if ((now - collisionFix) > collisionFixer) {
                if (Math.round(player.position.y) >= Math.round(mobB.position.y) - 30) {
                    livesLost = true
                }
                else if (death == false && Math.round(player.position.y) <= Math.round(mobB.position.y) - 30) {
                    Matter.Composite.remove(engine.world, mobB);
                    mobBDeath = true;
                }
                collisionFix = now;
            }

        }

        //Player Health system
        if (lives == 0) {
            death = true
        }

        if (livesLost == true) {
            let now = Date.now();
            if ((now - invulnerablity) > invulnerablilityTimer) {
                lives = lives - 1
                //change color here
            }
            invulnerablity = now;
            livesLost = false
        }
        //Player death
        if (death == true) {
            Matter.Body.translate(player, { x: spawnx - player.position.x, y: spawny - player.position.y });
            death = false
        }

        //mob targetting
        if (mobA.position.x > player.position.x) {
            Matter.Body.applyForce(mobA, mobA.position, { x: -0.0001, y: 0 });
        }
        else {
            Matter.Body.applyForce(mobA, mobA.position, { x: 0.0001, y: 0 });
        }
        if (mobB.position.x > player.position.x) {
            Matter.Body.applyForce(mobB, mobB.position, { x: -0.0001, y: 0 });
        }
        else {
            Matter.Body.applyForce(mobB, mobB.position, { x: 0.0001, y: 0 });
        }

        //Powerups
        let collisionGrav = SAT.collides(player, gravPower);
        let collisionSJump = SAT.collides(player, sjumpPower);
        //super jump
        if (p.keyIsDown(87) && hasSJump == true && playerGrounded == true && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > sjumpTimer && doubleJump == true) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: -0.1 });
                jumpTime = now;
            }
        }
        if (p.keyIsDown(87) && hasSJump == true && playerGrounded == false && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > sjumpTimer && doubleJump == true) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: -0.1 });
                doubleJump = false;
                jumpTime = now;
            }
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

        //gravity jump
        if (p.keyIsDown(87) && hasGrav == true && playerGrounded == true && engine.world.gravity.y == -1 && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: 0.06 });
                jumpTime = now;
            }
        }
        if (p.keyIsDown(87) && hasGrav == true && playerGrounded == false && engine.world.gravity.y == -1 && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: 0.06 });
                doubleJump = false;
                jumpTime = now;
            }
        }
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

        //R to reset position
        if (p.keyIsDown(82)) {
            Matter.Body.translate(player, { x: spawnx - player.position.x, y: spawny - player.position.y });
        }

        //Movement
        //W
        if (p.keyIsDown(87) && playerGrounded == true && hasSJump == false && engine.world.gravity.y == 1 && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: -0.06 });
                jumpTime = now;
            }
        }
        if (p.keyIsDown(87) && playerGrounded == false && hasSJump == false && engine.world.gravity.y == 1 && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player, player.position, { x: 0, y: -0.06 });
                doubleJump = false;
                jumpTime = now;
            }

        }
        if (playerGrounded == true) {
            doubleJump = true;
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
    }
};


let myp5 = new p5(sketch);