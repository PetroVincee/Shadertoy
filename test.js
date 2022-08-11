var GL = document.querySelector("canvas").getContext("webgl");

GL.scale = 1;
GL.viewportWidth = GL.canvas.width = window.innerWidth / GL.scale;
GL.viewportHeight = GL.canvas.height = window.innerHeight / GL.scale;
GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);

GL.depthFunc(GL.LEQUAL);  GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
GL.enable(GL.DEPTH_TEST); GL.enable(GL.BLEND);

var meta = {
    number: 0,
    balls: [],
    positions: [],
    radius: (GL.viewportWidth + GL.viewportHeight) / 120,
    color: [0.0, 0.0, 0.0, 0.0]
}

meta.Metaball = function(position, vector, speed) {
    this.position = position;
    this.vector = vector;
    this.speed = speed;
}
meta.Metaball.prototype.move = function(speed) {
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    if (this.position.x < -meta.radius * 2) this.position.x = GL.viewportWidth + meta.radius * 2;
    if (this.position.x > GL.viewportWidth + meta.radius * 2) this.position.x = -meta.radius * 2;
    if (this.position.y < -meta.radius * 2) this.position.y = GL.viewportHeight + meta.radius * 2;
    if (this.position.y > GL.viewportHeight + meta.radius * 2) this.position.y = -meta.radius * 2;
}

meta.setMetaballs = (number) => {
    meta.number = number;
    var arr = new Array(number);
    meta.positions = new Array(number);
    for (var i = 0; i < number; i ++) {
        arr[i] = new meta.Metaball(
            {
                x: Math.random() * GL.viewportWidth,
                y: Math.random() * GL.viewportHeight
            },
            {
                x: Math.random() * 2 - 1,
                y: Math.random() * 2 - 1
            },
            Math.random() / 2
        );
    }
    meta.balls = arr;
}

meta.setMetaballs(100);

var shaderProgram = createShaderProgram(
    GL,
    document.getElementById('shader-fs').innerHTML,
    document.getElementById('shader-vs').innerHTML,
    ['uScreenWidth', 'uScreenHeight', 'uTime', 'uRadius', 'uColor', 'uMetabolls'],
    ['aVertexPosition']
);

GL.useProgram(shaderProgram);

var vertexBuffer = createArrayBuffer(GL, [
    -1.0,  1.0,  1.0, 	 1.0,  1.0, 0.0,   -1.0, -1.0, 0.0,
    1.0, -1.0, -1.0,	-1.0, -1.0, 0.0, 	1.0,  1.0, 0.0
], 3, 6);

GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
GL.vertexAttribPointer(shaderProgram.aVertexPosition, vertexBuffer.itemSize, GL.FLOAT, false, 0, 0);

GL.uniform1f(shaderProgram.uScreenWidth, GL.viewportWidth);
GL.uniform1f(shaderProgram.uScreenHeight, GL.viewportHeight);
GL.uniform1f(shaderProgram.uRadius, meta.radius);
GL.uniform3f(shaderProgram.uColor, 0.0, 0.5, 0.0);

GL.time = 0;
GL.clearColor(0.0, 0.0, 0.0, 1.0);
var draw = () => {
    GL.clear(GL.COLOR_BUFFER_BIT);

    for (var i = 0; i < 30; i += 2) {
        meta.balls[i].move();
        meta.positions[i] = meta.balls[i].position.x;
        meta.positions[i + 1] = meta.balls[i].position.y;
    }

    GL.time += 5;
    GL.uniform1f(shaderProgram.uTime, (Math.sin(GL.time / 300) + 1) / 2);
    GL.uniform2fv(shaderProgram.uMetabolls, meta.positions);

    GL.drawArrays(GL.TRIANGLES, 0, vertexBuffer.numberOfItems);
    requestAnimationFrame(draw);
}
draw();