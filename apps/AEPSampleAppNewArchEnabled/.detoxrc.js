const path = require('path');

/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: path.resolve(__dirname, '../../e2e-test/jest.config.js')
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/AEPSampleAppNewArchEnabled.app',
      build: 'cd ios && xcodebuild -workspace AEPSampleAppNewArchEnabled.xcworkspace -scheme AEPSampleAppNewArchEnabled -configuration Debug -sdk iphonesimulator -derivedDataPath ./build'
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/AEPSampleAppNewArchEnabled.app',
      build: 'cd ios && xcodebuild -workspace AEPSampleAppNewArchEnabled.xcworkspace -scheme AEPSampleAppNewArchEnabled -configuration Release -sdk iphonesimulator -derivedDataPath ./build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew :app:assembleDebug :app:assembleDebugAndroidTest -DtestBuildType=debug',
      reversePorts: [
        8081
      ]
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew :app:assembleRelease :app:assembleReleaseAndroidTest -DtestBuildType=release',
      reversePorts: [
        8081
      ]
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 16e'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_9'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release'
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug'
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    }
  }
};

