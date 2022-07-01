import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    CubeTexture,
    SceneLoader,
    AbstractMesh,
  } from "@babylonjs/core";
  import "@babylonjs/loaders";
  
  export class AnimatedKLATT {
    scene: Scene;
    engine: Engine;
    target!: AbstractMesh;
  
    constructor(private canvas: HTMLCanvasElement) {
      this.engine = new Engine(this.canvas, true);
      this.scene = this.CreateScene();
      this.CreateTarget();
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
    
    async CreateEnvironment(): Promise<void> {
        await SceneLoader.ImportMeshAsync(
          "",
          "./models/",
          "Prototype_Level.glb",
          this.scene
        );
      }
    async CreateTarget() :Promise<void>{
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "target.glb",
            this.scene
        );

        meshes[0].position.y = 3;

        this.target = meshes[0];
    }

    CreateAnumations(): void{
      

    }
  }
  