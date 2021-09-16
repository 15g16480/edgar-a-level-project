import * as p5 from "p5";
import { World, Body, Engine } from 'matter-js'
import Object from './Object';
import drawBody from "./drawBody";

abstract class GameObject extends Object {
    isAlive: boolean;
    body: Body;
    colour: string;

    constructor(s: p5,
        engine: Engine,
        body: Body,
        colour: string) {
        super(s, engine);
        this.body = body;
        this.colour = colour;
        this.isAlive = true;
        World.add(engine.world, [this.body]);
    }

    kill() {
        World.remove(this.engine.world, this.body);
        this.isAlive = false;
    }

    draw(): void {
        if (this.isAlive) {
            drawBody(this.s, this.body, this.colour);
        }
    }
}
export default GameObject