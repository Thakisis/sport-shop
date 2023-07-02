export const fragmentShaders = [
    `
        varying vec3 csm_vPosition;
        uniform vec3 bgColor;
        void main() {
            vec3 newDifuse=bgColor;
            csm_DiffuseColor = vec4(newDifuse,1.);
        }
    `,
    `
        varying vec2 vUv;
        varying vec3 csm_vPosition;
        uniform vec3 bgColor;
        uniform sampler2D textures[1];
        uniform vec3 Color1;
        uniform vec3 Color2;
        uniform vec3 Color3;
        
        vec3 mixColors(sampler2D samp, vec3 prevDifuse , vec3 color1 , vec3 color2 , vec3 color3) {
            vec4 texture= texture2D( samp, vUv );
            prevDifuse=prevDifuse*(1.-texture.r)+color1*texture.r;
            prevDifuse=prevDifuse*(1.-texture.g)+color2*texture.g;
            prevDifuse=prevDifuse*(1.-texture.b)+color3*texture.b;
            return prevDifuse;
        }
        void main() {
            vec3 newDifuse=bgColor;
            newDifuse=mixColors(textures[0],newDifuse,Color1,Color2,Color3);
            csm_DiffuseColor = vec4(newDifuse,1.);
        }
    `,
    `
        varying vec2 vUv;
        varying vec3 csm_vPosition;
        uniform vec3 bgColor;
        uniform sampler2D textures[2];
        uniform vec3 Color1;
        uniform vec3 Color2;
        uniform vec3 Color3;
        uniform vec3 Color4;
        uniform vec3 Color5;
        uniform vec3 Color6;
        vec3 mixColors(sampler2D samp, vec3 prevDifuse , vec3 color1 , vec3 color2 , vec3 color3) {
            vec4 texture= texture2D( samp, vUv );
            prevDifuse=prevDifuse*(1.-texture.r)+color1*texture.r;
            prevDifuse=prevDifuse*(1.-texture.g)+color2*texture.g;
            prevDifuse=prevDifuse*(1.-texture.b)+color3*texture.b;
            return prevDifuse;
        }
        void main() {
            vec3 newDifuse=bgColor;
            newDifuse=mixColors(textures[0],newDifuse,Color1,Color2,Color3);
            newDifuse=mixColors(textures[1],newDifuse,Color4,Color5,Color6);
            csm_DiffuseColor = vec4(newDifuse,1.);
        }
    `
    ,
    `
        varying vec2 vUv;
        varying vec3 csm_vPosition;
        uniform vec3 bgColor;
        uniform sampler2D textures[3];
        uniform vec3 Color1;
        uniform vec3 Color2;
        uniform vec3 Color3;
        uniform vec3 Color4;
        uniform vec3 Color5;
        uniform vec3 Color6;
        uniform vec3 Color7;
        uniform vec3 Color8;
        uniform vec3 Color9;

        vec3 mixColors(sampler2D samp, vec3 prevDifuse , vec3 color1 , vec3 color2 , vec3 color3) {
            vec4 texture= texture2D( samp, vUv );
            prevDifuse=prevDifuse*(1.-texture.r)+color1*texture.r;
            prevDifuse=prevDifuse*(1.-texture.g)+color2*texture.g;
            prevDifuse=prevDifuse*(1.-texture.b)+color3*texture.b;
            return prevDifuse;
        }
        void main() {
            vec3 newDifuse=bgColor;
            newDifuse=mixColors(textures[0],newDifuse,Color1,Color2,Color3);
            newDifuse=mixColors(textures[1],newDifuse,Color4,Color5,Color6);
            newDifuse=mixColors(textures[2],newDifuse,Color7,Color8,Color9);
            csm_DiffuseColor = vec4(newDifuse,1.);
        }
    `
    ,
    `
        varying vec2 vUv;
        varying vec3 csm_vPosition;
        uniform vec3 bgColor;
        uniform sampler2D textures[4];
        uniform vec3 Color1;
        uniform vec3 Color2;
        uniform vec3 Color3;
        uniform vec3 Color4;
        uniform vec3 Color5;
        uniform vec3 Color6;
        uniform vec3 Color7;
        uniform vec3 Color8;
        uniform vec3 Color9;
        uniform vec3 Color10;
        uniform vec3 Color11
        uniform vec3 Color12;

        vec3 mixColors(sampler2D samp, vec3 prevDifuse , vec3 color1 , vec3 color2 , vec3 color3) {
            vec4 texture= texture2D( samp, vUv );
            prevDifuse=prevDifuse*(1.-texture.r)+color1*texture.r;
            prevDifuse=prevDifuse*(1.-texture.g)+color2*texture.g;
            prevDifuse=prevDifuse*(1.-texture.b)+color3*texture.b;
            return prevDifuse;
        }
        void main() {
            vec3 newDifuse=bgColor;
            newDifuse=mixColors(textures[0],newDifuse,Color1,Color2,Color3);
            newDifuse=mixColors(textures[1],newDifuse,Color4,Color5,Color6);
            newDifuse=mixColors(textures[2],newDifuse,Color7,Color8,Color9);
            newDifuse=mixColors(textures[3],newDifuse,Color10,Color11,Color12);
            csm_DiffuseColor = vec4(newDifuse,1.);
        }`,
]