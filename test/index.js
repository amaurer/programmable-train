const assert = require('assert');
const motor = require('../lib/motor.js');

describe('Motor', function () {

  describe('increase speeds', function () {
    
    it('should begin spinning the wheels', function () {
      const listener = motor.on('speedChanged', assert)
      motor.emit('setSpeed', { direction: motor.FORWARD, speed: 20 })
      motor.removeListener(listener)
    });

  });
  
});