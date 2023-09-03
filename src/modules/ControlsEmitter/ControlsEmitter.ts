import { EventEmitter } from "modules/EventEmitter/EventEmitter";

type PossibleEvent = 'fPress' | 'moveRight' | 'moveLeft' | 'jump'
export const controlsEmitter = new EventEmitter<PossibleEvent>()

document.addEventListener('keypress', (evt) => {
  if (evt.key === 'f') {
    controlsEmitter.emit('fPress')
  }
  if (evt.key === 'a') {
    controlsEmitter.emit('moveLeft')
  }
  if (evt.key === 'd') {
    controlsEmitter.emit('moveRight')
  }
  if (evt.key === 'w') {
    controlsEmitter.emit('jump')
  }
  // console.log(evt);
})