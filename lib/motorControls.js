const _ = require('lodash')
const { sleep } = require('./utils.js')
const motor = require('./motor.js')
// TODO: Write scaling logic, slower steps near the end
const SPEED_STEP_MS = 400



const EventEmitter = require('events')
const motorEE = new EventEmitter()
motorEE.config = _.pick(motor, 'MIN_SPEED,MAX_SPEED,FORWARD,BACKWARD'.split(','))
motorEE.stop = stop
motorEE.setSpeed = setSpeed
motorEE.setDirection = setDirection
motorEE.on('stop', stop)
motorEE.on('setSpeed', ({direction, speed}) => {
  motor.setSpeed(direction, speed)
})
motorEE.on('setDirection', ({direction}) => {
  motor.setDirection(direction)
})
motorEE.on('speedChanged', ({ direction, speed, percent }) => {
  console.info(`Speed Change: ${percent} at ${speed} ${direction}`)
})
motorEE.on('speedChangeComplete', ({ direction, speed, percent }) => {
  console.info(`Speed Change Complete: ${percent} at ${speed} ${direction}`)
})
motorEE.on('directionChangeComplete', ({ direction, speed, percent }) => {
  console.info(`Direction Change Complete: ${percent} at ${speed} ${direction}`)
})


// Controls the motor speed rate of change
const _speedControl = {
  async zero(){
    const speed = motor.speed()
    while(speed > motor.MIN_SPEED){
      motor.speed(-5)
      await sleep(SPEED_STEP_MS)
    }
  },
  async to(newSpeed){
    const _currSpeed = motor.speed()
    const motorSpeed = motor.speed
    if(newSpeed === _currSpeed) return
    let _speedStepDirection = 5
    let multiplier = 0.1
    if(newSpeed < _currSpeed){
      _speedStepDirection = -5
      multiplier = -0.2
    }
    while(newSpeed !== motorSpeed()){
      motorSpeed(_speedStepDirection * multiplier)
      await sleep(SPEED_STEP_MS)
    }
  }
}


// Handlers
async function setDirection(direction){
  if(!motor.isValidDirection(direction)){
    return console.error(`Invalid direction ${direction}`)
  }
  const _currSpeed = motor.speed()
  // Set Direction
  if(_currSpeed !== 0){
    await _speedControl.zero()
  }
  motor[direction]()
  motorEE.emit('directionChanged', motor.getMotionInfo())
  if(_currSpeed !== 0){
    await _speedControl.to(_currSpeed)
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
    await _speedControl.zero()
  }
  // Set Direction
  motor[direction]()
  motorEE.emit('directionChanged', motor.getMotionInfo())
  // Set speed
  await _speedControl.to(speed)
  motorEE.emit('speedChangeComplete', motor.getMotionInfo())
}

async function stop(){
  await _speedControl.zero()
  motorEE.emit('speedChangeComplete', motor.getMotionInfo())
}

module.exports = motorEE
