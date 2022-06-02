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
    //rotation in radians of local x,y,z axis
        this.alpha = 0
        this.beta = 0
        this.gamma = 0
    //local right, up, front vectors
        this.right = glMatrix.vec3.fromValues(1,0,0)
        this.up = glMatrix.vec3.fromValues(0,1,0)
        this.front = glMatrix.vec3.fromValues(0,0,1)

        this.type = Gimbal.enum[type]
    }


    frameCalculation(){
        let tmp1 = glMatrix.mat4.create()
        let rotX = glMatrix.mat4.fromXRotation(glMatrix.mat4.create(),this.alpha)
        let rotY = glMatrix.mat4.fromYRotation(glMatrix.mat4.create(),this.beta)
        let rotZ = glMatrix.mat4.fromZRotation(glMatrix.mat4.create(),this.gamma)

        switch(this.type) {
            case 0://XYZ
                glMatrix.mat4.multiply(tmp1, rotY, rotX)
                glMatrix.mat4.multiply(tmp1, rotZ, tmp1)
                break
            case 1://XZY
                glMatrix.mat4.multiply(tmp1, rotZ, rotX)
                glMatrix.mat4.multiply(tmp1, rotY, tmp1)
                break
            case 2://YXZ
                glMatrix.mat4.multiply(tmp1, rotX, rotY)
                glMatrix.mat4.multiply(tmp1, rotZ, tmp1)
                break
            case 3://YZX
                glMatrix.mat4.multiply(tmp1, rotZ, rotY)
                glMatrix.mat4.multiply(tmp1, rotX, tmp1)
                break
            case 4://ZXY
                glMatrix.mat4.multiply(tmp1, rotX, rotZ)
                glMatrix.mat4.multiply(tmp1, rotY, tmp1)
                break
            case 5://ZYX
                glMatrix.mat4.multiply(tmp1, rotY, rotZ)
                glMatrix.mat4.multiply(tmp1, rotX, tmp1)
                break
            default:
                //return identity
        }
        return tmp1
    }
    debug(){
        console.log(this.right[0],",",this.right[1],",",this.right[2])
        console.log(this.up[0],",",this.up[1],",",this.up[2])
        console.log(this.front[0],",",this.front[1],",",this.front[2])
    }

    setAlpha(alpha) { this.alpha = alpha % (Math.PI*2) }
    setBeta(beta) { this.beta = beta % (Math.PI*2) }
    setGamma(gamma) { this.gamma = gamma % (Math.PI*2) }

    addAlpha(alpha) { this.alpha = (this.alpha + alpha) % (Math.PI*2) }
    addBeta(beta) { this.beta = (this.beta + beta) % (Math.PI*2) }
    addGamma(gamma){ this.gamma = (this.gamma + gamma) % (Math.PI*2) }






}