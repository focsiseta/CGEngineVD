const flatVsSource =`
    attribute vec3 aPosition;
    
    uniform mat4 viewMatrix;
    uniform mat4 uM;
    uniform mat4 projMatrix;
    
    varying vec3 viewPosition;
    
    void main(void){
    
        viewPosition = (viewMatrix * uM * vec4(aPosition,1.0)).xyz;
        vec4 pos = projMatrix * vec4(viewPosition,1.0);
        gl_Position =  pos;
        gl_PointSize = 5.0;
    }
    `

const flatFsSource =`
    #extension GL_OES_standard_derivatives : enable
    precision lowp float;
    uniform vec4 uColor;
    
    varying vec3 viewPosition;
     
     
     void main(void){
     
     //luce direzionale
        vec3 lightDirection = vec3(0.0,0.0,1.0);
     
     //calcolo normale faccia per il flatShading
        vec3 xTangent = dFdx( viewPosition );
        vec3 yTangent = dFdy( viewPosition );
        vec3 faceNormal = normalize( cross( xTangent, yTangent ) );
     //calcolo della luce riflessa dall'oggetto
        float diffuse = max(dot(lightDirection,faceNormal),0.0);
     
        
        gl_FragColor = vec4((uColor * diffuse).xyz,uColor.w);    
     }
    `
const fsSource =`
    precision lowp float;
    uniform vec4 uColor;
     void main(void){
        gl_FragColor = uColor;    
     }
    `
const vsSource =`
    attribute vec3 aPosition;
    uniform mat4 viewMatrix;
    uniform mat4 uM;
    uniform mat4 projMatrix;
    void main(void){
        vec4 pos = projMatrix * viewMatrix * uM * vec4(aPosition, 1.0);
        gl_Position =  pos;
        gl_PointSize = 5.0;
    }
    `

const vsPhongSource = `
    
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 viewMatrix;
    uniform mat4 uM;
    uniform mat4 projMatrix;
    uniform mat4 uInvTransGeoMatrix;
    varying vec3 vPositionW;
    varying vec3 vNormal;
    void main(void){
    //Posizione punto in coordinate globali
        vec4 pos =  viewMatrix * uM * vec4(aPosition, 1.0);
        
        gl_Position = projMatrix * viewMatrix * uM * vec4(aPosition, 1.0);
        vPositionW = pos.xyz;
        //Perche' anche le normali con le transformazioni geometriche vengono alterate (non sempre ma succede)
        //vNormal = (transpose(inverse(uM)) * vec4(aNormal,1.0)).xyz;
        vNormal =  (uInvTransGeoMatrix * vec4(aNormal,1.0)).xyz;

    }
`
const fsPhongSource = `
    //#extension GL_OES_standard_derivatives : enable
    precision lowp float;
    varying vec3 vPositionW;
    varying vec3 vNormal;
    uniform vec3 uMatDiffuseColor;  //Colore quando oggetto viene illuminato
    uniform vec3 uMatAmbientColor;  //Colore del materiale in scarsa luminosita'
    uniform vec3 uMatSpecularColor; //Colore della riflessione della luce riflessa dall'oggetto
    uniform vec3 uEyePosition;
    
    void main(void){
        float lightDiffuseInt = 1.0; //Light intensity 
        float lightAmbientInt = 0.5; //Light Ambient intensity
        vec3 lightDir = vec3(0.0,0.0,1.0);//Needs to be a uniform
        vec3 lightColor = vec3(1.0,1.0,1.0);
        
        /*Uniforms*/
        //vec3 eyePosition = vec3(0.0,0.0,1.0); //eyePosition uniform
        /*~~~~~~~~~*/
        
        vec3 ambientColor = ((lightColor * lightAmbientInt) * uMatAmbientColor);
        vec3 diffuseColor = ((lightColor * lightDiffuseInt) * uMatDiffuseColor) * dot(vNormal,lightDir);
        vec3 H = normalize((-lightDir)+uEyePosition); //Nessun doppio dot product come i chad
        vec3 specularColor = pow(dot(H,vNormal),1.) * uMatSpecularColor * lightColor;
        gl_FragColor = vec4((specularColor).xyz,1.0);
    }
`

const flatSh = new Shader(gl,flatVsSource, flatFsSource)
const BasicShaders = new Shader(gl,vsSource, fsSource)
//const phongLight = new Program(gl,vsPhongSource,fsPhongSource)

