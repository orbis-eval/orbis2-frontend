import mitt from 'mitt'

export default defineNuxtPlugin(() => {
  const emitter = mitt()

  return {
    provide: {
      busEmit: emitter.emit, // Will emit an event
      busListen: emitter.on // Will register a listener for an event
    }
  }
})