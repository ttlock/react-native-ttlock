import {
  NativeModules,
  NativeEventEmitter,
  // EmitterSubscription,
} from 'react-native';

import type { ScanGatewayModal, ScanLockModal, InitGatewayParam, CardFingerprintCycleParam, ScanWifiModal, InitGatewayModal } from './types'

const ttlockModule = NativeModules.Ttlock;
const ttlockEventEmitter = new NativeEventEmitter(ttlockModule);



const subscriptionMap = new Map();

class TtGateway {
  static defaultCallback = function () { };

  static event = {
    scanGateway: "EventScanGateway",
    scanWifi: "EventScanWifi"
  };

  /**
   * Scan for nearby gateways （Only newly powered gateways can be scanned）
   * @param callback  If there is a reenergized gateway nearby, the callback will be performed multiple times
   */
  static startScan(callback: ((scanGatewayModal: ScanGatewayModal) => void)) {
    let subscription = subscriptionMap.get(TtGateway.event.scanGateway)
    if (subscription !== undefined) {
      subscription.remove()
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
    let subscription = subscriptionMap.get(TtGateway.event.scanGateway)
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
  static connect(mac: string, success: ((state: number, description: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let stateList = [
      { code: 0, description: "The bluetooth connect timeout" },
      { code: 1, description: "The bluetooth connect success" },
      { code: 2, description: "The bluetooth connect fail" }
    ]
    ttlockModule.connect(mac, (state: number) => {
      if (state === 1) {
        success(stateList[state].code, stateList[state].description);
      } else {
        fail!(stateList[state].code, stateList[state].description);
      }
    });
  }

  /**
   * Read wifi near the gateway
   * @param progress 
   * @param finish 
   * @param fail 
   */
  static getNearbyWifi(progress: ((scanWifiModal: ScanWifiModal[]) => void), finish: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    progress = progress || this.defaultCallback;
    finish = finish || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let subscription = ttlockEventEmitter.addListener(TtGateway.event.scanWifi, (responData) => {
      progress(responData);
    });

    ttlockModule.getNearbyWifi((state: number) => {
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
  static initGateway(object: InitGatewayParam, success: ((initGatewayModal: InitGatewayModal) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initGateway(object, success, (errorCode: number) => {
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


class Ttlock {

  static defaultCallback = function () { };

  static event = {
    scanLock: "EventScanLock",
    addCardProgrress: "EventAddCardProgrress",
    addFingerprintProgress: "EventAddFingerprintProgrress",
    bluetoothState: "EventBluetoothState"
  };

  /**
   * Scan for nearby Bluetooth locks
   * @param callback  The Callback will be executed multiple times if there is a Bluetooth lock nearby
   */
  static startScan(callback: null | ((lockScanModal: ScanLockModal) => void)) {
    let subscription = subscriptionMap.get(Ttlock.event.scanLock)
    if (subscription !== undefined) {
      subscription.remove()
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
    let subscription = subscriptionMap.get(Ttlock.event.scanLock)
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
  static initLock(object: object, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static resetLock(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static resetEkey(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetEkey(lockData, success, fail);
  }

  //enum control lock
  static controlEnum = Object.freeze({
    unlock: 0,
    lock: 1
  })

  /**
   * Controle the lock Unlock or lock or other operations
   * @param control  Ttlock.controlEnum.unlock or Ttlock.controlEnum.lock
   * @param lockData string
   * @param success successful callback
   * @param fail failed callback
   */
  static controlLock(control: number, lockData: string, success: null | ((lockTime: number, electricQuantity: number, uniqueId: number) => void), fail: null | ((errorCode: number, description: string) => void)) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttlockModule.controlLock(control, lockData, (dataArray:number[])=>{
      success(dataArray[0],dataArray[1],dataArray[2]);
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
  static createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static modifyPasscode(passcodeOrigin: string, passcodeNew: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static deletePasscode(passcode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static resetPasscode(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static getLockSwitchState(lockData: string, success: null | ((state: number, description: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let stateList = [
      { code: 0, description: "The lock state is locked" },
      { code: 1, description: "The lock state is unlocked" },
      { code: 2, description: "The lock state is unknow" },
      { code: 3, description: "A car on the lock" },
    ]

    ttlockModule.getLockSwitchState(lockData, (state: number) => {
      success!(stateList[state].code, stateList[state].description);
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
  static addCard(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: (() => void), success: null | ((cardNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    let subscription = ttlockEventEmitter.addListener(Ttlock.event.addCardProgrress, () => {
      progress();
    });
    ttlockModule.addCard(cycleList, startDate, endDate, lockData, (cardNumber: string) => {
      subscription.remove();
      success!(cardNumber);
    }, (errorCode: number, errorDesc: string) => {
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
  static modifyCardValidityPeriod(cardNumber: string, cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static deleteCard(cardNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static clearAllCards(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static addFingerprint(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: null | ((currentCount: number, totalCount: number) => void), success: null | ((fingerprintNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    let subscription = ttlockEventEmitter.addListener(Ttlock.event.addFingerprintProgress, (dataArray: number[]) => {
      progress!(dataArray[0], dataArray[1]);
    });
    ttlockModule.addFingerprint(cycleList, startDate, endDate, lockData, (fingerprintNumber: string) => {
      subscription.remove();
      success!(fingerprintNumber);
    }, (errorCode: number, errorDesc: string) => {
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
  static modifyFingerprintValidityPeriod(fingerprintNumber: string, cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static deleteFingerprint(fingerprintNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static clearAllFingerprints(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static modifyAdminPasscode(adminPasscode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static setLockTime(timestamp: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static getLockTime(lockData: string, success: null | ((lockTimestamp: number) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockTime(lockData, success, fail);
  }

  //enum config lock
  static lockRecordEnum = Object.freeze({
    latest: 0,
    all: 1
  })
  /**
   * Read the operation record of the lock. 
   * @param type Ttlock.lockRecordEnum.latest or Ttlock.lockRecordEnum.all
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static getLockOperateRecord(type: number, lockData: string, success: null | ((records: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static getLockAutomaticLockingPeriodicTime(lockData: string, success: null | ((currentTime: number, maxTime: number, minTime: number) => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static setLockAutomaticLockingPeriodicTime(seconds: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static getLockRemoteUnlockSwitchState(lockData: string, success: null | ((isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static setLockRemoteUnlockSwitchState(isOn: boolean, lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockRemoteUnlockSwitchState(isOn, lockData, success, fail);
  }


  //enum config lock
  static lockConfigEnum = Object.freeze({
    audio: 0,
    passcodeVisible: 1,
    freeze: 2,
    tamperAlert: 3,
    resetButton: 4,
    privacyLock: 5
  })
  /**
   * Get config of the lock
   * @param config Reference  Ttlock.lockConfigEnum
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static getLockConfig(config: number, lockData: string, success: null | ((type: number, isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static setLockConfig(config: number, isOn: boolean, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockConfig(config, isOn, lockData, success, fail);
  }


  //enum  lock passage mode
  static lockPassageModeEnum = Object.freeze({
    weekly: 0,
    monthly: 1
  })
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
  static addPassageMode(type: number, days: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static clearAllPassageModes(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllPassageModes(lockData, success, fail);
  }


  /**
   * Monitor phone's Bluetooth status
   * @param callback 
   */
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

  //enum config lock
  static lockFunction = Object.freeze({
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
    nbAwake: 39,
  })
  static supportFunction(fuction: number, lockData: string, callback: (isSupport: boolean) => void) {
    ttlockModule.supportFunction(fuction, lockData, callback);
  }

}

export { Ttlock, TtGateway }
export * from './types'
