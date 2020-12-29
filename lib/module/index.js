function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { NativeModules, NativeEventEmitter // EmitterSubscription,
} from 'react-native';
const ttlockModule = NativeModules.Ttlock;
const ttlockEventEmitter = new NativeEventEmitter(ttlockModule);
const subscriptionMap = new Map();

class TtGateway {
  static startScan(callback) {
    let subscription = subscriptionMap.get(TtGateway.event.scanGateway);

    if (subscription !== undefined) {
      subscription.remove();
    }

    subscription = ttlockEventEmitter.addListener(TtGateway.event.scanGateway, callback);
    subscriptionMap.set(TtGateway.event.scanGateway, subscription);
    ttlockModule.startScanGateway();
  }

  static stopScan() {
    ttlockModule.stopScanGateway();
    let subscription = subscriptionMap.get(TtGateway.event.scanGateway);

    if (subscription !== undefined) {
      subscription.remove();
    }

    subscriptionMap.delete(TtGateway.event.scanGateway);
  }

  static connect(mac, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    let stateList = [{
      code: 0,
      description: "The bluetooth connect timeout"
    }, {
      code: 1,
      description: "The bluetooth connect success"
    }, {
      code: 2,
      description: "The bluetooth connect fail"
    }];
    ttlockModule.connect(mac, state => {
      if (state === 1) {
        success(stateList[state].code, stateList[state].description);
      } else {
        fail(stateList[state].code, stateList[state].description);
      }
    });
  }

  static getNearbyWifi(progress, finish, fail) {
    progress = progress || this.defaultCallback;
    finish = finish || this.defaultCallback;
    fail = fail || this.defaultCallback;
    let subscription = ttlockEventEmitter.addListener(TtGateway.event.scanWifi, responData => {
      progress(responData);
    });
    ttlockModule.getNearbyWifi(state => {
      subscription.remove();

      if (state === 0) {
        finish();
      } else {
        fail(1, "Failed to get nearby wifi. Please confirm whether there is wifi nearby or reconnect to the gateway try again");
      }
    });
  }

  static initGateway(object, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    let paramObject = {
      SSID: object.wifi,
      wifiPwd: object.wifiPassword,
      gatewayName: object.gatewayName,
      uid: object.ttlockUid,
      userPwd: object.ttlockLoginPassword
    };
    console.log(paramObject);
    ttlockModule.initGateway(paramObject, success, fail);
  }

}

_defineProperty(TtGateway, "defaultCallback", function () {});

_defineProperty(TtGateway, "event", {
  scanGateway: "EventScanGateway",
  scanWifi: "EventScanWifi"
});

class Ttlock {
  static startScan(callback) {
    let subscription = subscriptionMap.get(Ttlock.event.scanLock);

    if (subscription !== undefined) {
      subscription.remove();
    }

    callback = callback || this.defaultCallback;
    subscription = ttlockEventEmitter.addListener(Ttlock.event.scanLock, callback);
    subscriptionMap.set(Ttlock.event.scanLock, subscription);
    ttlockModule.startScan();
  }

  static stopScan() {
    ttlockModule.stopScan();
    let subscription = subscriptionMap.get(Ttlock.event.scanLock);

    if (subscription !== undefined) {
      subscription.remove();
    }

    subscriptionMap.delete(Ttlock.event.scanLock);
  }

  static initLock(object, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initLock(object, success, fail);
  }

  static resetLock(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetLock(lockData, success, fail);
  }

  static resetEkey(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetEkey(lockData, success, fail);
  } //enum control lock


