const shaders = new Shader(gl,vsPhongSource,fsPhongSource)
shaders.useProgram()
//const render = new Render(gl,phongLight)
//const render2 = new Render(gl,BasicShaders)

function setup(){

//create the camera
    var c = new Camera([0,0,10],[0,0,0])

    //Stupid shit

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.3,0.8,0.8,0.8)
    gl.clear(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT)

//create and set the view frame
    shaders.setMatrixUniform('viewMatrix',c.getViewMatrix())

//create and set perspective projection matrix
    var projetionMatrix = glMatrix.mat4.create()
    glMatrix.mat4.perspective(projetionMatrix,3.14/4,1.0,0.15,150)
    shaders.setMatrixUniform('projMatrix',projetionMatrix)

//return the camera
    return c
}

function createScene(){
    mamma = new sceneElement("mamma")
    var mammaNode = new sceneNode(mamma,[])

    var crate = new Drawable(shaders.getContext(),"crate",piros, shapeCrate)
    var cube = new Drawable(shaders.getContext(), "cube", piros, shapeCube)
    var knife = new Drawable(shaders.getContext(),"knife", piros, shapeKnife)


    cube.translate([0,2,0])

    var node = new sceneNode(crate,[])
    crate.translate([0.0,-2.0,0.0])

    knife.scale([2,2,2])

    var node2 = new sceneNode(cube, [])
    var node3 = new sceneNode(knife, [])
    mammaNode.addFiglio(node)
    mammaNode.addFiglio(node2)
    mammaNode.addFiglio(node3)

    return mammaNode
}

yo = createScene()
inputHandler = new Input()

function drawScene(){
    //yo.element.rotateY(0.03)
    cumera.processInput(inputHandler)
    //console.log(inputHandler.getKeyStatus('e'))
    //cumera.rotateZ(0.01)
    //cumera.rotateX(0.001)
    shaders.setMatrixUniform('viewMatrix',cumera.getViewMatrix())
    shaders.setVectorUniform('uEyePosition',cumera.getCameraPosition())

    yo.calcSceneDraw(shaders.getContext(),shaders)
    window.requestAnimationFrame(drawScene)
}
cumera = setup()
drawScene()
/* Input.addCallback((event)=>{
     if(event.key === 'a' || event.key === 'A'){
         cube.rotateY(0.1)
     }
     if(event.key == 'd' || event.key == 'D'){
         cube.rotateY(-0.1)
     }
     if(event.key == 'w' || event.key == 'W'){
         cube.translate([0,0,-0.1])
     }
     if(event.key == 's' || event.key == 'S'){
         cube.translate([0,0,0.1])
     }
 },"keydown")
 Input.addCallback((event)=>{
     if(event.key === 'a' || event.key === 'A'){
         cube.rotateY(0.1)
     }
     if(event.key == 'd' || event.key == 'D'){
         cube.rotateY(-0.1)
     }
     if(event.key == 'w' || event.key == 'W'){
         cube.translate([0,0,-0.1])
     }
     if(event.key == 's' || event.key == 'S'){
         cube.translate([0,0,0.1])
     }
 },"keyup")*/