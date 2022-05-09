class Camera extends sceneElement{
    constructor(position = [0,0,5],origin = [0,0,0]) {
        super("Camera_")
        this.position = position
        this.origin = origin
        var tmp = glMatrix.vec3.create()
        glMatrix.vec3.add(tmp,position,origin)
        this.viewMatrix = glMatrix.mat4.create()
        this.translate(tmp)
        //glMatrix.mat4.lookAt(this.cameraMatrix,position,origin,[0,1,0])
    }
    getViewMatrix(){
        glMatrix.mat4.invert(this.viewMatrix,this.getTransformation())
        return this.viewMatrix
    }
    resetCamera(){
        this.cameraMatrix = glMatrix.mat4.create()
        glMatrix.mat4.translate(this.cameraMatrix,this.cameraMatrix,this.position)
    }

}