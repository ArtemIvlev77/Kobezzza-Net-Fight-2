import "app/styles/init.css";
import { drawHomeScene } from "widgets/home-scene";
import { eventEmitter } from './modeules'

drawHomeScene();

// это просто проверил
const id = setInterval(() => {
  eventEmitter.emit('update')
}, 100)

eventEmitter.on('update', () => {
  console.log(1)
})

eventEmitter.on('update', () => {
  console.log(2)
})

eventEmitter.once('update', () => {
  console.log(20)
})

setTimeout(() => {
  eventEmitter.off('update')
  clearInterval(id)
}, 600)