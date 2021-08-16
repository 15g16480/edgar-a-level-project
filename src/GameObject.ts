import * as p5 from "p5";
import { World, Body, Engine } from 'matter-js'
import Object from './Object';
import drawBody from "./drawBody";

abstract class GameObject extends Object {

    body: Body;
    colour: string;

    constructor(s: p5,
        engine: Engine,
        body: Body,
        colour: string) {
        super(s);
        this.body = body;
        this.colour = colour;
        World.add(engine.world, [this.body]);
    }

    draw(): void { drawBody(this.s, this.body, this.colour) }
}
export default GameObject