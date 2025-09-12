"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WirelessKeypadEvent = exports.Ttlock = exports.TtWirelessKeypad = exports.TtRemoteKeyEvent = exports.TtRemoteKey = exports.TtGateway = exports.TtDoorSensorEvent = exports.TtDoorSensor = exports.RemoteKeyPadErrorCode = exports.RemoteKeyErrorCode = exports.LockUnlockDirection = exports.LockState = exports.LockSoundVolume = exports.LockRecordType = exports.LockPassageMode = exports.LockFunction = exports.LockErrorCode = exports.LockControlType = exports.LockConfigType = exports.LockAccessoryType = exports.LiftWorkMode = exports.GatewayType = exports.GatewayIpSettingType = exports.GatewayErrorCode = exports.FaceState = exports.FaceErrorCode = exports.DoorSensorErrorCode = exports.ConnectState = exports.BluetoothState = void 0;
var _reactNative = require("react-native");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const ttLockModule = _reactNative.NativeModules.Ttlock;
const ttLockEventEmitter = new _reactNative.NativeEventEmitter(ttLockModule);
const subscriptionMap = new Map();
class TtWirelessKeypad {
  static startScan(callback) {
    let subscription = subscriptionMap.get(WirelessKeypadEvent.ScanWirelessKeypad);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttLockEventEmitter.addListener(WirelessKeypadEvent.ScanWirelessKeypad, callback);
    subscriptionMap.set(WirelessKeypadEvent.ScanWirelessKeypad, subscription);
    ttLockModule.startScanWirelessKeypad();
  }
  static stopScan() {
    ttLockModule.stopScanWirelessKeypad();
    let subscription = subscriptionMap.get(WirelessKeypadEvent.ScanWirelessKeypad);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(WirelessKeypadEvent.ScanWirelessKeypad);
  }
  static init(mac, lockMac, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.initWirelessKeypad(mac, lockMac, dataArray => {
      success(dataArray[0], dataArray[1]);
    }, errorCode => {
      let description = "Init wireless keypad fail.";
      if (errorCode === RemoteKeyPadErrorCode.wrongCRC) {
        description += "Wrong crc";
      } else if (errorCode === RemoteKeyPadErrorCode.connectTimeout) {
        description += "Connect timeout";
      } else if (errorCode === RemoteKeyPadErrorCode.wrongFactoryDate) {
        description += "Wrong factory date";
      }
      fail(errorCode, description);
    });
  }
}
exports.TtWirelessKeypad = TtWirelessKeypad;
_defineProperty(TtWirelessKeypad, "defaultCallback", function () {});
class TtDoorSensor {
  static startScan(callback) {
    let subscription = subscriptionMap.get(TtDoorSensorEvent.ScanDoorSensor);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttLockEventEmitter.addListener(TtDoorSensorEvent.ScanDoorSensor, callback);
    subscriptionMap.set(TtDoorSensorEvent.ScanDoorSensor, subscription);
    ttLockModule.startScanDoorSensor();
  }
  static stopScan() {
    ttLockModule.stopScanDoorSensor();
    let subscription = subscriptionMap.get(TtDoorSensorEvent.ScanDoorSensor);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(TtDoorSensorEvent.ScanDoorSensor);
  }
  static init(mac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.initDoorSensor(mac, lockData, dataArray => {
      success(dataArray[0], dataArray[1]);
    }, errorCode => {
      let description = "Init door sensor fail.";
      if (errorCode === DoorSensorErrorCode.bluetoothPowerOff) {
        description += "Bluetooth is power off";
      } else if (errorCode === DoorSensorErrorCode.connectTimeout) {
        description += "Connect timeout";
      } else if (errorCode === DoorSensorErrorCode.wrongCRC) {
        description += "Wrong crc";
      }
      fail(errorCode, description);
    });
  }
}
exports.TtDoorSensor = TtDoorSensor;
_defineProperty(TtDoorSensor, "defaultCallback", function () {});
class TtRemoteKey {
  static startScan(callback) {
    let subscription = subscriptionMap.get(TtRemoteKeyEvent.ScanRemoteKey);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttLockEventEmitter.addListener(TtRemoteKeyEvent.ScanRemoteKey, callback);
    subscriptionMap.set(TtRemoteKeyEvent.ScanRemoteKey, subscription);
    ttLockModule.startScanRemoteKey();
  }
  static stopScan() {
    ttLockModule.stopScanRemoteKey();
    let subscription = subscriptionMap.get(TtRemoteKeyEvent.ScanRemoteKey);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(TtRemoteKeyEvent.ScanRemoteKey);
  }
  static init(mac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.initRemoteKey(mac, lockData, dataArray => {
      success(dataArray[0], dataArray[1]);
    }, errorCode => {
      let description = "Init remote key fail.";
      if (errorCode === RemoteKeyErrorCode.wrongCRC) {
        description += "Wrong CRC";
      } else if (errorCode === RemoteKeyErrorCode.connectTimeout) {
        description += "Connect timeout";
      }
      fail(errorCode, description);
    });
  }
}
exports.TtRemoteKey = TtRemoteKey;
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
    subscription = ttLockEventEmitter.addListener(GatewayEvent.ScanGateway, callback);
    subscriptionMap.set(GatewayEvent.ScanGateway, subscription);
    ttLockModule.startScanGateway();
  }

  /**
   * Stop scanning nearby Bluetooth locks
   */
  static stopScan() {
    ttLockModule.stopScanGateway();
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
    ttLockModule.connect(mac, state => {
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
    let subscription = ttLockEventEmitter.addListener(GatewayEvent.ScanWifi, responseData => {
      progress(responseData);
    });
    ttLockModule.getNearbyWifi(state => {
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
    ttLockModule.initGateway(object, success, errorCode => {
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
exports.TtGateway = TtGateway;
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
    subscription = ttLockEventEmitter.addListener(TTLockEvent.ScanLock, callback);
    subscriptionMap.set(TTLockEvent.ScanLock, subscription);
    ttLockModule.startScan();
  }

  /**
   * Stop scanning nearby Bluetooth locks
   */
  static stopScan() {
    ttLockModule.stopScan();
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
    ttLockModule.initLock(object, success, fail);
  }
  static getLockVersionWithLockMac(lockMac, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockVersionWithLockMac(lockMac, success, fail);
  }
  static getAccessoryElectricQuantity(accessoryType, accessoryMac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getAccessoryElectricQuantity(accessoryType, accessoryMac, lockData, dataArray => {
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
    ttLockModule.resetLock(lockData, success, fail);
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
    ttLockModule.resetEkey(lockData, success, fail);
  }

  /**
   * Control the lock Unlock or lock or other operations
   * @param control  LockControlType
   * @param lockData string
   * @param success successful callback
   * @param fail failed callback
   */
  static controlLock(control, lockData, success, fail) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttLockModule.controlLock(control, lockData, dataArray => {
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
    ttLockModule.createCustomPasscode(passcode, startDate, endDate, lockData, success, fail);
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
    ttLockModule.modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail);
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
    ttLockModule.deletePasscode(passcode, lockData, success, fail);
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
    ttLockModule.resetPasscode(lockData, success, fail);
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
    ttLockModule.getLockSwitchState(lockData, state => {
      let lockState = [LockState.Locked, LockState.Unlock, LockState.Unknown, LockState.CarOnLock][state];
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
    let subscription = ttLockEventEmitter.addListener(TTLockEvent.AddCardProgress, () => {
      progress();
    });
    ttLockModule.addCard(cycleList, startDate, endDate, lockData, cardNumber => {
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
    ttLockModule.modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
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
    ttLockModule.deleteCard(cardNumber, lockData, success, fail);
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
    ttLockModule.clearAllCards(lockData, success, fail);
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
    let subscription = ttLockEventEmitter.addListener(TTLockEvent.AddFingerprintProgress, dataArray => {
      progress(dataArray[0], dataArray[1]);
    });
    ttLockModule.addFingerprint(cycleList, startDate, endDate, lockData, fingerprintNumber => {
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
    ttLockModule.modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail);
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
    ttLockModule.deleteFingerprint(fingerprintNumber, lockData, success, fail);
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
    ttLockModule.clearAllFingerprints(lockData, success, fail);
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
    ttLockModule.modifyAdminPasscode(adminPasscode, lockData, success, fail);
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
    ttLockModule.setLockTime(timestamp, lockData, success, fail);
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
    ttLockModule.getLockTime(lockData, success, fail);
  }
  static getLockSystem(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockSystem(lockData, success, fail);
  }
  static getLockElectricQuantity(lockData, success, fail) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttLockModule.getLockElectricQuantity(lockData, success, fail);
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
    ttLockModule.getLockOperationRecord(type, lockData, success, fail);
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
    ttLockModule.getLockAutomaticLockingPeriodicTime(lockData, data => {
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
    ttLockModule.setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail);
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
    ttLockModule.getLockRemoteUnlockSwitchState(lockData, success, fail);
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
    ttLockModule.setLockRemoteUnlockSwitchState(isOn, lockData, success, fail);
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
    ttLockModule.getLockConfig(config, lockData, data => {
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
    ttLockModule.setLockConfig(config, isOn, lockData, success, fail);
  }
  static setLockSoundVolume(soundVolume, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setLockSoundVolume(soundVolume, lockData, success, fail);
  }
  static getLockSoundVolume(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockSoundVolume(lockData, success, fail);
  }
  static getUnlockDirection(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getUnlockDirection(lockData, success, fail);
  }
  static setUnlockDirection(direction, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setUnlockDirection(direction, lockData, success, fail);
  }
  static setUnlockDirectionAutomatic(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setUnlockDirectionAutomatic(lockData, success, fail);
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
    ttLockModule.addPassageMode(mode, weekly, monthly, startDate, endDate, lockData, success, fail);
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
    ttLockModule.clearAllPassageModes(lockData, success, fail);
  }
  static addRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleDateList = cycleDateList || [];
    ttLockModule.addRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail);
  }
  static modifyRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleDateList = cycleDateList || [];
    ttLockModule.modifyRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail);
  }
  static deleteRemoteKey(remoteKeyMac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.deleteRemoteKey(remoteKeyMac, lockData, success, fail);
  }
  static clearAllRemoteKey(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.clearAllRemoteKey(lockData, success, fail);
  }
  static addDoorSensor(doorSensorMac, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.addDoorSensor(doorSensorMac, lockData, success, fail);
  }
  static clearAllDoorSensor(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.clearAllDoorSensor(lockData, success, fail);
  }
  static setDoorSensorAlertTime(time, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setDoorSensorAlertTime(time, lockData, success, fail);
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
    ttLockModule.recoverCard(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
  }
  static recoverPasscode(passcode, passcodeType, cycleType, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.recoverPasscode(passcode, passcodeType, cycleType, startDate, endDate, lockData, success, fail);
  }
  static scanWifi(lockData, callback, fail) {
    let subscription = subscriptionMap.get(TTLockEvent.ScanLockWifi);
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscription = ttLockEventEmitter.addListener(TTLockEvent.ScanLockWifi, data => {
      callback(data[0], data[1]);
    });
    subscriptionMap.set(TTLockEvent.ScanLockWifi, subscription);
    ttLockModule.scanWifi(lockData, fail);
  }
  static configWifi(wifiName, wifiPassword, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.configWifi(wifiName, wifiPassword, lockData, success, fail);
  }
  static configServer(ip, port, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.configServer(ip, port, lockData, success, fail);
  }
  static getWifiInfo(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getWifiInfo(lockData, data => {
      success(data[0], data[1]);
    }, fail);
  }
  static getWifiPowerSavingTime(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getWifiPowerSavingTime(lockData, success, fail);
  }

  /**
   * config wifi power saving time
   * @param weekDays 1~7,1 means Monday，2 means  Tuesday ,...,7 means Sunday， such as @[@1,@3,@6,@7]
   * @param startDate The time when it becomes valid (minutes from 0 clock)
   * @param endDate The time when it is expired (minutes from 0 clock)
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static configWifiPowerSavingTime(weekDays, startDate, endDate, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.configWifiPowerSavingTime(weekDays, startDate, endDate, lockData, success, fail);
  }
  static clearWifiPowerSavingTime(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.clearWifiPowerSavingTime(lockData, success, fail);
  }
  static configIp(info, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.configIp(info, lockData, success, fail);
  }
  static addFace(cycleList, startDate, endDate, lockData, progress, success, fail) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    let subscription = ttLockEventEmitter.addListener(TTLockEvent.AddFaceProgress, dataArray => {
      progress(dataArray[0], dataArray[1]);
    });
    ttLockModule.addFace(cycleList, startDate, endDate, lockData, cardNumber => {
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
    ttLockModule.addFaceFeatureData(faceFeatureData, cycleList, startDate, endDate, lockData, faceNumber => {
      success(faceNumber);
    }, (errorCode, errorDesc) => {
      fail(errorCode, errorDesc);
    });
  }
  static modifyFaceValidityPeriod(cycleList, startDate, endDate, faceNumber, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttLockModule.modifyFaceValidityPeriod(cycleList, startDate, endDate, faceNumber, lockData, success, fail);
  }
  static deleteFace(faceNumber, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.deleteFace(faceNumber, lockData, success, fail);
  }
  static clearAllFace(lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.clearFace(lockData, success, fail);
  }

  /**
   * Activate Lift Floors
   * @param floors   lift floors,connect with comma symbol,such as: @"1,2,3"
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static activateLiftFloors(floors, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.activateLiftFloors(floors, lockData, dataArray => {
      success(dataArray[0], dataArray[1], dataArray[2]);
    }, fail);
  }

  /**
   * Set Lift Control Enable Floors
   * @param floors lift floors,connect with comma symbol,such as: @"1,2,3"
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static setLiftControlEnableFloors(floors, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setLiftControlEnableFloors(floors, lockData, success, fail);
  }
  static setLiftWorkMode(workMode, lockData, success, fail) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setLiftWorkMode(workMode, lockData, success, fail);
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
    subscription = ttLockEventEmitter.addListener(Ttlock.event.bluetoothState, (state: number) => {
      let bluetoothStateList = [
        { code: 0, description: "The bluetooth state is unknown" },
        { code: 1, description: "The bluetooth state is resetting" },
        { code: 2, description: "Current device unsupported bluetooth" },
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
    ttLockModule.getBluetoothState(state => {
      var bluetoothState = [BluetoothState.Unknown, BluetoothState.Resetting, BluetoothState.Unsupported, BluetoothState.Unauthorized, BluetoothState.On, BluetoothState.Off][state];
      callback(bluetoothState);
    });
  }
  static supportFunction(lockFunction, lockData, callback) {
    ttLockModule.supportFunction(lockFunction, lockData, callback);
  }
}
exports.Ttlock = Ttlock;
_defineProperty(Ttlock, "defaultCallback", function () {});
var BluetoothState = exports.BluetoothState = /*#__PURE__*/function (BluetoothState) {
  BluetoothState[BluetoothState["Unknown"] = 0] = "Unknown";
  BluetoothState[BluetoothState["Resetting"] = 1] = "Resetting";
  BluetoothState[BluetoothState["Unsupported"] = 2] = "Unsupported";
  BluetoothState[BluetoothState["Unauthorized"] = 3] = "Unauthorized";
  BluetoothState[BluetoothState["On"] = 4] = "On";
  BluetoothState[BluetoothState["Off"] = 5] = "Off";
  return BluetoothState;
}(BluetoothState || {});
var LockFunction = exports.LockFunction = /*#__PURE__*/function (LockFunction) {
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
  LockFunction[LockFunction["RemoteUnlockSwitch"] = 14] = "RemoteUnlockSwitch";
  LockFunction[LockFunction["AudioSwitch"] = 15] = "AudioSwitch";
  LockFunction[LockFunction["NbIot"] = 16] = "NbIot";
  LockFunction[LockFunction["GetAdminPasscode"] = 18] = "GetAdminPasscode";
  LockFunction[LockFunction["HotelCard"] = 19] = "HotelCard";
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
  LockFunction[LockFunction["PassageModeAutoUnlock"] = 46] = "PassageModeAutoUnlock";
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
var LockRecordType = exports.LockRecordType = /*#__PURE__*/function (LockRecordType) {
  LockRecordType[LockRecordType["Latest"] = 0] = "Latest";
  LockRecordType[LockRecordType["All"] = 1] = "All";
  return LockRecordType;
}(LockRecordType || {});
var LockConfigType = exports.LockConfigType = /*#__PURE__*/function (LockConfigType) {
  LockConfigType[LockConfigType["Audio"] = 0] = "Audio";
  LockConfigType[LockConfigType["PasscodeVisible"] = 1] = "PasscodeVisible";
  LockConfigType[LockConfigType["Freeze"] = 2] = "Freeze";
  LockConfigType[LockConfigType["TamperAlert"] = 3] = "TamperAlert";
  LockConfigType[LockConfigType["ResetButton"] = 4] = "ResetButton";
  LockConfigType[LockConfigType["PrivacyLock"] = 5] = "PrivacyLock";
  LockConfigType[LockConfigType["PassageModeAutoUnlock"] = 6] = "PassageModeAutoUnlock";
  LockConfigType[LockConfigType["WifiPowerSavingMode"] = 7] = "WifiPowerSavingMode";
  LockConfigType[LockConfigType["DoubleAuth"] = 8] = "DoubleAuth";
  LockConfigType[LockConfigType["PublicMode"] = 9] = "PublicMode";
  LockConfigType[LockConfigType["LowBatteryAutoUnlock"] = 10] = "LowBatteryAutoUnlock";
  return LockConfigType;
}(LockConfigType || {});
var LockSoundVolume = exports.LockSoundVolume = /*#__PURE__*/function (LockSoundVolume) {
  LockSoundVolume[LockSoundVolume["On"] = -1] = "On";
  LockSoundVolume[LockSoundVolume["Off"] = 0] = "Off";
  LockSoundVolume[LockSoundVolume["Level_1"] = 1] = "Level_1";
  LockSoundVolume[LockSoundVolume["Level_2"] = 2] = "Level_2";
  LockSoundVolume[LockSoundVolume["Level_3"] = 3] = "Level_3";
  LockSoundVolume[LockSoundVolume["Level_4"] = 4] = "Level_4";
  LockSoundVolume[LockSoundVolume["Level_5"] = 5] = "Level_5";
  return LockSoundVolume;
}(LockSoundVolume || {});
var LockUnlockDirection = exports.LockUnlockDirection = /*#__PURE__*/function (LockUnlockDirection) {
  LockUnlockDirection[LockUnlockDirection["Unknown"] = 0] = "Unknown";
  LockUnlockDirection[LockUnlockDirection["Left"] = 1] = "Left";
  LockUnlockDirection[LockUnlockDirection["Right"] = 2] = "Right";
  return LockUnlockDirection;
}(LockUnlockDirection || {});
var LockPassageMode = exports.LockPassageMode = /*#__PURE__*/function (LockPassageMode) {
  LockPassageMode[LockPassageMode["Weekly"] = 0] = "Weekly";
  LockPassageMode[LockPassageMode["Monthly"] = 1] = "Monthly";
  return LockPassageMode;
}(LockPassageMode || {});
var LockControlType = exports.LockControlType = /*#__PURE__*/function (LockControlType) {
  LockControlType[LockControlType["Unlock"] = 0] = "Unlock";
  LockControlType[LockControlType["Lock"] = 1] = "Lock";
  return LockControlType;
}(LockControlType || {});
var LockState = exports.LockState = /*#__PURE__*/function (LockState) {
  LockState[LockState["Locked"] = 0] = "Locked";
  LockState[LockState["Unlock"] = 1] = "Unlock";
  LockState[LockState["Unknown"] = 2] = "Unknown";
  LockState[LockState["CarOnLock"] = 3] = "CarOnLock";
  return LockState;
}(LockState || {});
var FaceState = exports.FaceState = /*#__PURE__*/function (FaceState) {
  FaceState[FaceState["canAddFace"] = 0] = "canAddFace";
  FaceState[FaceState["addFail"] = 1] = "addFail";
  return FaceState;
}(FaceState || {});
var FaceErrorCode = exports.FaceErrorCode = /*#__PURE__*/function (FaceErrorCode) {
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
var LockErrorCode = exports.LockErrorCode = /*#__PURE__*/function (LockErrorCode) {
  LockErrorCode[LockErrorCode["hadReset"] = 0] = "hadReset";
  LockErrorCode[LockErrorCode["crcError"] = 1] = "crcError";
  LockErrorCode[LockErrorCode["noPermission"] = 2] = "noPermission";
  LockErrorCode[LockErrorCode["wrongAdminCode"] = 3] = "wrongAdminCode";
  LockErrorCode[LockErrorCode["lackOfStorageSpace"] = 4] = "lackOfStorageSpace";
  LockErrorCode[LockErrorCode["inSettingMode"] = 5] = "inSettingMode";
  LockErrorCode[LockErrorCode["noAdmin"] = 6] = "noAdmin";
  LockErrorCode[LockErrorCode["notInSettingMode"] = 7] = "notInSettingMode";
  LockErrorCode[LockErrorCode["wrongDynamicCode"] = 8] = "wrongDynamicCode";
  LockErrorCode[LockErrorCode["isNoPower"] = 9] = "isNoPower";
  LockErrorCode[LockErrorCode["resetPasscode"] = 10] = "resetPasscode";
  LockErrorCode[LockErrorCode["updatePasscodeIndex"] = 11] = "updatePasscodeIndex";
  LockErrorCode[LockErrorCode["invalidLockFlagPos"] = 12] = "invalidLockFlagPos";
  LockErrorCode[LockErrorCode["eKeyExpired"] = 13] = "eKeyExpired";
  LockErrorCode[LockErrorCode["passcodeLengthInvalid"] = 14] = "passcodeLengthInvalid";
  LockErrorCode[LockErrorCode["samePasscode"] = 15] = "samePasscode";
  LockErrorCode[LockErrorCode["eKeyInactive"] = 16] = "eKeyInactive";
  LockErrorCode[LockErrorCode["aesKey"] = 17] = "aesKey";
  LockErrorCode[LockErrorCode["fail"] = 18] = "fail";
  LockErrorCode[LockErrorCode["passcodeExist"] = 19] = "passcodeExist";
  LockErrorCode[LockErrorCode["passcodeNotExist"] = 20] = "passcodeNotExist";
  LockErrorCode[LockErrorCode["lackOfStorageSpaceWhenAddingPasscode"] = 21] = "lackOfStorageSpaceWhenAddingPasscode";
  LockErrorCode[LockErrorCode["invalidParaLength"] = 22] = "invalidParaLength";
  LockErrorCode[LockErrorCode["cardNotExist"] = 23] = "cardNotExist";
  LockErrorCode[LockErrorCode["fingerprintDuplication"] = 24] = "fingerprintDuplication";
  LockErrorCode[LockErrorCode["fingerprintNotExist"] = 25] = "fingerprintNotExist";
  LockErrorCode[LockErrorCode["invalidCommand"] = 26] = "invalidCommand";
  LockErrorCode[LockErrorCode["inFreezeMode"] = 27] = "inFreezeMode";
  LockErrorCode[LockErrorCode["invalidClientPara"] = 28] = "invalidClientPara";
  LockErrorCode[LockErrorCode["lockIsLocked"] = 29] = "lockIsLocked";
  LockErrorCode[LockErrorCode["recordNotExist"] = 30] = "recordNotExist";
  LockErrorCode[LockErrorCode["wrongSSID"] = 31] = "wrongSSID";
  LockErrorCode[LockErrorCode["wrongWifiPassword"] = 32] = "wrongWifiPassword";
  LockErrorCode[LockErrorCode["bluetoothPoweredOff"] = 33] = "bluetoothPoweredOff";
  LockErrorCode[LockErrorCode["connectionTimeout"] = 34] = "connectionTimeout";
  LockErrorCode[LockErrorCode["disconnection"] = 35] = "disconnection";
  LockErrorCode[LockErrorCode["lockIsBusy"] = 36] = "lockIsBusy";
  LockErrorCode[LockErrorCode["wrongLockData"] = 37] = "wrongLockData";
  LockErrorCode[LockErrorCode["invalidParameter"] = 38] = "invalidParameter";
  return LockErrorCode;
}(LockErrorCode || {});
var DoorSensorErrorCode = exports.DoorSensorErrorCode = /*#__PURE__*/function (DoorSensorErrorCode) {
  DoorSensorErrorCode[DoorSensorErrorCode["bluetoothPowerOff"] = 0] = "bluetoothPowerOff";
  DoorSensorErrorCode[DoorSensorErrorCode["connectTimeout"] = 1] = "connectTimeout";
  DoorSensorErrorCode[DoorSensorErrorCode["fail"] = 2] = "fail";
  DoorSensorErrorCode[DoorSensorErrorCode["wrongCRC"] = 3] = "wrongCRC";
  return DoorSensorErrorCode;
}(DoorSensorErrorCode || {});
var RemoteKeyErrorCode = exports.RemoteKeyErrorCode = /*#__PURE__*/function (RemoteKeyErrorCode) {
  RemoteKeyErrorCode[RemoteKeyErrorCode["fail"] = 0] = "fail";
  RemoteKeyErrorCode[RemoteKeyErrorCode["wrongCRC"] = 1] = "wrongCRC";
  RemoteKeyErrorCode[RemoteKeyErrorCode["connectTimeout"] = 2] = "connectTimeout";
  return RemoteKeyErrorCode;
}(RemoteKeyErrorCode || {});
var RemoteKeyPadErrorCode = exports.RemoteKeyPadErrorCode = /*#__PURE__*/function (RemoteKeyPadErrorCode) {
  RemoteKeyPadErrorCode[RemoteKeyPadErrorCode["fail"] = 0] = "fail";
  RemoteKeyPadErrorCode[RemoteKeyPadErrorCode["wrongCRC"] = 1] = "wrongCRC";
  RemoteKeyPadErrorCode[RemoteKeyPadErrorCode["connectTimeout"] = 2] = "connectTimeout";
  RemoteKeyPadErrorCode[RemoteKeyPadErrorCode["wrongFactoryDate"] = 3] = "wrongFactoryDate";
  return RemoteKeyPadErrorCode;
}(RemoteKeyPadErrorCode || {});
var GatewayErrorCode = exports.GatewayErrorCode = /*#__PURE__*/function (GatewayErrorCode) {
  GatewayErrorCode[GatewayErrorCode["fail"] = 0] = "fail";
  GatewayErrorCode[GatewayErrorCode["wrongSSID"] = 1] = "wrongSSID";
  GatewayErrorCode[GatewayErrorCode["wrongWifiPassword"] = 2] = "wrongWifiPassword";
  GatewayErrorCode[GatewayErrorCode["wrongCRC"] = 3] = "wrongCRC";
  GatewayErrorCode[GatewayErrorCode["wrongAesKey"] = 4] = "wrongAesKey";
  GatewayErrorCode[GatewayErrorCode["notConnect"] = 5] = "notConnect";
  GatewayErrorCode[GatewayErrorCode["disconnect"] = 6] = "disconnect";
  GatewayErrorCode[GatewayErrorCode["failConfigRouter"] = 7] = "failConfigRouter";
  GatewayErrorCode[GatewayErrorCode["failConfigServer"] = 8] = "failConfigServer";
  GatewayErrorCode[GatewayErrorCode["failConfigAccount"] = 9] = "failConfigAccount";
  GatewayErrorCode[GatewayErrorCode["noSIM"] = 10] = "noSIM";
  GatewayErrorCode[GatewayErrorCode["invalidCommand"] = 11] = "invalidCommand";
  GatewayErrorCode[GatewayErrorCode["failConfigIP"] = 12] = "failConfigIP";
  GatewayErrorCode[GatewayErrorCode["failInvalidIP"] = 13] = "failInvalidIP";
  return GatewayErrorCode;
}(GatewayErrorCode || {});
var ConnectState = exports.ConnectState = /*#__PURE__*/function (ConnectState) {
  ConnectState[ConnectState["Timeout"] = 0] = "Timeout";
  ConnectState[ConnectState["Success"] = 1] = "Success";
  ConnectState[ConnectState["Fail"] = 2] = "Fail";
  return ConnectState;
}(ConnectState || {});
var TTLockEvent = /*#__PURE__*/function (TTLockEvent) {
  TTLockEvent["ScanLock"] = "EventScanLock";
  TTLockEvent["AddCardProgress"] = "EventAddCardProgrress";
  TTLockEvent["AddFingerprintProgress"] = "EventAddFingerprintProgrress";
  TTLockEvent["AddFaceProgress"] = "EventAddFaceProgrress";
  TTLockEvent["ListenBluetoothState"] = "EventBluetoothState";
  TTLockEvent["ScanLockWifi"] = "EventScanLockWifi";
  return TTLockEvent;
}(TTLockEvent || {});
var TtRemoteKeyEvent = exports.TtRemoteKeyEvent = /*#__PURE__*/function (TtRemoteKeyEvent) {
  TtRemoteKeyEvent["ScanRemoteKey"] = "EventScanRemoteKey";
  return TtRemoteKeyEvent;
}(TtRemoteKeyEvent || {});
var TtDoorSensorEvent = exports.TtDoorSensorEvent = /*#__PURE__*/function (TtDoorSensorEvent) {
  TtDoorSensorEvent["ScanDoorSensor"] = "EventScanDoorSensor";
  return TtDoorSensorEvent;
}(TtDoorSensorEvent || {});
var GatewayEvent = /*#__PURE__*/function (GatewayEvent) {
  GatewayEvent["ScanGateway"] = "EventScanGateway";
  GatewayEvent["ScanWifi"] = "EventScanWifi";
  return GatewayEvent;
}(GatewayEvent || {});
var WirelessKeypadEvent = exports.WirelessKeypadEvent = /*#__PURE__*/function (WirelessKeypadEvent) {
  WirelessKeypadEvent["ScanWirelessKeypad"] = "EventWirelessKeypad";
  return WirelessKeypadEvent;
}(WirelessKeypadEvent || {});
var GatewayType = exports.GatewayType = /*#__PURE__*/function (GatewayType) {
  GatewayType[GatewayType["G2"] = 2] = "G2";
  GatewayType[GatewayType["G3"] = 3] = "G3";
  GatewayType[GatewayType["G4"] = 4] = "G4";
  GatewayType[GatewayType["G5"] = 5] = "G5";
  GatewayType[GatewayType["G6"] = 6] = "G6";
  return GatewayType;
}(GatewayType || {});
var LockAccessoryType = exports.LockAccessoryType = /*#__PURE__*/function (LockAccessoryType) {
  LockAccessoryType[LockAccessoryType["KEYPAD"] = 1] = "KEYPAD";
  LockAccessoryType[LockAccessoryType["REMOTE_KEY"] = 2] = "REMOTE_KEY";
  LockAccessoryType[LockAccessoryType["DOOR_SENSOR"] = 3] = "DOOR_SENSOR";
  return LockAccessoryType;
}(LockAccessoryType || {});
var GatewayIpSettingType = exports.GatewayIpSettingType = /*#__PURE__*/function (GatewayIpSettingType) {
  GatewayIpSettingType[GatewayIpSettingType["STATIC_IP"] = 0] = "STATIC_IP";
  GatewayIpSettingType[GatewayIpSettingType["DHCP"] = 1] = "DHCP";
  return GatewayIpSettingType;
}(GatewayIpSettingType || {});
var LiftWorkMode = exports.LiftWorkMode = /*#__PURE__*/function (LiftWorkMode) {
  LiftWorkMode[LiftWorkMode["ACTIVATE_ALL_FLOORS"] = 0] = "ACTIVATE_ALL_FLOORS";
  LiftWorkMode[LiftWorkMode["ACTIVATE_SPECIFIC_FLOORS"] = 1] = "ACTIVATE_SPECIFIC_FLOORS";
  return LiftWorkMode;
}(LiftWorkMode || {});
//# sourceMappingURL=index.js.map