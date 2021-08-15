import * as p5 from "p5";
import { World, Body, Engine } from 'matter-js'
import Object from './Object';

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
    abstract draw(): void;
    abstract update(): void;
}
export default GameObject