const cube={
    "version" : "0.1.0",

    "comment" : "Generated by MeshLab JSON Exporter",

    "id"      : 1,
    "name"    : "mesh",

    "vertices" :
        [
            {
                "name"       : "position_buffer",
                "size"       : 3,
                "type"       : "float32",
                "normalized" : false,
                "values"     :
                    [
                        -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
                        0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0, 0, 0, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0, 0, 0,
                        0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0, 0, 0, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0, 0, 0, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0, 0, 0, 0.5, -0.5, -0.5,
                        0.5, -0.5, -0.5, 0, 0, 0
                    ]
            },

            {
                "name"       : "normal_buffer",
                "size"       : 3,
                "type"       : "float32",
                "normalized" : false,
                "values"     :
                    [
                        0, 1, -1.49012e-07, 1, 0, 0, 0, -1.49012e-07, -1, 0, -1, 1.49012e-07, 1, 0, 0, -1, 0, 0, 0, -1, 1.49012e-07, 0, -1, 1.49012e-07, 0, -1.49012e-07, -1, -1, 0, 0,
                        0, 0, 0, 0, 1, -1.49012e-07, 0, 1.49012e-07, 1, 0, 0, 0, 0, 1, -1.49012e-07, 1, 0, 0, 0, 0, 0, 0, 1.49012e-07, 1, -1, 0, 0, 0, 0, 0,
                        0, 1.49012e-07, 1, 0, -1, 1.49012e-07, 0, 0, 0, 0, 1.49012e-07, 1, 0, 1, -1.49012e-07, 0, 0, 0, -1, 0, 0, 0, -1.49012e-07, -1, 0, 0, 0, 0, -1.49012e-07, -1,
                        1, 0, 0, 0, 0, 0
                    ]
            }
        ],

    "connectivity" :
        [
            {
                "name"      : "triangles",
                "mode"      : "triangles_list",
                "indexed"   : true,
                "indexType" : "uint32",
                "indices"   :
                    [
                        0, 11, 14, 12, 17, 20, 5, 26, 18, 7, 3, 6, 15, 4, 30, 8, 29, 27, 0, 24, 11, 12, 23, 17, 5, 9, 26, 7, 21, 3,
                        15, 1, 4, 8, 2, 29
                    ]
            }
        ],

    "mapping" :
        [
            {
                "name"       : "standard",
                "primitives" : "triangles",
                "attributes" :
                    [
                        {
                            "source"   : "position_buffer",
                            "semantic" : "position",
                            "set"      : 0
                        },
                        {
                            "source"   : "normal_buffer",
                            "semantic" : "normal",
                            "set"      : 0
                        }
                    ]
            }
        ],

    "custom" : null
}


const shapeCube = new Shape(cube.vertices[0].values, cube.connectivity[0].indices, cube.vertices[1].values)
//CREAZIONE BUFFER, DA IMPLEMENTARE NEL COSTRUTTORE DI SHAPE
shapeCube.vBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,shapeCube.vBuffer)
gl.bufferData(gl.ARRAY_BUFFER,shapeCube.vertices,gl.STATIC_DRAW)
gl.bindBuffer(gl.ARRAY_BUFFER,null)

shapeCube.nBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,shapeCube.nBuffer)
gl.bufferData(gl.ARRAY_BUFFER,shapeCube.normals,gl.STATIC_DRAW)
gl.bindBuffer(gl.ARRAY_BUFFER,null)

shapeCube.iBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,shapeCube.iBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,shapeCube.indices,gl.STATIC_DRAW)
gl.bindBuffer(gl.ARRAY_BUFFER,null)
