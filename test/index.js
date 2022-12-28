const assert = require('assert')
const MOTOR = require('../lib/motorControls.js')
const { MAX_SPEED, MIN_SPEED, FORWARD, BACKWARD } = MOTOR.config

let testSpeed = MAX_SPEED / 2
let processing = true
console.log(MIN_SPEED)

const interval = setInterval(() => {
  console.info(`Processing: ${processing}`)
}, 1000)

process.on('exit', async () => { 
  console.info('stopping')
  await MOTOR.stop() 
}) 

;(async () => {

  assert(!isNaN(MIN_SPEED) && MIN_SPEED >= 0, 'MIN_SPEED Should be a number and GTE zero')
  assert(!isNaN(MAX_SPEED) && MAX_SPEED > MIN_SPEED, 'MAX_SPEED Should be a number')
  assert(FORWARD === 'forward', 'FORWARD Invalid')
  assert(BACKWARD === 'backward', 'BACKWARD Invalid')


  // TRY FORWARD
  let direction = FORWARD
  console.log('test')

  await t(done => {
    const speed = testSpeed
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      console.info('set speed once')

      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    console.info('set speed')
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    const speed = MIN_SPEED
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    const speed = MAX_SPEED
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
      assert(MIN_SPEED === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    // Wait 1 sec
    setTimeout(() => {
      MOTOR.emit('stop')
    }, 1000)
  })



  // TRY REVERSE
  direction = BACKWARD

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
    const speed = MIN_SPEED
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(done => {
    const speed = MAX_SPEED
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
      assert(MIN_SPEED === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    // Wait 1 sec
    setTimeout(() => {
      MOTOR.emit('stop')
    }, 1000)
  })
    
  processing = false
  clearInterval(interval)


})()




function t(cb){
  return new Promise(cb)
}