import {
  NativeModules,
  NativeEventEmitter,
  // EmitterSubscription,
} from 'react-native';

import type { ScanGatewayModal, ScanLockModal, InitGatewayParam, CycleDateParam, ScanWifiModal, InitGatewayModal, LockVersion, ScanRemoteKeyModal, ScanDoorSensorModal, DeviceSystemModal, ScanWirelessKeypadModal, WifiLockServerInfo } from './types'

const ttLockModule = NativeModules.Ttlock;
const ttLockEventEmitter = new NativeEventEmitter(ttLockModule);

const subscriptionMap = new Map();

class TtWirelessKeypad {

  static defaultCallback = function () { };
  static startScan(callback: ((scanModal: ScanWirelessKeypadModal) => void)) {

    let subscription = subscriptionMap.get(WirelessKeypadEvent.ScanWirelessKeypad)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttLockEventEmitter.addListener(WirelessKeypadEvent.ScanWirelessKeypad, callback);
    subscriptionMap.set(WirelessKeypadEvent.ScanWirelessKeypad, subscription);
    ttLockModule.startScanWirelessKeypad();
  }

  static stopScan() {
    ttLockModule.stopScanWirelessKeypad();
    let subscription = subscriptionMap.get(WirelessKeypadEvent.ScanWirelessKeypad)
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(WirelessKeypadEvent.ScanWirelessKeypad);
  }

