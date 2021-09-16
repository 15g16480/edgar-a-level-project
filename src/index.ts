import * as p5 from 'p5';

import * as Matter from 'matter-js';

import drawBody from './drawBody';
import Player from './Player';
import GameObject from './GameObject';
import Object from './Object';
import Mob from './Mob';
import Bounds from './Bounds';
import Checkpoint from './Bounds';
import Platform from './Platform';
import Wall from './Wall';
import Ground from './Ground';
import SJump from './SJump';
import Grav from './Grav';

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
var SAT: any = (Matter as any).SAT

// abstract class GameObject {
//     body: Matter.Body;
//     constructor(body: Matter.Body) {
//         this.body = body;
//     }
//     draw(s: p5) {

//     }
// }

let sketch = function (p: p5) {
    // create an engine
    let engine: Matter.Engine;
    //create bodies
    let player: Player;
    let mobs: Mob[] = [];
    let ground: Ground[] = [];
    let checkpoints: Checkpoint[] = [];
    let walls: Wall[] = [];
    let platforms: Platform[] = [];
    let bounds: Bounds[] = [];
    let sJump: SJump;
    let grav: Grav;
    let deathCount = 0;
    let jumpTime = 0;
    let jumpTimer = 200;
    let sjumpTimer = 300;
    let gravTime = 0;
    let gravTimer = 1000;
    let collisionFix = 0;
    let collisionFixer = 1;
    let death = false;
    let playerGrounded = false;
    let doubleJump = false;
    let invulnerablity = 0;
    let invulnerablilityTimer = 1000;
    let livesElem: p5.Element;

    p.setup = function () {
        p.frameRate(60);
        //moves canvas to fit the webpage
        let cnv = p.createCanvas(window.innerWidth + 10, window.innerHeight + 99);
        cnv.position(-10, -20)
        engine = Engine.create();
        //render.options.wireframes = false;
        // creating entities

        player = new Player(p, engine, 400, 370, 40, 40, 'green');
        grav = new Grav(p, engine, 1400, 440, 20, 'green');
        sJump = new SJump(p, engine, 1500, 440, 20, 'purple');
        ground.push(new Ground(p, engine, 1600, 480, 810, 30, 'blue'));
        ground.push(new Ground(p, engine, 400, 410, 810, 30, 'blue'));
        ground.push(new Ground(p, engine, 2200, 670, 810, 30, 'blue'));
        ground.push(new Ground(p, engine, 480, 1000, 1000, 30, 'blue'));
        ground.push(new Ground(p, engine, 800, 670, 600, 30, 'blue'));
        ground.push(new Ground(p, engine, 400, 0, 8000, 30, 'blue'));
        
        //ground.push(new Ground(p, engine, 800, 670, 600, 30, 'green'));
        mobs.push(new Mob(p, engine, 900, 630, 40, 40, 'orange'));
        mobs.push(new Mob(p, engine, 700, 630, 40, 40, 'orange'));
        checkpoints.push(new Checkpoint(p, engine, 1600, 440, 20, 20, 'yellow'));
        checkpoints.push(new Checkpoint(p, engine, 2400, 630, 20, 20, 'yellow'));
        walls.push(new Wall(p, engine, 0, 400, 100, 1000, 'black'));
        //platforms.push(new Platform(p, engine, 300, 400, 10, 10, 'blue'));
        bounds.push(new Bounds(p, engine, -500, 1170, 10000, 500, 'blue'));

        livesElem = p.createDiv('Lives = 3');
        livesElem.position(20, 20);
        livesElem.style('color', 'white');
        //adding entities to world
        ground.forEach(g => World.add(engine.world, g.body));
        walls.forEach(w => World.add(engine.world, w.body));
        mobs.forEach(m => World.add(engine.world, m.body));
        bounds.forEach(b => World.add(engine.world, b.body));
        platforms.forEach(p => World.add(engine.world, p.body));

        //collisions for checkpoint saving
        checkpoints.forEach(c => {
            Matter.Events.on(engine, "collisionStart", function (event) {
                event.pairs
                    .filter(pair => pair.bodyA.id == player.body.id)
                    .forEach(pair => {
                        let possibleCheckpoint = pair.bodyA.id == player.body.id ? pair.bodyB : pair.bodyA;
                        if (possibleCheckpoint.id == c.body.id) {
                            player.hitCheckpoint(possibleCheckpoint.position.x, possibleCheckpoint.position.y);
                        }
                    });
            });
        });

        // ground collision
        ground.forEach(g => {
            Matter.Events.on(engine, "collisionStart", function (event) {
                event.pairs
                    .filter(pair => pair.bodyA.id == player.body.id || pair.bodyB.id == player.body.id)
                    .forEach(pair => {
                        let possibleGrounding = pair.bodyA.id == player.body.id ? pair.bodyB : pair.bodyA;
                        if (possibleGrounding.id == g.body.id) {
                            playerGrounded = true;
                        }
                    });
            });
            Matter.Events.on(engine, "collisionEnd", function (event) {
                event.pairs
                    .filter(pair => pair.bodyA.id == player.body.id || pair.bodyB.id == player.body.id)
                    .forEach(pair => {
                        let possibleGrounding = pair.bodyA.id == player.body.id ? pair.bodyB : pair.bodyA;
                        if (possibleGrounding.id == g.body.id) {
                            playerGrounded = false;
                        }
                    });
            });
        })

        //collisions for playing hit ceiling/floor
        //bounds.forEach(b => {}

        // player death
        Matter.Events.on(engine, "collisionStart", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.body.id || pair.bodyB.id == player.body.id)
                .forEach(pair => {
                    let edgeOfVerticalMap = pair.bodyA.id == player.body.id ? pair.bodyB : pair.bodyA;
                    if (edgeOfVerticalMap.id == 99) {
                        death = true;
                    }
                });
        });

        //power ups
        //Super Jump
        Matter.Events.on(engine, "collisionStart", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.body.id || pair.bodyB.id == player.body.id)
                .forEach(pair => {
                    let possibleSJump = pair.bodyA.id == player.body.id ? pair.bodyB : pair.bodyA;
                    if ((possibleSJump.id == sJump.body.id) && p.keyIsDown(81) && grav.power == false) {
                        sJump.power = true;
                    }
                    if (((possibleSJump.id == sJump.body.id) && p.keyIsDown(81)) && grav.power == true) {
                        sJump.power = true;
                        grav.power = false;
                    }
                });
        });
        //Gravity
        Matter.Events.on(engine, "collisionStart", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.body.id || pair.bodyB.id == player.body.id)
                .forEach(pair => {
                    let possibleGrav = pair.bodyA.id == player.body.id ? pair.bodyB : pair.bodyA;
                    if ((possibleGrav.id == grav.body.id) && p.keyIsDown(81) && sJump.power == false) {
                        grav.power = true;
                    }
                    if (((possibleGrav.id == grav.body.id) && p.keyIsDown(81)) && sJump.power == true) {
                        sJump.power = false;
                        grav.power = true;
                    }
                });
        });
        //mob behaviour
        mobs.forEach(m => {
            Matter.Events.on(engine, "collisionStart", function (event) {
                event.pairs
                    .filter(pair => pair.bodyA.id == player.body.id)
                    .forEach(pair => {
                        let collidingMobId = pair.bodyA.id == player.body.id ? pair.bodyB.id : pair.bodyA.id;
                        let collidingMob = mobs.find(m => m.body.id == collidingMobId);
                        let now = Date.now();
                        if (collidingMobId == m.body.id) {
                            if ((now - invulnerablity) > invulnerablilityTimer) {
                                if (Math.round(player.body.position.y) >= Math.round(m.body.position.y) - 30) {
                                    loseLife()
                                }
                                invulnerablity = now;
                            }
                            if (Math.round(player.body.position.y) <= Math.round(m.body.position.y) - 30) {
                                m.kill()
                                //if( = false){
                                //   m.colour = '20'
                                //}
                            }
                        }
                    });
            });
        })

        p.fill(400);
    };

    p.draw = function () {
        Matter.Engine.update(engine, 30);
        p.background(0);
        p.frameRate(60);
        p.translate(-player.body.position.x + innerWidth / 2, 0/*-player.position.y + innerHeight/2*/)
        player.update()
        sJump.draw();
        grav.draw();
        player.draw();
        mobs.forEach(m => m.draw());
        bounds.forEach(b => b.draw());
        checkpoints.forEach(c => c.draw());
        ground.forEach(g => g.draw());
        platforms.forEach(p => p.draw());
        walls.forEach(w => w.draw());

        //Player Health system
        if (player.lives == 0) {
            death = true
        }
        //Player death
        if (death == true && deathCount == 0) {
            player.respawn();
            player.lives = 2
            deathCount = 1
            death = false
        }
        if (death == true && deathCount == 1) {
            player.respawn();
            player.lives = 1
            deathCount = 2
            death = false
        }
        if (death == true && deathCount == 2) {
            //refresh page

            player.spawnx = 400
            player.spawny = 370
            player.respawn();
            death = false
            deathCount = 0
            player.lives = 3
        }

        // //mob targetting
        mobs.forEach(m => {
            if (m.body.position.x > player.body.position.x) {
                Matter.Body.applyForce(m.body, m.body.position, { x: -0.00005, y: 0 });
            }
            else {
                Matter.Body.applyForce(m.body, m.body.position, { x: 0.00005, y: 0 });
            }
        })

        //Powerups
        //super jump
        if (p.keyIsDown(87) && sJump.power == true && playerGrounded == true && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > sjumpTimer && doubleJump == true) {
                Matter.Body.applyForce(player.body, player.body.position, { x: 0, y: -0.1 });
                jumpTime = now;
            }
        }
        if (p.keyIsDown(87) && sJump.power == true && playerGrounded == false && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > sjumpTimer && doubleJump == true) {
                Matter.Body.applyForce(player.body, player.body.position, { x: 0, y: -0.1 });
                doubleJump = false;
                jumpTime = now;
            }
        }
        //gravity jump
        if (p.keyIsDown(87) && grav.power == true && playerGrounded == true && engine.world.gravity.y == -1 && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player.body, player.body.position, { x: 0, y: 0.06 });
                jumpTime = now;
            }
        }
        if (p.keyIsDown(87) && grav.power == true && playerGrounded == false && engine.world.gravity.y == -1 && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player.body, player.body.position, { x: 0, y: 0.06 });
                doubleJump = false;
                jumpTime = now;
            }
        }
        //R to reset position
        if (p.keyIsDown(82)) {
            player.respawn();
        }

        //Movement
        //W
        if (p.keyIsDown(87) && playerGrounded == true && sJump.power == false && engine.world.gravity.y == 1 && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player.body, player.body.position, { x: 0, y: -0.06 });
                jumpTime = now;
            }
        }
        if (p.keyIsDown(87) && playerGrounded == false && sJump.power == false && engine.world.gravity.y == 1 && doubleJump == true) {
            let now = Date.now();
            if ((now - jumpTime) > jumpTimer) {
                Matter.Body.applyForce(player.body, player.body.position, { x: 0, y: -0.06 });
                doubleJump = false;
                jumpTime = now;
            }
        }
        if (playerGrounded == true) {
            doubleJump = true;
        }
    }
    function loseLife() {
        let now = Date.now();
        if ((now - invulnerablity) > invulnerablilityTimer) {
            player.lives = player.lives - 1
            player.colour = 'red'
        }
        else {player.colour = 'green'}
        const prevlives = parseInt(livesElem.html().substring(8));
        livesElem.html('Lives = ' + (prevlives - 1));
        invulnerablity = now;
    }
    p.keyPressed = function () {
        //this changes gravity on toggle of E 
        if (p.keyCode == 69 && grav.power == true) {
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

function loseLife() {
    throw new Error('Function not implemented.');
}
