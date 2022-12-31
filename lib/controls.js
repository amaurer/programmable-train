const _ = require('lodash')
const { sleep } = require('./utils.js')
const motor = require('./motor.js')
// const smoke = require('./smoke.js')
const SPEED_STEP_MS = 200
const SPEED_STEP_PERCENT = 1


const EventEmitter = require('events')
const motorEE = new EventEmitter()
motorEE.config = _.pick(motor, 'MIN_SPEED,MAX_SPEED,FORWARD,BACKWARD'.split(','))
motorEE.config.MAX_SPEED
motorEE.stop = stop
motorEE.fullSpeed = fullSpeed
motorEE.setSpeed = setSpeed
motorEE.setDirection = setDirection
motorEE.on('stop', stop)
motorEE.on('fullSpeed', fullSpeed)
motorEE.on('setSpeed', ({direction, speed}) => setSpeed(direction, speed))
motorEE.on('setDirection', ({direction}) => setDirection(direction))
motorEE.on('speedChanged', ({ direction, speed }) => {
  console.info(`Speed Change: ${speed} ${direction}`)
})
motorEE.on('speedChangeComplete', ({ direction, speed }) => {
  console.info(`Speed Change Complete: ${speed} ${direction}`)
})
motorEE.on('directionChangeComplete', ({ direction, speed }) => {
  console.info(`Direction Change Complete: ${speed} ${direction}`)
})


// Controls speed rate of change
async function _toSpeed(newSpeed){
  const _desired = Math.round(newSpeed)
  let _curr = motor.speed()
  const motorSpeed = motor.speed
  if(_desired === _curr) return
  if(_desired % SPEED_STEP_PERCENT !== 0) return
  let _wait = 0
  if(_desired < _curr){
    while(_desired < _curr) {
      _curr = await _sp(-SPEED_STEP_PERCENT)
    }
  } else {
    while(_desired > _curr) {
      _curr = await _sp(SPEED_STEP_PERCENT)
    }
  }
  async function _sp(_step){
    const _spd = motorSpeed(_step)
    await sleep(SPEED_STEP_MS + _wait)
    if(_spd < motor.MAX_SPEED * 0.20) _wait = 0
    if(_spd < motor.MAX_SPEED * 0.30) _wait = 1600
    else if(_spd < motor.MAX_SPEED * 0.40) _wait = 1200
    else if(_spd < motor.MAX_SPEED * 0.50) _wait = 150
    return motorSpeed()
  }
}


// Handlers
async function setDirection(direction){
  if(!motor.isValidDirection(direction)){
    return console.error(`Invalid direction ${direction}`)
  }
  if(motor.direction() === direction) return
  // Stop if in motion to change directions
  const _currSpeed = motor.speed()
  if(_currSpeed !== 0){
    await _toSpeed(motor.MIN_SPEED)
  }
  // Set Direction
  motor[direction]()
  motorEE.emit('directionChanged', motor.getMotionInfo())
  // If was in motion, continue to previously defined speed
  if(_currSpeed !== 0){
    await _toSpeed(_currSpeed)
  }
  motorEE.emit('directionChangeComplete', motor.getMotionInfo())
}

async function setSpeed(direction, speed){
  if(!motor.isValidDirection(direction)){
    return console.error(`Invalid direction ${direction}`)
  }
  if(!motor.isValidSpeed(speed)){
    return console.error(`Invalid speed ${speed}`)
  }
  // Slow down before changing direction
  if(motor.direction() !== direction){
    await _toSpeed(motor.MIN_SPEED)
  }
  // Set Direction
  motor[direction]()
  motorEE.emit('directionChanged', motor.getMotionInfo())
  // Set speed
  await _toSpeed(speed)
  motorEE.emit('speedChangeComplete', motor.getMotionInfo())
}

async function stop(){
  await motor.stop()
  motorEE.emit('speedChangeComplete', motor.getMotionInfo())
}
async function fullSpeed(){
  await motor.fullSpeed()
  motorEE.emit('speedChangeComplete', motor.getMotionInfo())
}

module.exports = motorEE
