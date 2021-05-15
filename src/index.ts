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
    let camera: any;
    let MOVE_LEFT: Matter.Vector;

    p.setup = function () {
        MOVE_LEFT = Matter.Vector.create(-1,0)
        p.createCanvas(p.windowWidth + 50, p.windowHeight + 50);
        engine = Engine.create();
        // create two boxes and a ground
        boxA = Bodies.rectangle(400, 200, 80, 80, { inertia: Infinity, friction: 0.002 });
        boxB = Bodies.rectangle(400, 250, 80, 80);
        groundA = Bodies.rectangle(400, 410, 810, 60, { isStatic: true });
        groundB = Bodies.rectangle(800, 670, 600, 60, { isStatic: true });
        groundC = Bodies.rectangle(1600, 670, 810, 60, { isStatic: true });
        //finish = Bodies.circle(800, 800, 20, { isStatic: true });
        Matter.Body.setMass(boxA, 4)
        //let jumping = true;
        World.add(engine.world, [boxA, boxB, groundA, groundB, groundC/*, finish*/]);
        Matter.Body.applyForce(boxB, {x: boxB.position.x, y: boxB.position.y}, {x: 0.05, y: 0});
    };
    //     }
    //   }
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
        if (p.keyIsDown(87) && boxA) {
            Matter.Body.applyForce(boxA, boxA.position, { x: 0, y: -0.005 });
        }
        //A
        if (p.keyIsDown(65)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: -0.002, y: 0 });
        }
        //D
        if (p.keyIsDown(68)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: +0.002, y: 0 });
        }
        //S
        if (p.keyIsDown(83)) {
            Matter.Body.applyForce(boxA, boxA.position, { x: 0.00, y: 0.005 });
        }


        /*Matter.Events.on(engine, 'collisionStart', function(event) {
            // We know there was a collision so fetch involved elements ...
            var aElm = document.getElementById(event.pairs[0].bodyA.elementId);
            var bElm = document.getElementById(event.pairs[0].bodyB.elementId);
            // Now do something with the event and elements ... your task ;-)
        });
        Matter.Detector.collisions({boxA, groundA}, {boxA, groundB}, {boxA, groundC}, engine)*/
        /*function touchStarted(){
        if (boxA == finish)
            console.log('finished')
        }*/

    }
    
    p.keyPressed = function () {
       //this changes gravity on toggle of E 
       if (p.keyCode == 69) {
            engine.world.gravity.y *= -1;
        }
        //fullscreens on P
        if(p.keyCode == 80) {
            let fs = p.fullscreen();
           p.fullscreen(!fs);
        }
    }
    function scrollWrapper(x: any, y: any){
        var wrapper = document.getElementById('wrapper');  
        wrapper.scrollTop = x;
        wrapper.scrollLeft = y;
    }
};


let myp5 = new p5(sketch);