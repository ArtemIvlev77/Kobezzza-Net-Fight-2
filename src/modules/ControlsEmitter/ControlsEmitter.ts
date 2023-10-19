// @ts-nocheck
import { ee, EventEmitter } from '../EventEmitter'
import { rtcConnection } from '../WebRTC'

type PossibleEvent = 'fPress' | 'moveRight' | 'moveLeft' | 'jump' | 'ePress'
export const controlsEmitter = new EventEmitter<PossibleEvent>()

document.addEventListener('keypress', (evt) => {
  if (evt.code === 'KeyF') {
    controlsEmitter.emit('fPress')
  }
  if (evt.code === 'KeyE') {
    controlsEmitter.emit('ePress')
  }
  if (evt.code === 'KeyA') {
    controlsEmitter.emit('moveLeft')
  }
  if (evt.code === 'KeyD') {
    controlsEmitter.emit('moveRight')
  }
  // if (evt.code === 'KeyW') {
  //   controlsEmitter.emit('jump')
  // }
})

class Controller {
  constructor(ee: EventEmitter<string>) {
    // rtcConnection.ondatachannel = (event) => {
    //   console.log('ondatachannel')
    // }
    window.addEventListener('keydown', (event) => {
      console.log(event.code)
      switch(event.code) {
        case 'KeyF':
          ee.emit('fPress')
        break

        case 'KeyE':
          ee.emit('ePress')
        break

        case 'KeyD':
          rtcConnection.sendMessage({
            type: 'message',
            message: {
              type: 'moveRight',
            },
          })
          ee.emit('moveRight')
        break

        case 'KeyA':
          rtcConnection.sendMessage({
            type: 'message',
            message: {
              type: 'moveLeft',
            },
          })
          ee.emit('moveLeft')
        break

        case 'KeyW':
          rtcConnection.sendMessage({
            type: 'message',
            message: {
              type: 'jumping',
            },
          })
          ee.emit('jump')
        break
      }
    })

    window.addEventListener('keyup', (event) => {
      switch(event.code) {
        case 'KeyD':
          rtcConnection.sendMessage({
            type: 'message',
            message: {
              type: 'moveRightEnd',
            },
          })
          ee.emit('moveRightEnd')
        break

        case 'KeyA':
          rtcConnection.sendMessage({
            type: 'message',
            message: {
              type: 'moveLeftEnd',
            },
          })
          ee.emit('moveLeftEnd')
        break

        case 'KeyW':
          rtcConnection.sendMessage({
            type: 'message',
            message: {
              type: 'jumpingEnd',
            },
          })
          ee.emit('jumpEnd')
        break
      }
    })
  }
}

new Controller(ee)