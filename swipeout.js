/*
  Constructor Function for Applying gestures to a panel
  and moving it in a single direction horizontally,
  out of view.
 */

SwipeOut = function(options) {
  // set options
  this.el = options.node; // Dom element
  this.direction = options.dir; // left or right
  this.threshold = 100 / options.threshold; // percentage

  //  callbacks
  this.startCb = options.startCb;
  this.updateCb = options.updateCb;
  this.endCb = options.endCb;
  this.completeCb = options.completeCb;

  // manage state
  this.touchStartPositionX = 0;
  this.touchEndtPosition = 0;
  this.translateX = 0;
  this.sliding = false;
  this.canUpdate = false;

  // physics
  this.startTime = null;
  this.endTime = null;
  this.distance = 0;
  this.duration = 0;
  this.velocity = 0;
  this.elWidth = 0;
};



/*

  UTILITY
   - checkDirection
   - resetState
   - runCallback

 */

// Check that the calback is a function and call it
SwipeOut.prototype.runCallback = function(callback, args) {
  if (callback && typeof(callback) === 'function') {
    callback();
  }
};

// check that we're moving horizontally
SwipeOut.prototype.checkHorizontal = function(touch) {
  return (this.direction === 'left' && touch.clientX < this.touchStartPositionX) ||
       (this.direction === 'right' && touch.clientX > this.touchStartPositionX);
};

// reset the state of the element
SwipeOut.prototype.resetState = function() {
  this.canUpdate = false;
  this.el.style.transition = '';
  this.el.style.transform = '';
};



/*

  ANIMATION
   - setupAnimation
   - runAnimation
   - update

 */

 // calculate the speed per frame
 SwipeOut.prototype.setupAnimation = function(event) {
    // assuming 60fps get the distance per frame
   this.velocity = this.distance / (this.duration / 16.666666667);

   // run the animation if we're moving fast enough
   return (this.velocity > 4) ? this.runAnimation() : this.resetState();
 };

 // trigger the accellerated animation
 SwipeOut.prototype.runAnimation = function() {
   var _this = this;
   // if we've moved further than the width of the element
   if (Math.abs(this.translateX) < (+this.elWidth*1.2) ) {
     // accelerate and update position
     this.velocity = this.velocity*1.15;
     this.translateX = (this.direction === 'left') ? this.translateX - this.velocity : this.translateX + this.velocity;

     requestAnimationFrame(function() {
       _this.runAnimation();
       _this.update();
     });
   } else {

     // remove styles set and run callback
     this.resetState();
     this.runCallback(this.completeCb);

   }
 };

 // update the translate position
 SwipeOut.prototype.update = function() {
   if (!this.canUpdate)
     return;

   this.el.style.transform = 'translate3d(' + this.translateX + 'px,0,0)';
   this.runCallback(this.updateCb);
 };



/*

  EVENT HANDLERS
   - _begin - ontouchstart
   - end - ontouchend and ontouchcancel
   - move - ontouchmove

 */

// touch start handler
SwipeOut.prototype.begin = function(event) {
  this.sliding = true;
  this.canUpdate = true;
  this.startTime = Date.now();

  var touch = event.touches[0] ||
              event.changedTouches[0];

  // this makes too many assumptions TODO : get body width
  this.elWidth = +  this.el.getBoundingClientRect().width * 1.1;
  this.touchStartPositionX = touch.clientX;

  // Override any transition to ensure movement is smooth
  this.el.style.transition = 'none';
  this.runCallback(this.startCb);
};

// touch end handler
SwipeOut.prototype.end = function(event) {
  var touch = event.touches[0] ||
              event.changedTouches[0];

  // record that we've stopped sliding
  this.sliding = false;
  this.endTime = Date.now();
  this.touchEndPositionX = touch.clientX;
  this.distance = Math.abs(this.touchStartPositionX - this.touchEndPositionX);
  this.duration = Math.abs(this.endTime - this.startTime);

  // if we've moved far enough
  if ((this.distance > 30 && this.duration > 50) &&
      Math.abs(this.distance) > (this.elWidth / 3)) {
    // calculate velocity and trigger the accellerated exit
    this.setupAnimation();
  } else {
    // remove styles set
    this.resetState();
  }

  this.runCallback(this.endCb);
};

// touch move handler
SwipeOut.prototype.move = function(event) {
  var _this = this;
  var touch = event.touches[0] ||
              event.changedTouches[0];
  this.translateX = touch.clientX - this.touchStartPositionX;

  if (this.checkHorizontal(touch) && this.sliding) {
      requestAnimationFrame(function() {
        _this.update();
      });
    }

};



/*

  EVENTS
   - Listen - add the event listeners to the main obj
   - stopEvents - remove the event listeners.

 */

// attach event listeners
SwipeOut.prototype.listen = function() {
  /*
    Using the Object Proxy pattern to allow binding the parent context
    to the event handler functions, as they need access to the props
    and methods defined on the protoype.
  */
  this.el.addEventListener('touchstart', function(e) {
    this.begin(event);
  }.bind(this), false);
  this.el.addEventListener('touchend', function(e) {
    this.end(event);
  }.bind(this), false);
  this.el.addEventListener('touchcancel', function(e) {
    this.end(event);
  }.bind(this), false);
  this.el.addEventListener('touchmove', function(e) {
    this.move(event);
  }.bind(this), false);

};

// remove all the event listeners
SwipeOut.prototype.stopEvents = function() {
  this.el.removeEventListener('touchstart', this.begin, false);
  this.el.removeEventListener('touchend', this.end, false);
  this.el.removeEventListener('touchcancel', this.end, false);
  this.el.removeEventListener('touchmove', this.move, false);
};