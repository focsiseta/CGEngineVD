class Material{
    /*
    * ambientColor: color in extremely low light
    * diffuseColor: color of the object when illuminated
    * specularColor: color of the reflected light from the object
    * */
    constructor(diffuseColor,ambientColor,specularColor) {
        this.diffuseColor = diffuseColor
        this.ambientColor = ambientColor
        this.specularColor = specularColor
    }
    getDiffuse(){
        return this.diffuseColor
    }
    getAmbient(){
        return this.ambientColor
    }
    getSpecular(){
        return this.specularColor
    }
}

const piros = new Material([1,165/255,0],
                [255/255,140/255,0],
                [1,215/255,0])
