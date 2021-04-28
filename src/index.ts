import * as p5 from 'p5';

import * as Matter from 'matter-js';

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let sketch = function (p: p5) {
    // create an engine
    let engine: Matter.Engine;
    let boxA: Matter.Body;
    let boxB: Matter.Body;
    let groundA: Matter.Body;
    let groundB: Matter.Body;
    let groundC: Matter.Body;
    let finish: Matter.Body;

    p.setup = function () {
        p.createCanvas(1400, 1400);

        engine = Engine.create();
        // create two boxes and a ground
        boxA = Bodies.rectangle(400, 200, 80, 80);
        boxB = Bodies.rectangle(400, 250, 80, 80);
        groundA = Bodies.rectangle(400, 410, 810, 60, { isStatic: true });
        groundB = Bodies.rectangle(1000, 670, 810, 60, { isStatic: true });
        groundC = Bodies.rectangle(800, 870, 810, 60, { isStatic: true });
        finish = Bodies.circle(800,800,20, { isStatic: true });

        World.add(engine.world, [boxA, boxB, groundA,groundB,groundC,finish]);
    };

    p.draw = function () {
        Engine.update(engine, 10);

        p.background(0);
        p.fill("green");

        // Draw all bodies
        // p5 and matter js meeting
        engine.world.bodies.forEach(body => {
            p.beginShape()
            body.vertices.forEach(vertex => {
                p.vertex(vertex.x, vertex.y);
            })
            p.endShape(p.CLOSE);
        });

        if (p.keyIsDown(p.UP_ARROW)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: 0, y: -0.01 });
        }
        if (p.keyIsDown(p.LEFT_ARROW)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: -0.01, y: 0 });
        }
        if (p.keyIsDown(p.RIGHT_ARROW)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: +0.01, y: 0 });
        }
        if (p.keyIsDown(p.DOWN_ARROW)) {
          Matter.Body.applyForce(boxA, boxA.position, { x: 0.00, y: 0.1 });
      }
    };
};

let myp5 = new p5(sketch);