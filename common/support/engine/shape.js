class Shape{
    constructor(vertexArray,indexArray,normalArray = null){
        //Ancora la possibilita' di disegnare linee e punti non e' stata implementata
        this.drawingType = "TRIANGLES"
        this.vertices = new Float32Array(vertexArray)
        this.indices = new Uint16Array(indexArray)
        this.normals = normalArray == null ? ComputeNormals(this.vertices,this.indices) : normalArray
    }


}

const cylinder20 = new Shape(cyVertexGen(20),cyIndexGen(20))
const supercube = new Shape([
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0
],[
    0, 1, 2, 2, 1, 3,  // front
    5, 4, 7, 7, 4, 6,  // back
    4, 0, 6, 6, 0, 2,  // left
    1, 5, 3, 3, 5, 7,  // right
    2, 3, 6, 6, 3, 7,  // top
    4, 5, 0, 0, 5, 1   // bottom
])
