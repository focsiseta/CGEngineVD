class Camera extends sceneElement{
    constructor(position = [0,0,5]) {
        super("Camera_")
        //Position is used only to save the first position of the camera itself, for camera position use getActualPosition
        this.speed = 0.3
        this.resetPosition = position

        //euler rotation (careful about the gimbal lock)
        this.gimbal = new Gimbal("XYZ")


        //this.viewMatrix = glMatrix.mat4.create()

        this.translate(this.resetPosition)
        this.transformationMatrix = this.getTransformation()
    }
    rotateX(angle) {
        this.gimbal.addAlpha(angle)
        this.rotationMatrix = this.gimbal.frameCalculation()
    }
    rotateY(angle) {
        this.gimbal.addBeta(angle)
        this.rotationMatrix = this.gimbal.frameCalculation()

    }

    rotateZ(angle) {
        this.gimbal.addGamma(angle)
        this.rotationMatrix = this.gimbal.frameCalculation()

    }

// method for passing the inverted viewFrame to the shader
    getViewMatrix(){
        var tmp = glMatrix.mat4.create()
        glMatrix.mat4.mul(tmp,this.translationMatrix,this.rotationMatrix)
        glMatrix.mat4.invert(tmp,tmp)
        return tmp
    }

//debug
    getValue(){
        console.log(this.gimbal.alpha*180/Math.PI,this.gimbal.beta*180/Math.PI,this.gimbal.gamma*180/Math.PI)
    }

    resetCamera(){
        this.rotationMatrix = glMatrix.mat4.create()
        this.scaleMatrix = glMatrix.mat4.create()
        this.translationMatrix = glMatrix.mat4.create()
        this.viewMatrix = glMatrix.mat4.create()
        this.gimbal.alpha=0
        this.gimbal.beta=0
        this.gimbal.gamma=0
        this.translate(this.resetPosition)
    }

    getCameraPosition(){
        return [this.translationMatrix[12],this.translationMatrix[13],this.translationMatrix[14]]
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

        /*funzione ausiliaria per mantenere il codice pulito: esegue il corpo degli if nei casi della traslazione
        a,b,c sono gli elementi da estrarre dalla matrice nelle operazioni, flag se va invertito il segno della velocità*/
        let translationOps = (a,b,c,flag) => {
            let tmp = glMatrix.mat4.create()
            glMatrix.mat4.invert(tmp,this.getViewMatrix())
            let vector = glMatrix.vec3.fromValues(tmp[a],tmp[b],tmp[c])
            glMatrix.vec3.scale(vector,vector,flag?-this.speed:this.speed)

            this.translate(vector)
        }

        if(inputHandler.getKeyStatus('w') === true) {translationOps(8,9,10, true)}
        if(inputHandler.getKeyStatus('s') === true) {translationOps(8,9,10,false)}
        if(inputHandler.getKeyStatus('a') === true) {translationOps(0,1,2,  true)}
        if(inputHandler.getKeyStatus('d') === true) {translationOps(0,1,2, false)}

        if(inputHandler.getKeyStatus('i') === true){this.rotateX(gradToRad( 0.5))}
        if(inputHandler.getKeyStatus('k') === true){this.rotateX(gradToRad(-0.5))}

        if(inputHandler.getKeyStatus('l') === true){this.rotateY(gradToRad(-0.5))}
        if(inputHandler.getKeyStatus('j') === true){this.rotateY(gradToRad( 0.5))}

        if(inputHandler.getKeyStatus('n') === true){this.rotateZ(gradToRad( 0.5))}
        if(inputHandler.getKeyStatus('m') === true){this.rotateZ(gradToRad(-0.5))}

        /*if(inputHandler.getKeyStatus('u') === true){
            this.translate([0,0.05,0])
        }*/
        /*if(inputHandler.getKeyStatus('h') === true){
            this.translate([0,-0.05,0])
        }*/



        if(inputHandler.getKeyStatus('p') === true){
            this.getCameraPosition()
            this.resetCamera()
        }

    }


}