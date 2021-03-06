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
            #define N_MAX_LIGHT 1024

    precision lowp float;
    varying vec3 vPositionW;
    varying vec3 vNormal;
    uniform vec3 uMatDiffuseColor;  //Colore quando oggetto viene illuminato
    uniform vec3 uMatAmbientColor;  //Colore del materiale in scarsa luminosita'
    uniform vec3 uMatSpecularColor; //Colore della riflessione della luce riflessa dall'oggetto
    uniform vec3 uEyePosition;
    
    void main(void){
        vec3 normal= normalize(vNormal);
        float lightDiffuseInt = 1.0; //Light intensity 
        float lightAmbientInt = 0.3; //Light Ambient intensity
        vec3 lightDir = normalize(vec3(0.0,0.0,0.5));//Needs to be a uniform
        vec3 lightColor = vec3(1,1,1);
        //vec3 viewDir = normalize(uEyePosition - vPositionW); Praticamente la posizione della telecamera uEyePosition
        
            vec3 normalizedNormal = normalize(normal);
            vec3 ambientColor = (light.color * light.ambientInt) * uMatAmbientColor;
            vec3 diffuseColor = ((light.color * light.diffuseInt) * uMatDiffuseColor) * max(0.0,dot(normalizedNormal,light.direction));
            vec3 H = normalize(-light.direction + normalize(cameraPos));
            vec3 specularColor = pow(max(0.5,dot(H,normalizedNormal)), 30.)  * uMatSpecularColor * light.color;
        
        vec3 ambientColor = ((lightColor * lightAmbientInt) * uMatAmbientColor);
        vec3 diffuseColor = ((lightColor * lightDiffuseInt) * uMatDiffuseColor) * max(0.0,dot(normal,lightDir));
        vec3 H = normalize((lightDir) + normalize(uEyePosition)); //Nessun doppio dot product come i chad
        vec3 specularColor = pow(max ( 0.0, dot(H,normal)) ,50.) * uMatSpecularColor * lightColor;
        gl_FragColor = vec4((ambientColor+specularColor+diffuseColor).xyz,1.0);   
    }
`
const vsShaderBaseline  = `
        //vertex
        attribute vec3 aPosition;
        //normals
        attribute vec3 aNormal;
        //texture
        attribute vec2 aTextureCoord;
        
        //viewMatrix
        uniform mat4 viewMatrix;
        //Applies transformations and brings aPosition in viewSpace
        uniform mat4 uM;
        //projMatrix
        uniform mat4 projMatrix;
        //Normal correction matrix
        uniform mat4 uInvTransGeoMatrix;
        
        //Position in world space
        varying vec3 vPositionW;
        //exiting normal (which needs to be corrected by uInvTransGeoMatrix)
        varying vec3 vNormal;
        //interpol. texture
         varying highp vec2 vTexCoord;
        
        void main(void){
            //Point in world space just in case we need it
            vPositionW = (viewMatrix * uM * vec4(aPosition,1.0)).xyz;
            
            gl_Position = projMatrix * vec4(vPositionW,1.0);
            
            //Sending correct normal to fragment shader
            vNormal = (uInvTransGeoMatrix * vec4(aNormal,1.0)).xyz;
            vTexCoord = aTextureCoord;
            
        }
        `
const fsShaderBase  = `
        precision highp float;
        
        //Position in world space on the object right now (interpolated)
        varying vec3 vPositionW;
        
        //exiting normal (which needs to be corrected by uInvTransGeoMatrix)
        //Corrected and interpolated normal
        varying vec3 vNormal;
        //Interpolated tex coordinates
         varying highp vec2 vTexCoord;
        
        
        //Camera position
        uniform vec3 uEyePosition;
        
        //How many directional lights
        uniform float N_DIRLIGHTS;
        //We can have an offset for deciding which light is going to be rendered
        
        struct DirectionalLight{
            float diffuseInt;
            float ambientInt;
            vec3 color;
            
            vec3 specular;
            vec3 ambient;
            vec3 diffuse;
            vec3 direction;
        };
        
        /*
        int N_MAX_LIGHT = 1024;
        #define N_MAX_LIGHT 1024
        I can't get them to work gonna try later 
        TODO
        */
        
        uniform vec3 uMatDiffuseColor;  //Colore quando oggetto viene illuminato
        uniform vec3 uMatAmbientColor;  //Colore del materiale in scarsa luminosita'
        uniform vec3 uMatSpecularColor; //Colore della riflessione della luce riflessa dall'oggetto
        
        uniform sampler2D uSampler; // Texture
        
        //33
        //Luke skywalker
        
        uniform DirectionalLight sun[10];
        
        vec3 CalcDirectionalLight(DirectionalLight light,vec3 cameraPos,vec3 normal){
            vec3 normalizedNormal = normalize(normal);
            vec3 ambientColor = (light.color * light.ambientInt) * uMatAmbientColor;
            vec3 diffuseColor = (light.color * light.diffuseInt) * uMatDiffuseColor * max(0.0,dot(normalizedNormal,light.direction));
            vec3 H = normalize(-light.direction + normalize(cameraPos));
            vec3 specularColor = pow(max(0.5,dot(H,normalizedNormal)), 30.)  * uMatSpecularColor * light.color;
            light.ambient = ambientColor;
            light.diffuse = diffuseColor;
            light.specular = specularColor;
            return vec3(light.ambient + light.specular + light.diffuse);
        }
        void main(void){
            vec3 finalColor = vec3(0.0,0.0,0.0);
            int counter = int(N_DIRLIGHTS);
            for(int i = 0; i < 50; i++){
                if(i > counter){
                    break;
                }
                finalColor += CalcDirectionalLight(sun[i],uEyePosition,vNormal);

            }
            gl_FragColor = texture2D(uSampler,vTexCoord);
        
        }
        
`
const flatSh = new Shader(gl,flatVsSource, flatFsSource)
const BasicShaders = new Shader(gl,vsSource, fsSource)
//const phongLight = new Program(gl,vsPhongSource,fsPhongSource)

