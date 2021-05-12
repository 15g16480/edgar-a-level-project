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
    let cam;

    p.setup = function () {
        p.createCanvas(1400, 1000);

        engine = Engine.create();
        // create two boxes and a ground
        boxA = Bodies.rectangle(400, 200, 80, 80, { inertia: Infinity, friction: 0.002});
        boxB = Bodies.rectangle(400, 250, 80, 80);
        groundA = Bodies.rectangle(400, 410, 810, 60, { isStatic: true });
        groundB = Bodies.rectangle(1000, 670, 810, 60, { isStatic: true });
        groundC = Bodies.rectangle(800, 870, 810, 60, { isStatic: true });
        finish = Bodies.circle(800,800,20, { isStatic: true });
        cam = createCamera();
        //Matter.Body.setMass(boxA, 4)
        //let jumping = true;
        World.add(engine.world, [boxA, boxB, groundA,groundB,groundC,finish]);
        // cam = createCamera();
        // cam.pan(0.8);
    };

    p.draw = function () {
        Engine.update(engine, 30);

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
            
        //W
        if (p.keyIsDown(87)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: 0, y: -0.020 });
        }
        //A
        if (p.keyIsDown(65)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: -0.005, y: 0 });
        }
        //D
        if (p.keyIsDown(68)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: +0.005, y: 0 });
        }
        //S
        if (p.keyIsDown(83)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: 0.00, y: 0.01 });
        }
        //this changes gravity on toggle of E
        document.addEventListener('keydown',function(e){
            var key = e.keyCode || e.which;
            if(key == 69){
                engine.world.gravity.y *= -1;
            }          
        });

        /*function touchStarted(){
        if (boxA == finish)
            console.log('finished')
        }*/
    
    }
};
    

let myp5 = new p5(sketch);