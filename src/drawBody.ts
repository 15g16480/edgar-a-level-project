import * as p5 from 'p5';

function drawBody(p: p5, body: Matter.Body, colour: string) {
    p.fill(colour);
    p.beginShape()
    body.vertices.forEach(vertex => {
        p.vertex(vertex.x, vertex.y);
    })
    p.endShape(p.CLOSE);
}

export default drawBody;