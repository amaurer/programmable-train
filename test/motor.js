const assert = require('assert')
const MOTOR = require('../lib/motor.js')
const { MAX_SPEED, MIN_SPEED, FORWARD, BACKWARD } = MOTOR
const { sleep } = require('../lib/utils.js')

let testSpeed = MAX_SPEED / 2
let processing = true

const interval = setInterval(() => {processing}, 1000)

// process.on('exit', async () => { 
//   console.info('stopping')
//   await MOTOR.stop() 
// }) 

;(async () => {
  assert(!isNaN(MIN_SPEED) && MIN_SPEED >= 0, 'MIN_SPEED Should be a number and GTE zero')
  assert(!isNaN(MAX_SPEED) && MAX_SPEED > MIN_SPEED, 'MAX_SPEED Should be a number')
  assert(FORWARD === 'forward', 'FORWARD Invalid')
  assert(MOTOR.isValidSpeed(MAX_SPEED), 'should allow MAX_SPEED')
  assert(MOTOR.isValidSpeed(MIN_SPEED), 'should allow MIN_SPEED')

  await t(done => {
    const {direction, speed} = MOTOR.getMotionInfo()
    assert(direction === FORWARD, 'should be going forward')
    assert(speed === MIN_SPEED, 'should be stopped')
    done()
  })

  // TRY FORWARD
  console.warn('TESTING DIRECTION')

  await t(done => {
    MOTOR.forward()
    const { direction } = MOTOR.getMotionInfo()
    assert(direction === FORWARD, 'should be going forward')
    done()
  })

  await t(done => {
    MOTOR.backward()
    const { direction } = MOTOR.getMotionInfo()
    assert(direction === BACKWARD, 'should be going backward')
    done()
  })

  await t(done => {
    const _direction = MOTOR.direction(FORWARD)
    const direction = MOTOR.direction()
    assert(direction === _direction, 'should be going forward')
    assert(direction === FORWARD, 'should be going forward')
    done()
  })

  await t(done => {
    const _direction = MOTOR.direction(BACKWARD)
    const direction = MOTOR.direction()
    assert(direction === _direction, 'should be going backward')
    assert(direction === BACKWARD, 'should be going backward')
    done()
  })



  console.warn('TESTING SPEED')
  MOTOR.forward()

  await t(async done => {
    const speed = MOTOR.speed(testSpeed)
    await sleep(1000)
    assert(speed === testSpeed, 'should be going correct speed')
    done()
  })

  await t(async done => {
    const speed = MOTOR.stop()
    await sleep(1000)
    assert(speed === MIN_SPEED, 'should stop')
    done()
  })

  await t(async done => {
    const speed = MOTOR.speed(40.34)
    await sleep(1000)
    assert(speed === 40, 'should handle odd number')
    MOTOR.stop()
    done()
  })


  await t(async done => {
    try {
      MOTOR.speed(1140.34)
      throw 'didn\'t throw with high speed'
    } catch(e){
      console.log(`${e}`)
      assert(e.toString().includes('invalid'), 'should throw high speed')
    }
    done()
  })

  await t(async done => {
    const speed = MOTOR.stop()
    await sleep(1000)
    assert(speed === MIN_SPEED, 'should stop')
    done()
  })



  console.warn('TESTING REVERSE')
  MOTOR.backward()

  await t(async done => {
    const speed = MOTOR.fullSpeed()
    await sleep(1000)
    assert(speed === MAX_SPEED, 'should be full speed')
    done()
  })

  await t(async done => {
    const speed = MOTOR.stop()
    await sleep(1000)
    assert(speed === MIN_SPEED, 'should stop')
    done()
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