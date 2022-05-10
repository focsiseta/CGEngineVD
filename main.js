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
    var cube = render.drawableFactory("cubo",piros,supercube)
    //var cylinder = render.drawableFactory("cuboCont",[1,0,0],theCylinder10)
    var node = new sceneNode(cube,[])
    //var node2 = new sceneNode(cylinder,[])
    cube.translate([2.0,0.0,0.0])
    //cube.rotateX(-3.14/2)
    //Il pattern e' del tipo
    /*
    * creo la struttura di gerarchia
    * istanzio la roba in gpu
    * transformazioni
    * calcolo matrici
    */
    return node
}

yo = createScene()
inputHandler = new Input()
function drawScene(){
    //yo.element.rotateY(0.05)
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