//const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));

//gl.hint(gl.FRAGMENT_SHADER_DERIVATIVE_HINT,gl.DONT_CARE)

class Shader {
    constructor(glContext, vsSource, fsSource) {
        //DEBUGGING
        this.vsLog = ""
        this.fsLog = ""
        this.uniLog = ""

        this.vsSource = vsSource
        this.fsSource = fsSource
        this.gl = glContext

        this.program = this.gl.createProgram()
        this.vertexShader = this.gl.createShader(gl.VERTEX_SHADER)
        this.fragmentShader = this.gl.createShader(gl.FRAGMENT_SHADER)
        this.gl.shaderSource(this.vertexShader, this.vsSource)
        this.gl.compileShader(this.vertexShader)
        //DEBUGGING
        this.vsLog = this.gl.getShaderInfoLog(this.vertexShader)
        this.gl.shaderSource(this.fragmentShader, this.fsSource)
        this.gl.compileShader(this.fragmentShader)
        //DEBUGGING
        this.fsLog = this.gl.getShaderInfoLog(this.fragmentShader)

        this.gl.attachShader(this.program, this.vertexShader)
        this.gl.attachShader(this.program, this.fragmentShader)

        this.gl.linkProgram(this.program)

        let [attributeArray, uniformArray] = Shader.parseShaders(this.vsSource, this.fsSource)
        this.attributes = attributeArray
        this.uniforms = uniformArray
        this.attributes.forEach((element, index) => {
            this.bindAttribute(element, index)
        })
        this.uniforms.forEach((element) => {
            this.bindUniform(element)
        })
    }

    getContext(){
        return this.gl
    }

    bindAttribute(id, number) {
        this[id] = number
        this.gl.bindAttribLocation(this.program, this[id], id)
    }

    bindUniform(id) {
        this.uniforms.push(id) //Utilizzato per mettere i nomi degli uniform che non vengono parsati dentro lo shader, guarda sun in fsShaderBase
        this[id] = this.gl.getUniformLocation(this.program, id)
    }

    static parseShaders(vsSource, fsSource) {
        let attrParser = /(?<=attribute\s\w+\s)\w+(?=;)/g
        let unifParser = /(?<=uniform\s\w+\s)\w+(?=;)/g

        let attributes = vsSource.match(attrParser)
        let uniforms = vsSource.match(unifParser).concat(fsSource.match(unifParser))
        return [attributes, uniforms]
    }

    setMatrixUniform(uniformName, data, transpose=false){
        this.gl.uniformMatrix4fv(this[uniformName], transpose, data)
    }

    setVectorUniform(uniformName, data){
        if(!this.hasOwnProperty(uniformName)){
            this.uniLog+=`Error: ${uniformName} does not exist|`
            return
        }
        this.gl.uniform3fv(this[uniformName],data)
    }
    getUniformValue(uniformName){
        return this.gl.getUniform(this.program,this[uniformName])
    }
    useProgram(){
        this.gl.useProgram(this.program)
    }
    setUniform1Float(uniformName,data){
        if(!this.hasOwnProperty(uniformName)){
            this.uniLog+=`Error: ${uniformName} does not exist|`
            return
        }
        this.gl.uniform1f(this[uniformName],data)
    }


}







