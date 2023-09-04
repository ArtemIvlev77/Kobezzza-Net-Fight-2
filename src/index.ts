import "app/styles/init.css";
import { controlsEmitter } from "modules/ControlsEmitter";
import { HomeScene } from "widgets/scenes/HomeScene";
import { MainScene } from "widgets/scenes/MainScene";

import { connectionEmitter, rtcConnection } from "./modules/WebRTC";

// FIXME think about naming
class SceneManager {
  canvas: HTMLCanvasElement | null;
  scenes: {
    home: HomeScene,
    main: MainScene,
  };
  activeScene: Set<HomeScene | MainScene | undefined> = new Set(undefined);

  constructor() {
    this.canvas = document.querySelector("canvas");
    this.scenes = {
      home: new HomeScene(this.canvas),
      main: new MainScene({
        canvas: this.canvas,
        isHost: rtcConnection.isHost,
        connected: rtcConnection.connected,
      }),
    }
    this.handleLeft = this.handleLeft.bind(this)
  }

  handleLeft() {
    this.toggleTo('home')
  }

  init() {
    this.activeScene.add(this.scenes.home)
    this.update()

    connectionEmitter.on('left', this.handleLeft)
  }

  update() {
    this.activeScene.forEach((scene) => {
      scene?.update()
    })
  }

  toggleTo(scene: 'main' | 'home') {
    this.activeScene.forEach((scene) => {
      scene?.exit()
    })
    this.activeScene.clear()
    this.activeScene.add(this.scenes[scene])
    this.scenes[scene].init()
  }

  toggleScene() {
    // Think about Linked list for toggle state to next
    // home -> main -> game(1, 2, 3?) -> end game -> main (cycled)
    if (this.activeScene.has(this.scenes.home)) {
      this.activeScene.add(this.scenes.main)
      this.scenes.main.init()
      this.activeScene.delete(this.scenes.home)
    }
    this.update()
  }
}

const sceneManager = new SceneManager()
sceneManager.init()

// TODO
// I think handlers should be in scenes
// on init we add emitter subscribe (init in every scene)
// on exit from scene remove subscription from all events (exit in every scene)
controlsEmitter.on('fPress', () => {
  console.log('fPress');
  sceneManager.toggleScene()
})

// !!ANIMATION!!
function animate() {
  window.requestAnimationFrame(animate)
  sceneManager.update()
}
animate()

// TODO add jest test for EventEmitter
// // это просто проверил
// const id = setInterval(() => {
//   eventEmitter.emit('update')
// }, 100)

// eventEmitter.on('update', () => {
//   console.log(1)
// })

// eventEmitter.on('update', () => {
//   console.log(2)
// })

// eventEmitter.once('update', () => {
//   console.log(20)
// })

// setTimeout(() => {
//   eventEmitter.off('update')
//   clearInterval(id)
// }, 600)