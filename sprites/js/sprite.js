/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();

/*!
 * jQuery Sprite Plugin v0.1
 *
 * Copyright 2011, Justen
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( $ ) {

  var SpriteSheet = function(json){
    
    var frames = [];

    this.currentFrame = 1;
    this.totalFrames = 1;
    this.frame = null;
    this.change = function(){};

    this.__construct__ = function(json){
      this.parse(json);
    }

    this.gotoFrame = function(int){

      if(this.frames.length > 0){
        
        var f = Math.max(1, Math.min(this.totalFrames, int));
              
        if(f !== this.currentFrame){
          
          this.currentFrame = f;
          this.frame = this.frames[f - 1];
          this.change();
        }
      }
    }

    this.parse = function(data){

      this.frames = [];
      this.totalFrames = data.frames.count;
      this.currentFrame = 1;
      
      var cols = data.width / data.frames.width;
      var rows = data.height / data.frames.height;
      
      if(rows > 0 || cols > 0){
        for(var i = 0; i < rows; i++){
          for(var j = 0; j < cols; j++){
            
            if(this.frames.length == data.frames.count){
              
              break;
            
            }else{

              var frame = {
                x: j * data.frames.width,
                y: i * data.frames.height,
                width: data.frames.width,
                height: data.frames.height
              };

              this.frames.push(frame);
            }
          }
        }

        this.frame = this.frames[0];
      }

      this.gotoFrame(1);
    }

    this.__construct__(json);
  }

  // STAGE ///////////////////////////////////////////////////////////////////

  var Stage = (function(){

    var instance;

    function __construct__(){

      this.items = [];
      this.tickInterval = setInterval($.proxy(enterFrame, this), 32);
      //this.tickInterval = setInterval($.proxy(enterFrame, this), 200);

      return {
        add: function(obj){
          add(obj);
        }
      }
    };

    function enterFrame(){

      for(var i = 0; i < this.items.length; i++){
        this.items[i].render();
      }
    };

    function add(obj){
      
      //be sure the object registering has the
      //appropriate handler
      
      if(obj.render){
      this.items.push(obj);

      }else{
        throw 'Missing render on object register.';
      }
    };

    return {

      getInstance: function(){
        if (!instance)
          instance = __construct__();

        return instance; 
      }
    }
  })();

  // MOVIECLIP ///////////////////////////////////////////////////////////////

  var MovieClip = Class.extend({
    
    currentFrame: 1,
    totalFrames: 1,

    init: function(json){

      this.stage = Stage.getInstance().add(this);
      this.sprite = new SpriteSheet(json);
      this.totalFrames = this.sprite.totalFrames;
      this._isPlaying = false;
      this._targetFrame = -1;
      this.update = function(){};
    },

    render: function(){
      
      this.currentFrame = this.sprite.currentFrame;

      //check to see if there is a new frame waiting
      //to be rendered before just playing the next
      //frame in the sequence.

      if(this._targetFrame != -1){
      
        this.sprite.gotoFrame(this._targetFrame);
        this._targetFrame = -1;
        
      }else{

        if(this._isPlaying)
          this.sprite.gotoFrame(this.currentFrame + 1);
      }


      //this is the lamest thing... I trigger our callback
      //at the end of the enter, should be more like Flash with
      //events that support multiple listeners...

      this.update();
    },

    play: function(){
      this._isPlaying = true;
    },

    stop: function(){
      this._isPlaying = false;
    },

    nextFrame: function(){
      this._targetFrame = this.sprite.currentFrame + 1;
    },

    prevFrame: function(){
      this._targetFrame = this.sprite.currentFrame - 1;
    },

    gotoAndPlay: function(int){
      this._targetFrame = int;
      this.play();
    },

    gotoAndStop: function(int){
      this._targetFrame = int;
      this.stop();
    },
  });

  var Spritz = MovieClip.extend({
      
    el: null,
    
    init: function(el, json){
      this._super(json);
      this.el = el;
      this.el.css('background-size', json.width + 'px' + ' ' + json.height + 'px');
      this.el.css('background-repeat', 'no-repeat');
      this.el.css('background-position', '0 0');

      this.render();
    },

    render: function(){

      this._super();

      var tx = -this.sprite.frame.x + 'px';
      var ty = -this.sprite.frame.y + 'px';
      
      //TODO add support for changing texture based
      //on frame data.
      this.el.css('background-position', tx + ' ' + ty)
    }
  })

  var PlayOnce = Spritz.extend({

    stopMe: false,

    render: function(){

      this._super();
      
      switch(this.sprite.currentFrame){
        
        case 1:
          
          if(this.stopMe){
            this.stopMe = false;
            this.stop(true);
          }

          break;

        case this.sprite.totalFrames:
          
          this.gotoAndPlay(1);
          break;
      }
    },

    stop: function(stopImmediatly){
      if(!stopImmediatly) {
        this.stopMe = true;
      }else{
        this._super();
      }
    }
  })

  // PLUGIN //////////////////////////////////////////////////////////////////

  $.fn.spritz = function(json){
    
    this.mc = new PlayOnce(this, json);

    this.play = function(){
      this.mc.play();
      this.mc.stop();
    }

    return this;
  };

})( jQuery );