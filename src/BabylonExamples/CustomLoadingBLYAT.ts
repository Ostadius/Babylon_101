import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    MeshBuilder,
    CubeTexture,
    SceneLoader,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { CustomLoadingScreen } from "./CustomLoadingScreen";

export class CustomLoadingBLYAT {
    scene: Scene;
    engine: Engine;
    loadingScreen: CustomLoadingScreen;

    constructor(
        private canvas: HTMLCanvasElement,
        private loadingBar: HTMLElement,
        private percentLoaded: HTMLElement,
        private loader: HTMLElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.loadingScreen = new CustomLoadingScreen(this.loadingBar, this.percentLoaded, this.loader);
        // assigning the loading screen that we created to the engine.loadingScreen

        this.engine.loadingScreen = this.loadingScreen;

        this.engine.displayLoadingUI();
        this.CreateEnvironment();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera(
            "camera",
            new Vector3(0, 0.75, -8),
            this.scene
        );
        camera.attachControl();
        camera.speed = 0.25;

        const envTex = CubeTexture.CreateFromPrefilteredData(
            "./environment/sky.env",
            scene
        );

        scene.environmentTexture = envTex;

        scene.createDefaultSkybox(envTex, true);

        scene.environmentIntensity = 0.5;

        return scene;
    }




    async CreateEnvironment(): Promise<void> {
        await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "LightingScene.glb",
            this.scene,
            // callback function that the SceneLoader accepts as a parameter(=onProgress)
            (event)=>{
            const loadStatus = ((event.loaded*100)/event.total).toFixed();

            this.loadingScreen.updateLoadStatus(loadStatus);

            }
        );
            this.engine.hideLoadingUI();

    }
}
