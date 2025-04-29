import type { ScanGatewayModal, ScanLockModal, InitGatewayParam, CycleDateParam, ScanWifiModal, InitGatewayModal, LockVersion, ScanRemoteKeyModal, ScanDoorSensorModal, DeviceSystemModal, ScanWirelessKeypadModal, WifiLockServerInfo } from './types';
declare class TtWirelessKeypad {
    static defaultCallback: () => void;
    static startScan(callback: ((scanModal: ScanWirelessKeypadModal) => void)): void;
    static stopScan(): void;
    static init(mac: string, lockMac: string, success: ((electricQuantity: number, wirelessKeypadFeatureValue: string) => void), fail: null | ((errorCode: RemoteKeyPadErrorCode, description: string) => void)): void;
}
declare class TtDoorSensor {
    static defaultCallback: () => void;
    static startScan(callback: ((scanModal: ScanDoorSensorModal) => void)): void;
    static stopScan(): void;
    static init(mac: string, lockData: string, success: ((electricQuantity: number, systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: DoorSensorErrorCode, description: string) => void)): void;
}
declare class TtRemoteKey {
    static defaultCallback: () => void;
    static startScan(callback: ((scanModal: ScanRemoteKeyModal) => void)): void;
    static stopScan(): void;
    static init(mac: string, lockData: string, success: ((electricQuantity: number, systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: RemoteKeyErrorCode, description: string) => void)): void;
}
declare class TtGateway {
    static defaultCallback: () => void;
    /**
     * Scan for nearby gateways （Only newly powered gateways can be scanned）
     * @param callback  If there is a reenergized gateway nearby, the callback will be performed multiple times
     */
    static startScan(callback: ((scanGatewayModal: ScanGatewayModal) => void)): void;
    /**
     * Stop scanning nearby Bluetooth locks
     */
    static stopScan(): void;
    /**
     * Connected to the gateway Only newly powered gateways can be connected）
     * @param mac
     * @param callback
     */
    static connect(mac: string, callback: ((state: ConnectState) => void)): void;
    /**
     * Read wifi near the gateway
     * @param progress
     * @param finish
     * @param fail
     */
    static getNearbyWifi(progress: ((scanWifiModalList: ScanWifiModal[]) => void), finish: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Initialize gateway
     * @param object
     * @param success
     * @param fail
     */
    static initGateway(object: InitGatewayParam, success: ((initGatewayModal: InitGatewayModal) => void), fail: null | ((errorCode: GatewayErrorCode, description: string) => void)): void;
}
declare class Ttlock {
    static defaultCallback: () => void;
    /**
     * Scan for nearby Bluetooth locks
     * @param callback  The Callback will be executed multiple times if there is a Bluetooth lock nearby
     */
    static startScan(callback: null | ((scanLockModal: ScanLockModal) => void)): void;
    /**
     * Stop scanning nearby Bluetooth locks
     */
    static stopScan(): void;
    /**
     * Initialize lock
     * @param object {lockMac:"ea:09:e2:99:33", lockVersion:"{\"protocolType\":5,\"protocolVersion\":3,\"scene\":2,\"groupId\":1,\"orgId\":1}"}
     * @param success
     * @param fail
     */
    static initLock(object: object, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static getLockVersionWithLockMac(lockMac: string, success: null | ((lockVersion: LockVersion) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static getAccessoryElectricQuantity(accessoryType: LockAccessoryType, accessoryMac: string, lockData: string, success: ((electricQuantity: number, updateDate: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Reset the lock.
     * @param lockData
     * @param success
     * @param fail
     */
    static resetLock(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Reset the all keys.
     * @param lockData
     * @param success
     * @param fail
     */
    static resetEkey(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Control the lock Unlock or lock or other operations
     * @param control  LockControlType
     * @param lockData string
     * @param success successful callback
     * @param fail failed callback
     */
    static controlLock(control: LockControlType, lockData: string, success: null | ((lockTime: number, electricQuantity: number, uniqueId: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Create a custom passcode.
     * @param passcode The password must be 4-9 digits
     * @param startDate Timestamp millisecond. The start valid time of the password.
     * @param endDate Timestamp millisecond. The expiration time of the password
     * @param lockData
     * @param success
     * @param fail
     */
    static createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
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
    static modifyPasscode(passcodeOrigin: string, passcodeNew: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Delete the passcode.
     * @param passcode
     * @param lockData
     * @param success
     * @param fail
     */
    static deletePasscode(passcode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * All passcode will be invalid after reset （Custom passcode and Admin passcode is still valid）
     * @param lockData
     * @param success
     * @param fail
     */
    static resetPasscode(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Get the lock state (unlock or lock)
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockSwitchState(lockData: string, success: null | ((state: LockState) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
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
    static addCard(cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, progress: (() => void), success: null | ((cardNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
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
    static modifyCardValidityPeriod(cardNumber: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Delete the card
     * @param cardNumber
     * @param lockData
     * @param success
     * @param fail
     */
    static deleteCard(cardNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Clear all cards
     * @param lockData
     * @param success
     * @param fail
     */
    static clearAllCards(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
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
    static addFingerprint(cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, progress: null | ((currentCount: number, totalCount: number) => void), success: null | ((fingerprintNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
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
    static modifyFingerprintValidityPeriod(fingerprintNumber: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Delete the fingerprint
     * @param fingerprintNumber
     * @param lockData
     * @param success
     * @param fail
     */
    static deleteFingerprint(fingerprintNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Clear all fingerprints
     * @param lockData
     * @param success
     * @param fail
     */
    static clearAllFingerprints(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Modify admin passcode
     * @param adminPasscode  adminPasscode must be 4-9 digits
     * @param lockData
     * @param success
     * @param fail
     */
    static modifyAdminPasscode(adminPasscode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Set the lock time
     * @param timestamp  Millisecond.
     * @param lockData
     * @param success
     * @param fail
     */
    static setLockTime(timestamp: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Get the lock time
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockTime(lockData: string, success: null | ((lockTimestamp: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static getLockSystem(lockData: string, success: null | ((systemModel: DeviceSystemModal) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static getLockElectricQuantity(lockData: string, success: null | ((electricQuantity: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Read the operation record of the lock.
     * @param type LockRecordType
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockOperationRecord(type: LockRecordType, lockData: string, success: null | ((records: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Get the lock automatic locking periodic time
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockAutomaticLockingPeriodicTime(lockData: string, success: null | ((currentTime: number, maxTime: number, minTime: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Set the lock automatic locking periodic time
     * @param seconds
     * @param lockData
     * @param success
     * @param fail
     */
    static setLockAutomaticLockingPeriodicTime(seconds: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Get the lock remote unlock switch state
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockRemoteUnlockSwitchState(lockData: string, success: null | ((isOn: boolean) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Set the lock remote unlock switch state
     * @param isOn
     * @param lockData
     * @param success
     * @param fail
     */
    static setLockRemoteUnlockSwitchState(isOn: boolean, lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Get config of the lock
     * @param config
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockConfig(config: LockConfigType, lockData: string, success: null | ((type: number, isOn: boolean) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Set config of the lock
     * @param config
     * @param isOn
     * @param lockData
     * @param success
     * @param fail
     */
    static setLockConfig(config: LockConfigType, isOn: boolean, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static setLockSoundVolume(soundVolume: LockSoundVolume, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static getLockSoundVolume(lockData: string, success: null | ((lockSoundVolume: LockSoundVolume) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static getUnlockDirection(lockData: string, success: null | ((direction: LockUnlockDirection) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static setUnlockDirection(direction: LockUnlockDirection, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static setUnlockDirectionAutomatic(lockData: string, success: null | ((direction: LockUnlockDirection) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
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
    static addPassageMode(mode: LockPassageMode, days: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Clear all passage mode
     * @param lockData
     * @param success
     * @param fail
     */
    static clearAllPassageModes(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static addRemoteKey(remoteKeyMac: string, cycleDateList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static modifyRemoteKey(remoteKeyMac: string, cycleDateList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static deleteRemoteKey(remoteKeyMac: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static clearAllRemoteKey(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static addDoorSensor(doorSensorMac: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static clearAllDoorSensor(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static setDoorSensorAlertTime(time: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
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
    static recoverCard(cardNumber: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | ((cardNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static recoverPasscode(passcode: string, passcodeType: number, cycleType: number, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static scanWifi(lockData: string, callback: ((isFinished: boolean, wifiList: []) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static configWifi(wifiName: string, wifiPassword: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static configServer(ip: string, port: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static getWifiInfo(lockData: string, success: null | ((wifiMac: string, wifiRssi: number) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static getWifiPowerSavingTime(lockData: string, success: ((timesJsonString: undefined | string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * config wifi power saving time
     * @param weekDays 1~7,1 means Monday，2 means  Tuesday ,...,7 means Sunday， such as @[@1,@3,@6,@7]
     * @param startDate The time when it becomes valid (minutes from 0 clock)
     * @param endDate The time when it is expired (minutes from 0 clock)
     * @param lockData
     * @param success
     * @param fail
     */
    static configWifiPowerSavingTime(weekDays: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static clearWifiPowerSavingTime(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static configIp(info: WifiLockServerInfo, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static addFace(cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, progress: ((state: FaceState, FaceErrorCode: FaceErrorCode) => void), success: null | ((faceNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static addFaceFeatureData(faceFeatureData: string, cycleList: null | CycleDateParam[], startDate: number, endDate: number, lockData: string, success: null | ((faceNumber: string) => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static modifyFaceValidityPeriod(cycleList: null | CycleDateParam[], startDate: number, endDate: number, faceNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static deleteFace(faceNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    static clearAllFace(lockData: string, success: null | (() => void), fail: null | ((errorCode: LockErrorCode, description: string) => void)): void;
    /**
     * Monitor phone's Bluetooth status
     * @param callback
     */
    /**
     *
     * @param callback
     */
    static getBluetoothState(callback: (state: BluetoothState) => void): void;
    static supportFunction(lockFunction: LockFunction, lockData: string, callback: (isSupport: boolean) => void): void;
}
declare enum BluetoothState {
    Unknown = 0,
    Resetting = 1,
    Unsupported = 2,
    Unauthorized = 3,
    On = 4,
    Off = 5
}
declare enum LockFunction {
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
declare enum LockRecordType {
    Latest = 0,
    All = 1
}
declare enum LockConfigType {
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
declare enum LockSoundVolume {
    On = -1,
    Off = 0,
    Level_1 = 1,
    Level_2 = 2,
    Level_3 = 3,
    Level_4 = 4,
    Level_5 = 5
}
declare enum LockUnlockDirection {
    Unknown = 0,
    Left = 1,
    Right = 2
}
declare enum LockPassageMode {
    Weekly = 0,
    Monthly = 1
}
declare enum LockControlType {
    Unlock = 0,
    Lock = 1
}
declare enum LockState {
    Locked = 0,
    Unlock = 1,
    Unknown = 2,
    CarOnLock = 3
}
declare enum FaceState {
    canAddFace = 0,
    addFail = 1
}
declare enum FaceErrorCode {
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
    needTiltHeadToRight = 20
}
declare enum LockErrorCode {
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
declare enum DoorSensorErrorCode {
    bluetoothPowerOff = 0,
    connectTimeout = 1,
    fail = 2,
    wrongCRC = 3
}
declare enum RemoteKeyErrorCode {
    fail = 0,
    wrongCRC = 1,
    connectTimeout = 2
}
declare enum RemoteKeyPadErrorCode {
    fail = 0,
    wrongCRC = 1,
    connectTimeout = 2,
    wrongFactoryDate = 3
}
declare enum GatewayErrorCode {
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
declare enum ConnectState {
    Timeout = 0,
    Success = 1,
    Fail = 2
}
declare enum TtRemoteKeyEvent {
    ScanRemoteKey = "EventScanRemoteKey"
}
declare enum TtDoorSensorEvent {
    ScanDoorSensor = "EventScanDoorSensor"
}
declare enum WirelessKeypadEvent {
    ScanWirelessKeypad = "EventWirelessKeypad"
}
declare enum GatewayType {
    G2 = 2,
    G3 = 3,
    G4 = 4
}
declare enum LockAccessoryType {
    KEYPAD = 1,
    REMOTE_KEY = 2,
    DOOR_SENSOR = 3
}
declare enum GatewayIpSettingType {
    STATIC_IP = 0,
    DHCP = 1
}
export { Ttlock, TtGateway, TtRemoteKey, TtDoorSensor, TtWirelessKeypad, BluetoothState, LockFunction, LockRecordType, LockConfigType, LockPassageMode, LockControlType, LockState, ConnectState, GatewayType, GatewayIpSettingType, LockSoundVolume, TtRemoteKeyEvent, TtDoorSensorEvent, LockUnlockDirection, LockAccessoryType, ScanLockModal, ScanRemoteKeyModal, ScanDoorSensorModal, DeviceSystemModal, WirelessKeypadEvent, ScanWirelessKeypadModal, WifiLockServerInfo, FaceState, FaceErrorCode, LockErrorCode, DoorSensorErrorCode, RemoteKeyErrorCode, RemoteKeyPadErrorCode, GatewayErrorCode, InitGatewayModal, InitGatewayParam };
