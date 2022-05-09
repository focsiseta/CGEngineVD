const coneVertexGen = function (resolution) {
    let angle = 0
    let step = (Math.PI*2)/resolution
    let lowY = -1.0
    let highY = +1.0

    let out = [0.0, lowY, 0.0]
    //lowerCircle
    for(let i=1; i<=resolution; i++){
        out.push(Math.cos(angle), lowY, Math.sin(angle))
        angle += step
    }
    out.push(0.0,highY,0.0)

    return out
}

const coneIndexGen = function (resolution){
    let out= []
    //lowerCircle
    for (let i = 1; i<resolution; i++){
        out.push(i+1,0, i)
    }
    out.push(1, 0, resolution)

    //lateralFaces
    for(let i = 1; i<resolution; i++){
        out.push(i+1, i, resolution+1)
    }

    out.push(resolution, resolution+1,1)

    return out
}

const coneIndexContourGen2 = function(resolution){
    let out = []
    //lowerCircle
    for(let i=1; i<resolution; i++){
        out.push(i,i+1)
    }
    out.push(resolution,1)

    //lateral edges
    for(let i = 1; i<=resolution; i++)
        out.push(i,resolution+1)
    return out
}

const theCone10 ={

    drawingType : "TRIANGLES",

    vertexs :new Float32Array(coneVertexGen(20)),

    indexs : new Uint16Array(coneIndexGen(20))
}
theCone10.normals = ComputeNormals(theCone10.vertexs, theCone10.indexs)


const theCone10Contour = {
    drawingType: "LINES",

    vertexs: new Float32Array(coneVertexGen(10)),

    indexs: new Uint16Array(coneIndexContourGen2(10))
}