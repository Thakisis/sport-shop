export const vertexShader = `
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}
`

export const fragmentShader = `
#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	#endif
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}

`

export const uniforms =

{
    diffuse: {
        value: 16777215
    },
    opacity: {
        value: 1
    },
    map: {
        value: null
    },
    mapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    alphaMap: {
        value: null
    },
    alphaMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    alphaTest: {
        value: 0
    },
    envMap: {
        value: {
            metadata: {
                version: 4.6,
                type: "Texture",
                generator: "Texture.toJSON"
            },
            uuid: "8992de13-48af-4f35-89bf-86e3cd415c30",
            name: "PMREM.cubeUv",
            image: "54dda379-676d-4ffd-9e89-5b0b820b3137",
            mapping: 306,
            channel: 0,
            repeat: [
                1,
                1
            ],
            offset: [
                0,
                0
            ],
            center: [
                0,
                0
            ],
            rotation: 0,
            wrap: [
                1001,
                1001
            ],
            format: 1023,
            internalFormat: null,
            type: 1016,
            colorSpace: "srgb-linear",
            minFilter: 1006,
            magFilter: 1006,
            anisotropy: 1,
            flipY: false,
            generateMipmaps: false,
            premultiplyAlpha: false,
            unpackAlignment: 4
        }
    },
    flipEnvMap: {
        value: 1
    },
    reflectivity: {},
    ior: {},
    refractionRatio: {},
    aoMap: {
        value: null
    },
    aoMapIntensity: {
        value: 1
    },
    aoMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    lightMap: {
        value: null
    },
    lightMapIntensity: {
        value: 1
    },
    lightMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    emissiveMap: {
        value: null
    },
    emissiveMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    bumpMap: {
        value: null
    },
    bumpMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    bumpScale: {
        value: 1
    },
    normalMap: {
        value: null
    },
    normalMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    normalScale: {
        value: {
            x: 1,
            y: 1
        }
    },
    displacementMap: {
        value: null
    },
    displacementMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    displacementScale: {
        value: 1
    },
    displacementBias: {
        value: 0
    },
    roughnessMap: {
        value: null
    },
    roughnessMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    metalnessMap: {
        value: null
    },
    metalnessMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    fogDensity: {
        value: 0.00025
    },
    fogNear: {
        value: 1
    },
    fogFar: {
        value: 2000
    },
    fogColor: {
        value: 16777215
    },
    ambientLightColor: {
        value: [
            0,
            0,
            0
        ],
        needsUpdate: true
    },
    lightProbe: {
        value: [
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            }
        ],
        needsUpdate: true
    },
    directionalLights: {
        value: [],
        properties: {
            direction: {},
            color: {}
        },
        needsUpdate: true
    },
    directionalLightShadows: {
        value: [],
        properties: {
            shadowBias: {},
            shadowNormalBias: {},
            shadowRadius: {},
            shadowMapSize: {}
        },
        needsUpdate: true
    },
    directionalShadowMap: {
        value: []
    },
    directionalShadowMatrix: {
        value: []
    },
    spotLights: {
        value: [],
        properties: {
            color: {},
            position: {},
            direction: {},
            distance: {},
            coneCos: {},
            penumbraCos: {},
            decay: {}
        },
        needsUpdate: true
    },
    spotLightShadows: {
        value: [],
        properties: {
            shadowBias: {},
            shadowNormalBias: {},
            shadowRadius: {},
            shadowMapSize: {}
        },
        needsUpdate: true
    },
    spotLightMap: {
        value: []
    },
    spotShadowMap: {
        value: []
    },
    spotLightMatrix: {
        value: []
    },
    pointLights: {
        value: [],
        properties: {
            color: {},
            position: {},
            decay: {},
            distance: {}
        },
        needsUpdate: true
    },
    pointLightShadows: {
        value: [],
        properties: {
            shadowBias: {},
            shadowNormalBias: {},
            shadowRadius: {},
            shadowMapSize: {},
            shadowCameraNear: {},
            shadowCameraFar: {}
        },
        needsUpdate: true
    },
    pointShadowMap: {
        value: []
    },
    pointShadowMatrix: {
        value: []
    },
    hemisphereLights: {
        value: [],
        properties: {
            direction: {},
            skyColor: {},
            groundColor: {}
        },
        needsUpdate: true
    },
    rectAreaLights: {
        value: [],
        properties: {
            color: {},
            position: {},
            width: {},
            height: {}
        },
        needsUpdate: true
    },
    ltc_1: {
        value: null
    },
    ltc_2: {
        value: null
    },
    emissive: {
        value: 0
    },
    roughness: {
        value: 1
    },
    metalness: {
        value: 0
    },
    envMapIntensity: {
        value: 1
    },
    clearcoat: {
        value: 0
    },
    clearcoatMap: {
        value: null
    },
    clearcoatMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    clearcoatNormalMap: {
        value: null
    },
    clearcoatNormalMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    clearcoatNormalScale: {
        value: {
            x: 1,
            y: 1
        }
    },
    clearcoatRoughness: {
        value: 0
    },
    clearcoatRoughnessMap: {
        value: null
    },
    clearcoatRoughnessMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    iridescence: {
        value: 0
    },
    iridescenceMap: {
        value: null
    },
    iridescenceMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    iridescenceIOR: {
        value: 1.3
    },
    iridescenceThicknessMinimum: {
        value: 100
    },
    iridescenceThicknessMaximum: {
        value: 400
    },
    iridescenceThicknessMap: {
        value: null
    },
    iridescenceThicknessMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    sheen: {
        value: 0
    },
    sheenColor: {
        value: 0
    },
    sheenColorMap: {
        value: null
    },
    sheenColorMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    sheenRoughness: {
        value: 1
    },
    sheenRoughnessMap: {
        value: null
    },
    sheenRoughnessMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    transmission: {
        value: 0
    },
    transmissionMap: {
        value: null
    },
    transmissionMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    transmissionSamplerSize: {
        value: {
            x: 0,
            y: 0
        }
    },
    transmissionSamplerMap: {
        value: null
    },
    thickness: {
        value: 0
    },
    thicknessMap: {
        value: null
    },
    thicknessMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    attenuationDistance: {
        value: 0
    },
    attenuationColor: {
        value: 0
    },
    specularColor: {
        value: 16777215
    },
    specularColorMap: {
        value: null
    },
    specularColorMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    specularIntensity: {
        value: 1
    },
    specularIntensityMap: {
        value: null
    },
    specularIntensityMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    anisotropyVector: {
        value: {
            x: 0,
            y: 0
        }
    },
    anisotropyMap: {
        value: null
    },
    anisotropyMapTransform: {
        value: {
            elements: [
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]
        }
    },
    clippingPlanes: {
        value: null,
        needsUpdate: false
    }
}