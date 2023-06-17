export const shaderFragments = {
    TshirtA_solido: {
        uniforms:
        {

            Number: { value: null },
            background: { value: 0x000000 },

        }
        ,
        frHeader: `
                
                uniform sampler2D Number; 
                uniform vec3 background; 
            
        `,
        frBody: `
            vec2 uvs = vUv;
            vec2 uvIm2=vUv*2.3;
            uvIm2.y-=1.1;
            uvIm2.x-=1.22;
            vec4 numberColor= texture2D( Number, uvIm2 );
            vec3 finalColor=mix(background,numberColor.rgb,numberColor.a);
            diffuseColor= vec4(finalColor,1.);
        `


    },
    TshirtA_diagonal: {
        uniforms:
        {
            Zones1: { value: null },
            Number: { value: null },
            background: { value: 0x000000 },
            ColorA: { value: 0x000000 },
            ColorB: { value: 0x000000 },
            ColorC: { value: 0x000000 },
        }
        ,
        frHeader: `
                uniform sampler2D Zones1; 
                uniform sampler2D Number; 
                uniform vec3 background; 
                uniform vec3 ColorA; 
                uniform vec3 ColorB; 
                uniform vec3 ColorC; 
        `,
        frBody: `
            vec2 uvs = vUv;
            vec2 uvIm2=vUv*2.3;
            uvIm2.y-=1.1;
            uvIm2.x-=1.22;
            vec4 texelColor= texture2D( Zones1, uvs );
            vec4 numberColor= texture2D( Number, uvIm2 );
            vec3 color1=vec3(0.,1.,0.);
            vec3 color2=vec3(0.,0.,1.);
            vec3 pass1=mix(background,ColorA,texelColor.r);
            vec3 pass2=mix(pass1,ColorB,texelColor.g);
            vec3 pass3=mix(pass2,ColorC,texelColor.b);
            vec3 finalColor=mix(pass3,numberColor.rgb,numberColor.a);
            
            diffuseColor= vec4(finalColor,1.);
        `


    }


}
