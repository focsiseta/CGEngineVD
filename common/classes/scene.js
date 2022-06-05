/* For reference :
* A shape object is an object with:
*
*   draws only edges
*   this.isContour  : bool
*   Vertex array
*   this.vertexs    : Float32Array gl.FLOAT
*   Indexs array
*   this.indexs     : Uint16Array gl.UNSIGNED_SHORT
* */

class sceneElement {
    constructor(name = "Default_element"){
        this.name = name
        this.rotationMatrix = glMatrix.mat4.create()
        this.scaleMatrix = glMatrix.mat4.create()
        this.translationMatrix = glMatrix.mat4.create()
        //Father frame
        this.fMatrix = glMatrix.mat4.create()
        //Full transformation frame
        this.tMatrix = glMatrix.mat4.create()
        //Full transformation frame inverted and then transposed
        this.inverseTransposeMatrix = glMatrix.mat4.create()
        //Full transformation frame multiplied by father frame
        this.finalFrame = glMatrix.mat4.create()

    }
    rotateX(angle){
        glMatrix.mat4.rotateX(this.rotationMatrix,this.rotationMatrix,angle)
    }
    rotateY(angle){
        glMatrix.mat4.rotateY(this.rotationMatrix,this.rotationMatrix,angle)
    }
    rotateZ(angle){
        glMatrix.mat4.rotateZ(this.rotationMatrix,this.rotationMatrix,angle)
    }
    translate(translationVector){
        glMatrix.mat4.translate(this.translationMatrix,this.translationMatrix,translationVector)
    }
    scale(scaleVector){
        glMatrix.mat4.scale(this.scaleMatrix,this.scaleMatrix,scaleVector)
    }
    getFrame(){
        var tmp = glMatrix.mat4.create()
        //TransScalRot (TSR) Matrix composition -> father matrix * son matrix * vertex
        // We express points in father's perspective so we can have global coordinates
        // as father matrix * son matrix * vertex and that's basically it

        // tmp = T * S
        glMatrix.mat4.mul(tmp,this.translationMatrix,this.scaleMatrix)
        //(T * S) = T * S * R
        glMatrix.mat4.mul(tmp,tmp,this.rotationMatrix)
        glMatrix.mat4.mul(tmp,this.fMatrix,tmp)
        return tmp
    }
    getTransformation(){
        var tmp = glMatrix.mat4.create()
        glMatrix.mat4.mul(tmp,this.translationMatrix,this.scaleMatrix)
        //(T * S) = T * S * R
        glMatrix.mat4.mul(tmp,tmp,this.rotationMatrix)
        return tmp
    }
    setFatherFrame(frame){
        glMatrix.mat4.copy(this.fMatrix,frame)
    }

    updateStuff(){
        this.tMatrix = this.getTransformation()

        this.finalFrame = this.getFrame()

        let tmp = glMatrix.mat4.create()
        glMatrix.mat4.transpose(tmp,glMatrix.mat4.invert(tmp,this.getTransformation()))
        this.inverseTransposeMatrix = tmp
    }

}
class Drawable extends sceneElement{

    constructor(glContext, name = "Default_element",material = null,shape = null) {
        super(name)
        this.order = 0
        this.shape = shape
        this.material = material
        this.context = glContext
      //NON SERVE PIU', E' LA SHAPE AD ISTANZIARE I BUFFER NELLA GPU
        //this.createObject()
    }

    //this method is for keeping normal consistency in the shaders. If we have to draw an object with normals, we also need the inverse transposed transf matrix
    getInverseTranspose(){
        let tmp = glMatrix.mat4.create()
        glMatrix.mat4.transpose(tmp,glMatrix.mat4.invert(tmp,this.getTransformation()))
        return tmp
    }

