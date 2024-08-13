function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { NativeModules, NativeEventEmitter
// EmitterSubscription,
} from 'react-native';
const ttlockModule = NativeModules.Ttlock;
const ttlockEventEmitter = new NativeEventEmitter(ttlockModule);
const subscriptionMap = new Map();
class TtWirelessKeypad {
  static startScan(callback) {
    let subscription = subscriptionMap.get(WirelessKeypadEvent.ScanWirelessKeypad);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttlockEventEmitter.addListener(WirelessKeypadEvent.ScanWirelessKeypad, callback);
    subscriptionMap.set(WirelessKeypadEvent.ScanWirelessKeypad, subscription);
    ttlockModule.startScanWirelessKeypad();
  }
  static stopScan() {
    ttlockModule.stopScanWirelessKeypad();
    let subscription = subscriptionMap.get(WirelessKeypadEvent.ScanWirelessKeypad);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(WirelessKeypadEvent.ScanWirelessKeypad);
  }
  static init(mac, lockMac, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initWirelessKeypad(mac, lockMac, dataArray => {
      success(dataArray[0], dataArray[1]);
    }, errorCode => {
      let description = "Init wireless keypad fail.";
      if (errorCode === -1) {
        description += "Wrong crc";
      } else if (errorCode === -2) {
        description += "Connect timeout";
      } else if (errorCode === -3) {
        description += "Wrong factoryd date";
      }
      fail(errorCode, description);
    });
  }
}
_defineProperty(TtWirelessKeypad, "defaultCallback", function () {});
class TtDoorSensor {
  static startScan(callback) {
    let subscription = subscriptionMap.get(TtDoorSensorEvent.ScanDoorSensor);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttlockEventEmitter.addListener(TtDoorSensorEvent.ScanDoorSensor, callback);
    subscriptionMap.set(TtDoorSensorEvent.ScanDoorSensor, subscription);
    ttlockModule.startScanDoorSensor();
  }
  static stopScan() {
    ttlockModule.stopScanDoorSensor();
    let subscription = subscriptionMap.get(TtDoorSensorEvent.ScanDoorSensor);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(TtDoorSensorEvent.ScanDoorSensor);
  }
  static init(mac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initDoorSensor(mac, lockData, dataArray => {
      success(dataArray[0], dataArray[1]);
    }, errorCode => {
      let description = "Init door sensor fail.";
      if (errorCode === 1) {
        description += "Bluetooth is power off";
      } else if (errorCode === 2) {
        description += "Connect timeout";
      } else if (errorCode === 4) {
        description += "Wrong crc";
      }
      fail(errorCode, description);
    });
  }
}
_defineProperty(TtDoorSensor, "defaultCallback", function () {});
class TtRemoteKey {
  static startScan(callback) {
    let subscription = subscriptionMap.get(TtRemoteKeyEvent.ScanRemoteKey);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttlockEventEmitter.addListener(TtRemoteKeyEvent.ScanRemoteKey, callback);
    subscriptionMap.set(TtRemoteKeyEvent.ScanRemoteKey, subscription);
    ttlockModule.startScanRemoteKey();
  }
  static stopScan() {
    ttlockModule.stopScanRemoteKey();
    let subscription = subscriptionMap.get(TtRemoteKeyEvent.ScanRemoteKey);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(TtRemoteKeyEvent.ScanRemoteKey);
  }
  static init(mac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initRemoteKey(mac, lockData, dataArray => {
      success(dataArray[0], dataArray[1]);
    }, errorCode => {
      let description = "Init remote key fail.";
      if (errorCode === -1) {
        description += "Wrong CRC";
      } else if (errorCode === -2) {
        description += "Connect timeout";
      }
      fail(errorCode, description);
    });
  }
}
_defineProperty(TtRemoteKey, "defaultCallback", function () {});
class TtGateway {
  /**
   * Scan for nearby gateways （Only newly powered gateways can be scanned）
   * @param callback  If there is a reenergized gateway nearby, the callback will be performed multiple times
   */
  static startScan(callback) {
    let subscription = subscriptionMap.get(GatewayEvent.ScanGateway);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttlockEventEmitter.addListener(GatewayEvent.ScanGateway, callback);
    subscriptionMap.set(GatewayEvent.ScanGateway, subscription);
    ttlockModule.startScanGateway();
  }

