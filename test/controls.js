const assert = require('assert')
const MOTOR = require('../lib/controls.js')
const { MAX_SPEED, MIN_SPEED, FORWARD, BACKWARD } = MOTOR.config

let testSpeed = MAX_SPEED / 2
let processing = true
console.info(`testSpeed ${testSpeed}`)

const interval = setInterval(() => {processing}, 1000)

// process.on('exit', async () => { 
//   console.info('exiting')
//   await MOTOR.stop() 
// }) 

;(async () => {
  assert(!isNaN(MIN_SPEED) && MIN_SPEED >= 0, 'MIN_SPEED Should be a number and GTE zero')
  assert(!isNaN(MAX_SPEED) && MAX_SPEED > MIN_SPEED, 'MAX_SPEED Should be a number')
  assert(FORWARD === 'forward', 'FORWARD Invalid')
  assert(BACKWARD === 'backward', 'BACKWARD Invalid')


  // TRY FORWARD
  let direction = FORWARD
  console.warn('TESTING FORWARD')

  await t(async done => {
    const speed = testSpeed
    console.info(`test speed ${speed}`)
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, `direction should be equal to set ${speedChanged.direction}`)
      assert(speed === speedChanged.speed, `speed should be equal to set ${speedChanged.speed}`)
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(async done => {
    const speed = MIN_SPEED
    console.info(`min speed ${speed}`)
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(async done => {
    const speed = MAX_SPEED
    console.info(`max speed ${speed}`)
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(async done => {
    console.info('stop speed')
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      console.info(`set speed ${MIN_SPEED} ${ speedChanged.speed}`)
      assert(MIN_SPEED === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    // Wait 1 sec
    MOTOR.emit('stop')
  })

  await t(async done => {
    console.info('full speed')
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(MAX_SPEED === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('fullSpeed')
  })



  // TRY REVERSE
  direction = BACKWARD
  console.warn('TESTING BACKWARD')

  await t(async done => {
    const speed = testSpeed
    console.info(`speed ${speed}`)
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(async done => {
    const speed = MIN_SPEED
    console.info(`speed ${speed}`)
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(async done => {
    const speed = MAX_SPEED
    console.info(`speed ${speed}`)
    MOTOR.once('speedChangeComplete', (speedChanged) => {
      assert(direction === speedChanged.direction, 'direction should be equal to set')
      assert(speed === speedChanged.speed, 'speed should be equal to set')
      done()
    })
    MOTOR.emit('setSpeed', { direction, speed })
  })

  await t(async done => {
    console.info('speed stop')
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
  return new Promise(res => {
    cb(res)
    console.info('complete')
  })
}