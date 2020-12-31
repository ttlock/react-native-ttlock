import type { ScanGatewayModal, ScanLockModal, InitGatewayParam, CardFingerprintCycleParam, ScanWifiModal, InitGatewayModal } from './types';
declare class TtGateway {
    static defaultCallback: () => void;
    static event: {
        scanGateway: string;
        scanWifi: string;
    };
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
     * @param success
     * @param fail
     */
    static connect(mac: string, success: ((state: number, description: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Read wifi near the gateway
     * @param progress
     * @param finish
     * @param fail
     */
    static getNearbyWifi(progress: ((scanWifiModal: ScanWifiModal[]) => void), finish: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Initialize gateway
     * @param object
     * @param success
     * @param fail
     */
    static initGateway(object: InitGatewayParam, success: ((initGatewayModal: InitGatewayModal) => void), fail: null | ((errorCode: number, description: string) => void)): void;
}
declare class Ttlock {
    static defaultCallback: () => void;
    static event: {
        scanLock: string;
        addCardProgrress: string;
        addFingerprintProgress: string;
        bluetoothState: string;
    };
    /**
     * Scan for nearby Bluetooth locks
     * @param callback  The Callback will be executed multiple times if there is a Bluetooth lock nearby
     */
    static startScan(callback: null | ((lockScanModal: ScanLockModal) => void)): void;
    /**
     * Stop scanning nearby Bluetooth locks
     */
    static stopScan(): void;
    /**
     * Initialize lock
     * @param object {lock:"ea:09:e2:99:33", lockVersion:"{\"protocolType\":5,\"protocolVersion\":3,\"scene\":2,\"groupId\":1,\"orgId\":1}"}
     * @param success
     * @param fail
     */
    static initLock(object: object, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Reset the lock.
     * @param lockData
     * @param success
     * @param fail
     */
    static resetLock(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Reset the all keys.
     * @param lockData
     * @param success
     * @param fail
     */
    static resetEkey(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static controlEnum: Readonly<{
        unlock: number;
        lock: number;
    }>;
    /**
     * Controle the lock Unlock or lock or other operations
     * @param control  Ttlock.controlEnum.unlock or Ttlock.controlEnum.lock
     * @param lockData string
     * @param success successful callback
     * @param fail failed callback
     */
    static controlLock(control: number, lockData: string, success: null | ((lockTime: number, electricQuantity: number, uniqueId: number) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Create a custom passcode.
     * @param passcode The password must be 4-9 digits
     * @param startDate Timestamp millisecond. The start valid time of the password.
     * @param endDate Timestamp millisecond. The expiration time of the password
     * @param lockData
     * @param success
     * @param fail
     */
    static createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
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
    static modifyPasscode(passcodeOrigin: string, passcodeNew: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Delete the passcode.
     * @param passcode
     * @param lockData
     * @param success
     * @param fail
     */
    static deletePasscode(passcode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * All passcode will be invalid after reset （Custom passcode and Admin passcode is still valid）
     * @param lockData
     * @param success
     * @param fail
     */
    static resetPasscode(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Get the lock state (unlock or lock)
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockSwitchState(lockData: string, success: null | ((state: number, description: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
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
    static addCard(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: (() => void), success: null | ((cardNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
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
    static modifyCardValidityPeriod(cardNumber: string, cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Delete the card
     * @param cardNumber
     * @param lockData
     * @param success
     * @param fail
     */
    static deleteCard(cardNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Clear all cards
     * @param lockData
     * @param success
     * @param fail
     */
    static clearAllCards(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
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
    static addFingerprint(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: null | ((currentCount: number, totalCount: number) => void), success: null | ((fingerprintNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
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
    static modifyFingerprintValidityPeriod(fingerprintNumber: string, cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Delete the fingerprint
     * @param fingerprintNumber
     * @param lockData
     * @param success
     * @param fail
     */
    static deleteFingerprint(fingerprintNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Clear all fingerprints
     * @param lockData
     * @param success
     * @param fail
     */
    static clearAllFingerprints(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Modify admin passcode
     * @param adminPasscode  adminPasscode must be 4-9 digits
     * @param lockData
     * @param success
     * @param fail
     */
    static modifyAdminPasscode(adminPasscode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Set the lock time
     * @param timestamp  Millisecond.
     * @param lockData
     * @param success
     * @param fail
     */
    static setLockTime(timestamp: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Get the lock time
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockTime(lockData: string, success: null | ((lockTimestamp: number) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static lockRecordEnum: Readonly<{
        latest: number;
        all: number;
    }>;
    /**
     * Read the operation record of the lock.
     * @param type Ttlock.lockRecordEnum.latest or Ttlock.lockRecordEnum.all
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockOperateRecord(type: number, lockData: string, success: null | ((records: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Get the lock automatic locking periodic time
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockAutomaticLockingPeriodicTime(lockData: string, success: null | ((currentTime: number, maxTime: number, minTime: number) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Set the lock automatic locking periodic time
     * @param seconds
     * @param lockData
     * @param success
     * @param fail
     */
    static setLockAutomaticLockingPeriodicTime(seconds: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Get the lock remote unlock switch state
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockRemoteUnlockSwitchState(lockData: string, success: null | ((isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Set the lock remote unlock switch state
     * @param isOn
     * @param lockData
     * @param success
     * @param fail
     */
    static setLockRemoteUnlockSwitchState(isOn: boolean, lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static lockConfigEnum: Readonly<{
        audio: number;
        passcodeVisible: number;
        freeze: number;
        tamperAlert: number;
        resetButton: number;
        privacyLock: number;
    }>;
    /**
     * Get config of the lock
     * @param config Reference  Ttlock.lockConfigEnum
     * @param lockData
     * @param success
     * @param fail
     */
    static getLockConfig(config: number, lockData: string, success: null | ((type: number, isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Set config of the lock
     * @param config Reference  Ttlock.lockConfigEnum
     * @param isOn
     * @param lockData
     * @param success
     * @param fail
     */
    static setLockConfig(config: number, isOn: boolean, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static lockPassageModeEnum: Readonly<{
        weekly: number;
        monthly: number;
    }>;
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
    static addPassageMode(type: number, days: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Clear all passage mode
     * @param lockData
     * @param success
     * @param fail
     */
    static clearAllPassageModes(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    /**
     * Monitor phone's Bluetooth status
     * @param callback
     */
    static addBluetoothStateListener(callback: (state: number, description: string) => void): void;
    static deleteBluetoothStateListener(): void;
    static lockFunction: Readonly<{
        passcode: number;
        icCard: number;
        fingerprint: number;
        wristband: number;
        autoLock: number;
        deletePasscode: number;
        managePasscode: number;
        locking: number;
        passcodeVisible: number;
        gatewayUnlock: number;
        lockFreeze: number;
        cyclePassword: number;
        doorSensor: number;
        remoteUnlockSwicth: number;
        audioSwitch: number;
        nbIot: number;
        getAdminPasscode: number;
        htelCard: number;
        noClock: number;
        noBroadcastInNormal: number;
        passageMode: number;
        turnOffAutoLock: number;
        wirelessKeypad: number;
        light: number;
        hotelCardBlacklist: number;
        identityCard: number;
        tamperAlert: number;
        resetButton: number;
        privacyLock: number;
        deadLock: number;
        cyclicCardOrFingerprint: number;
        fingerVein: number;
        nbAwake: number;
    }>;
    static supportFunction(fuction: number, lockData: string, callback: (isSupport: boolean) => void): void;
}
export { Ttlock, TtGateway };
export * from './types';
