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

  /**
   * Scan for nearby gateways （Only newly powered gateways can be scanned）
   * @param callback  If there is a reenergized gateway nearby, the callback will be performed multiple times
   */
  static startScan(callback: ((scanGatewayModal: ScanGatewayModal) => void)) {
    let subscription = subscriptionMap.get(GatewayEvent.ScanGateway)
    if (subscription !== undefined) {
      subscription.remove()
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
    let subscription = subscriptionMap.get(GatewayEvent.ScanGateway)
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(GatewayEvent.ScanGateway);
  }

  /**
   * Connected to the gateway Only newly powered gateways can be connected）
   * @param mac 
   * @param success 
   * @param fail 
   */
  static connect(mac: string, success: ((state: ConnectState) => void), fail: null | ((state: ConnectState) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.connect(mac, (state: number) => {
      if (state === 1) {
        success(ConnectState.Success);
      } else if (state === 0){
        fail!(ConnectState.Timeout);
      }else{
        fail!(ConnectState.Fail);
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

    let subscription = ttlockEventEmitter.addListener(GatewayEvent.ScanWifi, (responData) => {
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
  static startScan(callback: null | ((lockScanModal: ScanLockModal) => void)) {
    let subscription = subscriptionMap.get(TTLockEvent.ScanLock)
    if (subscription !== undefined) {
      subscription.remove()
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

  /**
   * Controle the lock Unlock or lock or other operations
   * @param control  LockControlType
   * @param lockData string
   * @param success successful callback
   * @param fail failed callback
   */
  static controlLock(control: LockControlType, lockData: string, success: null | ((lockTime: number, electricQuantity: number, uniqueId: number) => void), fail: null | ((errorCode: number, description: string) => void)) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttlockModule.controlLock(control, lockData, (dataArray: number[]) => {
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
  static getLockSwitchState(lockData: string, success: null | ((state: LockState) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;

    ttlockModule.getLockSwitchState(lockData, (state: number) => {
      let lockState = [
        LockState.Locked,
        LockState.Unlock,
        LockState.Unknow,
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
  static addCard(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: (() => void), success: null | ((cardNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    let subscription = ttlockEventEmitter.addListener(TTLockEvent.AddCardProgrress, () => {
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

    let subscription = ttlockEventEmitter.addListener(TTLockEvent.AddFingerprintProgress, (dataArray: number[]) => {
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


  /**
   * Read the operation record of the lock. 
   * @param type LockRecordType
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static getLockOperationRecord(type: LockRecordType, lockData: string, success: null | ((records: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
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

  /**
   * Get config of the lock
   * @param config 
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static getLockConfig(config: LockConfigType, lockData: string, success: null | ((type: number, isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockConfig(config, lockData, success, fail);
  }

  /**
   * Set config of the lock
   * @param config 
   * @param isOn 
   * @param lockData 
   * @param success 
   * @param fail 
   */
  static setLockConfig(config: LockConfigType, isOn: boolean, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockConfig(config, isOn, lockData, success, fail);
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
  static addPassageMode(mode: LockPassageMode, days: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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
  static clearAllPassageModes(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllPassageModes(lockData, success, fail);
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
  static getBluetoothState(callback: (state: BluetoothState) => void) {
    callback = callback || this.defaultCallback;
    ttlockModule.getBluetoothState((state: number) => {
      var bluetoothState = [
        BluetoothState.Unknow,
        BluetoothState.Resetting,
        BluetoothState.Unsupport,
        BluetoothState.Unauthorized,
        BluetoothState.On,
        BluetoothState.Off
      ][state];
      callback(bluetoothState);
    });
  }

  static supportFunction(fuction: LockFunction, lockData: string, callback: (isSupport: boolean) => void) {
    ttlockModule.supportFunction(fuction, lockData, callback);
  }

}

enum BluetoothState {
  Unknow = 0,
  Resetting = 1,
  Unsupport = 2,
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
  DoorSensor = 13,
  RemoteUnlockSwicth = 14,
  AudioSwitch = 15,
  NbIot = 16,
  GetAdminPasscode = 18,
  HtelCard = 19,
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
  FingerVein = 37,
  NbAwake = 39,
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
  PrivacyLock = 5
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
  Unknow = 2,
  CarOnLock
}

enum ConnectState {
  Timeout = 0,
  Success = 1,
  Fail = 2
}

enum TTLockEvent {
  ScanLock = "EventScanLock",
  AddCardProgrress = "EventAddCardProgrress",
  AddFingerprintProgress = "EventAddFingerprintProgrress",
  ListenBluetoothState = "EventBluetoothState"
};


enum GatewayEvent {
  ScanGateway = "EventScanGateway",
  ScanWifi = "EventScanWifi"
};




export { Ttlock, TtGateway, BluetoothState, LockFunction, LockRecordType, LockConfigType, LockPassageMode, LockControlType, LockState, ConnectState }
export * from './types'
