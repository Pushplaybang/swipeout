# SwipeOut
Tiny touch library in vanilla javascript and CSS3, ideal for mobile UI interactions.


## Install
Simple install the package via atmosphere

```sh
meteor add pushplaybang:swipeout
```




## Getting Started : 
You'll first need to setup your CSS.  The library works using the css3 transform property, so your ideal styling should consist of having two states, opened and closed, here is example markup :

```html
<div class="appnavigation" id="appnavigation">
    <ul>
        <!-- menu items -->
    </ul>
</div>
```


Note, we're using the ID only for fast selection, not for styling (ever!). Heres our CSS :

```css
.appnavigation {
  /* GENERAL STYLE */
  will-change: transform;
  backface-visibility: hidden;
  position: fixed;
  background: #fff;
  width: 85%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 120;
  
  /* THE IMPORTANT PART  */
  transform: translate3d(-100%,0,0);
  transition: transform .325s;
}
.appnavigation.visible {
  transform: translate3d(0,0,0);
}
```


The library works via a simple constructor, as follows (run of course after the DOM element required has been rendered):

```js
var el = document.getElementById('appnavigation')
var navGestures = new swipeIt({
  // any js node, getElementById is the fastest
  node: el,
  // currently allows only 'left' or 'right'
  dir: 'left',
  // % of width movement thaht will trigger the callBack
  threshold: 45,  
  // a function to run if the element crosses the threshold
  completeCb: function() {
    //.. do whatever you want heres a common example:
    el.classList.remove('visible'); // ie9+
  }
}).listen(); // begin listening

```

**In Meteor Blaze: Do this is your templates onRendered callback**

##How it works
On the `touchstart` event, we disable to transition, and override the transform, updating the position based on the co-ordinates provided by the `touchmove` event. when the `touchend` or `touchcancel` event fires, we check whether we're beyond the threshold, if we are we fire the thresholdCb function, and remove the CSS overrides on the element.

### TODO
 - Detect prefixed transforms
 - add callbacks for each hanndler and 'update'
 - add Y axis movement
 - lock overflow Y when X movement, and viceversa
 - Test test test


### Contributions and Suggestions Welcome!
Have something you think this needs or could use as an improvement, let me know.  add [an issue on github]() or fork and create a pull request.



___


 ### License [MIT](https://opensource.org/licenses/MIT)
 Copyright (c) 2016 Paul van Zyl

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
