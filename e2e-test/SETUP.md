# Detox E2E Testing Setup Guide

This guide will help you set up and run Detox E2E tests for the ContentCardsView features.

## Prerequisites

### 1. Install Detox CLI globally
```bash
npm install -g detox-cli
```

### 2. Install dependencies
```bash
cd /Users/cacheung/mobilesdk/containerWithUITest/aepsdk-react-native/apps/AEPSampleAppNewArchEnabled
yarn install
# or
npm install
```

### 3. Generate native projects (Expo)
Since this is an Expo project, you need to generate the native iOS and Android folders:

```bash
npx expo prebuild
```

This will create the `ios/` and `android/` directories with the necessary native code.

## iOS Setup

### 1. Install iOS dependencies

```bash
cd ios
pod install
cd ..
```

### 2. Configure iOS for Detox

The `.detoxrc.js` is already configured. You need to ensure:

- **Xcode** is installed (preferably latest version)
- **iOS Simulator** is available
- The simulator device matches the one in `.detoxrc.js` (iPhone 15 Pro)

### 3. Verify iOS Simulator

Open Simulator and create an iPhone 15 Pro simulator if you don't have one:
```bash
open -a Simulator
```

Then in Xcode: `Window > Devices and Simulators`

### 4. Build the iOS app for Detox

```bash
npm run detox:build:ios
```

### 5. Run iOS tests

```bash
npm run detox:test:ios
```

## Android Setup

### 1. Install Android dependencies

Ensure you have:
- **Android Studio** installed
- **Android SDK** installed
- **Java JDK** (version 11 or higher)
- **ANDROID_HOME** environment variable set

### 2. Set up Android environment variables

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then reload:
```bash
source ~/.zshrc  # or ~/.bash_profile
```

### 3. Create Android Virtual Device (AVD)

The `.detoxrc.js` expects an AVD named `Pixel_7_API_34`. Create it using Android Studio or command line:

**Using Android Studio:**
1. Open Android Studio
2. Go to `Tools > Device Manager`
3. Click `Create Device`
4. Select `Pixel 7`
5. Select API Level 34 (Android 14)
6. Name it `Pixel_7_API_34`
7. Finish

**Using command line:**
```bash
# List available system images
sdkmanager --list | grep system-images

# Install Android 14 (API 34) system image if not installed
sdkmanager "system-images;android-34;google_apis;x86_64"

# Create AVD
avdmanager create avd -n Pixel_7_API_34 -k "system-images;android-34;google_apis;x86_64" -d pixel_7
```

### 4. Configure Android for Detox

Add Detox configuration to your Android project:

**android/build.gradle** - Ensure you have these in `allprojects > repositories`:
```gradle
allprojects {
    repositories {
        maven {
            url "$rootDir/../node_modules/detox/Detox-android"
        }
    }
}
```

**android/app/build.gradle** - Add in `dependencies`:
```gradle
androidTestImplementation('com.wix:detox:+')
```

**android/app/src/androidTest/java/com/your/app/DetoxTest.java** - Create this file:
```java
package com.adobe.marketing.mobile.messagingsample;

import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {
    @Rule
    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

    @Test
    public void runDetoxTests() {
        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
        detoxConfig.rnContextLoadTimeoutSec = (com.adobe.marketing.mobile.messagingsample.BuildConfig.DEBUG ? 180 : 60);

        Detox.runTests(mActivityRule, detoxConfig);
    }
}
```

### 5. Build the Android app for Detox

```bash
npm run detox:build:android
```

### 6. Run Android tests

```bash
npm run detox:test:android
```

## Running Tests

### Full E2E Test Suite

**iOS:**
```bash
npm run e2e:ios
```

**Android:**
```bash
npm run e2e:android
```

### Run Specific Test Files

**Mock Data Tests:**
```bash
# iOS
detox test -c ios.sim.debug e2e/contentCards.mock.test.ts

# Android
detox test -c android.emu.debug e2e/contentCards.mock.test.ts
```

