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
    target: AbstractMesh;
  
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
      const camera = new FreeCamera("camera", new Vector3(0, 3, -4), this.scene);
      camera.attachControl();
      camera.minZ = 0.5;
      camera.speed = 0.5;
      // camera.rotation.y = 1.5;
  
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
        meshes.shift();
        
        this.target = Mesh.MergeMeshes(
          meshes as Mesh[],
          true,
          true,
          undefined,
          false,
          true
          );
          
        this.target.rotation.y = -90;
        // this.target.position.y = -10;
        // this.target.position.z = 40;
        this.CreateAnimations();
    }

    CreateAnimations(): void{
      const rotateFrames = [];
      const slideFrames = [];
      const fadeFrames =[];

      const fps = 60;

      const rotateAnim = new Animation(
        "rotateAnim", 
        "rotation.x",
        fps,
        Animation.ANIMATIONTYPE_FLOAT, 
        Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const slideAnim = new Animation(
          "slideAnim",
          "position",
          fps,
          Animation.ANIMATIONTYPE_VECTOR3,
          Animation.ANIMATIONLOOPMODE_CYCLE
          );
        const fadeAnim = new Animation(
                  "fadeAnim",
                  "visibility",
                  fps,
                  Animation.ANIMATIONTYPE_FLOAT,
                  Animation.ANIMATIONLOOPMODE_CONSTANT
                  );

        rotateFrames.push({frame:0, value:0});
        rotateFrames.push({frame:180, value:Math.PI/2});

        slideFrames.push({ frame: 0, value: new Vector3(0, 3, 0) });
        slideFrames.push({ frame: 45, value: new Vector3(-3, 2, 0) });
        slideFrames.push({ frame: 90, value: new Vector3(0, 3, 0) });
        slideFrames.push({ frame: 135, value: new Vector3(3, 2, 0) });
        slideFrames.push({ frame: 180, value: new Vector3(0, 3, 0) });
    
        fadeFrames.push({ frame: 0, value: 1 });
        fadeFrames.push({ frame: 180, value: 0 });
    
        slideAnim.setKeys(slideFrames);
        rotateAnim.setKeys(rotateFrames);
        fadeAnim.setKeys(fadeFrames);

        this.target.animations.push(rotateAnim);
        this.target.animations.push(slideAnim);
        this.target.animations.push(fadeAnim);


        // this.scene.beginAnimation(this.target, 0, 180, true);
          const onAnimationEnd =()=>{
            console.log("Ani Ended");
            this.target.setEnabled(false);
          }
          const animControl =this.scene.beginDirectAnimation(
            this.target,
            [slideAnim,rotateAnim],
            0,
            180,
            true,
            1,
            onAnimationEnd
            );

            this.scene.onPointerDown = async (evt)=>{
              if(evt.button===1){
                await this.scene
                .beginDirectAnimation(this.target, [fadeAnim], 0, 180)
                .waitAsync();
              
                  animControl.stop();
              }
            }
    }
  }
  