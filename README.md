# react-native-ttlock

Ttlock react native module

## Installation

```sh
npm install react-native-ttlock
```

## Usage

```js
import Ttlock from "react-native-ttlock";

// ...

const result = await Ttlock.multiply(3, 7);
```
#### Android

#1. AndroidManifest.xml configuration:
(1) Add 'xmlns:tools="http://schemas.android.com/tools"' 
    to <manifest> element
(2) Add 'tools:replace="android:label"' 
    to <application> element
(3) Additional permissions:
```  
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```
#2. In order to get the permission request result in ttlock plugin, in MainActivity extends ReactActivity, you need override the onRequestPermissionsResult method and 
add below code:
(1) java code
```
  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();

    TtlockModule ttlockModule = mReactInstanceManager.getCurrentReactContext().getNativeModule(TtlockModule.class);
    ttlockModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }
```
#3.When you release the apk, you need disable proguard in release builds in build.gradle.like this:

```
repositories {
    buildTypes {
        release {
            minifyEnabled false
            shrinkResources false
        }
    }
```
## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
