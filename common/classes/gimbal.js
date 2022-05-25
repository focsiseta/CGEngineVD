class Gimbal{

    static enum = {
        XYZ:0,
        XZY:1,
        YXZ:2,
        YZX:3,
        ZXY:4,
        ZYX:5,
    }

    constructor(type) {
        this.alpha = 0
        this.beta = 0
        this.gamma = 0
        this.type = Gimbal.enum[type]
    }


    frameCalculation(){

        let tmp1 = glMatrix.mat4.create()
        let tmp2 = glMatrix.mat4.create()
        let rotX = glMatrix.mat4.fromXRotation(glMatrix.mat4.create(),this.alpha)
        let rotY = glMatrix.mat4.fromYRotation(glMatrix.mat4.create(),this.beta)
        let rotZ = glMatrix.mat4.fromZRotation(glMatrix.mat4.create(),this.gamma)

        switch(this.type) {
            case 0://XYZ
                glMatrix.mat4.multiply(tmp1, rotY, rotX)
                glMatrix.mat4.multiply(tmp2, rotZ, tmp1)
                break
            case 1://XZY
                glMatrix.mat4.multiply(tmp1, rotY, rotX)
                glMatrix.mat4.multiply(tmp2, rotZ, tmp1)
                break
            case 2://YXZ
                glMatrix.mat4.multiply(tmp1, rotY, rotX)
                glMatrix.mat4.multiply(tmp2, rotZ, tmp1)
                break
            case 3://YZX
                glMatrix.mat4.multiply(tmp1, rotY, rotX)
                glMatrix.mat4.multiply(tmp2, rotZ, tmp1)
                break
            case 4://ZXY
                glMatrix.mat4.multiply(tmp1, rotY, rotX)
                glMatrix.mat4.multiply(tmp2, rotZ, tmp1)
                break
            case 5://ZYX
                glMatrix.mat4.multiply(tmp1, rotY, rotX)
                glMatrix.mat4.multiply(tmp2, rotZ, tmp1)
                break
            default:
                //return identity
        }
        return tmp2
    }

    setAlpha(alpha){
        this.alpha = alpha % (Math.PI*2)
    }
    setBeta(beta){
        this.beta = beta % (Math.PI*2)
    }
    setGamma(gamma){
        this.gamma = gamma % (Math.PI*2)
    }

    addAlpha(alpha){
        this.alpha+=alpha
        this.alpha %= (Math.PI*2)
    }

    addBeta(beta){
        this.beta+=beta
        this.beta %= (Math.PI*2)
    }

    addGamma(gamma){
        this.gamma+=gamma
        this.beta %= (Math.PI*2)
    }






}