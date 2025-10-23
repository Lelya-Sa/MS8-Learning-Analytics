/**
 * Circuit Breaker Implementation
 * Provides resilience patterns for microservice calls
 */

class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.timeout = options.timeout || 5000;
    this.errorThreshold = options.errorThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttempt = null;
  }

  async fire(params) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker open');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await Promise.race([
        this.fn(params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), this.timeout)
        )
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.errorThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttempt: this.nextAttempt
    };
  }
}

module.exports = { CircuitBreaker };
