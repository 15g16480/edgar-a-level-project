import * as p5 from 'p5';

import * as Matter from 'matter-js';

import drawBody from './drawBody';
import Player from './Player';
import GameObject from './GameObject';
import Object from './Object';
import Mob from './Mob';
import Bounds from './Bounds';
import Checkpoint from './Checkpoints';
import Platform from './Platform';
import Wall from './Wall';
import Ground from './Ground';
import SJump from './SJump';
import Grav from './Grav';
import FinishLine from './Finishline';

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
    let mobs1: Mob[] = [];
    let mobs2: Mob[] = [];
    let ground1: Ground[] = [];
    let ground2: Ground[] = [];
    let checkpoints1: Checkpoint[] = [];
    let checkpoints2: Checkpoint[] = [];
    let walls1: Wall[] = [];
    let walls2: Wall[] = [];
    let platforms1: Platform[] = [];
    let platforms2: Platform[] = [];
    let bounds1: Bounds[] = [];
    let bounds2: Bounds[] = [];
    let finishLine1: FinishLine;
    let finishLine2: FinishLine;
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
    let level1 = true;
    let level2 = false;

    p.setup = function () {
        p.frameRate(60);
        //moves canvas to fit the webpage
        let cnv = p.createCanvas(window.innerWidth + 10, window.innerHeight + 99);
        cnv.position(-10, -20)
        engine = Engine.create();
        //render.options.wireframes = false;
        // creating entities
        player = new Player(p, engine, 400, 370, 40, 40, 'green');
        grav = new Grav(p, engine, 2900, 620, 20, 'green');
        sJump = new SJump(p, engine, 1300, 620, 20, 'purple');
        ground1.push(new Ground(p, engine, 2000, 480, 800, 30, 'blue'));
        ground1.push(new Ground(p, engine, 400, 410, 800, 30, 'blue'));
        ground1.push(new Ground(p, engine, 2800, 670, 800, 30, 'blue'));
        ground1.push(new Ground(p, engine, 4000, 850, 800, 30, 'blue'));
        ground1.push(new Ground(p, engine, 1200, 670, 600, 30, 'blue'));
        ground1.push(new Ground(p, engine, 3300, 30, 600, 30, 'blue'));
        bounds1.push(new Ground(p, engine, 400, 0, 30000, 30, 'blue'));
        bounds1.push(new Bounds(p, engine, -500, 1170, 30000, 500, 'blue'));
        mobs1.push(new Mob(p, engine, 1100, 630, 40, 40, 'orange'));
        mobs1.push(new Mob(p, engine, 3000, 630, 40, 40, 'orange'));
        checkpoints1.push(new Checkpoint(p, engine, 1900, 440, 20, 20, 'yellow'));
        checkpoints1.push(new Checkpoint(p, engine, 2700, 630, 20, 20, 'yellow'));
        walls1.push(new Wall(p, engine, 0, 400, 100, 1000, 'black'));
        finishLine1 = new FinishLine(p, engine, 4000, 840, 300, 40, 'white');
        ground2.push(new Ground(p, engine, 400, 480, 800, 30, 'blue'));
        livesElem = p.createDiv('Lives = 3');
        livesElem.position(20, 20);
        livesElem.style('color', 'white');
        //adding entities to world
        if (level1 == true) {
            ground1.forEach(g => World.add(engine.world, g.body));
            walls1.forEach(w => World.add(engine.world, w.body));
            mobs1.forEach(m => World.add(engine.world, m.body));
            bounds1.forEach(b => World.add(engine.world, b.body));
            platforms1.forEach(p => World.add(engine.world, p.body));
        }
        if (level1 == false) {
            ground1.forEach(g => World.remove(engine.world, g.body));
            walls1.forEach(w => World.remove(engine.world, w.body));
            mobs1.forEach(m => World.remove(engine.world, m.body));
            bounds1.forEach(b => World.remove(engine.world, b.body));
            platforms1.forEach(p => World.remove(engine.world, p.body));
        }
        if (level2 == true) {
            ground2.forEach(g => World.add(engine.world, g.body));
            walls2.forEach(w => World.add(engine.world, w.body));
            mobs2.forEach(m => World.add(engine.world, m.body));
            bounds2.forEach(b => World.add(engine.world, b.body));
            platforms2.forEach(p => World.add(engine.world, p.body));
        }
        if (level2 == false) {
            ground2.forEach(g => World.remove(engine.world, g.body));
            walls2.forEach(w => World.remove(engine.world, w.body));
            mobs2.forEach(m => World.remove(engine.world, m.body));
            bounds2.forEach(b => World.remove(engine.world, b.body));
            platforms2.forEach(p => World.remove(engine.world, p.body));
        }
        //collisions for checkpoint saving
        checkpoints1.forEach(c => {
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

        // Player grounded collision
        ground1.forEach(g => {
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
        bounds1.forEach(b => {
            Matter.Events.on(engine, "collisionStart", function (event) {
                event.pairs
                    .filter(pair => pair.bodyA.id == player.body.id || pair.bodyB.id == player.body.id)
                    .forEach(pair => {
                        let outOfBounds = pair.bodyA.id == player.body.id ? pair.bodyB : pair.bodyA;
                        if (outOfBounds.id == b.body.id) {
                            death = true
                        }
                    });
            });
            //collision for mob falling off 
            mobs1.forEach(m => {
                Matter.Events.on(engine, "collisionStart", function (event) {
                    event.pairs
                        .filter(pair => pair.bodyA.id == b.body.id)
                        .forEach(pair => {
                            let collidingMobId = pair.bodyA.id == b.body.id ? pair.bodyB.id : pair.bodyA.id;
                            let collidingMob = mobs1.find(m => m.body.id == collidingMobId);
                            if (collidingMobId == m.body.id) {
                                m.kill()
                            }
                        });
                });
            })
        })

        // Reaching finishline
        Matter.Events.on(engine, "collisionStart", function (event) {
            event.pairs
                .filter(pair => pair.bodyA.id == player.body.id || pair.bodyB.id == player.body.id)
                .forEach(pair => {
                    let finishing = pair.bodyA.id == player.body.id ? pair.bodyB : pair.bodyA;
                    if (finishing.id == finishLine1.body.id) {
                        level1 = false
                        level2 = true
                        player.spawnx = 400
                        player.spawny = 370
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
        mobs1.forEach(m => {
            Matter.Events.on(engine, "collisionStart", function (event) {
                event.pairs
                    .filter(pair => pair.bodyA.id == player.body.id)
                    .forEach(pair => {
                        let collidingMobId = pair.bodyA.id == player.body.id ? pair.bodyB.id : pair.bodyA.id;
                        let collidingMob = mobs1.find(m => m.body.id == collidingMobId);
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
        if (level1 = true) {
            finishLine1.draw();
            mobs1.forEach(m => m.draw());
            bounds1.forEach(b => b.draw());
            checkpoints1.forEach(c => c.draw());
            ground1.forEach(g => g.draw());
            platforms1.forEach(p => p.draw());
            walls1.forEach(w => w.draw());
        }
        if (level2 == true) {
            finishLine2.draw();
            mobs2.forEach(m => m.draw());
            bounds2.forEach(b => b.draw());
            checkpoints2.forEach(c => c.draw());
            ground2.forEach(g => g.draw());
            platforms2.forEach(p => p.draw());
            walls2.forEach(w => w.draw());
        }
        //Player Health system
        if (player.lives == 0) {
            death = true
        }
        //Player death
        if (death == true) {
            sJump.power = false
            grav.power = false
            p.setup()
        }
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
        mobs1.forEach(m => {
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
        else { player.colour = 'green' }
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
