export interface ScanLockModal {
    lockName: string;
    lockMac: string;
    isInited: boolean;
    isKeyboardActivated: boolean;
    electricQuantity: number;
    lockVersion: string;
    lockSwitchState: number;
    rssi: number;
    oneMeterRSSI: number;
}
export interface ScanGatewayModal {
    gatewayName: string;
    gatewayMac: string;
    isDfuMode: boolean;
    rssi: number;
    type: number;
}
export interface LockVersion {
    protocolVersion: string;
    protocolType: string;
    groupId: string;
    orgId: string;
    scene: string;
}
export interface ScanWifiModal {
    wifi: string;
    rssi: number;
}
export interface InitGatewayParam {
    gatewayName: string;
    wifi: string | undefined;
    wifiPassword: string | undefined;
    ttlockUid: number;
    ttlockLoginPassword: string;
    type: number;
}
export interface InitGatewayModal {
    modelNum: string;
    hardwareRevision: string;
    firmwareRevision: string;
}
export interface CardFingerprintCycleParam {
    weekDay: number;
    startTime: number;
    endTime: number;
}
