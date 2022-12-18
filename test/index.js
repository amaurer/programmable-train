const assert = require('assert');
const motor = require('../lib/motor.js');

describe('Motor', function () {



  describe('increase speeds', function () {
    
    it('should begin spinning the wheels', (done) => {
      const direction = motor.FORWARD
      const speed = 20
      motor.emit('setSpeed', { direction, speed })
      motor.on('speedChanged', (speedChanged) => {
        assert(speed <= speedChanged.speed, "speed should be less or equal to requested speed")
      })
      motor.on('speedChangeComplete', () => {
        assert(direction === speedChanged.direction, "direction should be equal to set")
        assert(speed === speedChanged.speed, "speed should be equal to set")
        motor.removeListener('speedChanged', this)
        done()
      })
    });

  });
  
});