import type { ScanGatewayModal, ScanLockModal, InitLockParam, InitGatewayParam, CardFingerprintCycleParam, ScanWifiModal, InitGatewayModal } from './types';
declare class TtGateway {
    static defaultCallback: () => void;
    static event: {
        scanGateway: string;
        scanWifi: string;
    };
    static startScan(callback: ((scanGatewayModal: ScanGatewayModal) => void)): void;
    static stopScan(): void;
    static connect(mac: string, success: ((state: number, description: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static getNearbyWifi(progress: ((scanWifiModal: ScanWifiModal[]) => void), finish: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
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
    static startScan(callback: null | ((lockScanModal: ScanLockModal) => void)): void;
    static stopScan(): void;
    static initLock(object: InitLockParam, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static resetLock(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static resetEkey(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static controlEnum: Readonly<{
        unlock: number;
        lock: number;
    }>;
    /**
     *
     * @param control controlEnum
     * @param lockData string
     * @param success successful callback
     * @param fail failed callback
     */
    static controlLock(control: number, lockData: string, success: null | ((lockTime: number, electricQuantity: number, uniqueId: number) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static modifyPasscode(passcodeOrigin: string, passcodeNew: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static deletePasscode(passcode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static resetPasscode(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static getLockSwitchState(lockData: string, success: null | ((state: number, description: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static addCard(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: (() => void), success: null | ((cardNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static modifyCardValidityPeriod(cardNumber: string, cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static deleteCard(cardNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static clearAllCards(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static addFingerprint(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: null | ((currentCount: number, totalCount: number) => void), success: null | ((fingerprintNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static modifyFingerprintValidityPeriod(fingerprintNumber: string, cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static deleteFingerprint(fingerprintNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static clearAllFingerprints(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static modifyAdminPasscode(adminPasscode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static setLockTime(timestamp: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static getLockTime(lockData: string, success: null | ((lockTimestamp: number) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static lockRecordEnum: Readonly<{
        latest: number;
        all: number;
    }>;
    static getLockOperateRecord(type: number, lockData: string, success: null | ((records: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static getLockAutomaticLockingPeriodicTime(lockData: string, success: null | ((currentTime: number, maxTime: number, minTime: number) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static setLockAutomaticLockingPeriodicTime(seconds: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static getLockRemoteUnlockSwitchState(lockData: string, success: null | ((isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static setLockRemoteUnlockSwitchState(isOn: boolean, lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static lockConfigEnum: Readonly<{
        audio: number;
        passcodeVisible: number;
        freeze: number;
        tamperAlert: number;
        resetButton: number;
        privacyLock: number;
    }>;
    static getLockConfig(config: number, lockData: string, success: null | ((type: number, isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static setLockConfig(config: number, isOn: boolean, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static lockPassageModeEnum: Readonly<{
        weekly: number;
        monthly: number;
    }>;
    static addPassageMode(type: number, days: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
    static clearAllPassageModes(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;
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
