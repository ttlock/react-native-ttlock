function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { NativeModules, NativeEventEmitter // EmitterSubscription,
} from 'react-native';
const ttlockModule = NativeModules.Ttlock;
const ttlockEventEmitter = new NativeEventEmitter(ttlockModule);
const subscriptionMap = new Map();

class TtGateway {
  /**
   * Scan for nearby gateways （Only newly powered gateways can be scanned）
   * @param callback  If there is a reenergized gateway nearby, the callback will be performed multiple times
   */
  static startScan(callback) {
    let subscription = subscriptionMap.get(TtGateway.event.scanGateway);

    if (subscription !== undefined) {
      subscription.remove();
    }

    subscription = ttlockEventEmitter.addListener(TtGateway.event.scanGateway, callback);
    subscriptionMap.set(TtGateway.event.scanGateway, subscription);
    ttlockModule.startScanGateway();
  }
  /**
   * Stop scanning nearby Bluetooth locks
   */


  static stopScan() {
    ttlockModule.stopScanGateway();
    let subscription = subscriptionMap.get(TtGateway.event.scanGateway);

    if (subscription !== undefined) {
      subscription.remove();
    }

    subscriptionMap.delete(TtGateway.event.scanGateway);
  }
  /**
   * Connected to the gateway Only newly powered gateways can be connected）
   * @param mac 
   * @param success 
   * @param fail 
   */


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
  /**
   * Read wifi near the gateway
   * @param progress 
   * @param finish 
   * @param fail 
   */


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
  /**
   * Initialize gateway
   * @param object 
   * @param success 
   * @param fail 
   */


  static initGateway(object, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initGateway(object, success, errorCode => {
      let description = "Init gateway fail.";

      if (errorCode === 3) {
        description += "Wrong wifi";
      } else if (errorCode === 4) {
        description += "Wrong wifi password";
      }

      fail(errorCode, description);
    });
  }

}

_defineProperty(TtGateway, "defaultCallback", function () {});

_defineProperty(TtGateway, "event", {
  scanGateway: "EventScanGateway",
  scanWifi: "EventScanWifi"
});

class Ttlock {
  /**
   * Scan for nearby Bluetooth locks
   * @param callback  The Callback will be executed multiple times if there is a Bluetooth lock nearby
   */
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
  /**
   * Stop scanning nearby Bluetooth locks
   */


  static stopScan() {
    ttlockModule.stopScan();
    let subscription = subscriptionMap.get(Ttlock.event.scanLock);

    if (subscription !== undefined) {
      subscription.remove();
    }

    subscriptionMap.delete(Ttlock.event.scanLock);
  }
  /**
   * Initialize lock
   * @param object {lock:"ea:09:e2:99:33", lockVersion:"{\"protocolType\":5,\"protocolVersion\":3,\"scene\":2,\"groupId\":1,\"orgId\":1}"}
   * @param success 
   * @param fail 
   */


