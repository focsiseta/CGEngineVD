class Render {
    //Teoricamente questa classe dovrebbe permetterci di disegnare nello stesso contesto, ma con uno shader per render
    //Questo vuol dire che se dobbiamo disegnare con piu' shader, avremmo semplicemente piu' oggetti render con lo
    // stesso contesto e diversi shader

    // Un albero di Render potrebbe non essere male una volta sistemato il problema delle uniform

    /*
    * Per far in modo che il contesto con piu' shader funzioni dobbiamo passare per ogni programma
    * la view matrix e la proj matrix, cosa che qui non viene fatta
    * LE UNIFORM VENGONO SALVATE IN MODO SEPARATO PER PROGRAMMA
    * TODO: gestire le uniform della proj matrix e viewMatrix */

    //Shader,context
    constructor(context,shader){
        this.shader = shader
        this.context = context
        this.context.useProgram(this.shader.program)
        this.stupidShit()

    }
    //just for 4x4 matrix for now, needs to be generalized
    setUniform(uniformName,data,transpose = false){
        this.context.uniformMatrix4fv(this.shader[uniformName],transpose,data)
    }
    useProgram(){
        this.context.useProgram(this.shader.program)
    }
    getShader(){
        return this.shader
    }
    getContex(){
        return this.context
    }
    stupidShit(){
        this.context.enable(this.context.CULL_FACE)
        this.context.enable(this.context.DEPTH_TEST)
        this.context.clearColor(0.3,0.8,0.8,0.8)
        this.context.clear(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT)
    }

    //takes as param a sceneNode
    drawScene(scene){
        scene.redrawScene(this.context,this.shader)
    }
    calcScene(scene){
        scene.calcScene()
    }
    calcAndDrawScene(scene){
        scene.calcSceneDraw(this.context,this.shader)
    }
    //creates and returns a drawable which is loaded by default in GPU
    drawableFactory(name = "Default_element",color = [1,0,0],material = null,shape = null){
        var returnDrawable = new Drawable(name,color,material,shape)
        returnDrawable.createObject(this.context)
        return returnDrawable
    }
    //returns a render from another render with different shader
    static renderFromRender(renderObj,shader){
        return new Render(renderObj.context,shader)
    }
}