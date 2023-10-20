import "app/styles/init.css";
import { controlsEmitter } from "modules/ControlsEmitter";
import { HomeScene } from "widgets/scenes/HomeScene";
import { MainScene } from "widgets/scenes/MainScene";
import {
  rtcConnection,
} from "./modules";
import { GameScene } from "widgets/scenes/GameScene";

type Scene = 'main' | 'home' | 'game'

export interface SceneManagerI {
  canvas: HTMLCanvasElement | null;
  scenes: {
    home: HomeScene;
    main: MainScene;
    game: GameScene;
  };
  activeScene: HomeScene | MainScene | GameScene | undefined;

  init(): void;

  update(): void;

  toggleTo(scene: Scene): void;

  toggleScene(): void;
}

// FIXME think about naming
class SceneManager implements SceneManagerI {
  canvas: HTMLCanvasElement | null;
  scenes: {
    home: HomeScene,
    main: MainScene,
    game: GameScene,
  };
  activeScene: HomeScene | MainScene | GameScene | undefined = undefined;

  constructor() {
    this.canvas = document.querySelector("canvas");
    this.scenes = {
      home: new HomeScene(this.canvas),
      main: new MainScene({
        canvas: this.canvas,
        isHost: rtcConnection.isHost,
        connected: rtcConnection.connected,
        sceneManager: this,
      }),
      game: new GameScene(this.canvas)
    }
    this.toggleScene = this.toggleScene.bind(this)
  }

  init() {
    this.activeScene = this.scenes.home
    this.update()

    // TODO
    // I think handlers should be in scenes
    // on init we add emitter subscribe (init in every scene)
    // on exit from scene remove subscription from all events (exit in every scene)
    controlsEmitter.on('fPress', this.toggleScene)
  }

  update() {
    this.activeScene?.update()
  }

  toggleTo(scene: Scene) {
    this.activeScene?.exit()
    this.activeScene = this.scenes[scene]
    this.activeScene.init()
  }

  toggleScene() {
    console.log('toggleScene');
    // Think about Linked list for toggle state to next
    // home -> main -> game(1, 2, 3?) -> end game -> main (cycled)
    if (this.activeScene instanceof HomeScene) {
      this.toggleTo('main')
      controlsEmitter.off('fPress', this.toggleScene)
    } else if (this.activeScene instanceof MainScene) {
      // FIXME think about prop drilling
      this.scenes.game.setBgById(this.activeScene.arena.id)
      this.toggleTo('game')
    }
    this.update()
  }
}

const sceneManager = new SceneManager()
sceneManager.init()

// !!ANIMATION!!
function animate() {
  window.requestAnimationFrame(animate)
  sceneManager.update()
}

animate()
