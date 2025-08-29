import NativeTTLock from './NativeTtlock';

import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.Ttlock);

export class Ttlock {

  static defaultCallback = function () { };
  static getBluetoothState(callback: (state: BluetoothState) => void) {
    NativeTTLock.getBluetoothState(
      (state: number) => {
        var bluetoothState = [
          BluetoothState.Unknown,
          BluetoothState.Resetting,
          BluetoothState.Unsupported,
          BluetoothState.Unauthorized,
          BluetoothState.On,
          BluetoothState.Off
        ][state] ?? BluetoothState.Unknown;
        callback(bluetoothState);
      }
    );
  }

  static startScan(callback: (scanLockModal: ScanLockModal) => void) {
    this.stopScan();
    callback = callback || this.defaultCallback;
    eventEmitter.addListener(TTLockEvent.SCAN_LOCK, callback);
    NativeTTLock.startScan();
  }

  static stopScan() {
    NativeTTLock.stopScan();
    eventEmitter.removeAllListeners(TTLockEvent.SCAN_LOCK);
  }


  /**
   * Initialize lock
   * @param object {lockMac:"ea:09:e2:99:33", lockVersion:"{\"protocolType\":5,\"protocolVersion\":3,\"scene\":2,\"groupId\":1,\"orgId\":1}"}
   * @param success
   * @param fail
   */
  static initLock(object: Object, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.initLock(object, success, fail);
  }


