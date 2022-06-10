import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  MeshBuilder,
  CubeTexture,
  PBRMaterial,
  Texture,
  SceneLoader,
  AbstractMesh,
  GlowLayer,
  Light,
  LightGizmo,
  GizmoManager,
  HemisphericLight,
  Color3,
  DirectionalLight,
  PointLight,
  SpotLight,
  ShadowGenerator,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class BOMBAKLATT {
  scene: Scene;
  engine: Engine;
  lightTubes!:AbstractMesh[];
  models!:AbstractMesh[];
  ball!:AbstractMesh;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    // this.CreateTank();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
    camera.attachControl();
    camera.speed = 0.3;
    //set environment/skybox from HDRI .env file
    // const envTex = CubeTexture.CreateFromPrefilteredData(
    //   "./environment/shang.env",
    //   scene);
    // scene.environmentTexture = envTex;
    // scene.environmentIntensity = 1;
    // scene.createDefaultSkybox(envTex, true);

    return scene;
  }
  async CreateEnvironment(): Promise<void> {
    const {meshes} = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "LightingScene.glb"
    )
    this.models = meshes;

    this.lightTubes = meshes.filter(
      (mesh)=>
        mesh.name === "lightTube_left" || mesh.name === "lightTube_right"
      
    );
    this.ball = MeshBuilder.CreateSphere("ball", {diameter: 0.6}, this.scene);

    this.ball.position = new Vector3(0, 1, -1);

    const glowLayer = new GlowLayer("glowLayer", this.scene);
    glowLayer.intensity = 0.8

    this.CreateLights();
  }


  CreateLights(): void{
    // const hemiLight = new HemisphericLight(
    //   "hemiLight",
    //   new Vector3(0,1,0),
    //   this.scene)
    //   //creates horizon of two different colors
    //   hemiLight.diffuse = new Color3(1,0,0);
    //   hemiLight.groundColor = new Color3(0,0,1);
    //   //add specular light gradient
    //   hemiLight.specular = new Color3(0,1,0);
    //   //create interactable Gizmo a la blender 

    // const pointLight = new PointLight(
    //   "pointLight",
    //   new Vector3(0,2,0),
    //   this.scene
    // );
    // pointLight.diffuse = new Color3(172/255,34,90);
    // //if I dont assing it the PointLight type it will be a Nullable <Light>
    // const pointClone = pointLight.clone("pointClone") as PointLight;

    // pointLight.parent = this.lightTubes[0];
    // pointClone.parent = this.lightTubes[1];
    //Math.PI == 180 degrees and whatever you divide it by will be the angle of the spotlight
    const spotLight = new SpotLight("spotLight",new Vector3(0,0.5,-3),new Vector3(0,1,3),Math.PI/2,10,this.scene);
    spotLight.intensity = 100;
    // enable shadows for this specific spotlight
    spotLight.shadowEnabled = true;
    //give shadow depth by setting the clipping planes of the shadow
    spotLight.shadowMinZ = 1;    
    spotLight.shadowMaxZ = 100  ;

    // 1st param map size of shadow 2nd param the light mesh/source
    const shadowGen = new ShadowGenerator(2048, spotLight);
    //to increase shadow quality by using below filter 
    shadowGen.useBlurCloseExponentialShadowMap = true;
    this.ball.receiveShadows = true;
    shadowGen.addShadowCaster(this.ball);

    this.models.map(mesh =>{
      mesh.receiveShadows = true;
      shadowGen.addShadowCaster(mesh);
    })
    this.CreateGizmos(spotLight);
  }
  CreateGizmos(customLight:Light): void {
    const lightGizmo = new LightGizmo();
    lightGizmo.scaleRatio = 2;
    lightGizmo.light= customLight;

    const gizmoManager = new GizmoManager(this.scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos  = false;
    gizmoManager.attachToMesh(lightGizmo.attachedMesh);
  }


  CreateAsphalt(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene);
    pbr.albedoTexture = new Texture(
      "./textures/asphalt/asphalt_02_diff_1k.jpg",
      this.scene);

    pbr.bumpTexture = new Texture(
      "./textures/asphalt/asphalt_02_nor_gl_1k.jpg",
      this.scene);

    pbr.metallicTexture = new Texture(
      "./textures/asphalt/asphalt_02_arm_1k.jpg",
      this.scene);

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;
    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;
    pbr.roughness = 2;
    return pbr;
  }

  CreateMetal(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene);
    pbr.albedoTexture = new Texture(
      "./textures/metal/rusty_metal_02_ao_white2.jpg",
      this.scene);

    pbr.bumpTexture = new Texture(
      "./textures/metal/metal_plate_nor_gl_1k.jpg",
      this.scene);

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;
    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.roughness = 0.7;
    return pbr;
  }
async CreateTank(): Promise <void> {
    const models = await SceneLoader.ImportMeshAsync(
      "", 
      "./models/", 
      "tank1.glb");

    
    console.log("models", models);
    
    // SceneLoader.ImportMesh("", "./models/", "tank1.glb", this.scene, (meshes) => {
    //   console.log("meshes", meshes);
    // }
    // )
  }

}
