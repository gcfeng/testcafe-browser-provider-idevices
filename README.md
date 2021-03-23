# testcafe-browser-provider-idevices
<a href="https://www.npmjs.com/package/testcafe-browser-provider-idevices"><img alt="NPM Version" src="https://img.shields.io/npm/v/testcafe-browser-provider-idevices.svg" data-canonical-src="https://img.shields.io/npm/v/testcafe-browser-provider-idevices.svg" style="max-width:100%;"></a>

This is the **iOS Simulator** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

It allows you to launch the iOS simulator for automated testing in Mobile Safari. It uses `node-simctl` to interface
with the Simulator.

## Install

```
npm install --save-dev testcafe-browser-provider-idevices
```

## Usage


You can determine the available browser aliases by running
```
testcafe -b idevices
```

When you run tests from the command line, use the alias when specifying browsers:

```
testcafe idevices:device:os 'path/to/test/file.js'
```

where `device` is something like:
- `iPhone 8`
- `iPad Pro (11-inch) (2nd generation)`
- `iPad Simulator`
- `iPhone Simulator`

and `os` is something like:
- `iOS 14.4`

`os` is optional - if you exclude it then the most recent OS version will be chosen.

## Author
gcfeng (https://github.com/gcfeng/testcafe-browser-provider-idevices)