  static initLock(object, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initLock(object, success, fail);
  }
  /**
   * Reset the lock.
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static resetLock(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetLock(lockData, success, fail);
  }
  /**
   * Reset the all keys.
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static resetEkey(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetEkey(lockData, success, fail);
  } //enum control lock


  /**
   * Controle the lock Unlock or lock or other operations
   * @param control  Ttlock.controlEnum.unlock or Ttlock.controlEnum.lock
   * @param lockData string
   * @param success successful callback
   * @param fail failed callback
   */
  static controlLock(control, lockData, success, fail) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttlockModule.controlLock(control, lockData, dataArray => {
      success(dataArray[0], dataArray[1], dataArray[2]);
    }, fail);
  }
  /**
   * Create a custom passcode. 
   * @param passcode The password must be 4-9 digits
   * @param startDate Timestamp millisecond. The start valid time of the password.
   * @param endDate Timestamp millisecond. The expiration time of the password
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static createCustomPasscode(passcode, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.createCustomPasscode(passcode, startDate, endDate, lockData, success, fail);
  }
  /**
   * Change the password and the expiry date of the password.
   * @param passcodeOrigin origin password
   * @param passcodeNew new password must be 4-9 digits
   * @param startDate Timestamp millisecond. The start valid time of the password.
   * @param endDate Timestamp millisecond. The expiration time of the password
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail);
  }
  /**
   * Delete the passcode.
   * @param passcode 
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static deletePasscode(passcode, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deletePasscode(passcode, lockData, success, fail);
  }
  /**
   * All passcode will be invalid after reset （Custom passcode and Admin passcode is still valid）
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static resetPasscode(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetPasscode(lockData, success, fail);
  }
  /**
   * Get the lock state (unlock or lock)
   * @param lockData 
   * @param success 
   * @param fail 
   */


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
  /**
   * Add a card to unlock the lock
   * @param cycleList Periodic unlocking. You can set it to null if you don't need it
   * @param startDate Timestamp millisecond. The start valid time of the card.
   * @param endDate Timestamp millisecond. The expiration time of the card
   * @param lockData 
   * @param progress 
   * @param success 
   * @param fail 
   */


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
      console.log("Success:", cardNumber);
      success(cardNumber);
    }, (errorCode, errorDesc) => {
      subscription.remove();
      fail(errorCode, errorDesc);
    });
  }
  /**
   * Modify the validity period of the card
   * @param cardNumber 
   * @param cycleList Periodic unlocking. You can set it to null if you don't need it
   * @param startDate Timestamp millisecond. The start valid time of the card.
   * @param endDate Timestamp millisecond. The expiration time of the card
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
  }
  /**
   * Delete the card
   * @param cardNumber 
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static deleteCard(cardNumber, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deleteCard(cardNumber, lockData, success, fail);
  }
  /**
   * Clear all cards
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static clearAllCards(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllCards(lockData, success, fail);
  }
  /**
   * Add  fingerprint to unlock the lock
   * @param cycleList Periodic unlocking. You can set it to null if you don't need it
   * @param startDate Timestamp millisecond. The start valid time of the fingerprint.
   * @param endDate Timestamp millisecond. The expiration time of the fingerprint
   * @param lockData 
   * @param progress 
   * @param success 
   * @param fail 
   */


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
  /**
   * Modify the validity period of the fingerprint
   * @param fingerprintNumber 
   * @param cycleList Periodic unlocking. You can set it to null if you don't need it
   * @param startDate Timestamp millisecond. The start valid time of the fingerprint.
   * @param endDate Timestamp millisecond. The expiration time of the fingerprint
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail);
  }
  /**
   * Delete the fingerprint
   * @param fingerprintNumber 
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static deleteFingerprint(fingerprintNumber, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deleteFingerprint(fingerprintNumber, lockData, success, fail);
  }
  /**
   * Clear all fingerprints
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static clearAllFingerprints(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllFingerprints(lockData, success, fail);
  }
  /**
   * Modify admin passcode
   * @param adminPasscode  adminPasscode must be 4-9 digits
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static modifyAdminPasscode(adminPasscode, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.modifyAdminPasscode(adminPasscode, lockData, success, fail);
  }
  /**
   * Set the lock time
   * @param timestamp  Millisecond.
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static setLockTime(timestamp, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockTime(timestamp, lockData, success, fail);
  }
  /**
   * Get the lock time
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static getLockTime(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockTime(lockData, success, fail);
  } //enum config lock


  /**
   * Read the operation record of the lock. 
   * @param type Ttlock.lockRecordEnum.latest or Ttlock.lockRecordEnum.all
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static getLockOperateRecord(type, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockOperateRecord(type, lockData, success, fail);
  }
  /**
   * Get the lock automatic locking periodic time
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static getLockAutomaticLockingPeriodicTime(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockAutomaticLockingPeriodicTime(lockData, success, fail);
  }
  /**
   * Set the lock automatic locking periodic time
   * @param seconds 
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail);
  }
  /**
   * Get the lock remote unlock switch state
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static getLockRemoteUnlockSwitchState(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockRemoteUnlockSwitchState(lockData, success, fail);
  }
  /**
   * Set the lock remote unlock switch state
   * @param isOn 
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static setLockRemoteUnlockSwitchState(isOn, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockRemoteUnlockSwitchState(isOn, lockData, success, fail);
  } //enum config lock


  /**
   * Get config of the lock
   * @param config Reference  Ttlock.lockConfigEnum
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static getLockConfig(config, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockConfig(config, lockData, success, fail);
  }
  /**
   * Set config of the lock
   * @param config Reference  Ttlock.lockConfigEnum
   * @param isOn 
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static setLockConfig(config, isOn, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockConfig(config, isOn, lockData, success, fail);
  } //enum  lock passage mode


  /**
   * Set the lock always unlock.
   * @param type Ttlock.lockPassageModeEnum.weekly or Ttlock.lockPassageModeEnum.monthly
   * @param days type = Ttlock.lockPassageModeEnum.weekly then days should be 1~7 Monday ~ Sunday, [1,3,6]. type = Ttlock.lockPassageModeEnum.monthly then days should be 1~31, [1,7,29,31]
   * @param startDate The valid time of the passage mode
   * @param endDate The invalid time of the passage mode
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static addPassageMode(type, days, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    let weekly = this.lockPassageModeEnum.weekly === type ? days : [];
    let monthly = this.lockPassageModeEnum.monthly === type ? days : [];
    ttlockModule.addPassageMode(type, weekly, monthly, startDate, endDate, lockData, success, fail);
  }
  /**
   * Clear all passage mode
   * @param lockData 
   * @param success 
   * @param fail 
   */


  static clearAllPassageModes(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllPassageModes(lockData, success, fail);
  }
  /**
   * Monitor phone's Bluetooth status
   * @param callback 
   */


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