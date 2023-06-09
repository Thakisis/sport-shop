export const shaderFragments = [
    {
        uniforms:
        {
            Zones1: { value: null },
            background: { value: 0x000000 },
            ColorA: { value: 0x000000 },
            ColorB: { value: 0x000000 },
            ColorC: { value: 0x000000 },
        }
        ,
        frHeader: `
        uniform sampler2D Zones1; 
                uniform vec3 background; 
                uniform vec3 ColorA; 
                uniform vec3 ColorB; 
                uniform vec3 ColorC; 
        `,
        frBody: `
            vec2 uvs = vUv;
            vec4 texelColor= texture2D( Zones1, uvs );
            vec3 color1=vec3(0.,1.,0.);
            vec3 color2=vec3(0.,0.,1.);
            vec3 pass1=mix(background,ColorC,texelColor.b);
            vec3 pass2=mix(pass1,ColorB,texelColor.g);
            vec3 pass3=mix(pass2,ColorA,texelColor.r);
            vec3 finalColor=pass3;
            diffuseColor= vec4(pass3,1.);
        `


    }


]