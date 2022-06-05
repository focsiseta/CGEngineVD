const shaders = new Shader(gl,vsShaderBaseline,fsShaderBase)
shaders.useProgram()
//const render = new Render(gl,phongLight)
//const render2 = new Render(gl,BasicShaders)

function setup(){

//create the camera
    var c = new Camera([0,0,10],[0,0,0])


    //Stupid shit

//BINDING PER CUBO DI ATTRIBUTI POSIZIONE, NORMALII E INDICI
// SETTO GLI UNIFORM DEL CUBO
    gl.enableVertexAttribArray(shaders['aPosition'])
    gl.bindBuffer(gl.ARRAY_BUFFER,shapeCube.vBuffer)
    gl.vertexAttribPointer(shaders['aPosition'],3,gl.FLOAT,false,0,0)
    //gl.vertexAttribPointer(shaders['aPosition'],3,gl.FLOAT,false,0,0)

    gl.enableVertexAttribArray(shaders['aNormal'])
    gl.bindBuffer(gl.ARRAY_BUFFER,shapeCube.nBuffer)
    gl.vertexAttribPointer(shaders['aNormal'],3,gl.FLOAT,false,0,0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,shapeCube.iBuffer)

    shaders.setVectorUniform('uMatDiffuseColor',piros.getDiffuse())
    shaders.setVectorUniform('uMatAmbientColor',piros.getAmbient())
    shaders.setVectorUniform('uMatSpecularColor',piros.getSpecular())
    //gl.vertexAttribPointer(shaders['aNormal'],3,gl.FLOAT,false,0,0)

    //gl.enableVertexAttribArray(shaders['aTextureCoord'])
    //gl.vertexAttribPointer(shaders['aTextureCoord'],2,gl.FLOAT,false,0,0)


    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.3,0.8,0.8,0.8)
    gl.clear(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT)

//create and set the view frame
    shaders.setMatrixUniform('viewMatrix',c.getViewMatrix())

//create and set perspective projection matrix
    var projetionMatrix = glMatrix.mat4.create()
    glMatrix.mat4.perspective(projetionMatrix,3.14/4,1300/720,0.15,150)
    shaders.setMatrixUniform('projMatrix',projetionMatrix)

//return the camera
    return c
}

function createScene(){

    var directional = new DirectionalLight("Test",0.3,0.0,[0.0,1.0,-1.0],[1,1,1])
    var directional2 = new DirectionalLight("Test",0.5,0.0,[0.0,1.0,1.0],[1,1,1])
    var directional3 = new DirectionalLight("Test",0.5,0.0,[1.0,1.0,0.0],[1,1,1])

    DirectionalLight.bindLights(shaders)
    DirectionalLight.loadLights(shaders)
    element = new sceneElement("mamma")
    var node = new sceneNode(element,[])
    /*
    var crate = new Drawable(shaders.getContext(),"crate",piros, shapeCrate)
    var cube = new Drawable(shaders.getContext(), "cube", piros, shapeCube)
    var knife = new Drawable(shaders.getContext(),"knife", piros, shapeCrate)
    var sphere = new Drawable(shaders.getContext(),"sphere", piros, shapeCube)
    */


    var image1 = new Image()
    var texture1
    image1.addEventListener('load',function(){
        gl.activeTexture(gl.TEXTURE0)
        texture1 = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D,texture1)
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA ,gl.RGBA,gl.UNSIGNED_BYTE,image1)
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.bindTexture(gl.TEXTURE_2D,null)
        console.log(texture1)
    })
    image1.src = "https://webglfundamentals.org/webgl/resources/f-texture-pixel-coords.png"


    var image2 = new Image()
    image2.src = "common/textures/textureBox.png"
    var texture2
    image2.addEventListener('load',function(){
        gl.activeTexture(gl.TEXTURE1)
        texture2 = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D,texture1)
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image2)
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.bindTexture(gl.TEXTURE_2D,null)
    })

    shapeCube.texCoord = new Float32Array(96)
    for(var i in shapeCube.texCoord){
        shapeCube.texCoord[i] = 0.5
    }
    shapeCube.tBuffer = gl.createBuffer()
//BINDING DI ATTRIBUTO TEXTURE
    gl.enableVertexAttribArray(shaders['aTextureCoord'])
    gl.bindBuffer(gl.ARRAY_BUFFER,shapeCube.tBuffer)
    gl.vertexAttribPointer(shaders['aTextureCoord'],2,gl.FLOAT,false,0,0)
    gl.bufferData(gl.ARRAY_BUFFER,shapeCube.texCoord,gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER,null)


    var cubeArray = []
    for(let i = 0; i < 30;i++){
        cubeArray.push(new Drawable(shaders.getContext(),"cube_"+i,piros,shapeCube))
        cubeArray[i].translate([-5,0,0])
        cubeArray[i].translate([0,0,-i*5])
        node.addFiglio(new sceneNode(cubeArray[i],[]))
    }
    cubeArray = []
    for(let i = 0; i < 25;i++){
        cubeArray.push(new Drawable(shaders.getContext(),"cube_"+i,piros,shapeCube))
        cubeArray[i].translate([0,0,-i*5])
        node.addFiglio(new sceneNode(cubeArray[i],[]))
    }

    var crateArray = []
    for(let i = 0; i < 25;i++){
        crateArray.push(new Drawable(shaders.getContext(),"cube_"+i,piros,shapeCube))
        crateArray[i].translate([5,0,0])
        crateArray[i].translate([0,0,-i*5])
        node.addFiglio(new sceneNode(crateArray[i],[]))
    }
    var crateArray = []
    for(let i = 0; i < 25;i++){
        crateArray.push(new Drawable(shaders.getContext(),"cube_"+i,piros,shapeCube))
        crateArray[i].translate([10,0,0])
        crateArray[i].translate([0,0,-i*5])
        node.addFiglio(new sceneNode(crateArray[i],[]))
    }
    var crateArray = []
    for(let i = 0; i < 25;i++){
        crateArray.push(new Drawable(shaders.getContext(),"cube_"+i,piros,shapeCube))
        crateArray[i].translate([-10,0,0])
        crateArray[i].translate([0,0,-i*5])
        node.addFiglio(new sceneNode(crateArray[i],[]))
    }


    //gl.bindTexture(gl.TEXTURE_2D,texture1)

    let array = []

    sceneNode.recCalcScene(node,identity(),array)
    return ([node,array])
}
let yo,array
[yo,array] = createScene()
inputHandler = new Input()

var countero = 0
var flaggo = true

function drawScene(){
    /*if(countero >70){
        countero=0
        flaggo=!flaggo
    }
    if(flaggo){
        yo.element.rotateY(Math.PI/140)
    }
    else
        yo.element.rotateX(Math.PI/140)
    countero++
*/

    //yo.element.rotateY(0.003)
    //yo.calcScene()


    //console.log(inputHandler.getKeyStatus('e'))
    //cumera.rotateZ(0.01)
    //cumera.rotateX(0.001)

    cumera.processInput(inputHandler)
    shaders.setMatrixUniform('viewMatrix',cumera.getViewMatrix())
    shaders.setVectorUniform('uEyePosition',cumera.getCameraPosition())

    //sceneNode.recRedrawScene(yo,shaders.getContext(),shaders)
    sceneNode.drawArray(array,shaders)
    //sceneNode.recCalcSceneDraw(yo,identity(),shaders.getContext(),shaders)
    //sceneNode.recCalcSceneDraw(yo,identity(),shaders.getContext(),shaders)
    window.requestAnimationFrame(drawScene)
}
cumera = setup()
drawScene()