**API Integration Tests:**
```bash
# iOS
detox test -c ios.sim.debug e2e/contentCards.api.test.ts

# Android
detox test -c android.emu.debug e2e/contentCards.api.test.ts
```

### Run Tests in Watch Mode

```bash
detox test -c ios.sim.debug --watch
```

## Test Structure

### Test Files

- **e2e/contentCards.mock.test.ts** - Tests using mock data
  - Navigation tests
  - View type selection
  - Theme switching
  - Template switching
  - Content card rendering with mock data
  - Theme and template combinations

- **e2e/contentCards.api.test.ts** - Tests using real API integration
  - Remote content fetching
  - Track action functionality
  - Content refresh
  - Real-time updates
  - Error handling

### Helper Functions

All helper functions are in `e2e/helpers.ts`:
- `navigateToContentCards()` - Navigate to ContentCardsView
- `selectViewType()` - Select a view type
- `switchTheme()` - Switch between themes
- `switchTemplate()` - Switch between templates
- `trackAction()` - Track an action
- `verifyContentCardContainerVisible()` - Verify container is visible
- `verifyEmptyStateVisible()` - Verify empty state

## Troubleshooting

### iOS Issues

**Issue: "Could not find iPhone 15 Pro simulator"**
```bash
# List available simulators
xcrun simctl list devices

# Create iPhone 15 Pro simulator
xcrun simctl create "iPhone 15 Pro" "com.apple.CoreSimulator.SimDeviceType.iPhone-15-Pro"
```

**Issue: "RCTBridge required dispatch_sync to load RCTDevLoadingView"**
- This is usually harmless but can be avoided by building in Release mode

**Issue: Pod install fails**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Issues

**Issue: "Could not find AVD Pixel_7_API_34"**
- Follow the AVD creation steps above
- Or update `.detoxrc.js` with your AVD name:
  ```bash
  # List available AVDs
  emulator -list-avds
  ```

**Issue: "Android build fails"**
```bash
cd android
./gradlew clean
cd ..
npm run detox:build:android
```

**Issue: "Detox timed out"**
- Increase timeout in `e2e/jest.config.js`
- Ensure emulator is running before tests
- Check Metro bundler is running

### General Issues

**Issue: "Cannot find module 'detox'"**
```bash
rm -rf node_modules
yarn install  # or npm install
```

**Issue: "Tests are flaky"**
- Increase timeouts in tests
- Ensure device/emulator is not overloaded
- Run tests with `--reuse` flag to reuse existing app instance

**Issue: "Metro bundler issues"**
```bash
# Reset metro cache
npx react-native start --reset-cache
```

## Screenshots

Screenshots are automatically captured during test runs and saved to:
- iOS: `e2e/artifacts/ios/`
- Android: `e2e/artifacts/android/`

## Best Practices

1. **Always reload between tests** - Done automatically in `setup.ts`
2. **Use testID props** - All interactive elements have testIDs
3. **Wait for elements** - Use `waitFor()` with appropriate timeouts
4. **Take screenshots** - Helps debug failing tests
5. **Run tests on CI** - Configure for continuous integration

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  ios-e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: |
          cd apps/AEPSampleAppNewArchEnabled
          npm install
      - name: Run iOS E2E tests
        run: |
          cd apps/AEPSampleAppNewArchEnabled
          npm run e2e:ios

  android-e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: |
          cd apps/AEPSampleAppNewArchEnabled
          npm install
      - name: Run Android E2E tests
        run: |
          cd apps/AEPSampleAppNewArchEnabled
          npm run e2e:android
```

## Next Steps

1. Run `npm install` to install Detox
2. Run `npx expo prebuild` to generate native folders
3. Follow iOS or Android setup above
4. Build the app for your platform
5. Run the tests!

## Support

For more information:
- [Detox Documentation](https://wix.github.io/Detox/)
- [Expo Detox Guide](https://docs.expo.dev/guides/testing-with-detox/)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)

