// https://www.npmjs.com/package/pigpio
// https://www.waveshare.com/wiki/RPi_Motor_Driver_Board
// Interface	wiringPi	BCM
// M1	P28	20
// M2	P29	21
// PWMA	P25	26
// M3	P22	6
// M4	P23	13
// PWMB	P26	12

const Gpio = require('pigpio').Gpio
const M1 = new Gpio(20, {mode: Gpio.OUTPUT})
const M2 = new Gpio(21, {mode: Gpio.OUTPUT})
const PWMA = new Gpio(26, {mode: Gpio.OUTPUT}).pwmRange(1000)
const MAX_SPEED_UNITS = PWMA.getPwmRange()
const MAX_SPEED = Math.round(MAX_SPEED_UNITS / 10)
const MIN_SPEED = 0
const FORWARD = 'forward'
const BACKWARD = 'backward'
let _dutyDirection = null
let _pwmDutyCycle = 0
forward()


function _dutyCycle(duty, absDuty){
  if(isNaN(duty) && isNaN(absDuty)) return Math.round(_pwmDutyCycle / 10)
  let _newDuty = _pwmDutyCycle
  if(!isNaN(absDuty)){
    _newDuty = absDuty * 10
  } else if(!isNaN(duty)){
    _newDuty = _newDuty + (duty * 10)
  } else {
    throw 'motor: duty NaN'
  }
  console.info(`motor: ${_pwmDutyCycle} -> ${_newDuty}`)
  PWMA.pwmWrite(_newDuty)
  _pwmDutyCycle = _newDuty
  return Math.round(_pwmDutyCycle / 10)
}

function speed(addSubAmount){
  const _speed = _dutyCycle()
  if(isNaN(addSubAmount)) return _speed
  const _addSubAmount = Math.round(addSubAmount)
  const _newSpeed = _speed + _addSubAmount
  if(!isValidSpeed(_newSpeed)) throw `motor: invalid speed ${_newSpeed}`
  return _dutyCycle(_addSubAmount)
}

function stop(){
  console.info('motor: stop')
  return _dutyCycle(undefined, MIN_SPEED)
}

function fullSpeed(){
  console.info('motor: full speed')
  return _dutyCycle(undefined, MAX_SPEED)
}


function forward(){
  console.info('motor: forward')
  _dutyDirection = FORWARD
  M1.digitalWrite(1)
  M2.digitalWrite(0)
  return _dutyDirection
}

function backward(){
  console.info('motor: backward')
  _dutyDirection = BACKWARD
  M1.digitalWrite(0)
  M2.digitalWrite(1)
  return _dutyDirection
}

function direction(forwardBackward){
  if(forwardBackward === undefined) return _dutyDirection
  if(forwardBackward === BACKWARD){
    console.info(BACKWARD)
    backward()
  } else {
    console.info(FORWARD)
    forward()
  }
  return _dutyDirection
}

function isValidDirection(direction){
  return [FORWARD,BACKWARD].includes(direction)
}

function isValidSpeed(speed){
  return !isNaN(speed) && speed >= MIN_SPEED && speed <= MAX_SPEED
}

function getMotionInfo(){
  return { direction: _dutyDirection, speed: speed() }
}

module.exports = {
  getMotionInfo,
  forward, backward, speed, direction, stop, fullSpeed,
  isValidDirection, isValidSpeed,
  FORWARD, BACKWARD, MIN_SPEED, MAX_SPEED
}