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
motorEventEmitter.on('stop', stop)
motorEventEmitter.on('setSpeed', ({direction, speed}) => {
  setSpeed(direction, speed)
})
motorEventEmitter.on('speedChanged', ({ speed, percent }) => {
  console.info(`Speed Change: ${percent} at ${speed}`)
})


const _motorControl = {
  forward(){
    direction = FORWARD;
    M1.digitalWrite(1); 
    M2.digitalWrite(0); 
  },
  backward(){
    direction = BACKWARD;
    M1.digitalWrite(0); 
    M2.digitalWrite(1); 
  },
  speed(addSubAmount){
    _dutyCycle += addSubAmount
    PWMA.pwmWrite(_dutyCycle);
    motorEventEmitter.emit('speedChanged', {
      speed: _dutyCycle, percent: percent(_dutyCycle, MAX_SPEED)
    })
  }
}


const _speedControl = {
  async zero(){
    console.log(`toCycle:0`)
    while(_dutyCycle > MIN_SPEED){
      _motorControl.speed(-5)
      await sleep(SPEED_STEP_MS)
    }
  },
  async to(toCycle){
    if(toCycle === _dutyCycle) return
    console.log(`toCycle:${toCycle}`)
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
}

async function stop(){
  await _speedControl.zero()
}


module.exports = motorEventEmitter

// module.exports = {
//   setSpeed, stop,
//   FORWARD, BACKWARD, MIN_SPEED, MAX_SPEED, QUARTER_SPEED: MAX_SPEED / 4
// }