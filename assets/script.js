import jsonData from './package.json' assert {type: 'json'};

let right = document.getElementById("right");
let left = document.getElementById("left");

let title = document.getElementById("title");
let description = document.getElementById("description");

var canvas = document.querySelector("canvas");

let loginBTN = document.getElementById("login");

let indexValue = 0;
showImg(indexValue);

var color = {
    r: 2.3,
    g: 0.0,
    b: 0.0
}

window.addEventListener("scroll", function(){
    let getPos = canvas.getBoundingClientRect().top / 7;
    console.log(getPos);
    canvas.style.transform = "translateY(-"+getPos+"px)";
});

right.addEventListener("click", function(){
    showImg(indexValue += 1);

});

left.addEventListener("click", function(){
    showImg(indexValue -= 1);
});

function showImg(){
    const text = document.querySelector(".counter");
    if(indexValue >= jsonData.length) indexValue = 0;
    if(indexValue < 0) indexValue = jsonData.length-1;
    text.innerHTML = "0"+jsonData[indexValue].id+"/0"+jsonData.length;
    title.innerHTML = jsonData[indexValue].title;
    description.innerHTML = jsonData[indexValue].description;
    color = jsonData[indexValue].color;
    loginBTN.style.background = jsonData[indexValue].loginBG;
}

function init(){
    var gl = canvas.getContext('webgl');

    if(!gl){
        console.log("eroor");
        gl = canvas.getContext('experimental-webgl');
    }

    var vertexSource = document.getElementById("vertex-shader").innerHTML;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    var fragmentSource = document.getElementById("fragment-shader").innerHTML;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    var width = canvas.width = window.innerWidth;//document.body.innerWidth;
    var height = canvas.height = window.innerHeight;//document.body.innerHeight;

    var startTime = (new Date()).getTime();

    program.aVertexPosition = gl.getUniformLocation(program, "aVertexPosition");
    program.iR = gl.getUniformLocation(program, "iR");
    program.iG = gl.getUniformLocation(program, "iG");
    program.iB = gl.getUniformLocation(program, "iB");
    program.uTime = gl.getUniformLocation(program, "uTime");
    program.uRes = gl.getUniformLocation(program, "uRes");

    gl.useProgram(program);
    var pos = [-1, 1,
        -1, -1,
        1, -1,
        1, -1,
        1, 1,
        -1, 1];

    var bufPos = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufPos );
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(pos), gl.STATIC_DRAW);

    gl.enableVertexAttribArray( program.aVertexPosition );
    gl.vertexAttribPointer( program.aVertexPosition, 2, gl.FLOAT, false, 0, 0 );
    console.log(width);
    gl.uniform2fv(program.uRes, [width, height]);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    console.log("VERTEX:  "+gl.getShaderInfoLog(vertexShader));
    console.log("FRAGMENT:  "+gl.getShaderInfoLog(fragmentShader));
    console.log("PROGRAM:  "+gl.getProgramInfoLog(program));

    (function drawScene() {
        requestAnimationFrame(drawScene);
        var time = (new Date()).getTime() - startTime;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniform1f(program.uTime, time * 0.0006);

        gl.uniform1f(program.iR, color.r );
        gl.uniform1f(program.iG, color.g );
        gl.uniform1f(program.iB, color.b );

        gl.drawArrays(gl.TRIANGLES, 0, 6);



    })();

    window.onresize = function () {
        width = canvas.width;
        height = canvas.height;
        console.log(width);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2fv(program.uRes, [width, height]);
    }
}
init();