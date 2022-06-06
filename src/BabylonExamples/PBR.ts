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
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class PBR {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnv();
    this.CreateTank();
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
    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/shang.env",
      scene);
    scene.environmentTexture = envTex;
    scene.environmentIntensity = 1;
    scene.createDefaultSkybox(envTex, true);

    return scene;
  }
  CreateEnv(): void {
    const tanks = ["ethan", "methan", "methanol", "water", "methanol", "water", "methanol", "gas", "fluids", "redbull", "ethan", "lastlast", "redbull", "ethan", "lastlast", "redbull", "methan", "lastlast"];
    const tpr = 3;
    const cylPosY = 1;
    // const pyramidObj = { height: 0.5, diameterTop: 0, tessellation: 32, diameterBottom: 2.5 };
    // //create ground plane and set material
    // const cylinderDiameter = 2.5
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 20, height: 30 },
      this.scene
    );
    ground.material = this.CreateAsphalt();
    ground.position.z = 6.5;
    
    //loop out tank models
    const offsetVar = -1
    for (let i = 0; tanks.length > i; i += tpr) {
      const tankRow = tanks.slice(i, i + tpr);
      console.log(tankRow);
      for (let k = offsetVar; tankRow.length + offsetVar > k; k++) {

        // //cylinder settings
        // const cylinder = MeshBuilder.CreateCylinder(`cylinder-${i}`, { diameter: cylinderDiameter }, this.scene);
        // cylinder.material = this.CreateMetal();
        // cylinder.position = new Vector3(k * (-4), cylPosY, i - 4)

        // // pyramid settings
        // const pyramid = MeshBuilder.CreateCylinder("pyramid", pyramidObj, this.scene);
        // pyramid.material = this.CreateMetal();
        // pyramid.position = new Vector3(k * (-4), 2.25, i - 4);
        
      }




    }

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
