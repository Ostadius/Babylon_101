import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    CubeTexture,
    SceneLoader,
    AbstractMesh,
    Animation,
    Mesh
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
      const camera = new FreeCamera("camera", new Vector3(-2.5, 0, 0), this.scene);
      camera.attachControl();
      camera.minZ = 0.5;
      camera.speed = 0.5;
      camera.rotation.y = 1.5;
  
      //set environment/skybox from HDRI .env file
      const envTex = CubeTexture.CreateFromPrefilteredData(
        "./environment/shang.env",
        scene);
      scene.environmentTexture = envTex;
      envTex.gammaSpace = false;

      envTex.rotationY = Math.PI / 2;
      scene.environmentIntensity = 1;
      scene.createDefaultSkybox(envTex, true, 1000, 0.25);
  
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

        // meshes[0].position.y = 0;


        this.target = Mesh.MergeMeshes(meshes);

        this.CreateAnimations();
    }

    CreateAnimations(): void{
      const rotateFrames = [];
      const fps = 60;

      const rotateAnim = new Animation(
        "rotateAnim", 
        "rotation.x",
        fps,
        Animation.ANIMATIONTYPE_FLOAT, 
        Animation.ANIMATIONLOOPMODE_CYCLE
        );

        rotateFrames.push({frame:0, value:0});
        rotateFrames.push({frame:180, value:Math.PI/2});

        rotateAnim.setKeys(rotateFrames);

        this.target.animations.push(rotateAnim);


        this.scene.beginAnimation(this.target, 0, 180);


    }
  }
  