  static getLockVersionWithLockMac(lockMac: string, success: null | ((lockVersion: LockVersion) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.getLockVersionWithLockMac(lockMac, (data: Object) => {
      success!(data as LockVersion);
    }, fail);
  }

  static getAccessoryElectricQuantity(accessoryType: LockAccessoryType, accessoryMac: string, lockData: string, success: ((electricQuantity: number, updateDate: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.getAccessoryElectricQuantity(accessoryType, accessoryMac, lockData, (dataArray: any[]) => {
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
    NativeTTLock.resetLock(lockData, success, fail);
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
    NativeTTLock.resetEkey(lockData, success, fail);
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
    NativeTTLock.controlLock(control, lockData, (dataArray: any[]) => {
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
    NativeTTLock.createCustomPasscode(passcode, startDate, endDate, lockData, success, fail);
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
    NativeTTLock.modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail);
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
    NativeTTLock.deletePasscode(passcode, lockData, success, fail);
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
    NativeTTLock.resetPasscode(lockData, success, fail);
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

    NativeTTLock.getLockSwitchState(lockData, (state: number) => {
      let lockState = [
        LockState.Locked,
        LockState.Unlock,
        LockState.Unknown,
        LockState.CarOnLock
      ][state] ?? LockState.Unknown;
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

    eventEmitter.removeAllListeners(TTLockEvent.ADD_CARD_PROGRESS);
    eventEmitter.addListener(TTLockEvent.ADD_CARD_PROGRESS, () => {
      progress();
    });
    NativeTTLock.addCard(cycleList, startDate, endDate, lockData, (cardNumber: string) => {
      eventEmitter.removeAllListeners(TTLockEvent.ADD_CARD_PROGRESS);
      success!(cardNumber);
    }, (errorCode: LockErrorCode, errorDesc: string) => {
      eventEmitter.removeAllListeners(TTLockEvent.ADD_CARD_PROGRESS);
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
    NativeTTLock.modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
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
    NativeTTLock.deleteCard(cardNumber, lockData, success, fail);
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
    NativeTTLock.clearAllCards(lockData, success, fail);
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

    eventEmitter.addListener(TTLockEvent.ADD_FINGERPRINT_PROGRESS, (dataArray: any[]) => {
      progress!(dataArray[0], dataArray[1]);
    });
    NativeTTLock.addFingerprint(cycleList, startDate, endDate, lockData, (fingerprintNumber: string) => {
      eventEmitter.removeAllListeners(TTLockEvent.ADD_FINGERPRINT_PROGRESS);
      success!(fingerprintNumber);
    }, (errorCode: LockErrorCode, errorDesc: string) => {
      eventEmitter.removeAllListeners(TTLockEvent.ADD_FINGERPRINT_PROGRESS);
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
    NativeTTLock.modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail);
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
    NativeTTLock.deleteFingerprint(fingerprintNumber, lockData, success, fail);
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
    NativeTTLock.clearAllFingerprints(lockData, success, fail);
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
    NativeTTLock.modifyAdminPasscode(adminPasscode, lockData, success, fail);
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
    NativeTTLock.setLockTime(timestamp, lockData, success, fail);
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
    NativeTTLock.getLockTime(lockData, success, fail);
  }

  static getLockSystem(lockData: string, success: null | ((systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.getLockSystem(lockData, (data: Object) => {
      success!(data as DeviceSystemModal);
    }, fail);
  }

  static getLockElectricQuantity(lockData: string, success: null | ((electricQuantity: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    NativeTTLock.getLockElectricQuantity(lockData, success, fail);
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
    NativeTTLock.getLockOperationRecord(type, lockData, success, fail);
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
    NativeTTLock.getLockAutomaticLockingPeriodicTime(lockData, (data: any[]) => {
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
    NativeTTLock.setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail);
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
    NativeTTLock.getLockRemoteUnlockSwitchState(lockData, success, fail);
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
    NativeTTLock.setLockRemoteUnlockSwitchState(isOn, lockData, success, fail);
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
    NativeTTLock.getLockConfig(config, lockData, (data: any[]) => {
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
    NativeTTLock.setLockConfig(config, isOn, lockData, success, fail);
  }


  static setLockSoundVolume(soundVolume: LockSoundVolume, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.setLockSoundVolume(soundVolume, lockData, success, fail);
  }

  static getLockSoundVolume(lockData: string, success: null | ((lockSoundVolume: LockSoundVolume) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.getLockSoundVolume(lockData, success, fail);
  }


  static getUnlockDirection(lockData: string, success: null | ((direction: LockUnlockDirection) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.getUnlockDirection(lockData, success, fail);
  }


  static setUnlockDirection(direction: LockUnlockDirection, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.setUnlockDirection(direction, lockData, success, fail);
  }


  static setUnlockDirectionAutomatic(lockData: string, success: null | ((direction: LockUnlockDirection) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.setUnlockDirectionAutomatic(lockData, success, fail);
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

    NativeTTLock.addPassageMode(mode, weekly, monthly, startDate, endDate, lockData, success, fail);
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
    NativeTTLock.clearAllPassageModes(lockData, success, fail);
  }

  static addRemoteKey(remoteKeyMac: string, cycleDateList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleDateList = cycleDateList || [];
    NativeTTLock.addRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail);
  }

  static modifyRemoteKey(remoteKeyMac: string, cycleDateList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleDateList = cycleDateList || [];
    NativeTTLock.modifyRemoteKey(remoteKeyMac, cycleDateList, startDate, endDate, lockData, success, fail);
  }

  static deleteRemoteKey(remoteKeyMac: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.deleteRemoteKey(remoteKeyMac, lockData, success, fail);
  }

  static clearAllRemoteKey(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.clearAllRemoteKey(lockData, success, fail);
  }


  static addDoorSensor(doorSensorMac: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.addDoorSensor(doorSensorMac, lockData, success, fail);
  }

  static clearAllDoorSensor(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.clearAllDoorSensor(lockData, success, fail);
  }


  static setDoorSensorAlertTime(time: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.setDoorSensorAlertTime(time, lockData, success, fail);
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
    NativeTTLock.recoverCard(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
  }

  static recoverPasscode(passcode: string, passcodeType: number, cycleType: number, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.recoverPasscode(passcode, passcodeType, cycleType, startDate, endDate, lockData, success, fail);
  }

  static scanWifi(lockData: string, callback: ((isFinished: boolean, wifiList: []) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    eventEmitter.removeAllListeners(TTLockEvent.SCAN_LOCK_WIFI);
    eventEmitter.addListener(TTLockEvent.SCAN_LOCK_WIFI, (data: any[]) => {
      callback!(data[0], data[1]);
    });
    NativeTTLock.scanWifi(lockData, fail);
  }

  static configWifi(wifiName: string, wifiPassword: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.configWifi(wifiName, wifiPassword, lockData, success, fail);
  }


  static configServer(ip: string, port: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.configServer(ip, port, lockData, success, fail);
  }

  static getWifiInfo(lockData: string, success: null | ((wifiMac: string, wifiRssi: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.getWifiInfo(lockData, (data: any[]) => {
      success!(data[0], data[1]);
    }, fail);
  }


  static getWifiPowerSavingTime(lockData: string, success: ((timesJsonString: undefined | string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.getWifiPowerSavingTime(lockData, success, fail);
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
    NativeTTLock.configWifiPowerSavingTime(weekDays, startDate, endDate, lockData, success, fail);
  }

  static clearWifiPowerSavingTime(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.clearWifiPowerSavingTime(lockData, success, fail);
  }


  static configIp(info: WifiLockServerInfo, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.configIp(info, lockData, success, fail);
  }


  static addFace(cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, progress: ((state: FaceState, FaceErrorCode: FaceErrorCode) => void), success: null | ((faceNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    eventEmitter.removeAllListeners(TTLockEvent.ADD_FACE_PROGRESS);
    eventEmitter.addListener(TTLockEvent.ADD_FACE_PROGRESS, (dataArray: any[]) => {
      progress(dataArray[0], dataArray[1]);
    });
    NativeTTLock.addFace(cycleList, startDate, endDate, lockData, (cardNumber: string) => {
      eventEmitter.removeAllListeners(TTLockEvent.ADD_FACE_PROGRESS);
      success!(cardNumber);
    }, (errorCode: LockErrorCode, errorDesc: string) => {
      console.log("addFace errorCode:" + errorCode + "      errorDesc:" + errorDesc);
      eventEmitter.removeAllListeners(TTLockEvent.ADD_FACE_PROGRESS);
      fail!(errorCode, errorDesc);
    });
  }

  static addFaceFeatureData(faceFeatureData: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | ((faceNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    NativeTTLock.addFaceFeatureData(faceFeatureData, cycleList, startDate, endDate, lockData, (faceNumber: string) => {
      success!(faceNumber);
    }, (errorCode: LockErrorCode, errorDesc: string) => {
      fail!(errorCode, errorDesc);
    });
  }

  static modifyFaceValidityPeriod(cycleList: null | CycleDateParam[], startDate: number, endDate: number, faceNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    NativeTTLock.modifyFaceValidityPeriod(cycleList, startDate, endDate, faceNumber, lockData, success, fail);
  }

  static deleteFace(faceNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.deleteFace(faceNumber, lockData, success, fail);
  }

  static clearAllFace(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.clearFace(lockData, success, fail);
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
    NativeTTLock.activateLiftFloors(floors, lockData, (dataArray: any[]) => {
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
    NativeTTLock.setLiftControlEnableFloors(floors, lockData, success, fail);
  }

  static setLiftWorkMode(workMode: LiftWorkMode, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.setLiftWorkMode(workMode, lockData, success, fail);
  }

    static supportFunction(lockFunction: LockFunction, lockData: string, callback: (isSupport: boolean) => void) {
    NativeTTLock.supportFunction(lockFunction, lockData, callback);
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

}



















export class TtWirelessKeypad {

  static defaultCallback = function () { };
  static startScan(callback: ((scanModal: ScanWirelessKeypadModal) => void)) {

    eventEmitter.removeAllListeners(WirelessKeypadEvent.ScanWirelessKeypad);
    eventEmitter.addListener(WirelessKeypadEvent.ScanWirelessKeypad, callback);
    NativeTTLock.startScanWirelessKeypad();
    
  }

  static stopScan() {
    NativeTTLock.stopScanWirelessKeypad();
    eventEmitter.removeAllListeners(WirelessKeypadEvent.ScanWirelessKeypad);
  }

  static init(mac: string, lockMac: string, success: ((electricQuantity: number, wirelessKeypadFeatureValue: string) => void), fail: null | ((errorCode: RemoteKeyPadErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.initWirelessKeypad(mac, lockMac, (dataArray: any[]) => {
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

export class TtDoorSensor {

  static defaultCallback = function () { };

  static startScan(callback: ((scanModal: ScanDoorSensorModal) => void)) {
    eventEmitter.removeAllListeners(TtDoorSensorEvent.ScanDoorSensor);
    eventEmitter.addListener(TtDoorSensorEvent.ScanDoorSensor, callback);
    NativeTTLock.startScanDoorSensor();
  }

  static stopScan() {
    NativeTTLock.stopScanDoorSensor();
    eventEmitter.removeAllListeners(TtDoorSensorEvent.ScanDoorSensor);
  }

  static init(mac: string, lockData: string, success: ((electricQuantity: number, systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: DoorSensorErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.initDoorSensor(mac, lockData, (dataArray: any[]) => {
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



export class TtRemoteKey {

  static defaultCallback = function () { };

  static startScan(callback: ((scanModal: ScanRemoteKeyModal) => void)) {
    eventEmitter.removeAllListeners(TtRemoteKeyEvent.ScanRemoteKey);
    eventEmitter.addListener(TtRemoteKeyEvent.ScanRemoteKey, callback);
    NativeTTLock.startScanRemoteKey();
  }

  static stopScan() {
    NativeTTLock.stopScanRemoteKey();
    eventEmitter.removeAllListeners(TtRemoteKeyEvent.ScanRemoteKey);
  }

  static init(mac: string, lockData: string, success: ((electricQuantity: number, systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: RemoteKeyErrorCode, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    NativeTTLock.initRemoteKey(mac, lockData, (dataArray: any[]) => {
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

export class TtGateway {
  static defaultCallback = function () { };

  /**
   * Scan for nearby gateways （Only newly powered gateways can be scanned）
   * @param callback  If there is a reenergized gateway nearby, the callback will be performed multiple times
   */
  static startScan(callback: ((scanGatewayModal: ScanGatewayModal) => void)) {
    eventEmitter.removeAllListeners(GatewayEvent.ScanGateway);
    eventEmitter.addListener(GatewayEvent.ScanGateway, callback);
    NativeTTLock.startScanGateway();
  }

  /**
   * Stop scanning nearby Bluetooth locks
   */
  static stopScan() {
    NativeTTLock.stopScanGateway();
    eventEmitter.removeAllListeners(GatewayEvent.ScanGateway);
  }

  /**
   * Connected to the gateway Only newly powered gateways can be connected）
   * @param mac
   * @param callback
   */
  static connect(mac: string, callback: ((state: ConnectState) => void)) {
    callback = callback || this.defaultCallback;
    NativeTTLock.connect(mac, (state: number) => {
      let connectState = [ConnectState.Timeout, ConnectState.Success, ConnectState.Fail][state] ?? ConnectState.Fail;
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

    eventEmitter.addListener(GatewayEvent.ScanWifi, (responseData: ScanWifiModal[]) => {
      progress(responseData);
    });

    NativeTTLock.getNearbyWifi((state: number) => {
      eventEmitter.removeAllListeners(GatewayEvent.ScanWifi);
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
    NativeTTLock.initGateway(object, (data: Object) => {
      success!(data as InitGatewayModal);
    }, (errorCode: GatewayErrorCode) => {
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













export enum BluetoothState {
  Unknown = 0,
  Resetting = 1,
  Unsupported = 2,
  Unauthorized = 3,
  On = 4,
  Off = 5
}



export enum LockFunction {
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

export enum LockRecordType {
  Latest = 0,
  All = 1
}


export enum LockConfigType {
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

export enum LockSoundVolume {
  On = -1,
  Off = 0,
  Level_1 = 1,
  Level_2 = 2,
  Level_3 = 3,
  Level_4 = 4,
  Level_5 = 5
}


export enum LockUnlockDirection {
  Unknown = 0,
  Left = 1,
  Right = 2
}

export enum LockPassageMode {
  Weekly = 0,
  Monthly = 1
}

export enum LockControlType {
  Unlock = 0,
  Lock = 1
}

export enum LockState {
  Locked = 0,
  Unlock = 1,
  Unknown = 2,
  CarOnLock
}

export enum FaceState {
  canAddFace = 0,
  addFail = 1
}

export enum FaceErrorCode {
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


export enum LockErrorCode {
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

export enum DoorSensorErrorCode {
  bluetoothPowerOff = 0,
  connectTimeout = 1,
  fail = 2,
  wrongCRC = 3
}

export enum RemoteKeyErrorCode {
  fail = 0,
  wrongCRC = 1,
  connectTimeout = 2
}

export enum RemoteKeyPadErrorCode {
  fail = 0,
  wrongCRC = 1,
  connectTimeout = 2,
  wrongFactoryDate = 3
}


export enum GatewayErrorCode {
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


export enum ConnectState {
  Timeout = 0,
  Success = 1,
  Fail = 2
}


export enum TtRemoteKeyEvent {
  ScanRemoteKey = "EventScanRemoteKey"
}

export enum TtDoorSensorEvent {
  ScanDoorSensor = "EventScanDoorSensor"
}

export enum GatewayEvent {
  ScanGateway = "EventScanGateway",
  ScanWifi = "EventScanWifi"
}


export enum WirelessKeypadEvent {
  ScanWirelessKeypad = "EventWirelessKeypad"
}


export enum GatewayType {
  G2 = 2,
  G3 = 3,
  G4 = 4,
  G5 = 5,
  G6 = 6
}


export enum LockAccessoryType {
  KEYPAD = 1,
  REMOTE_KEY = 2,
  DOOR_SENSOR = 3
}

export enum GatewayIpSettingType {
  STATIC_IP = 0,
  DHCP = 1
}

export enum LiftWorkMode {
  ACTIVATE_ALL_FLOORS = 0,
  ACTIVATE_SPECIFIC_FLOORS = 1
}


enum TTLockEvent {
  SCAN_LOCK = "EventScanLock",
  ADD_CARD_PROGRESS = "EventAddCardProgrress",
  ADD_FINGERPRINT_PROGRESS = "EventAddFingerprintProgrress",
  ADD_PASSCODE_PROGRESS = "EventAddPasscodeProgrress",
  ADD_FACE_PROGRESS = "EventAddFaceProgrress",
  LISTEN_BLUETOOTH_STATE = "EventBluetoothState",
  SCAN_LOCK_WIFI = "EventScanLockWifi",
}



export interface ScanLockModal {
  lockName: string,
  lockMac: string,
  isInited: boolean,
  isKeyboardActivated: boolean,
  electricQuantity: number,
  lockVersion: string,
  lockSwitchState: number,
  rssi: number
  oneMeterRSSI: number
}


export interface ScanGatewayModal {
  gatewayName: string,
  gatewayMac: string,
  isDfuMode: boolean,
  rssi: number,
  type: number
}

export interface WifiLockServerInfo {
  type: number,  // staticIp: 0, dhcp: 1
  ipAddress: string | undefined,
  subnetMask: string | undefined,
  router: string | undefined,
  preferredDns: string | undefined,
  alternateDns: string | undefined,
}

export interface ScanRemoteKeyModal {
  remoteKeyName: string,
  remoteKeyMac: string,
  rssi: number
}

export interface ScanDoorSensorModal {
  name: string,
  mac: string,
  rssi: number,
  scanTime: number
}

export interface ScanWirelessKeypadModal {
  name: string,
  mac: string,
  rssi: number
}


export interface LockVersion {
  protocolVersion: string,
  protocolType: string,
  groupId: string,
  orgId: string,
  scene: string
}


export interface ScanWifiModal {
  wifi: string,
  rssi: number
}

export interface InitGatewayParam {
  type: number,
  gatewayName: string,
  wifi: string | undefined,
  wifiPassword: string | undefined,
  ttLockUid: number,
  ttLockLoginPassword: string,
  serverIp: string | undefined,
  serverPort: number | undefined,

  ipSettingType: number | undefined,
  ipAddress: string | undefined,
  subnetMask: string | undefined,
  router: string | undefined,
  preferredDns: string | undefined,
  alternateDns: string | undefined
}

export interface InitGatewayModal {
  modelNum: string,
  hardwareRevision: string,
  firmwareRevision: string,
}

export interface DeviceSystemModal {
  modelNum: string,
  hardwareRevision: string,
  firmwareRevision: string,

  //NB IOT LOCK
  nbOperator: string,
  nbNodeId: string,
  nbCardNumber: string,
  nbRssi: string,
  //support TTLockFeatureValuePasscodeKeyNumber
  passcodeKeyNumber: string,
  lockData: string,

}


export interface CycleDateParam {
  weekDay: number,
  startTime: number,
  endTime: number
}