  static init(mac: string, lockMac: string, success: ((electricQuantity: number, wirelessKeypadFeatureValue: string) => void), fail: null | ((errorCode: RemoteKeyPadErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.initWirelessKeypad(mac, lockMac, (dataArray: any[]) => {
      success!(dataArray[0], dataArray[1]);
    }, (errorCode: RemoteKeyPadErrorCode) => {
      let description = "Init wireless keypad fail.";
      if (errorCode === RemoteKeyPadErrorCode.wrongCRC) {
        description += "Wrong crc";
      } else if (errorCode === RemoteKeyPadErrorCode.connectTimeout) {
        description += "Connect timeout";
      } else if (errorCode === RemoteKeyPadErrorCode.wrongFactoryDate) {
        description += "Wrong factory date";
      }
      fail!(errorCode, description);
    });
  }
}

class TtDoorSensor {

  static defaultCallback = function () { };

  static startScan(callback: ((scanModal: ScanDoorSensorModal) => void)) {
    let subscription = subscriptionMap.get(TtDoorSensorEvent.ScanDoorSensor)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttLockEventEmitter.addListener(TtDoorSensorEvent.ScanDoorSensor, callback);
    subscriptionMap.set(TtDoorSensorEvent.ScanDoorSensor, subscription);
    ttLockModule.startScanDoorSensor();
  }

  static stopScan() {
    ttLockModule.stopScanDoorSensor();
    let subscription = subscriptionMap.get(TtDoorSensorEvent.ScanDoorSensor)
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(TtDoorSensorEvent.ScanDoorSensor);
  }

  static init(mac: string, lockData: string, success: ((electricQuantity: number, systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: DoorSensorErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.initDoorSensor(mac, lockData, (dataArray: any[]) => {
      success!(dataArray[0], dataArray[1]);
    }, (errorCode: DoorSensorErrorCode) => {
      let description = "Init door sensor fail.";
      if (errorCode === DoorSensorErrorCode.bluetoothPowerOff) {
        description += "Bluetooth is power off";
      } else if (errorCode === DoorSensorErrorCode.connectTimeout) {
        description += "Connect timeout";
      } else if (errorCode === DoorSensorErrorCode.wrongCRC) {
        description += "Wrong crc";
      }
      fail!(errorCode, description);
    });
  }
}



class TtRemoteKey {

  static defaultCallback = function () { };

  static startScan(callback: ((scanModal: ScanRemoteKeyModal) => void)) {
    let subscription = subscriptionMap.get(TtRemoteKeyEvent.ScanRemoteKey)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttLockEventEmitter.addListener(TtRemoteKeyEvent.ScanRemoteKey, callback);
    subscriptionMap.set(TtRemoteKeyEvent.ScanRemoteKey, subscription);
    ttLockModule.startScanRemoteKey();
  }

  static stopScan() {
    ttLockModule.stopScanRemoteKey();
    let subscription = subscriptionMap.get(TtRemoteKeyEvent.ScanRemoteKey)
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(TtRemoteKeyEvent.ScanRemoteKey);
  }

  static init(mac: string, lockData: string, success: ((electricQuantity: number, systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: RemoteKeyErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.initRemoteKey(mac, lockData, (dataArray: any[]) => {
      success!(dataArray[0], dataArray[1]);
    }, (errorCode: RemoteKeyErrorCode) => {
      let description = "Init remote key fail.";
      if (errorCode === RemoteKeyErrorCode.wrongCRC) {
        description += "Wrong CRC";
      } else if (errorCode === RemoteKeyErrorCode.connectTimeout) {
        description += "Connect timeout";
      }
      fail!(errorCode, description);
    });
  }
}

class TtGateway {
  static defaultCallback = function () { };

  /**
   * Scan for nearby gateways （Only newly powered gateways can be scanned）
   * @param callback  If there is a reenergized gateway nearby, the callback will be performed multiple times
   */
  static startScan(callback: ((scanGatewayModal: ScanGatewayModal) => void)) {
    let subscription = subscriptionMap.get(GatewayEvent.ScanGateway)
    if (subscription !== undefined) {
      subscription.remove()
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
    let subscription = subscriptionMap.get(GatewayEvent.ScanGateway)
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
  static connect(mac: string, callback: ((state: ConnectState) => void)) {
    callback = callback || this.defaultCallback;
    ttLockModule.connect(mac, (state: number) => {
      let connectState = [ConnectState.Timeout, ConnectState.Success, ConnectState.Fail][state];
      callback!(connectState);
    });
  }

  /**
   * Read wifi near the gateway
   * @param progress
   * @param finish
   * @param fail
   */
  static getNearbyWifi(progress: ((scanWifiModalList: ScanWifiModal[]) => void), finish: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    progress = progress || this.defaultCallback;
    finish = finish || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let subscription = ttLockEventEmitter.addListener(GatewayEvent.ScanWifi, (responseData: ScanWifiModal[]) => {
      progress(responseData);
    });

    ttLockModule.getNearbyWifi((state: number) => {
      subscription.remove();
      if (state === 0) {
        finish!();
      } else {
        fail!(1, "Failed to get nearby wifi. Please confirm whether there is wifi nearby or reconnect to the gateway try again");
      }
    });
  }

  /**
   * Initialize gateway
   * @param object
   * @param success
   * @param fail
   */
  static initGateway(object: InitGatewayParam, success: ((initGatewayModal: InitGatewayModal) => void), fail: null | ((errorCode: GatewayErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.initGateway(object, success, (errorCode: GatewayErrorCode) => {
      let description = "Init gateway fail.";
      if (errorCode === 3) {
        description += "Wrong wifi";
      } else if (errorCode === 4) {
        description += "Wrong wifi password";
      }
      fail!(errorCode, description);
    });
  }

}


class Ttlock {

  static defaultCallback = function () { };

  /**
   * Scan for nearby Bluetooth locks
   * @param callback  The Callback will be executed multiple times if there is a Bluetooth lock nearby
   */
  static startScan(callback: null | ((scanLockModal: ScanLockModal) => void)) {
    let subscription = subscriptionMap.get(TTLockEvent.ScanLock)
    if (subscription !== undefined) {
      subscription.remove()
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
    let subscription = subscriptionMap.get(TTLockEvent.ScanLock)
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
  static initLock(object: object, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.initLock(object, success, fail);
  }


  static getLockVersionWithLockMac(lockMac: string, success: null | ((lockVersion: LockVersion) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockVersionWithLockMac(lockMac, success, fail);
  }

  static getAccessoryElectricQuantity(accessoryType: LockAccessoryType, accessoryMac: string, lockData: string, success: ((electricQuantity: number, updateDate: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getAccessoryElectricQuantity(accessoryType, accessoryMac, lockData, (dataArray: number[]) => {
      success!(dataArray[0], dataArray[1]);
    }, fail);
  }


  /**
   * Reset the lock.
   * @param lockData
   * @param success
   * @param fail
   */
  static resetLock(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static resetEkey(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static controlLock(control: LockControlType, lockData: string, success: null | ((lockTime: number, electricQuantity: number, uniqueId: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttLockModule.controlLock(control, lockData, (dataArray: number[]) => {
      success!(dataArray[0], dataArray[1], dataArray[2]);
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
  static createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static modifyPasscode(passcodeOrigin: string, passcodeNew: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static deletePasscode(passcode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static resetPasscode(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static getLockSwitchState(lockData: string, success: null | ((state: LockState) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;

    ttLockModule.getLockSwitchState(lockData, (state: number) => {
      let lockState = [
        LockState.Locked,
        LockState.Unlock,
        LockState.Unknown,
        LockState.CarOnLock
      ][state];
      success!(lockState);
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
  static addCard(cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, progress: (() => void), success: null | ((cardNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    let subscription = ttLockEventEmitter.addListener(TTLockEvent.AddCardProgress, () => {
      progress();
    });
    ttLockModule.addCard(cycleList, startDate, endDate, lockData, (cardNumber: string) => {
      subscription.remove();
      success!(cardNumber);
    }, (errorCode: LockErrorCode, errorDesc: string) => {
      subscription.remove();
      fail!(errorCode, errorDesc);
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
  static modifyCardValidityPeriod(cardNumber: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static deleteCard(cardNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static clearAllCards(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static addFingerprint(cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, progress: null | ((currentCount: number, totalCount: number) => void), success: null | ((fingerprintNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    let subscription = ttLockEventEmitter.addListener(TTLockEvent.AddFingerprintProgress, (dataArray: number[]) => {
      progress!(dataArray[0], dataArray[1]);
    });
    ttLockModule.addFingerprint(cycleList, startDate, endDate, lockData, (fingerprintNumber: string) => {
      subscription.remove();
      success!(fingerprintNumber);
    }, (errorCode: LockErrorCode, errorDesc: string) => {
      subscription.remove();
      fail!(errorCode, errorDesc);
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
  static modifyFingerprintValidityPeriod(fingerprintNumber: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static deleteFingerprint(fingerprintNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static clearAllFingerprints(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static modifyAdminPasscode(adminPasscode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static setLockTime(timestamp: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static getLockTime(lockData: string, success: null | ((lockTimestamp: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockTime(lockData, success, fail);
  }

  static getLockSystem(lockData: string, success: null | ((systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockSystem(lockData, success, fail);
  }

  static getLockElectricQuantity(lockData: string, success: null | ((electricQuantity: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static getLockOperationRecord(type: LockRecordType, lockData: string, success: null | ((records: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static getLockAutomaticLockingPeriodicTime(lockData: string, success: null | ((currentTime: number, maxTime: number, minTime: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockAutomaticLockingPeriodicTime(lockData, (data: number[]) => {
      success!(data[0], data[1], data[2]);
    }, fail);
  }

  /**
   * Set the lock automatic locking periodic time
   * @param seconds
   * @param lockData
   * @param success
   * @param fail
   */
  static setLockAutomaticLockingPeriodicTime(seconds: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static getLockRemoteUnlockSwitchState(lockData: string, success: null | ((isOn: boolean) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static setLockRemoteUnlockSwitchState(isOn: boolean, lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static getLockConfig(config: LockConfigType, lockData: string, success: null | ((type: number, isOn: boolean) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockConfig(config, lockData, (data: any[]) => {
      success!(data[0], data[1]);
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
  static setLockConfig(config: LockConfigType, isOn: boolean, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setLockConfig(config, isOn, lockData, success, fail);
  }


  static setLockSoundVolume(soundVolume: LockSoundVolume, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setLockSoundVolume(soundVolume, lockData, success, fail);
  }

  static getLockSoundVolume(lockData: string, success: null | ((lockSoundVolume: LockSoundVolume) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getLockSoundVolume(lockData, success, fail);
  }


  static getUnlockDirection(lockData: string, success: null | ((direction: LockUnlockDirection) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getUnlockDirection(lockData, success, fail);
  }


  static setUnlockDirection(direction: LockUnlockDirection, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setUnlockDirection(direction, lockData, success, fail);
  }


  static setUnlockDirectionAutomatic(lockData: string, success: null | ((direction: LockUnlockDirection) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static addPassageMode(mode: LockPassageMode, days: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static clearAllPassageModes(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.clearAllPassageModes(lockData, success, fail);
  }

  static addRemoteKey(remoteKeyMac: string, cycleDateList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleDateList = cycleDateList || [];
    ttLockModule.addRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail);
  }

  static modifyRemoteKey(remoteKeyMac: string, cycleDateList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleDateList = cycleDateList || [];
    ttLockModule.modifyRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail);
  }

  static deleteRemoteKey(remoteKeyMac: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.deleteRemoteKey(remoteKeyMac, lockData, success, fail);
  }

  static clearAllRemoteKey(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.clearAllRemoteKey(lockData, success, fail);
  }


  static addDoorSensor(doorSensorMac: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.addDoorSensor(doorSensorMac, lockData, success, fail);
  }

  static clearAllDoorSensor(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.clearAllDoorSensor(lockData, success, fail);
  }


  static setDoorSensorAlertTime(time: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static recoverCard(cardNumber: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | ((cardNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttLockModule.recoverCard(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
  }

  static recoverPasscode(passcode: string, passcodeType: number, cycleType: number, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.recoverPasscode(passcode, passcodeType, cycleType, startDate, endDate, lockData, success, fail);
  }

  static scanWifi(lockData: string, callback: ((isFinished: boolean, wifiList: []) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    let subscription = subscriptionMap.get(TTLockEvent.ScanLockWifi)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttLockEventEmitter.addListener(TTLockEvent.ScanLockWifi, (data: any[]) => {
      callback!(data[0], data[1]);
    });
    subscriptionMap.set(TTLockEvent.ScanLockWifi, subscription);
    ttLockModule.scanWifi(lockData, fail);
  }

  static configWifi(wifiName: string, wifiPassword: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.configWifi(wifiName, wifiPassword, lockData, success, fail);
  }


  static configServer(ip: string, port: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.configServer(ip, port, lockData, success, fail);
  }

  static getWifiInfo(lockData: string, success: null | ((wifiMac: string, wifiRssi: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.getWifiInfo(lockData, (data: any[]) => {
      success!(data[0], data[1]);
    }, fail);
  }


  static getWifiPowerSavingTime(lockData: string, success: ((timesJsonString: undefined | string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static configWifiPowerSavingTime(weekDays: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.configWifiPowerSavingTime(weekDays, startDate, endDate, lockData, success, fail);
  }

  static clearWifiPowerSavingTime(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.clearWifiPowerSavingTime(lockData, success, fail);
  }


  static configIp(info:WifiLockServerInfo, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.configIp(info,lockData, success, fail);
  }


  static addFace(cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, progress: ((state: FaceState, FaceErrorCode: FaceErrorCode) => void), success: null | ((faceNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    let subscription = ttLockEventEmitter.addListener(TTLockEvent.AddFaceProgress, (dataArray: number[]) => {
      progress(dataArray[0], dataArray[1]);
    });
    ttLockModule.addFace(cycleList, startDate, endDate, lockData, (cardNumber: string) => {
      subscription.remove();
      success!(cardNumber);
    }, (errorCode: LockErrorCode, errorDesc: string) => {
      subscription.remove();
      fail!(errorCode, errorDesc);
    });
  }

  static addFaceFeatureData(faceFeatureData: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | ((faceNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttLockModule.addFaceFeatureData(faceFeatureData, cycleList, startDate, endDate, lockData, (faceNumber: string) => {
      success!(faceNumber);
    }, (errorCode: LockErrorCode, errorDesc: string) => {
      fail!(errorCode, errorDesc);
    });
  }

  static modifyFaceValidityPeriod(cycleList: null | CycleDateParam[], startDate: number, endDate: number, faceNumber:string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttLockModule.modifyFaceValidityPeriod(cycleList, startDate, endDate, faceNumber, lockData, success, fail);
  }

  static deleteFace(faceNumber:string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.deleteFace(faceNumber, lockData, success, fail);
  }

  static clearAllFace(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static activateLiftFloors(floors: string, lockData: string, success: null | ((lockTime: number, electricQuantity: number, uniqueId: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.activateLiftFloors(floors, lockData, (dataArray: any[]) => {
      success!(dataArray[0], dataArray[1], dataArray[2]);
    }, fail);
  }

  /**
   * Set Lift Control Enable Floors
   * @param floors lift floors,connect with comma symbol,such as: @"1,2,3"
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static setLiftControlEnableFloors(floors: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttLockModule.setLiftControlEnableFloors(floors, lockData, success, fail);
  }

    static setLiftWorkMode(workMode: LiftWorkMode, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
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
  static getBluetoothState(callback: (state: BluetoothState) => void) {
    callback = callback || this.defaultCallback;
    ttLockModule.getBluetoothState((state: number) => {
      var bluetoothState = [
        BluetoothState.Unknown,
        BluetoothState.Resetting,
        BluetoothState.Unsupported,
        BluetoothState.Unauthorized,
        BluetoothState.On,
        BluetoothState.Off
      ][state];
      callback(bluetoothState);
    });
  }

  static supportFunction(lockFunction: LockFunction, lockData: string, callback: (isSupport: boolean) => void) {
    ttLockModule.supportFunction(lockFunction, lockData, callback);
  }

}

enum BluetoothState {
  Unknown = 0,
  Resetting = 1,
  Unsupported = 2,
  Unauthorized = 3,
  On = 4,
  Off = 5
}

enum LockFunction {
  Passcode = 0,
  IcCard = 1,
  Fingerprint = 2,
  Wristband = 3,
  AutoLock = 4,
  DeletePasscode = 5,
  ManagePasscode = 7,
  Locking = 8,
  PasscodeVisible = 9,
  GatewayUnlock = 10,
  LockFreeze = 11,
  CyclePassword = 12,
  RemoteUnlockSwitch = 14,
  AudioSwitch = 15,
  NbIot = 16,
  GetAdminPasscode = 18,
  HotelCard = 19,
  NoClock = 20,
  NoBroadcastInNormal = 21,
  PassageMode = 22,
  TurnOffAutoLock = 23,
  WirelessKeypad = 24,
  Light = 25,
  HotelCardBlacklist = 26,
  IdentityCard = 27,
  TamperAlert = 28,
  ResetButton = 29,
  PrivacyLock = 30,
  DeadLock = 32,
  CyclicCardOrFingerprint = 34,
  UnlockDirection = 36,
  FingerVein = 37,
  NbAwake = 39,
  RecoverCyclePasscode = 40,
  RemoteKey = 41,
  GetAccessoryElectricQuantity = 42,
  SoundVolume = 43,
  QRCode = 44,
  SensorState = 45,
  PassageModeAutoUnlock = 46,
  DoorSensor = 50,
  DoorSensorAlert = 51,
  Sensitivity = 52,
  Face = 53,
  CpuCard = 55,
  Wifi = 56,
  WifiStaticIP = 58,
  PasscodeKeyNumber = 60,
  AutoSetUnlockDirection = 81
}

enum LockRecordType {
  Latest = 0,
  All = 1
}


enum LockConfigType {
  Audio = 0,
  PasscodeVisible = 1,
  Freeze = 2,
  TamperAlert = 3,
  ResetButton = 4,
  PrivacyLock = 5,
  PassageModeAutoUnlock = 6,
  WifiPowerSavingMode = 7,
  DoubleAuth = 8,
  PublicMode = 9,
  LowBatteryAutoUnlock = 10
}

enum LockSoundVolume {
  On = -1,
  Off = 0,
  Level_1 = 1,
  Level_2 = 2,
  Level_3 = 3,
  Level_4 = 4,
  Level_5 = 5
}


enum LockUnlockDirection {
  Unknown = 0,
  Left = 1,
  Right = 2
}

enum LockPassageMode {
  Weekly = 0,
  Monthly = 1
}

enum LockControlType {
  Unlock = 0,
  Lock = 1
}

enum LockState {
  Locked = 0,
  Unlock = 1,
  Unknown = 2,
  CarOnLock
}

enum FaceState {
  canAddFace = 0,
  addFail = 1
}

enum FaceErrorCode {
  normal = 0,
  noFaceDetected = 1,
  tooCloseToTheTop = 2,
  tooCloseToTheBottom = 3,
  tooCloseToTheLeft = 4,
  tooCloseToTheRight = 5,
  tooFarAway = 6,
  tooClose = 7,
  eyebrowsCovered = 8,
  eyesCovered = 9,
  faceCovered = 10,
  wrongFaceDirection = 11,
  eyeOpeningDetected = 12,
  eyesClosedStatus = 13,
  failedToDetectEye = 14,
  needTurnHeadToLeft = 15,
  needTurnHeadToRight = 16,
  needRaiseHead = 17,
  needLowerHead = 18,
  needTiltHeadToLeft = 19,
  needTiltHeadToRight = 20,
};


enum LockErrorCode{
  hadReset = 0,
  crcError = 1,
  noPermission = 2,
  wrongAdminCode = 3,
  lackOfStorageSpace = 4,
  inSettingMode = 5,
  noAdmin = 6,
  notInSettingMode = 7,
  wrongDynamicCode = 8,
  isNoPower = 9,
  resetPasscode = 10,
  updatePasscodeIndex = 11,
  invalidLockFlagPos = 12,
  eKeyExpired = 13,
  passcodeLengthInvalid = 14,
  samePasscode = 15,
  eKeyInactive = 16,
  aesKey = 17,
  fail = 18,
  passcodeExist = 19,
  passcodeNotExist = 20,
  lackOfStorageSpaceWhenAddingPasscode = 21,
  invalidParaLength = 22,
  cardNotExist = 23,
  fingerprintDuplication = 24,
  fingerprintNotExist = 25,
  invalidCommand = 26,
  inFreezeMode = 27,
  invalidClientPara = 28,
  lockIsLocked = 29,
  recordNotExist = 30,
  wrongSSID = 31,
  wrongWifiPassword = 32,
  bluetoothPoweredOff = 33,
  connectionTimeout = 34,
  disconnection = 35,
  lockIsBusy = 36,
  wrongLockData = 37,
  invalidParameter = 38
}

enum DoorSensorErrorCode {
  bluetoothPowerOff = 0,
  connectTimeout = 1,
  fail = 2,
  wrongCRC = 3
}

enum RemoteKeyErrorCode {
  fail = 0,
  wrongCRC = 1,
  connectTimeout = 2
}

enum RemoteKeyPadErrorCode {
  fail = 0,
  wrongCRC = 1,
  connectTimeout = 2,
  wrongFactoryDate = 3
}


enum GatewayErrorCode {
  fail = 0,
  wrongSSID = 1,
  wrongWifiPassword = 2,
  wrongCRC = 3,
  wrongAesKey = 4,
  notConnect = 5,
  disconnect = 6,
  failConfigRouter = 7,
  failConfigServer = 8,
  failConfigAccount = 9,
  noSIM = 10,
  invalidCommand = 11,
  failConfigIP = 12,
  failInvalidIP = 13
}


enum ConnectState {
  Timeout = 0,
  Success = 1,
  Fail = 2
}

enum TTLockEvent {
  ScanLock = "EventScanLock",
  AddCardProgress = "EventAddCardProgrress",
  AddFingerprintProgress = "EventAddFingerprintProgrress",
  AddFaceProgress = "EventAddFaceProgrress",
  ListenBluetoothState = "EventBluetoothState",
  ScanLockWifi = "EventScanLockWifi",
}

enum TtRemoteKeyEvent {
  ScanRemoteKey = "EventScanRemoteKey"
}

enum TtDoorSensorEvent {
  ScanDoorSensor = "EventScanDoorSensor"
}

enum GatewayEvent {
  ScanGateway = "EventScanGateway",
  ScanWifi = "EventScanWifi"
}


enum WirelessKeypadEvent {
  ScanWirelessKeypad = "EventWirelessKeypad"
}


enum GatewayType {
  G2 = 2,
  G3 = 3,
  G4 = 4
}


enum LockAccessoryType {
  KEYPAD = 1,
  REMOTE_KEY = 2,
  DOOR_SENSOR = 3
}

enum GatewayIpSettingType {
  STATIC_IP = 0,
  DHCP = 1
}

enum LiftWorkMode {
  ACTIVATE_ALL_FLOORS = 0,
  ACTIVATE_SPECIFIC_FLOORS = 1
}

export { Ttlock, TtGateway, TtRemoteKey, TtDoorSensor, TtWirelessKeypad, BluetoothState, LockFunction, LockRecordType, LockConfigType, LockPassageMode, LockControlType, LockState, ConnectState, GatewayType, GatewayIpSettingType, LockSoundVolume, TtRemoteKeyEvent, TtDoorSensorEvent, LockUnlockDirection, LockAccessoryType, ScanLockModal, ScanRemoteKeyModal, ScanDoorSensorModal, DeviceSystemModal, WirelessKeypadEvent, ScanWirelessKeypadModal, WifiLockServerInfo, FaceState, FaceErrorCode, LockErrorCode, DoorSensorErrorCode, RemoteKeyErrorCode, RemoteKeyPadErrorCode, GatewayErrorCode, InitGatewayModal, InitGatewayParam, LiftWorkMode};
