class Light{
    constructor(type = "Local",position,diffuseInt,ambientInt,direction,color) {
        this.type = type
        this.position = position
        this.diffuseIntensity = diffuseInt
        this.ambientIntensity = ambientInt
        this.direction = direction
        this.color = color
    }

    getType(){
        return this.type
    }
    getPosition(){
        return this.position
    }
    getDiffuseInt(){
        return this.diffuseIntensity
    }
    getAmbientInt(){
        return this.ambientIntensity
    }
    getDirection(){
        return this.direction
    }
    getColor(){
        return this.color
    }
}