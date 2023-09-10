import { controlsEmitter } from "modules/ControlsEmitter";
import { BaseScene } from "../BaseScene";
import { SupportedMessageType, connectionEmitter, rtcConnection } from "modules/WebRTC";
import { MainSceneGamer } from "./MainSceneGamer";
import { MainSceneArena } from "./MainSceneArena";

type ConnectionMessage = {
  memberId: string;
  message: {
    messageType: string;
    text: string;
  }
}

export class MainScene extends BaseScene {
  isHost: boolean;
  connected: boolean;
  player: MainSceneGamer;
  enemy: MainSceneGamer;
  connectionSound: HTMLAudioElement;
  arena: MainSceneArena;

  constructor({ canvas, isHost, connected }: {
    canvas: HTMLCanvasElement | null,
    isHost: boolean,
    connected: boolean,
  }) {
    super(canvas)

    this.isHost = isHost;
    this.connected = connected;
    this.player = new MainSceneGamer({ canvas, isHost, connected, type: 'player' })
    this.enemy = new MainSceneGamer({ canvas, isHost: !isHost, connected, type: 'enemy' })
    this.arena = new MainSceneArena({ canvas, isHost, connected })

    this.connectionSound = new Audio('/assets/sounds/invasion.mp3');

    this.toggleToPrev = this.toggleToPrev.bind(this)
    this.toggleToNext = this.toggleToNext.bind(this)
    this.handleJoined = this.handleJoined.bind(this)
    this.handleConnected = this.handleConnected.bind(this)
    this.handleConnectionMessage = this.handleConnectionMessage.bind(this)
    this.toggleReady = this.toggleReady.bind(this)
  }

  get characterTarget(): MainSceneGamer {
    const hostPlayer = this.isHost ? this.player : this.enemy
    const target = !this.connected ? this.player : hostPlayer
    return target
  }

  get playersIsReady(): boolean {
    return this.enemy.isReady && this.player.isReady
  }

  // FIXME think about refactoring
  toggleToPrev() {
    if (this.playersIsReady && this.isHost) {
      this.arena.toggleToPrev()
    } else {
      this.characterTarget.toggleToPrev()
      rtcConnection.sendMessage({
        type: 'message',
        message: {
          type: 'main-scene:change-character',
          characterId: this.characterTarget.id,
        },
      })
    }
  }

  // FIXME think about refactoring
  toggleToNext() {
    if (this.playersIsReady && this.isHost) {
      this.arena.toggleToNext()
    } else {
      this.characterTarget.toggleToNext()
      rtcConnection.sendMessage({
        type: 'message',
        message: {
          type: 'main-scene:change-character',
          characterId: this.characterTarget.id,
        },
      })
    }
  }

  toggleReady() {
    if (this.playersIsReady && this.isHost) {
      // this.arena.toggleToNext()
      alert('Switch to next scene')
    } else {
      this.characterTarget.toggleReady()
      rtcConnection.sendMessage({
        type: 'message',
        message: {
          type: 'main-scene:is-ready',
          isReady: this.characterTarget.isReady,
        },
      })
    }
  }

  handleJoined() {
    this.isHost = true
    this.connected = true
    this.connectionSound.volume = 0.1
    this.connectionSound.play()
    // TODO think about reactive update
    this.enemy.setConnected(true)
    this.player.setConnected(true)
  }

  handleConnected() {
    this.connected = true
    // TODO think about reactive update
    this.enemy.setConnected(true)
    this.player.setConnected(true)
  }

  handleConnectionMessage({ message }: ConnectionMessage) {
    const data = JSON.parse(message.text) as {
      type: 'string',
      message: {
        type: SupportedMessageType,
        characterId: number,
        isReady: boolean;
      }
    }
    const peerTarget = this.characterTarget.type === 'player'
      ? this.enemy
      : this.player
    if (data.message.type === 'main-scene:change-character') {
      peerTarget.setById(data.message.characterId)
    }
    if (data.message.type === 'main-scene:is-ready') {
      console.log('data.message.isReady', data.message.isReady);
      peerTarget.setReady(data.message.isReady)
    }
  }

  drawSelectPlayer() {
    this.player.draw({
      offset: { x: 200, y: 380 },
      title: 'Player 1',
    })
  }

  drawSelectEnemy() {
    this.enemy.draw({
      offset: { x: 966, y: 380 },
      title: 'Player 2',
    })
  }

  draw() {
    if (this.canvas) {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawBg()
      this.drawTitle()
      this.drawSelectPlayer()
      this.drawSelectEnemy()
      this.arena.draw()
    }
  }

  update() {
    this.drawBg()
    this.drawTitle()
    this.drawSelectPlayer()
    this.drawSelectEnemy()
    this.arena.draw()
    // For debug drawing element position
    // drawGrid({ canvas: this.canvas })
  }

  init() {
    controlsEmitter.on('moveLeft', this.toggleToPrev)
    controlsEmitter.on('moveRight', this.toggleToNext)
    controlsEmitter.on('fPress', this.toggleReady)

    connectionEmitter.on('joined', this.handleJoined)
    connectionEmitter.on('connected', this.handleConnected)
    connectionEmitter.on('message', (data) => this.handleConnectionMessage(data as ConnectionMessage))

    rtcConnection.init()
  }

  exit() {
    controlsEmitter.off('moveLeft', this.toggleToPrev)
    controlsEmitter.off('moveRight', this.toggleToNext)
    controlsEmitter.off('fPress', this.toggleReady)

    connectionEmitter.off('joined', this.handleJoined)
    connectionEmitter.off('connected', this.handleConnected)
    connectionEmitter.off('message', (data) => this.handleConnectionMessage(data as ConnectionMessage))
  }
}
