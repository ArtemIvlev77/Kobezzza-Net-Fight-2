import { EventEmitter } from "modules/EventEmitter/EventEmitter";

type PossibleEvent = 'fPress' | 'moveRight' | 'moveLeft' | 'jump'
export const controlsEmitter = new EventEmitter<PossibleEvent>()

document.addEventListener('keypress', (evt) => {
  if (evt.code === 'KeyF') {
    controlsEmitter.emit('fPress')
  }
  if (evt.code === 'KeyA') {
    controlsEmitter.emit('moveLeft')
  }
  if (evt.code === 'KeyD') {
    controlsEmitter.emit('moveRight')
  }
  if (evt.code === 'KeyW') {
    controlsEmitter.emit('jump')
  }
})