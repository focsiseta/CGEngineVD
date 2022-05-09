//const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
const canvas = document.getElementById("OUT")
const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"))
gl.getExtension('OES_standard_derivatives')

//gl.hint(gl.FRAGMENT_SHADER_DERIVATIVE_HINT,gl.DONT_CARE)

class Program{
    constructor(glContext,vsSource, fsSource) {
    //DEBUGGING
        this.vsLog = ""
        this.fsLog = ""

        this.vsSource = vsSource
        this.fsSource = fsSource
        this.gl = glContext

        this.program = this.gl.createProgram()
        this.vertexShader = this.gl.createShader(gl.VERTEX_SHADER)
        this.fragmentShader = this.gl.createShader(gl.FRAGMENT_SHADER)
        this.gl.shaderSource(this.vertexShader,this.vsSource)
        this.gl.compileShader(this.vertexShader)
    //DEBUGGING
        this.vsLog = this.gl.getShaderInfoLog(this.vertexShader)

        this.gl.shaderSource(this.fragmentShader,this.fsSource)
        this.gl.compileShader(this.fragmentShader)
    //DEBUGGING
        this.fsLog = this.gl.getShaderInfoLog(this.fragmentShader)

        this.gl.attachShader(this.program,this.vertexShader)
        this.gl.attachShader(this.program,this.fragmentShader)

        this.gl.linkProgram(this.program)


        let [attributeArray,uniformArray] = Program.parseShaders(this.vsSource,this.fsSource)
        this.attributes = attributeArray
        this.uniforms = uniformArray
        this.attributes.forEach((element, index) => {this.bindAttribute(element, index)})
        this.uniforms.forEach((element) => {this.bindUniform(element)})


    }

    bindAttribute(id, number){
        this[id] = number
        gl.bindAttribLocation(this.program, this[id], id)
    }

    bindUniform(id){
        this[id] = gl.getUniformLocation(this.program, id)
    }

    static parseShaders(vsSource, fsSource){
        let attrParser = /(?<=attribute\s\w+\s)\w+(?=;)/g
        let unifParser = /(?<=uniform\s\w+\s)\w+(?=;)/g
        let attributes = vsSource.match(attrParser)
        let uniforms = vsSource.match(unifParser).concat(fsSource.match(unifParser))
        return [attributes, uniforms]
    }
    getAttributes(){
        return this.attributes
    }
    getUniforms(){
        return this.uniforms
    }
}





