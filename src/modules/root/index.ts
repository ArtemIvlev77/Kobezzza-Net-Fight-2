import { WebRTCConnection } from "modules/WebRTC/WebRTC";
import { SceneRoot } from "pages/scene";

// TODO move to .env variable
const APP_ID = "92e993a84f45433fac4c116aedc52b0a"

export let globalInstance: RootApp;

function root(target: {new(...args: any[]): RootApp}) {
  return class extends target {
    constructor() {
      super()
      globalInstance = this;
    }
  }
}

export class Widget {
  constructor() {}

  get isRoot() {
    return false;
  }

  get root() {
    return globalInstance!
  }
}

@root
export class RootApp extends Widget {
  // FIXME add Session interface
  connection = new WebRTCConnection({ appId: APP_ID })
  sceneRoot: SceneRoot | undefined

  constructor() {
    super()
    this.animate = this.animate.bind(this)
    this.animate()
  }

  animate() {
    if (this.sceneRoot) {
      this.sceneRoot.update()
    }
    window.requestAnimationFrame(this.animate)
  }

  initSceneRoot(sceneRoot: SceneRoot) {
    this.sceneRoot = sceneRoot
    this.sceneRoot.init()
  }

  get isRoot() {
    return true;
  }

  get root(): RootApp {
    return this
  }
}

