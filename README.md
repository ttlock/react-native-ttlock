# react-native-ttlock

##### Developers Email && Quick Response
ttlock-developers-email-list@googlegroups.com

## Installation

Move `react-native-ttlock` to `yourProject/node_modules`

## Add configuration to project

#### iOS

1. `cd ./ios && pod install && cd ../`

2. In XCode  `TARGETS` ➜ `info` ➜ add key `Privacy - Bluetooth Peripheral Usage Description` value `your description for bluetooth` and key `Privacy - Bluetooth Always Usage Description` value `your description for bluetooth`

#### Android
1. AndroidManifest.xml configuration:   
(1) Add 'xmlns:tools="http://schemas.android.com/tools"' to element   
(2) Add 'tools:replace="android:label"' to element   
(3) Additional permissions:  

``` 
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
``` 

2. In order to get the permission request result in ttlock plugin, in MainActivity extends ReactActivity, you need override the onRequestPermissionsResult method and add below code:   
(1) java code:

``` 
  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();

    TtlockModule ttlockModule = mReactInstanceManager.getCurrentReactContext().getNativeModule(TtlockModule.class);
    ttlockModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }
``` 

3. When you release the apk, you need disable proguard in release builds.Config buildTypes in build.gradle like this:

``` 
repositories {
    buildTypes {
        release {
            minifyEnabled false
            shrinkResources false
        }
    }
``` 
4. Support min sdk version is 18
``` 
defaultConfig {
        minSdkVersion 18
    }
 ``` 
## Usage Lock

### 1 Lock basic operation
1.0 Get bluetooth state

``` js
Ttlock.getBluetoothState((state: BluetoothState)=>{
    console.log("bluetooth:",state);
});
``` 


1.1 Scan lock

``` js
//Start scan lock
Ttlock.startScan((scanLockModal: ScanLockModal) => {
    //todo
});

//Stop scan lock
Ttlock.stopScan();

```

1.2 Init lock


``` js
const param = {
    lockMac: scanLockModal.lockMac,
    lockVersion: scanLockModal.lockVersion
  }
  Ttlock.initLock(param, (lockData) => {
    Ttlock.stopScan();
    //...
  }, (errorCode, errorDesc) => {
    //...
  })
}
```

1.3 Reset Lock


``` js
Ttlock.resetLock(lockData, () => {
    //...
}, (errorCode, errorDesc) => {
    //...
})
```


1.4 Set Lock Time


``` js
let timestamp = new Date().getTime();
Ttlock.setLockTime(timestamp, lockData, () => {
    //...
}, (errorCode, errorDesc) => {
    //...
});
```


1.5 Get Lock Time


``` js
Ttlock.getLockTime(lockData, (lockTimestamp: number) => {
    //...
}, (errorCode, errorDesc) => {
    //...
});
```

1.6 Get Lock Operation Record


``` js
Ttlock.getLockOperationRecord(LockRecordType.Latest, lockData, successCallback, failedCallback);
```

1.7 Get Lock State

``` js
Ttlock.getLockSwitchState(lockData, (state: LockState) => {
    //...
},  (errorCode, errorDesc) => {
    //...
});
```

1.8 Set lock automatic locking periodic time

``` js
let seconds = 20;
Ttlock.setLockAutomaticLockingPeriodicTime(seconds, lockData, () => {
      //...
},  (errorCode, errorDesc) => {
    //...
});
```

1.9 Get lock automatic locking periodic time

``` js
Ttlock.getLockAutomaticLockingPeriodicTime(lockData, (currentTime: number, maxTime: number, minTime: number) => {
    //...
},  (errorCode, errorDesc) => {
    //...
});
```

1.10 Set lock remote unlock switch state

``` js
let isOn = true;
Ttlock.setLockRemoteUnlockSwitchState(isOn, lockData, (lockDataNew: string) => {
      let text = "set lock remote unlock switch success, please upload lockDataNew to server";
      console.log(text);
}, (errorCode, errorDesc) => {
    //...
});
```


1.11 Set lock config

``` js
/*
enum LockConfigType {
  Audio = 0,
  PasscodeVisible = 1,
  Freeze = 2,
  TamperAlert = 3,
  ResetButton = 4,
  PrivacyLock = 5
}
*/
let isOn = true;
Ttlock.setLockConfig(LockConfigType.Audio, isOn, lockData, () => {
      let text = "config lock success";
      successCallback(text);
}, (errorCode, errorDesc) => {
    //...
});
```

1.12 Get lock config

``` js
/*
enum LockConfigType {
  Audio = 0,
  PasscodeVisible = 1,
  Freeze = 2,
  TamperAlert = 3,
  ResetButton = 4,
  PrivacyLock = 5
}
*/
Ttlock.getLockConfig(LockConfigType.Audio, lockData, (type: number, isOn: boolean) => {
      let text = "type:" + type + "\n" + "isOn:" + isOn;
      successCallback(text);
}, (errorCode, errorDesc) => {
    //...
});
```

### 2. Ekey

2.1 Control lock

``` js
Ttlock.controlLock(LockControlType.Unlock, lockData, (lockTime: number, electricQuantity: number, uniqueId: number) => {
      let text = "lockTime:" + lockTime + "\n" + "electricQuantity:" + electricQuantity + "\n" + "uniqueId:" + uniqueId;
      successCallback(text);
}, (errorCode, errorDesc) => {
    //...
});
```

