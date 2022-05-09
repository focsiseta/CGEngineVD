angle = 0.0;
mode = 0; // 0 light, 1 trackball
shadingMode = 0;

l  = -1;
r  =  1;
b  = -1;
t  =  1;
n  =  1;
f  = 15;

DirLight = function(){
    this.direction = [0,1,0];
}
sun = new DirLight();

function setupWebGL() {
    canvas = document.getElementById("OUTPUT-CANVAS");
    gl = canvas.getContext('webgl');
    gl.getExtension('OES_standard_derivatives');
}

function createObjectBuffers(gl, obj) {

    obj.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    obj.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, obj.normals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    obj.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.triangleIndices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

function setupWhatToDraw() {
    cube = new Cube(10);
    ComputeNormals(cube);
    createObjectBuffers(gl,cube);

    cylinder = new Cylinder(10);
    ComputeNormals(cylinder);
    createObjectBuffers(gl,cylinder );

    cone = new Cone(20);
    ComputeNormals(cone);
    createObjectBuffers(gl,cone );

    quad = new Quadrilateral();
    ComputeNormals(quad);
    createObjectBuffers(gl,quad );

    teapot =   loadOnGPU(teapotMesh);
    laurana =   loadOnGPU(laurana500);
}

function setupHowToDraw() {
    phongShader = new phongShader(gl);
}

function drawObject(gl, obj, fillColor) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
    gl.enableVertexAttribArray(this.phongShader.aPositionIndex);
    gl.vertexAttribPointer(this.phongShader.aPositionIndex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalBuffer);
    gl.enableVertexAttribArray(this.phongShader.aNormalIndex);
    gl.vertexAttribPointer(this.phongShader.aNormalIndex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    gl.uniform3fv(this.phongShader.uColorLocation, fillColor);
    gl.drawElements(gl.TRIANGLES, obj.triangleIndices.length, gl.UNSIGNED_SHORT, 0);


    gl.disableVertexAttribArray(this.phongShader.aPositionIndex);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};


view_transform    = glMatrix.mat4.create();
scale_matrix      = glMatrix.mat4.create();
translate_matrix  = glMatrix.mat4.create();
axis_matrix       = glMatrix.mat4.create();
rotate_transform  = glMatrix.mat4.create();
identity          = glMatrix.mat4.create();
M                 = glMatrix.mat4.create();

function draw(){
    gl.enable(gl.DEPTH_TEST);
    //gl.cullFace(gl.BACK);
    //gl.enable(gl.CULL_FACE);

    angle+=0.01;

    gl.clearColor(0.8,0.8,0.8,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT);

    // setup the view transform
    glMatrix.mat4.lookAt(view_transform,[0.0,2.0,7.0],[0.0,0.0,0.0],[0,1,0]);

    // setup the projection transform
    projection_transform = glMatrix.mat4.create();
    //glMatrix.mat4.perspective(projection_transform, 3.14/4.0, 1.0, 0.01, 20);
    glMatrix.mat4.frustum(projection_transform, l,r,b,t,n, f);


    gl.useProgram(phongShader);

    /* the shader will just output the base color if a null light direction is given */
    gl.uniform3fv(phongShader.uLightDirectionLocation,[0,0,0]);

    gl.uniformMatrix4fv(phongShader.uProjectionMatrixLocation,false,projection_transform);
    gl.uniformMatrix4fv(phongShader.uViewMatrixLocation,false,view_transform);
    gl.uniformMatrix4fv(phongShader.uTrackballMatrixLocation,false,trackball_matrix);



    /* draw the light direction */
    glMatrix.mat4.fromScaling(scale_matrix,[0.01,2,0.01]);
    glMatrix.mat4.fromTranslation(translate_matrix,[0,1,0]);
    glMatrix.mat4.mul(M,scale_matrix,translate_matrix);
    glMatrix.mat4.mul(M,lightRotation,M);
    gl.uniformMatrix4fv(phongShader.uM,false,M);
    drawObject(gl,cube,[1,1,0]);

    glMatrix.mat4.fromScaling(scale_matrix,[0.1,0.1,0.1]);
    glMatrix.mat4.fromTranslation(translate_matrix,[0,4,0]);
    glMatrix.mat4.mul(M,translate_matrix,scale_matrix);
    glMatrix.mat4.mul(M,lightRotation,M);

    gl.uniformMatrix4fv(phongShader.uM,false,M);
    drawObject(gl,cube,[1,0,0]);

    /* draw the world reference frame as three axis
      each axis is a scale cube */
    for(var i=0; i < 3; ++i){
        var color_translate   = [0.0,0.0,0.0];
        var scaling = [0.01,0.01,0.01];
        color_translate[i] = 1.0;
        scaling[i] = 2;
        glMatrix.mat4.fromScaling(scale_matrix,scaling);
        glMatrix.mat4.fromTranslation(translate_matrix,color_translate);
        glMatrix.mat4.mul(translate_matrix,translate_matrix,scale_matrix);
        gl.uniformMatrix4fv(phongShader.uM,false,translate_matrix);
        drawObject(gl,cube,color_translate);
    }

    gl.uniform3fv(phongShader.uLightDirectionLocation,sun.direction);
    gl.uniform1i(phongShader.uShadingModeLocation,shadingMode);

    // draw the base quad
    glMatrix.mat4.fromScaling(scale_matrix,[4,1,4]);
    gl.uniformMatrix4fv(phongShader.uM,false,scale_matrix);
    drawObject(gl,quad,[0.8,0.5,0.7]);

    glMatrix.mat4.fromTranslation(translate_matrix,[-3,5.5,0]);
    //  glMatrix.mat4.fromScaling(scale_matrix,[0.05,0.05,0.05]);
    glMatrix.mat4.fromScaling(scale_matrix,[0.1,0.1,0.1]);
    glMatrix.mat4.mul(scale_matrix,translate_matrix,scale_matrix);
    gl.uniformMatrix4fv(phongShader.uM,false,scale_matrix);
    drawObject(gl,teapot,[0.3,0.3,0.3]);
    //drawObject(gl,laurana,[0.3,0.3,0.3]);

    window.requestAnimationFrame(draw);
    return;

    /* draw the three cones */
    glMatrix.mat4.fromTranslation(translate_matrix,[0,0,2]);
    gl.uniformMatrix4fv(phongShader.uM,false,translate_matrix);
    drawObject(gl,cone,[0.8,0.6,0.7]);

    glMatrix.mat4.fromTranslation(translate_matrix,[2,0,0]);
    gl.uniformMatrix4fv(phongShader.uM,false,translate_matrix);
    drawObject(gl,cone,[0.4,0.8,0.7]);

    // the third cone is upside down on theback of the quad
    glMatrix.mat4.fromTranslation(translate_matrix,[-2,-0.01,0]);
    glMatrix.mat4.fromRotation(rotate_transform,3.14,[1,0,0]);
    glMatrix.mat4.mul(translate_matrix,translate_matrix,rotate_transform);
    gl.uniformMatrix4fv(phongShader.uM,false,translate_matrix);
    drawObject(gl,cone,[0.4,0.8,0.7]);

    window.requestAnimationFrame(draw);
}

function setup(){
    setupWebGL();
    setupWhatToDraw();
    setupHowToDraw();

    canvas.addEventListener('mouseup',on_mouseup,false);
    canvas.addEventListener('mousedown',on_mousedown,false);
    canvas.addEventListener('mousemove',on_mouseMove,false);
}

/* controlling the light direction with the mouse */
drag            = false;    // we are on dragging mode
startX          = 0.0;
startY          = 0.0;

lightRotation   = glMatrix.mat4.create();
Rphi            = glMatrix.mat4.create();
Rtheta          = glMatrix.mat4.create();

/* trackball */
rotating        = false;
start_point      = [0,0,0];
trackball_center= [0,0,-10.0];
trackball_matrix = glMatrix.mat4.create();

ray_sphere_intersection = function (r,radius,dz){

    var a = r[0] * r[0] + r[1] * r[1] + r[2] * r[2];

    var b = - 2 * dz * r[2];
    var c = dz * dz - radius * radius;

    var dis = b * b - 4 * a * c;

    if(dis > 0){
        var t0 = (-b - Math.sqrt(dis)) / (2 * a);
        var t1 = (-b + Math.sqrt(dis)) / (2 * a);
        var t = Math.min(t0,t1);
        return [true,[t*r[0],t*r[1],t*r[2]]];
    }else
        return [false,[0,0,0]];
}

ray_from_click = function(x,y){
    px = l + ( x/500.0)*(r-l);
    py = b + ( (500-y)/500.0)*(t-b);
    pz = -n;
    return [px,py,pz];
}

point_on_sphere = function (x,y){
    var ray = ray_from_click(x,y);
    return ray_sphere_intersection(ray,5,-7.5);
}

on_mousedown = function(e){
    if(mode === 0)
        drag = true;
    startX = e.clientX;
    startY = e.clientY;

    if(mode === 1){
        var isOnSphere = point_on_sphere(startX,startY);
        if(isOnSphere[0]){
            console.log("rotating");
            rotating = true;
            start_point = isOnSphere[1];
        }
    }
}
on_mouseMove = function(e){
    if(!drag && !rotating)
        return;

    deltaX = e.clientX-startX;
    deltaY = e.clientY-startY;

    if(mode === 0){
        glMatrix.mat4.fromRotation(Rphi  ,deltaX*0.01,[0,1,0]);
        glMatrix.mat4.fromRotation(Rtheta,deltaY*0.01,[1,0,0]);
        glMatrix.mat4.mul(Rphi,Rphi,Rtheta);

        lightRotation =  glMatrix.mat4.mul(lightRotation,Rphi,lightRotation);

        newDir = glMatrix.vec3.create();
        sun.direction = glMatrix.vec3.transformMat4(newDir,sun.direction,Rphi);
    }else
    if(mode === 1 && rotating){
        var res = point_on_sphere(e.clientX,e.clientY);
        if(res[0]){
            var p0 = start_point;
            var p1 = res[1];
            var p0c= glMatrix.vec3.create();
            var p1c= glMatrix.vec3.create();
            var rot_axis = glMatrix.vec3.create();
            var rot_angle = 0.0;
            glMatrix.vec3.sub(p0c,p0,trackball_center);
            glMatrix.vec3.sub(p1c,p1,trackball_center);
            glMatrix.vec3.cross(rot_axis,p0c,p1c);
            rot_angle = Math.asin( glMatrix.vec3.length(rot_axis) /(glMatrix.vec3.length(p0c)*glMatrix.vec3.length(p1c)));
            glMatrix.vec3.normalize(rot_axis,rot_axis);

            var rotMat = glMatrix.mat4.create();
            glMatrix.mat4.fromRotation(rotMat,rot_angle,rot_axis);
            glMatrix.mat4.mul(trackball_matrix, rotMat,trackball_matrix);

            start_point = p1;

        }


    }
    startX =  e.clientX;
    startY =  e.clientY;

}
on_mouseup = function(e){
    drag = false;
    rotating = false;
}

function helloRotations(){
    setup();
    draw();
}

update_mode = function(v){
    mode = parseInt(v);
}

update_shadingmode = function(v){
    shadingMode = parseInt(v);
}

window.onload = helloRotations;
