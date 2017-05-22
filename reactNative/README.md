# Commands

- `watchman watch-del-all`
- `rm -rf node_modules && npm install`
- `rm -fr $TMPDIR/react-*`
- `node node_modules/react-native/local-cli/cli.js start --reset-cache`

- `watchman watch-del-all && rm -rf node_modules && npm install && rm -fr $TMPDIR/react-* && react-native run-ios --reset-cache`

### Common Errors / Bugs

- https://github.com/facebook/react-native/issues/4968
- `npm install --save react@16.0.0-alpha.6`: manually install, sometimes npm install does not install this properly

### NPM scripts

```
"scripts": {
  "start": "node node_modules/react-native/local-cli/cli.js start",
  "rc-start": "npm start -- --reset-cache",
  "clean": "rm -rf $TMPDIR/react-* && watchman watch-del-all && npm cache clean",
  "clean-start": "npm run clean && npm run rc-start",
  "fresh-install": "rm -rf $TMPDIR/react-* && watchman watch-del-all && rm -rf ios/build/ModuleCache/* && rm -rf node_modules/ && npm cache clean && npm install",
  "fresh-start" : "npm run fresh-install && npm run rc-start",
  "tron": "node_modules/.bin/reactotron"
}
```