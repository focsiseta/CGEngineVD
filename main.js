const phongLight = new Program(gl,vsPhongSource,fsPhongSource)
const render = new Render(gl,phongLight)
//const render2 = new Render(gl,BasicShaders)
function setup(){
    //var camera = Object.create(FlyingCamera).init(canvasElement);
    var cameraMatrix = glMatrix.mat4.create()
    var c = new Camera([0,0,10],[0,0,0])
    glMatrix.mat4.lookAt(cameraMatrix,[0,2,10],[0,0,0],[0,1,0])
    render.setUniform('viewMatrix',c.getViewMatrix())
   // render2.setUniform('viewMatrix',cameraMatrix)
    var projetionMatrix = identity() //
    glMatrix.mat4.perspective(projetionMatrix,3.14/4,1.0,0.15,150)
    render.setUniform('projMatrix',projetionMatrix)
    //render2.setUniform('projMatrix',projetionMatrix)
    return c
}
function createScene(){
    mamma = new sceneElement("mamma")
    var mammaNode = new sceneNode(mamma,[])

    var crate = render.drawableFactory("crate",piros,shapeCrate)
    var cube = render.drawableFactory("cube",piros,shapeCube)
    var knife = render.drawableFactory("knife", piros, shapeKnife)
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
    yo.element.rotateY(0.03)
    cumera.processInput(inputHandler)
    //console.log(inputHandler.getKeyStatus('e'))
    //cumera.rotateZ(0.01)
    //cumera.rotateX(0.001)
    render.setUniform('viewMatrix',cumera.getViewMatrix())
    render.calcAndDrawScene(yo)
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