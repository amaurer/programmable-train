const assert = require('assert')
const MOTOR = require('../lib/motor.js')


let testSpeed = MOTOR.MAX_SPEED / 2


;(async () => {



  // TRY FORWARD
  let direction = MOTOR.FORWARD

  await t(done => {
    const speed = testSpeed
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    const speed = MOTOR.MIN_SPEED
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    const speed = MOTOR.MAX_SPEED
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(MOTOR.MIN_SPEED === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    // Wait 1 sec
    setTimeout(() => {
      MOTOR.emit('stop')
    }, 1000)
  })



  // TRY REVERSE
  direction = MOTOR.BACKWARD

  await t(done => {
    const speed = testSpeed
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    const speed = MOTOR.MIN_SPEED
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    const speed = MOTOR.MAX_SPEED
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(MOTOR.MIN_SPEED === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    // Wait 1 sec
    setTimeout(() => {
      MOTOR.emit('stop')
    }, 1000)
  })
    


})()




function t(cb){
  return new Promise(cb)
}