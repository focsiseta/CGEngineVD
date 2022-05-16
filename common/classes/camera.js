class Camera extends sceneElement{
    constructor(position = [0,0,5],origin = [0,0,0]) {
        super("Camera_")
        //Position is used only to save the first position of the camera itself, for camera position use getActualPosition
        this.position = position
        this.origin = origin
        glMatrix.vec3.add(this.position,position,origin)
        this.viewMatrix = glMatrix.mat4.create()
        this.translate(this.position)
        this.transformationMatrix = this.getTransformation()
        //glMatrix.mat4.lookAt(this.cameraMatrix,position,origin,[0,1,0])
    }

    getViewMatrix(){
        //Updates camera matrix
        glMatrix.mat4.copy(this.transformationMatrix,this.getTransformation())
        //Gets viewMatrix from the camera
        glMatrix.mat4.invert(this.viewMatrix,this.transformationMatrix)
        return this.viewMatrix
    }
    getTransformationMatrix(){
        return this.transformationMatrix
    }
    resetCamera(){
        this.rotationMatrix = glMatrix.mat4.create()
        this.scaleMatrix = glMatrix.mat4.create()
        this.translationMatrix = glMatrix.mat4.create()
        this.viewMatrix = glMatrix.mat4.create()
        this.translate(this.position)
        glMatrix.mat4.invert(this.viewMatrix,this.getTransformation())
    }
    getCameraPosition(){
        return [this.transformationMatrix[12],this.transformationMatrix[13],this.transformationMatrix[14]]
    }

    processInput(inputHandler) {
        /*
        il cross product e' invertito perche' per come funziona la telecamera e' il mondo che ci
        viene incontro quindi se deve sembrare che stiamo andando a sinistra,il mondo andra' alla nostra destra

        Stesso principio si applica per quando si va avanti o indietro
        Per andare avanti il mondo si sta spostando vicino a noi, mantre tornare indietro il mondo si deve allontanare

        Sottosopra il verso di destra e sinistra viene invertito, cercare di sistemare questo problema con una
        flag per invertire  vorrebbe dire che dopo una certo angolo di rotazione Z dovremmo cambiare il verso e questo
        puo' non essere sempre la soluzione piu' corretta
        */
        //This gimbals af
        if(inputHandler.getKeyStatus('w') === true){

                var px = this.transformationMatrix[8]
                var py = this.transformationMatrix[9]
                var pz = this.transformationMatrix[10]
                px +=  gradToRad(1) * 0.000003
                py += gradToRad(1) * 0.0000003
                pz += gradToRad(1) * 0.0000003
                this.translate([gradToRad(-px * 2),gradToRad(-py  * 2) ,gradToRad(-pz  * 2)])

        }
        if(inputHandler.getKeyStatus('s') === true) {

            var px = this.transformationMatrix[8]
            var py = this.transformationMatrix[9]
            var pz = this.transformationMatrix[10]
            px += 0.001 * 0.005 * 0.0005
            py += 0.001 * 0.005* 0.0005
            pz += 0.001 * 0.005 * 0.0005
            this.translate([gradToRad(px * 2),gradToRad(py  * 2) ,gradToRad(pz  * 2)])
        }
        if(inputHandler.getKeyStatus('spacebar') === true){
            this.translate([0,0.05,0])
        }
        if(inputHandler.getKeyStatus('h') === true){
            this.translate([0,-0.05,0])
        }
        if(inputHandler.getKeyStatus('a') === true){
            var px = this.transformationMatrix[8]
            var py = this.transformationMatrix[9]
            var pz = this.transformationMatrix[10]
            var cross = glMatrix.vec3.create()
            glMatrix.vec3.cross(cross,[px,py,pz],[0,1,0])
            this.translate([gradToRad(cross[0] * 2),gradToRad(cross[1]* 2),gradToRad(cross[2] * 2)])
        }
        if(inputHandler.getKeyStatus('d') === true){

            var px = this.transformationMatrix[8]
            var py = this.transformationMatrix[9]
            var pz = this.transformationMatrix[10]
            var cross = glMatrix.vec3.create()
            // -1 because cross product hand rule
            glMatrix.vec3.cross(cross,[px,py,pz],[0,-1,0])
            this.translate([gradToRad(cross[0] * 2),gradToRad(cross[1]* 2),gradToRad(cross[2] * 2)])

        }
        if(inputHandler.getKeyStatus('i') === true){
            this.rotateX(gradToRad(1))
        }
        if(inputHandler.getKeyStatus('k') === true){
            this.rotateX(gradToRad(-1))
        }
        if(inputHandler.getKeyStatus('l') === true){
            this.rotateY(gradToRad(-1))
        }
        if(inputHandler.getKeyStatus('j') === true){
            this.rotateY(gradToRad(1))
        }
        if(inputHandler.getKeyStatus('n') === true){
            this.rotateZ(gradToRad(1))
        }

        if(inputHandler.getKeyStatus('m') === true){
            this.rotateZ(gradToRad(-1))
        }

        if(inputHandler.getKeyStatus('p') === true){
            this.getCameraPosition()
            this.resetCamera()
        }

    }


}