  /**
   * 
   * @param control controlEnum
   * @param lockData string
   * @param success successful callback
   * @param fail failed callback
   */
  static controlLock(control, lockData, success, fail) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttlockModule.controlLock(control, lockData, success, fail);
  }

  static createCustomPasscode(passcode, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.createCustomPasscode(passcode, startDate, endDate, lockData, success, fail);
  }

  static modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail);
  }

  static deletePasscode(passcode, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deletePasscode(passcode, lockData, success, fail);
  }

  static resetPasscode(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetPasscode(lockData, success, fail);
  }

  static getLockSwitchState(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    let stateList = [{
      code: 0,
      description: "The lock state is locked"
    }, {
      code: 1,
      description: "The lock state is unlocked"
    }, {
      code: 2,
      description: "The lock state is unknow"
    }, {
      code: 3,
      description: "A car on the lock"
    }];
    ttlockModule.getLockSwitchState(lockData, state => {
      success(stateList[state].code, stateList[state].description);
    }, fail);
  }

  static addCard(cycleList, startDate, endDate, lockData, progress, success, fail) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    let subscription = ttlockEventEmitter.addListener(Ttlock.event.addCardProgrress, () => {
      progress();
    });
    ttlockModule.addCard(cycleList, startDate, endDate, lockData, cardNumber => {
      subscription.remove();
      success(cardNumber);
    }, (errorCode, errorDesc) => {
      subscription.remove();
      fail(errorCode, errorDesc);
    });
  }

  static modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
  }

  static deleteCard(cardNumber, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deleteCard(cardNumber, lockData, success, fail);
  }

  static clearAllCards(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllCards(lockData, success, fail);
  }

  static addFingerprint(cycleList, startDate, endDate, lockData, progress, success, fail) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    let subscription = ttlockEventEmitter.addListener(Ttlock.event.addFingerprintProgress, dataArray => {
      progress(dataArray[0], dataArray[1]);
    });
    ttlockModule.addFingerprint(cycleList, startDate, endDate, lockData, fingerprintNumber => {
      subscription.remove();
      success(fingerprintNumber);
    }, (errorCode, errorDesc) => {
      subscription.remove();
      fail(errorCode, errorDesc);
    });
  }

  static modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail);
  }

  static deleteFingerprint(fingerprintNumber, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deleteFingerprint(fingerprintNumber, lockData, success, fail);
  }

  static clearAllFingerprints(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllFingerprints(lockData, success, fail);
  }

  static modifyAdminPasscode(adminPasscode, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.modifyAdminPasscode(adminPasscode, lockData, success, fail);
  }

  static setLockTime(timestamp, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockTime(timestamp, lockData, success, fail);
  }

  static getLockTime(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockTime(lockData, success, fail);
  } //enum config lock


  static getLockOperateRecord(type, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockOperateRecord(type, lockData, success, fail);
  }

  static getLockAutomaticLockingPeriodicTime(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockAutomaticLockingPeriodicTime(lockData, success, fail);
  }

  static setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail);
  }

  static getLockRemoteUnlockSwitchState(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockRemoteUnlockSwitchState(lockData, success, fail);
  }

  static setLockRemoteUnlockSwitchState(isOn, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockRemoteUnlockSwitchState(isOn, lockData, success, fail);
  } //enum config lock


  static getLockConfig(config, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockConfig(config, lockData, success, fail);
  }

  static setLockConfig(config, isOn, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockConfig(config, isOn, lockData, success, fail);
  } //enum  lock passage mode


  static addPassageMode(type, days, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    let weekly = this.lockPassageModeEnum.weekly === type ? days : [];
    let monthly = this.lockPassageModeEnum.monthly === type ? days : [];
    ttlockModule.addPassageMode(type, weekly, monthly, startDate, endDate, lockData, success, fail);
  }

  static clearAllPassageModes(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllPassageModes(lockData, success, fail);
  }

  static addBluetoothStateListener(callback) {
    let subscription = subscriptionMap.get(Ttlock.event.bluetoothState);

    if (subscription !== undefined) {
      subscription.remove();
    }

    subscription = ttlockEventEmitter.addListener(Ttlock.event.bluetoothState, state => {
      let bluetoothStateList = [{
        code: 0,
        description: "The bluetooth state is unknow"
      }, {
        code: 1,
        description: "The bluetooth state is resetting"
      }, {
        code: 2,
        description: "Current device unsupport bluetooth"
      }, {
        code: 3,
        description: "The bluetooth is unauthorized"
      }, {
        code: 4,
        description: "The bluetooth is ok"
      }, {
        code: 5,
        description: "The bluetooth is off"
      }];
      callback(bluetoothStateList[state].code, bluetoothStateList[state].description);
    });
    subscriptionMap.set(Ttlock.event.bluetoothState, subscription);
  }

  static deleteBluetoothStateListener() {
    let subscription = subscriptionMap.get(Ttlock.event.bluetoothState);

    if (subscription !== undefined) {
      subscription.remove();
    }

    subscriptionMap.delete(Ttlock.event.bluetoothState);
  } //enum config lock


  static supportFunction(fuction, lockData, callback) {
    ttlockModule.supportFunction(fuction, lockData, callback);
  }

}

_defineProperty(Ttlock, "defaultCallback", function () {});

_defineProperty(Ttlock, "event", {
  scanLock: "EventScanLock",
  addCardProgrress: "EventAddCardProgrress",
  addFingerprintProgress: "EventAddFingerprintProgrress",
  bluetoothState: "EventBluetoothState"
});

_defineProperty(Ttlock, "controlEnum", Object.freeze({
  unlock: 0,
  lock: 1
}));

_defineProperty(Ttlock, "lockRecordEnum", Object.freeze({
  latest: 0,
  all: 1
}));

_defineProperty(Ttlock, "lockConfigEnum", Object.freeze({
  audio: 0,
  passcodeVisible: 1,
  freeze: 2,
  tamperAlert: 3,
  resetButton: 4,
  privacyLock: 5
}));

_defineProperty(Ttlock, "lockPassageModeEnum", Object.freeze({
  weekly: 0,
  monthly: 1
}));

_defineProperty(Ttlock, "lockFunction", Object.freeze({
  passcode: 0,
  icCard: 1,
  fingerprint: 2,
  wristband: 3,
  autoLock: 4,
  deletePasscode: 5,
  managePasscode: 7,
  locking: 8,
  passcodeVisible: 9,
  gatewayUnlock: 10,
  lockFreeze: 11,
  cyclePassword: 12,
  doorSensor: 13,
  remoteUnlockSwicth: 14,
  audioSwitch: 15,
  nbIot: 16,
  getAdminPasscode: 18,
  htelCard: 19,
  noClock: 20,
  noBroadcastInNormal: 21,
  passageMode: 22,
  turnOffAutoLock: 23,
  wirelessKeypad: 24,
  light: 25,
  hotelCardBlacklist: 26,
  identityCard: 27,
  tamperAlert: 28,
  resetButton: 29,
  privacyLock: 30,
  deadLock: 32,
  cyclicCardOrFingerprint: 34,
  fingerVein: 37,
  nbAwake: 39
}));

export { Ttlock, TtGateway };
export * from './types';
//# sourceMappingURL=index.js.map