import { controlsEmitter } from "modules/ControlsEmitter";
import { HomeScene } from "widgets/scenes/HomeScene";
import { MainScene } from "widgets/scenes/MainScene";
import { GameScene } from "widgets/scenes/GameScene";
import { getUrlParams } from "shared/lib/query";

type Scene = 'main' | 'home' | 'game'

export interface SceneRootI {
  canvas: HTMLCanvasElement | null;
  scenes: {
    home: HomeScene;
    main: MainScene;
    game: GameScene;
  } | undefined;
  activeScene: HomeScene | MainScene | GameScene | undefined;

  init(): void;

  update(): void;

  toggleTo(scene: Scene): void;

  toggleScene(): void;
}

export class SceneRoot implements SceneRootI {
  canvas: HTMLCanvasElement | null;
  scenes: {
    home: HomeScene,
    main: MainScene,
    game: GameScene,
  } | undefined;
  activeScene: HomeScene | MainScene | GameScene | undefined = undefined;

  constructor() {
    this.canvas = document.querySelector("canvas");
    this.toggleScene = this.toggleScene.bind(this)
  }

  init() {
    this.scenes = {
      home: new HomeScene(this.canvas),
      main: new MainScene({canvas: this.canvas}),
      game: new GameScene(this.canvas)
    }
    let roomId = getUrlParams().get('room')
    if (roomId) {
      this.toggleTo('main')
    } else {
      this.activeScene = this.scenes.home
      // TODO
      // I think handlers should be in scenes
      // on init we add emitter subscribe (init in every scene)
      // on exit from scene remove subscription from all events (exit in every scene)
      controlsEmitter.on('fPress', this.toggleScene)
    }
    this.update()

  }

  update() {
    this.activeScene?.update()
  }

  toggleTo(scene: Scene) {
    this.activeScene?.exit()
    this.activeScene = this.scenes?.[scene]
    this.activeScene?.init()
  }

  toggleScene() {
    // Think about Linked list for toggle state to next
    // home -> main -> game(1, 2, 3?) -> end game -> main (cycled)
    if (this.activeScene instanceof HomeScene) {
      this.toggleTo('main')
      controlsEmitter.off('fPress', this.toggleScene)
    } else if (this.activeScene instanceof MainScene) {
      // FIXME think about prop drilling
      this.scenes?.game.setBgById(this.activeScene.arena.id)
      this.toggleTo('game')
    }
    this.update()
  }
}
