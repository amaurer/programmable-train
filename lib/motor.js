// https://www.npmjs.com/package/pigpio
// https://www.waveshare.com/wiki/RPi_Motor_Driver_Board
// Interface	wiringPi	BCM
// M1	P28	20
// M2	P29	21
// PWMA	P25	26
// M3	P22	6
// M4	P23	13
// PWMB	P26	12

const { sleep, percent } = require('./utils.js')
const Gpio = require('pigpio').Gpio;
const M1 = new Gpio(20, {mode: Gpio.OUTPUT});
const M2 = new Gpio(21, {mode: Gpio.OUTPUT});
const PWMA = new Gpio(26, {mode: Gpio.OUTPUT});
const MIN_SPEED = 0
const MAX_SPEED = PWMA.getPwmRange()
const SPEED_STEP_MS = 400
const FORWARD = 'forward'
const BACKWARD = 'backward'
let _dutyCycle = 0;
let _dutyDirection = FORWARD;


const motorEventEmitter = new require('events')();
motorEventEmitter.MIN_SPEED = MIN_SPEED
motorEventEmitter.MAX_SPEED = MAX_SPEED
motorEventEmitter.SPEED_STEP_MS = SPEED_STEP_MS
motorEventEmitter.FORWARD = FORWARD
motorEventEmitter.BACKWARD = BACKWARD
motorEventEmitter.stop = stop
motorEventEmitter.setSpeed = setSpeed
motorEventEmitter.setDirection = setDirection
motorEventEmitter.on('stop', stop)
motorEventEmitter.on('setSpeed', ({direction, speed}) => {
  setSpeed(direction, speed)
})
motorEventEmitter.on('setDirection', ({direction}) => {
  setDirection(direction)
})
motorEventEmitter.on('speedChanged', ({ direction, speed, percent }) => {
  console.info(`Speed Change: ${percent} at ${speed} ${direction}`)
})
motorEventEmitter.on('speedChangeComplete', ({ direction, speed, percent }) => {
  console.info(`Speed Change Complete: ${percent} at ${speed} ${direction}`)
})
motorEventEmitter.on('directionChangeComplete', ({ direction, speed, percent }) => {
  console.info(`Direction Change Complete: ${percent} at ${speed} ${direction}`)
})

const _motorControl = {
  forward(){
    console.info(`toDirection:forward`)
    _dutyDirection = FORWARD;
    M1.digitalWrite(1); 
    M2.digitalWrite(0); 
    motorEventEmitter.emit('directionChanged', getMotionInfo())
  },
  backward(){
    console.info(`toDirection:backward`)
    _dutyDirection = BACKWARD;
    M1.digitalWrite(0); 
    M2.digitalWrite(1);
    motorEventEmitter.emit('directionChanged', getMotionInfo())
  },
  speed(addSubAmount){
    _dutyCycle += addSubAmount
    PWMA.pwmWrite(_dutyCycle);
    motorEventEmitter.emit('speedChanged', getMotionInfo())
  }
}


const _speedControl = {
  async zero(){
    console.info(`toCycle:0`)
    while(_dutyCycle > MIN_SPEED){
      _motorControl.speed(-5)
      await sleep(SPEED_STEP_MS)
    }
  },
  async to(toCycle){
    if(toCycle === _dutyCycle) return
    console.info(`toCycle:${toCycle}`)
    if(toCycle < MIN_SPEED || toCycle > MAX_SPEED){
      return console.error(`Invalid speed ${speed}`)
    }
    let _speedStepDirection = 5
    if(toCycle < _dutyCycle){
      _speedStepDirection = -5
    }
    while(toCycle !== _dutyCycle){
      _motorControl.speed(_speedStepDirection)
      await sleep(SPEED_STEP_MS)
    }
  }
}

function getMotionInfo(){
  return { direction: _dutyDirection, speed: _dutyCycle, percent: percent(_dutyCycle, MAX_SPEED) }
}

async function setDirection(direction){
  // Verify input
  if(![FORWARD,BACKWARD].includes(direction)){
    return console.error(`Invalid direction ${direction}`)
  }
  const _currSpeed = _dutyCycle
  // Set Direction
  if(_currSpeed !== 0){
    await _speedControl.zero()
  }
  _motorControl[direction]()
  if(_currSpeed !== 0){
    await _speedControl.to(_currSpeed)
  }
  motorEventEmitter.emit('directionChangeComplete', getMotionInfo())
}

async function setSpeed(direction, speed){
  // Verify input
  if(![FORWARD,BACKWARD].includes(direction)){
    return console.error(`Invalid direction ${direction}`)
  }
  // Slow down before changing direction
  if(_dutyDirection !== direction){
    await _speedControl.zero()
  }
  // Set Direction
  _motorControl[direction]()
  await _speedControl.to(speed)
  motorEventEmitter.emit('speedChangeComplete', getMotionInfo())
}

async function stop(){
  await _speedControl.zero()
  motorEventEmitter.emit('speedChangeComplete', getMotionInfo())
}


module.exports = motorEventEmitter

// module.exports = {
//   setSpeed, stop,
//   FORWARD, BACKWARD, MIN_SPEED, MAX_SPEED, QUARTER_SPEED: MAX_SPEED / 4
// }