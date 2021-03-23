import Simctl from 'node-simctl';

export default {
  simctl: null,
  devices: [],
  currentDevices: {},

  // Multiple browsers support
  isMultiBrowser: true,

  // Required
  // ---
  async openBrowser(id, pageUrl, browserName) {
    const device = this.getDevice(browserName);
    if (!device) {
      throw new Error('Could not find a valid iOS device to test on');
    }
    this.currentDevices[id] = device;
    this.simctl.udid = device.udid;
    if (device.state !== 'Shutdown') {
      await this.simctl.shutdown(device.udid);
    }
    await this.simctl.bootDevice();
    await this.simctl.startBootMonitor({ timeout: 120000 });
    await this.simctl.openUrl(pageUrl);
  },

  async closeBrowser(id) {
    await this.simctl.shutdownDevice();
    this.currentDevices[id] = null;
  },

  // Optional
  // ---
  async init() {
    if (!this.simctl) {
      this.simctl = new Simctl();
    }
    // We don't run tests on tvOS or watchOS, so only include iOS devices
    const { devices, runtimes } = await this.simctl.list();
    const iOSRuntimes = runtimes.filter(runtime => /iOS/i.test(runtime.name));
    iOSRuntimes.forEach(runtime => {
      const identifier = runtime.identifier;
      if (devices[identifier] && !this.devices.find(d => d.identifier === identifier)) {
        this.devices.push({
          runtime,
          devices: devices[identifier]
        });
      }
    });
    if (this.devices.length > 1) {
      this.devices.sort((a, b) => {
        const v1 = a.runtime.version.replace('.', '');
        const v2 = b.runtime.version.replace('.', '');
        return parseFloat(v2) - parseFloat(v1);
      });
    }
  },

  // Browser names handling
  async getBrowserList() {
    const list = [];
    this.devices.forEach(({ runtime, devices }) => {
      const name = runtime.name;
      devices.forEach(device => {
        list.push(`${device.name}:${name}`);
      });
    });
    return list;
  },

  async isValidBrowserName(browserName) {
    return this.getDevice(browserName) !== null;
  },

  // Extra methods
  async resizeWindow(/* id, width, height, currentWidth, currentHeight */) {
    this.reportWarning('The window resize functionality is not supported by the "idevices" browser provider.');
  },

  async takeScreenshot(/* id, screenshotPath, pageWidth, pageHeight */) {
    await this.simctl.getScreenshot();
  },

  getDevice(browserName) {
    const parts = browserName.split(':');
    let deviceName = parts[0];
    let platform = parts[1];
    if (!deviceName) return null;
    let devices = [];
    if (platform) {
      platform = this.devices.find(d => d.runtime.name === platform);
      if (!platform) return null;
      devices = platform.devices;
    } else {
      devices = this.devices[0].devices;
    }
    let device = null;
    // Auto select device
    if (/iPhone Simulator/i.test(deviceName)) {
      for (const d of devices) {
        if (/iPhone/i.test(d.name)) {
          device = d;
        }
      }
    } else if (/iPad Simulator/i.test(deviceName)) {
      for (const d of devices) {
        if (/iPad/i.test(d.name)) {
          device = d;
        }
      }
    } else if (/iPod Simulator/i.test(deviceName)) {
      for (const d of devices) {
        if (/iPod/i.test(d.name)) {
          device = d;
        }
      }
    }
    return device;
  }
};
