const assert = require('assert')

describe('Motor', function () {
  this.timeout(20000)
  this.motor = require('../lib/motor.js')
  this.testSpeed = this.motor.MAX_SPEED / 3


  describe('forward', function () {
    const direction = 'forward'

    it('should begin spinning the wheels', (done) => {
      const speed = this.testSpeed
      this.motor.once('speedChangeComplete', (speedChanged) => {
        assert(direction === speedChanged.direction, 'direction should be equal to set')
        assert(speed === speedChanged.speed, 'speed should be equal to set')
        done()
      })
      this.motor.emit('setSpeed', { direction, speed })
    })

    it('should slow the wheels to a stop', (done) => {
      const speed = this.motor.MIN_SPEED
      this.motor.once('speedChangeComplete', (speedChanged) => {
        assert(direction === speedChanged.direction, 'direction should be equal to set')
        assert(speed === speedChanged.speed, 'speed should be equal to set')
        done()
      })
      this.motor.emit('setSpeed', { direction, speed })
    })

    it('should reverse max speed', (done) => {
      const speed = this.motor.MAX_SPEED
      this.motor.once('speedChangeComplete', (speedChanged) => {
        assert(direction === speedChanged.direction, 'direction should be equal to set')
        assert(speed === speedChanged.speed, 'speed should be equal to set')
        done()
      })
      this.motor.emit('setSpeed', { direction, speed })
    })

    it('should stop', (done) => {
      this.motor.once('speedChangeComplete', (speedChanged) => {
        assert(direction === speedChanged.direction, 'direction should be equal to set')
        assert(this.motor.MIN_SPEED === speedChanged.speed, 'speed should be equal to set')
        done()
      })
      // Wait 1 sec
      setTimeout(() => {
        this.motor.emit('stop')
      }, 1000)
    })


  })


  describe('reverse', function () {
    const direction = 'reverse'

    it('should begin spinning the wheels', (done) => {
      const speed = this.testSpeed
      this.motor.once('speedChangeComplete', (speedChanged) => {
        assert(direction === speedChanged.direction, 'direction should be equal to set')
        assert(speed === speedChanged.speed, 'speed should be equal to set')
        done()
      })
      this.motor.emit('setSpeed', { direction, speed })
    })

    it('should slow the wheels to a stop', (done) => {
      const speed = this.motor.MIN_SPEED
      this.motor.once('speedChangeComplete', (speedChanged) => {
        assert(direction === speedChanged.direction, 'direction should be equal to set')
        assert(speed === speedChanged.speed, 'speed should be equal to set')
        done()
      })
      this.motor.emit('setSpeed', { direction, speed })
    })

    it('should reverse max speed', (done) => {
      const speed = this.motor.MAX_SPEED
      this.motor.once('speedChangeComplete', (speedChanged) => {
        assert(direction === speedChanged.direction, 'direction should be equal to set')
        assert(speed === speedChanged.speed, 'speed should be equal to set')
        done()
      })
      this.motor.emit('setSpeed', { direction, speed })
    })

    it('should stop', (done) => {
      this.motor.once('speedChangeComplete', (speedChanged) => {
        assert(direction === speedChanged.direction, 'direction should be equal to set')
        assert(this.motor.MIN_SPEED === speedChanged.speed, 'speed should be equal to set')
        done()
      })
      // Wait 1 sec
      setTimeout(() => {
        this.motor.emit('stop')
      }, 1000)
    })
    

  })


})