2.2 Reset ekey

``` js
Ttlock.resetEkey(lockData, (lockDataNew) => {
    //important: upload lockDataNew to ttlock server. 
    let text = "reset ekey success";
    console.log(text);
}, (errorCode, errorDesc) => {
    //...
});
```

### 3. Passcode

3.1 Get passcode

https://open.sciener.com/doc/api/v3/keyboardPwd/get


3.2 Custom passcode

``` js
 //example: passcode valid one day
let startDate = new Date().getTime();
let endDate = startDate + 24 * 3600 * 1000;
Ttlock.createCustomPasscode("1122", startDate, endDate, lockData, () => {
      successCallback("create cutome passcode success");
}, (errorCode, errorDesc) => {
    //...
});
```

3.3 Modify passcode

``` js
// passcode valid one minute
let startDate = new Date().getTime();
let endDate = startDate + 1 * 60 * 1000;
let oldPasscode = "1122";
let newPasscode = "2233";
Ttlock.modifyPasscode(oldPasscode, newPasscode, startDate, endDate, lockData, () => {
      successCallback("modify passcode success");
}, (errorCode, errorDesc) => {
    //...
});   
```

3.4 Delete passcode

``` js
Ttlock.deletePasscode("2233", lockData, () => {
    successCallback("delete passcode success");
}, (errorCode, errorDesc) => {
    //...
});  
```


3.5 Reset all passcode ( not contain the admin password )

``` js
Ttlock.resetPasscode(lockData, (lockDataNew: string) => {
    //important: upload lockDataNew to ttlock server. 
    console.log("reset passcode success, please upload lockDataNew to server");
}, (errorCode, errorDesc) => {
    //...
});   
```

3.6 Modify admin passcode

``` js
let adminPasscode = "9999";
Ttlock.modifyAdminPasscode(adminPasscode, lockData, () => {
      let text = "modify admin passcode success";
}, (errorCode, errorDesc) => {
    //...
});   
```

### 4. Card

4.1 Add card

``` js
// card valid one day
let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addCard(null, startDate, endDate, lockData, () => {
     // progress
}, (cNumber: string) => {
      cardNumber = cNumber;
      let text = "cardNumber:" + cardNumber;
      successCallback(text);
}, (errorCode, errorDesc) => {
    //...    
});   
```

4.2 Modify card validity period

``` js
// card valid one minute
let startDate = new Date().getTime();
let endDate = startDate + 1 * 60 * 1000;
Ttlock.modifyCardValidityPeriod(cardNumber, null, startDate, endDate, lockData, () => {
    let text = "modify card validity period success";
}, (errorCode, errorDesc) => {
    //...        
});   
```


4.3 Delete card

``` js
Ttlock.deleteCard(cardNumber, lockData, () => {
      let text = "delete card success";
}, (errorCode, errorDesc) => {
    //...    
});   
```

4.4 Clear all cards

``` js
Ttlock.clearAllCards(lockData, () => {
    let text = "clear all cards success";
}, (errorCode, errorDesc) => {
    //...    
});   
```

### 5. Fingerprint

5.1 Add fingerprint

``` js
// card valid one day
let startDate = new Date().getTime();
let endDate = startDate + 24 * 3600 * 1000;

Ttlock.addFingerprint(null, startDate, endDate, lockData, (currentCount: number, totalCount: number) => {
      let text = "currentCount:" + currentCount + "\n" + "totalCount:" + totalCount;
      progressCallback(text);
}, (fNumber: string) => {
      fingerprintNumber = fNumber;
      let text = "fingerprintNumber:" + fingerprintNumber
    }, (errorCode, errorDesc) => {
    //...    
});  
```


5.2 Modify fingerprint validity period

``` js
// fingerprint valid one minute
let startDate = new Date().getTime();
let endDate = startDate + 1 * 60 * 1000;

Ttlock.modifyFingerprintValidityPeriod(fingerprintNumber, null, startDate, endDate, lockData, () => {
      let text = "modify fingerprint validity period success";
}, (errorCode, errorDesc) => {
    //...    
});  
```


5.3 Delete fingerprint 

``` js
Ttlock.deleteFingerprint(fingerprintNumber, lockData, () => {
      let text = "delete fingerprint success";
}, (errorCode, errorDesc) => {
    //...    
});  
```

5.4 Clear all fingerprints

``` js
Ttlock.clearAllFingerprints(lockData, () => {
    let text = "clear all fingerprints success";
}, (errorCode, errorDesc) => {
    //...    
});  
```


### 6. Passage mode

6.1 Add passage mode

``` js
//valid time 8:00 am ---   17:00 pm
let startTime = 8 * 60;
let endTime = 17 * 60;
Ttlock.addPassageMode(LockPassageMode.Weekly, [1, 2, 7], startTime, endTime, lockData, () => {
      let text = "add passage mode success";
}, (errorCode, errorDesc) => {
    //...    
});  
```

6.2 Clear all passageModes

``` js
Ttlock.clearAllPassageModes(lockData, () => {
    let text = "clear all passage modes success";
}, (errorCode, errorDesc) => {
    //...    
});  
```




