/* eslint-disable */
Package.describe({
  name: 'pushplaybang:swipeout',
  version: '0.0.1',
  summary: 'Tiny touch library in vanilla javascript and CSS3, ideal for mobile UI interactions',
  git: '',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('es5-shim');
  api.use('ecmascript');
  api.use('pushplaybang:common-polyfills');
  api.addFiles('swipeout.js', 'client');
  api.export('SwipeOut', 'client');
});
