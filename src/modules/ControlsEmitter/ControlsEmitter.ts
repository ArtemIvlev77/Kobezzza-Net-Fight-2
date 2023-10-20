import { ee, EventEmitter } from '../EventEmitter'

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
})

class Controller {
  constructor(ee: EventEmitter<string>) {
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
          ee.emit('moveRight')
        break

        case 'KeyA':
          ee.emit('moveLeft')
        break

        case 'KeyW':
          ee.emit('jump')
        break
      }
    })

    window.addEventListener('keyup', (event) => {
      switch(event.code) {
        case 'KeyD':
          ee.emit('moveRightEnd')
        break

        case 'KeyA':
          ee.emit('moveLeftEnd')
        break

        case 'KeyW':
          ee.emit('jumpEnd')
        break
      }
    })
  }
}

new Controller(ee)