  /**
   * Stop scanning nearby Bluetooth locks
   */
  static stopScan() {
    ttlockModule.stopScanGateway();
    let subscription = subscriptionMap.get(GatewayEvent.ScanGateway);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(GatewayEvent.ScanGateway);
  }

  /**
   * Connected to the gateway Only newly powered gateways can be connected）
   * @param mac
   * @param callback
   */
  static connect(mac, callback) {
    callback = callback || this.defaultCallback;
    ttlockModule.connect(mac, state => {
      let connectState = [ConnectState.Timeout, ConnectState.Success, ConnectState.Fail][state];
      callback(connectState);
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
    let subscription = ttlockEventEmitter.addListener(GatewayEvent.ScanWifi, responData => {
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
class Ttlock {
  /**
   * Scan for nearby Bluetooth locks
   * @param callback  The Callback will be executed multiple times if there is a Bluetooth lock nearby
   */
  static startScan(callback) {
    let subscription = subscriptionMap.get(TTLockEvent.ScanLock);
    if (subscription !== undefined) {
      subscription.remove();
    }
    callback = callback || this.defaultCallback;
    subscription = ttlockEventEmitter.addListener(TTLockEvent.ScanLock, callback);
    subscriptionMap.set(TTLockEvent.ScanLock, subscription);
    ttlockModule.startScan();
  }

  /**
   * Stop scanning nearby Bluetooth locks
   */
  static stopScan() {
    ttlockModule.stopScan();
    let subscription = subscriptionMap.get(TTLockEvent.ScanLock);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(TTLockEvent.ScanLock);
  }

  /**
   * Initialize lock
   * @param object {lockMac:"ea:09:e2:99:33", lockVersion:"{\"protocolType\":5,\"protocolVersion\":3,\"scene\":2,\"groupId\":1,\"orgId\":1}"}
   * @param success
   * @param fail
   */
  static initLock(object, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initLock(object, success, fail);
  }
  static getLockVersionWithLockMac(lockMac, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockVersionWithLockMac(lockMac, success, fail);
  }
  static getAccessoryElectricQuantity(accessoryType, accessoryMac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getAccessoryElectricQuantity(accessoryType, accessoryMac, lockData, dataArray => {
      success(dataArray[0], dataArray[1]);
    }, fail);
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
  }

  /**
   * Controle the lock Unlock or lock or other operations
   * @param control  LockControlType
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
    ttlockModule.getLockSwitchState(lockData, state => {
      let lockState = [LockState.Locked, LockState.Unlock, LockState.Unknow, LockState.CarOnLock][state];
      success(lockState);
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
    let subscription = ttlockEventEmitter.addListener(TTLockEvent.AddCardProgrress, () => {
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
    let subscription = ttlockEventEmitter.addListener(TTLockEvent.AddFingerprintProgress, dataArray => {
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
  }
  static getLockElectricQuantity(lockData, success, fail) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttlockModule.getLockElectricQuantity(lockData, success, fail);
  }

  /**
   * Read the operation record of the lock.
   * @param type LockRecordType
   * @param lockData
   * @param success
   * @param fail
   */
  static getLockOperationRecord(type, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockOperationRecord(type, lockData, success, fail);
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
    ttlockModule.getLockAutomaticLockingPeriodicTime(lockData, data => {
      success(data[0], data[1], data[2]);
    }, fail);
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
  }

  /**
   * Get config of the lock
   * @param config
   * @param lockData
   * @param success
   * @param fail
   */
  static getLockConfig(config, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockConfig(config, lockData, data => {
      success(data[0], data[1]);
    }, fail);
  }

  /**
   * Set config of the lock
   * @param config
   * @param isOn
   * @param lockData
   * @param success
   * @param fail
   */
  static setLockConfig(config, isOn, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockConfig(config, isOn, lockData, success, fail);
  }
  static setLockSoundVolume(soundVolume, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockSoundVolume(soundVolume, lockData, success, fail);
  }
  static getLockSoundVolume(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockSoundVolume(lockData, success, fail);
  }
  static getUnlockDirection(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getUnlockDirection(lockData, success, fail);
  }
  static setUnlockDirection(direction, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setUnlockDirection(direction, lockData, success, fail);
  }
  static setUnlockDirectionAutomatic(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setUnlockDirectionAutomatic(lockData, success, fail);
  }

  /**
   * Set the lock always unlock.
   * @param mode LockPassageMode
   * @param days
   * type = LockPassageMode.Weekly then days should be 1~7 Monday ~ Sunday, [1,3,6]
   * type = LockPassageMode.Monthly then days should be 1~31, [1,7,29,31]
   * @param startDate The valid time of the passage mode
   * @param endDate The invalid time of the passage mode
   * @param lockData
   * @param success
   * @param fail
   */
  static addPassageMode(mode, days, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    let weekly = LockPassageMode.Weekly === mode ? days : [];
    let monthly = LockPassageMode.Monthly === mode ? days : [];
    ttlockModule.addPassageMode(mode, weekly, monthly, startDate, endDate, lockData, success, fail);
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
  static addRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleDateList = cycleDateList || [];
    ttlockModule.addRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail);
  }
  static modifyRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleDateList = cycleDateList || [];
    ttlockModule.modifyRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail);
  }
  static deleteRemoteKey(remoteKeyMac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deleteRemoteKey(remoteKeyMac, lockData, success, fail);
  }
  static clearAllRemoteKey(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllRemoteKey(lockData, success, fail);
  }
  static addDoorSensor(doorSensorMac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.addDoorSensor(doorSensorMac, lockData, success, fail);
  }
  static clearAllDoorSensor(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllDoorSensor(lockData, success, fail);
  }
  static setDoorSensorAlertTime(time, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setDoorSensorAlertTime(time, lockData, success, fail);
  }

  /**
     * Recover card data to the lock
     * @param cardNumber
     * @param cycleList Periodic unlocking. You can set it to null if you don't need it
     * @param startDate Timestamp millisecond. The start valid time of the card.
     * @param endDate Timestamp millisecond. The expiration time of the card
     * @param lockData
     * @param success
     * @param fail
     */
  static recoverCard(cardNumber, cycleList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.recoverCard(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
  }
  static recoverPasscode(passcode, passcodeType, cycleType, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.recoverPasscode(passcode, passcodeType, cycleType, startDate, endDate, lockData, success, fail);
  }
  static scanWifi(lockData, callback, fail) {
    let subscription = subscriptionMap.get(TTLockEvent.ScanLockWifi);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttlockEventEmitter.addListener(TTLockEvent.ScanLockWifi, data => {
      callback(data[0], data[1]);
    });
    subscriptionMap.set(TTLockEvent.ScanLockWifi, subscription);
    ttlockModule.scanWifi(lockData, fail);
  }
  static configWifi(wifiName, wifiPassword, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.configWifi(wifiName, wifiPassword, lockData, success, fail);
  }
  static configServer(ip, port, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.configServer(ip, port, lockData, success, fail);
  }
  static getWifiInfo(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getWifiInfo(lockData, data => {
      success(data[0], data[1]);
    }, fail);
  }
  static configIp(info, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.configIp(info, lockData, success, fail);
  }
  static addFace(cycleList, startDate, endDate, lockData, progress, success, fail) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    let subscription = ttlockEventEmitter.addListener(TTLockEvent.AddFaceProgrress, dataArray => {
      progress(dataArray[0], dataArray[1]);
    });
    ttlockModule.addFace(cycleList, startDate, endDate, lockData, cardNumber => {
      subscription.remove();
      success(cardNumber);
    }, (errorCode, errorDesc) => {
      subscription.remove();
      fail(errorCode, errorDesc);
    });
  }
  static addFaceFeatureData(faceFeatureData, cycleList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.addFaceFeatureData(faceFeatureData, cycleList, startDate, endDate, lockData, faceNumber => {
      success(faceNumber);
    }, (errorCode, errorDesc) => {
      fail(errorCode, errorDesc);
    });
  }
  static modifyFaceValidityPeriod(cycleList, startDate, endDate, faceNumber, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.modifyFaceValidityPeriod(cycleList, startDate, endDate, faceNumber, lockData, success, fail);
  }
  static deleteFace(faceNumber, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deleteFace(faceNumber, lockData, success, fail);
  }
  static clearAllFace(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearFace(lockData, success, fail);
  }
  static enterUpgradeMode(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.enterUpgradeMode(lockData, success, fail);
  }

  /**
   * Monitor phone's Bluetooth status
   * @param callback
   */
  /*
  static addBluetoothStateListener(callback: (state: number, description: string) => void) {
    let subscription = subscriptionMap.get(Ttlock.event.bluetoothState)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttlockEventEmitter.addListener(Ttlock.event.bluetoothState, (state: number) => {
      let bluetoothStateList = [
        { code: 0, description: "The bluetooth state is unknow" },
        { code: 1, description: "The bluetooth state is resetting" },
        { code: 2, description: "Current device unsupport bluetooth" },
        { code: 3, description: "The bluetooth is unauthorized" },
        { code: 4, description: "The bluetooth is ok" },
        { code: 5, description: "The bluetooth is off" },
      ]
      callback(bluetoothStateList[state].code, bluetoothStateList[state].description);
    });
    subscriptionMap.set(Ttlock.event.bluetoothState, subscription);
  }
    static deleteBluetoothStateListener() {
    let subscription = subscriptionMap.get(Ttlock.event.bluetoothState)
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(Ttlock.event.bluetoothState);
  }
  */

  /**
   *
   * @param callback
   */
  static getBluetoothState(callback) {
    callback = callback || this.defaultCallback;
    ttlockModule.getBluetoothState(state => {
      var bluetoothState = [BluetoothState.Unknow, BluetoothState.Resetting, BluetoothState.Unsupport, BluetoothState.Unauthorized, BluetoothState.On, BluetoothState.Off][state];
      callback(bluetoothState);
    });
  }
  static supportFunction(fuction, lockData, callback) {
    ttlockModule.supportFunction(fuction, lockData, callback);
  }
}
_defineProperty(Ttlock, "defaultCallback", function () {});
var BluetoothState = /*#__PURE__*/function (BluetoothState) {
  BluetoothState[BluetoothState["Unknow"] = 0] = "Unknow";
  BluetoothState[BluetoothState["Resetting"] = 1] = "Resetting";
  BluetoothState[BluetoothState["Unsupport"] = 2] = "Unsupport";
  BluetoothState[BluetoothState["Unauthorized"] = 3] = "Unauthorized";
  BluetoothState[BluetoothState["On"] = 4] = "On";
  BluetoothState[BluetoothState["Off"] = 5] = "Off";
  return BluetoothState;
}(BluetoothState || {});
var LockFunction = /*#__PURE__*/function (LockFunction) {
  LockFunction[LockFunction["Passcode"] = 0] = "Passcode";
  LockFunction[LockFunction["IcCard"] = 1] = "IcCard";
  LockFunction[LockFunction["Fingerprint"] = 2] = "Fingerprint";
  LockFunction[LockFunction["Wristband"] = 3] = "Wristband";
  LockFunction[LockFunction["AutoLock"] = 4] = "AutoLock";
  LockFunction[LockFunction["DeletePasscode"] = 5] = "DeletePasscode";
  LockFunction[LockFunction["ManagePasscode"] = 7] = "ManagePasscode";
  LockFunction[LockFunction["Locking"] = 8] = "Locking";
  LockFunction[LockFunction["PasscodeVisible"] = 9] = "PasscodeVisible";
  LockFunction[LockFunction["GatewayUnlock"] = 10] = "GatewayUnlock";
  LockFunction[LockFunction["LockFreeze"] = 11] = "LockFreeze";
  LockFunction[LockFunction["CyclePassword"] = 12] = "CyclePassword";
  LockFunction[LockFunction["RemoteUnlockSwicth"] = 14] = "RemoteUnlockSwicth";
  LockFunction[LockFunction["AudioSwitch"] = 15] = "AudioSwitch";
  LockFunction[LockFunction["NbIot"] = 16] = "NbIot";
  LockFunction[LockFunction["GetAdminPasscode"] = 18] = "GetAdminPasscode";
  LockFunction[LockFunction["HtelCard"] = 19] = "HtelCard";
  LockFunction[LockFunction["NoClock"] = 20] = "NoClock";
  LockFunction[LockFunction["NoBroadcastInNormal"] = 21] = "NoBroadcastInNormal";
  LockFunction[LockFunction["PassageMode"] = 22] = "PassageMode";
  LockFunction[LockFunction["TurnOffAutoLock"] = 23] = "TurnOffAutoLock";
  LockFunction[LockFunction["WirelessKeypad"] = 24] = "WirelessKeypad";
  LockFunction[LockFunction["Light"] = 25] = "Light";
  LockFunction[LockFunction["HotelCardBlacklist"] = 26] = "HotelCardBlacklist";
  LockFunction[LockFunction["IdentityCard"] = 27] = "IdentityCard";
  LockFunction[LockFunction["TamperAlert"] = 28] = "TamperAlert";
  LockFunction[LockFunction["ResetButton"] = 29] = "ResetButton";
  LockFunction[LockFunction["PrivacyLock"] = 30] = "PrivacyLock";
  LockFunction[LockFunction["DeadLock"] = 32] = "DeadLock";
  LockFunction[LockFunction["CyclicCardOrFingerprint"] = 34] = "CyclicCardOrFingerprint";
  LockFunction[LockFunction["UnlockDirection"] = 36] = "UnlockDirection";
  LockFunction[LockFunction["FingerVein"] = 37] = "FingerVein";
  LockFunction[LockFunction["NbAwake"] = 39] = "NbAwake";
  LockFunction[LockFunction["RecoverCyclePasscode"] = 40] = "RecoverCyclePasscode";
  LockFunction[LockFunction["RemoteKey"] = 41] = "RemoteKey";
  LockFunction[LockFunction["GetAccessoryElectricQuantity"] = 42] = "GetAccessoryElectricQuantity";
  LockFunction[LockFunction["SoundVolume"] = 43] = "SoundVolume";
  LockFunction[LockFunction["QRCode"] = 44] = "QRCode";
  LockFunction[LockFunction["SensorState"] = 45] = "SensorState";
  LockFunction[LockFunction["PassageModeAutoUn"] = 46] = "PassageModeAutoUn";
  LockFunction[LockFunction["DoorSensor"] = 50] = "DoorSensor";
  LockFunction[LockFunction["DoorSensorAlert"] = 51] = "DoorSensorAlert";
  LockFunction[LockFunction["Sensitivity"] = 52] = "Sensitivity";
  LockFunction[LockFunction["Face"] = 53] = "Face";
  LockFunction[LockFunction["CpuCard"] = 55] = "CpuCard";
  LockFunction[LockFunction["Wifi"] = 56] = "Wifi";
  LockFunction[LockFunction["WifiStaticIP"] = 58] = "WifiStaticIP";
  LockFunction[LockFunction["PasscodeKeyNumber"] = 60] = "PasscodeKeyNumber";
  LockFunction[LockFunction["AutoSetUnlockDirection"] = 81] = "AutoSetUnlockDirection";
  return LockFunction;
}(LockFunction || {});
var LockRecordType = /*#__PURE__*/function (LockRecordType) {
  LockRecordType[LockRecordType["Latest"] = 0] = "Latest";
  LockRecordType[LockRecordType["All"] = 1] = "All";
  return LockRecordType;
}(LockRecordType || {});
var LockConfigType = /*#__PURE__*/function (LockConfigType) {
  LockConfigType[LockConfigType["Audio"] = 0] = "Audio";
  LockConfigType[LockConfigType["PasscodeVisible"] = 1] = "PasscodeVisible";
  LockConfigType[LockConfigType["Freeze"] = 2] = "Freeze";
  LockConfigType[LockConfigType["TamperAlert"] = 3] = "TamperAlert";
  LockConfigType[LockConfigType["ResetButton"] = 4] = "ResetButton";
  LockConfigType[LockConfigType["PrivacyLock"] = 5] = "PrivacyLock";
  LockConfigType[LockConfigType["PassageModeAutoUnlock"] = 6] = "PassageModeAutoUnlock";
  LockConfigType[LockConfigType["WifiPowerSavingMode"] = 7] = "WifiPowerSavingMode";
  LockConfigType[LockConfigType["DoubleAuth"] = 8] = "DoubleAuth";
  return LockConfigType;
}(LockConfigType || {});
var LockSoundVolume = /*#__PURE__*/function (LockSoundVolume) {
  LockSoundVolume[LockSoundVolume["On"] = -1] = "On";
  LockSoundVolume[LockSoundVolume["Off"] = 0] = "Off";
  LockSoundVolume[LockSoundVolume["Livel_1"] = 1] = "Livel_1";
  LockSoundVolume[LockSoundVolume["Livel_2"] = 2] = "Livel_2";
  LockSoundVolume[LockSoundVolume["Livel_3"] = 3] = "Livel_3";
  LockSoundVolume[LockSoundVolume["Livel_4"] = 4] = "Livel_4";
  LockSoundVolume[LockSoundVolume["Livel_5"] = 5] = "Livel_5";
  return LockSoundVolume;
}(LockSoundVolume || {});
var LockUnlockDirection = /*#__PURE__*/function (LockUnlockDirection) {
  LockUnlockDirection[LockUnlockDirection["Unknow"] = 0] = "Unknow";
  LockUnlockDirection[LockUnlockDirection["Left"] = 1] = "Left";
  LockUnlockDirection[LockUnlockDirection["Right"] = 2] = "Right";
  return LockUnlockDirection;
}(LockUnlockDirection || {});
var LockPassageMode = /*#__PURE__*/function (LockPassageMode) {
  LockPassageMode[LockPassageMode["Weekly"] = 0] = "Weekly";
  LockPassageMode[LockPassageMode["Monthly"] = 1] = "Monthly";
  return LockPassageMode;
}(LockPassageMode || {});
var LockControlType = /*#__PURE__*/function (LockControlType) {
  LockControlType[LockControlType["Unlock"] = 0] = "Unlock";
  LockControlType[LockControlType["Lock"] = 1] = "Lock";
  return LockControlType;
}(LockControlType || {});
var LockState = /*#__PURE__*/function (LockState) {
  LockState[LockState["Locked"] = 0] = "Locked";
  LockState[LockState["Unlock"] = 1] = "Unlock";
  LockState[LockState["Unknow"] = 2] = "Unknow";
  LockState[LockState["CarOnLock"] = 3] = "CarOnLock";
  return LockState;
}(LockState || {});
var FaceState = /*#__PURE__*/function (FaceState) {
  FaceState[FaceState["canAddFace"] = 0] = "canAddFace";
  FaceState[FaceState["addFail"] = 1] = "addFail";
  return FaceState;
}(FaceState || {});
var FaceErrorCode = /*#__PURE__*/function (FaceErrorCode) {
  FaceErrorCode[FaceErrorCode["normal"] = 0] = "normal";
  FaceErrorCode[FaceErrorCode["noFaceDetected"] = 1] = "noFaceDetected";
  FaceErrorCode[FaceErrorCode["tooCloseToTheTop"] = 2] = "tooCloseToTheTop";
  FaceErrorCode[FaceErrorCode["tooCloseToTheBottom"] = 3] = "tooCloseToTheBottom";
  FaceErrorCode[FaceErrorCode["tooCloseToTheLeft"] = 4] = "tooCloseToTheLeft";
  FaceErrorCode[FaceErrorCode["tooCloseToTheRight"] = 5] = "tooCloseToTheRight";
  FaceErrorCode[FaceErrorCode["tooFarAway"] = 6] = "tooFarAway";
  FaceErrorCode[FaceErrorCode["tooClose"] = 7] = "tooClose";
  FaceErrorCode[FaceErrorCode["eyebrowsCovered"] = 8] = "eyebrowsCovered";
  FaceErrorCode[FaceErrorCode["eyesCovered"] = 9] = "eyesCovered";
  FaceErrorCode[FaceErrorCode["faceCovered"] = 10] = "faceCovered";
  FaceErrorCode[FaceErrorCode["wrongFaceDirection"] = 11] = "wrongFaceDirection";
  FaceErrorCode[FaceErrorCode["eyeOpeningDetected"] = 12] = "eyeOpeningDetected";
  FaceErrorCode[FaceErrorCode["eyesClosedStatus"] = 13] = "eyesClosedStatus";
  FaceErrorCode[FaceErrorCode["failedToDetectEye"] = 14] = "failedToDetectEye";
  FaceErrorCode[FaceErrorCode["needTurnHeadToLeft"] = 15] = "needTurnHeadToLeft";
  FaceErrorCode[FaceErrorCode["needTurnHeadToRight"] = 16] = "needTurnHeadToRight";
  FaceErrorCode[FaceErrorCode["needRaiseHead"] = 17] = "needRaiseHead";
  FaceErrorCode[FaceErrorCode["needLowerHead"] = 18] = "needLowerHead";
  FaceErrorCode[FaceErrorCode["needTiltHeadToLeft"] = 19] = "needTiltHeadToLeft";
  FaceErrorCode[FaceErrorCode["needTiltHeadToRight"] = 20] = "needTiltHeadToRight";
  return FaceErrorCode;
}(FaceErrorCode || {});
;
var ConnectState = /*#__PURE__*/function (ConnectState) {
  ConnectState[ConnectState["Timeout"] = 0] = "Timeout";
  ConnectState[ConnectState["Success"] = 1] = "Success";
  ConnectState[ConnectState["Fail"] = 2] = "Fail";
  return ConnectState;
}(ConnectState || {});
var TTLockEvent = /*#__PURE__*/function (TTLockEvent) {
  TTLockEvent["ScanLock"] = "EventScanLock";
  TTLockEvent["AddCardProgrress"] = "EventAddCardProgrress";
  TTLockEvent["AddFingerprintProgress"] = "EventAddFingerprintProgrress";
  TTLockEvent["AddFaceProgrress"] = "EventAddFaceProgrress";
  TTLockEvent["ListenBluetoothState"] = "EventBluetoothState";
  TTLockEvent["ScanLockWifi"] = "EventScanLockWifi";
  return TTLockEvent;
}(TTLockEvent || {});
var TtRemoteKeyEvent = /*#__PURE__*/function (TtRemoteKeyEvent) {
  TtRemoteKeyEvent["ScanRemoteKey"] = "EventScanRemoteKey";
  return TtRemoteKeyEvent;
}(TtRemoteKeyEvent || {});
var TtDoorSensorEvent = /*#__PURE__*/function (TtDoorSensorEvent) {
  TtDoorSensorEvent["ScanDoorSensor"] = "EventScanDoorSensor";
  return TtDoorSensorEvent;
}(TtDoorSensorEvent || {});
var GatewayEvent = /*#__PURE__*/function (GatewayEvent) {
  GatewayEvent["ScanGateway"] = "EventScanGateway";
  GatewayEvent["ScanWifi"] = "EventScanWifi";
  return GatewayEvent;
}(GatewayEvent || {});
var WirelessKeypadEvent = /*#__PURE__*/function (WirelessKeypadEvent) {
  WirelessKeypadEvent["ScanWirelessKeypad"] = "EventWirelessKeypad";
  return WirelessKeypadEvent;
}(WirelessKeypadEvent || {});
var GatewayType = /*#__PURE__*/function (GatewayType) {
  GatewayType[GatewayType["G2"] = 2] = "G2";
  GatewayType[GatewayType["G3"] = 3] = "G3";
  GatewayType[GatewayType["G4"] = 4] = "G4";
  return GatewayType;
}(GatewayType || {});
var LockAccessoryType = /*#__PURE__*/function (LockAccessoryType) {
  LockAccessoryType[LockAccessoryType["KEYPAD"] = 1] = "KEYPAD";
  LockAccessoryType[LockAccessoryType["REMOTE_KEY"] = 2] = "REMOTE_KEY";
  LockAccessoryType[LockAccessoryType["DOOR_SENSOR"] = 3] = "DOOR_SENSOR";
  return LockAccessoryType;
}(LockAccessoryType || {});
var GatewayIpSettingType = /*#__PURE__*/function (GatewayIpSettingType) {
  GatewayIpSettingType[GatewayIpSettingType["STATIC_IP"] = 0] = "STATIC_IP";
  GatewayIpSettingType[GatewayIpSettingType["DHCP"] = 1] = "DHCP";
  return GatewayIpSettingType;
}(GatewayIpSettingType || {});
export { Ttlock, TtGateway, TtRemoteKey, TtDoorSensor, TtWirelessKeypad, BluetoothState, LockFunction, LockRecordType, LockConfigType, LockPassageMode, LockControlType, LockState, ConnectState, GatewayType, GatewayIpSettingType, LockSoundVolume, TtRemoteKeyEvent, TtDoorSensorEvent, LockUnlockDirection, LockAccessoryType, WirelessKeypadEvent, FaceState, FaceErrorCode };
//# sourceMappingURL=index.js.map