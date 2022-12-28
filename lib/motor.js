// https://www.npmjs.com/package/pigpio
// https://www.waveshare.com/wiki/RPi_Motor_Driver_Board
// Interface	wiringPi	BCM
// M1	P28	20
// M2	P29	21
// PWMA	P25	26
// M3	P22	6
// M4	P23	13
// PWMB	P26	12

const { percent } = require('./utils.js')
const Gpio = require('pigpio').Gpio
const M1 = new Gpio(20, {mode: Gpio.OUTPUT})
const M2 = new Gpio(21, {mode: Gpio.OUTPUT})
const PWMA = new Gpio(26, {mode: Gpio.OUTPUT})
const MIN_SPEED = 0
PWMA.pwmRange(1000)
const MAX_SPEED = PWMA.getPwmRange()
const FORWARD = 'forward'
const BACKWARD = 'backward'
let _dutyCycle = 0
let _dutyDirection = FORWARD
forward()

function forward(){
  console.info('direction: forward')
  _dutyDirection = FORWARD
  M1.digitalWrite(1) 
  M2.digitalWrite(0) 
}

function backward(){
  console.info('direction: backward')
  _dutyDirection = BACKWARD
  M1.digitalWrite(0) 
  M2.digitalWrite(1)
}

function direction(forwardBackward){
  if(forwardBackward === undefined) return _dutyDirection
  if(forwardBackward === BACKWARD){
    backward()
  } else {
    forward()
  }
  return _dutyDirection
}

function speed(addSubAmount){
  if(addSubAmount === undefined) return _dutyCycle
  _dutyCycle += addSubAmount
  console.info(`dutyCycle: ${_dutyCycle}`)
  PWMA.pwmWrite(_dutyCycle)
  return _dutyCycle
}

function stop(){
  _dutyCycle = MIN_SPEED
  console.info(`stop: ${_dutyCycle}`)
  PWMA.pwmWrite(_dutyCycle)
}

function fullSpeed(){
  _dutyCycle = MAX_SPEED
  console.info(`fullSpeed: ${_dutyCycle}`)
  PWMA.pwmWrite(_dutyCycle)
}

function isValidDirection(direction){
  return [FORWARD,BACKWARD].includes(direction)
}

function isValidSpeed(speed){
  return speed >= MIN_SPEED && speed <= MAX_SPEED
}

function getMotionInfo(){
  return { direction: _dutyDirection, speed: _dutyCycle, percent: percent(_dutyCycle, MAX_SPEED) }
}

module.exports = {
  getMotionInfo,
  forward, backward, speed, direction, stop, fullSpeed,
  isValidDirection, isValidSpeed,
  FORWARD, BACKWARD, MIN_SPEED, MAX_SPEED
}