    drawObject(shader){
//ADESSO OGNI DRAWABLE FA IL BINDING DEI BUFFER DELLA SHAPE, NON NE CREA PIU' DI NUOVI
        let context = this.context

        //context.bindBuffer(context.ARRAY_BUFFER,this.vBuffer)
        //context.bindBuffer(context.ARRAY_BUFFER,this.shape.vBuffer)
        //context.enableVertexAttribArray(shader['aPosition'])
        //context.vertexAttribPointer(shader['aPosition'],3,context.FLOAT,false,0,0)

        /*context.bindBuffer(context.ARRAY_BUFFER,this.nBuffer)
        context.bindBuffer(context.ARRAY_BUFFER,this.shape.nBuffer)
        context.enableVertexAttribArray(shader['aNormal'])
        context.vertexAttribPointer(shader['aNormal'],3,context.FLOAT,false,0,0)*/

        /*context.bindBuffer(context.ARRAY_BUFFER,this.shape.tBuffer)
        context.enableVertexAttribArray(shader['aTextureCoord'])
        context.vertexAttribPointer(shader['aTextureCoord'],2,context.FLOAT,false,0,0)*/

        //context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,this.iBuffer)

        //context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,this.shape.iBuffer)
        context.uniformMatrix4fv(shader['uM'],false,this.finalFrame)

        context.uniformMatrix4fv(shader['uInvTransGeoMatrix'],false,this.inverseTransposeMatrix)

        shader.setVectorUniform('uMatDiffuseColor',this.material.getDiffuse())
        shader.setVectorUniform('uMatAmbientColor',this.material.getAmbient())
        shader.setVectorUniform('uMatSpecularColor',this.material.getSpecular())

        context.drawElements(context[this.shape.drawingType],this.shape.indices.length,context.UNSIGNED_SHORT,0)
        //context.disableVertexAttribArray(shader['aPosition'])
        //context.disableVertexAttribArray(shader['aNormal'])
        //context.disableVertexAttribArray(shader['aTextureCoord'])
        //context.bindBuffer(context.ARRAY_BUFFER,null)
        //context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,null)
    }
    createObject(){
        let context= this.context

        this.vBuffer = context.createBuffer()
        context.bindBuffer(context.ARRAY_BUFFER,this.vBuffer)
        context.bufferData(context.ARRAY_BUFFER,this.shape.vertices,context.STATIC_DRAW)
        context.bindBuffer(context.ARRAY_BUFFER,null)
        this.nBuffer = context.createBuffer()
        context.bindBuffer(context.ARRAY_BUFFER,this.nBuffer)
        context.bufferData(context.ARRAY_BUFFER,this.shape.normals,context.STATIC_DRAW)
        context.bindBuffer(context.ARRAY_BUFFER,null)
        this.iBuffer = context.createBuffer()
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,this.iBuffer)
        context.bufferData(context.ELEMENT_ARRAY_BUFFER,this.shape.indices,context.STATIC_DRAW)
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,null)
    }

    setOrder(order){
        this.order = order
    }

}


class sceneNode {
    // Drawable , sceneNode[]
    constructor(element ,figli = []) {
        if(figli == null)
            alert("[Scene node constructor] passed null params")
        this.element = element
        this.figli = figli
    }
    getDrawable(){
        return this.element
    }

    addFiglio(element){
        this.figli.push(element)
    }
    calcScene(){
        sceneNode.recCalcScene(this,identity())
    }
    static recCalcScene(sNode,acc,array){
        if(sNode.element == null){
            sNode.figli.forEach((figlio)=>{
                sceneNode.recCalcScene(figlio,acc)
            })
            return
        }
        sNode.element.setFatherFrame(acc)
        sNode.element.updateStuff()
        if (sNode.element.drawObject!=null)
            array.push(sNode.element)
        sNode.figli.forEach((figlio) =>{
            sceneNode.recCalcScene(figlio,sNode.element.getFrame(),array)
        })

    }
//disegnare con la struttura array
    static drawArray(array,shader){
        for (let key in array)
            array[key].drawObject(shader)
    }

    calcSceneDraw(context,shader){ //useful when you want perpetual movement
        sceneNode.recCalcSceneDraw(this,glMatrix.mat4.create(),context,shader)
    }

    static recCalcSceneDraw(sNode,acc,context,shader){
        if(sNode.element == null){
            sNode.figli.forEach((figlio)=>{
                sceneNode.recCalcSceneDraw(figlio,acc,context,shader)
            })
            return
        }
        sNode.element.setFatherFrame(acc)
//se l'elemento non ha la funzione draw (serve solo per immagazzinare le matrici) allora non viene chiamata draw

        if(sNode.element.drawObject != null)
            sNode.element.drawObject(shader)


        sNode.figli.forEach((figlio) =>{
            sceneNode.recCalcSceneDraw(figlio,sNode.element.getFrame(),context,shader)
        })
    }

    redrawScene(context,shader){
        sceneNode.recRedrawScene(this,context,shader)
    }

    static recRedrawScene(sNode,context,shader){
        if(sNode.element == null){
            sNode.figli.forEach((figlio)=> {
                sceneNode.recRedrawScene(figlio, context, shader)
            })
            return
        }

        if(sNode.element.drawObject != null)
            sNode.element.drawObject(shader)

        sNode.figli.forEach((figlio) => {
            sceneNode.recRedrawScene(figlio, context, shader)
        })
    }
}

