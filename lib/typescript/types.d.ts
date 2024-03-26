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
export interface WifiLockServerInfo {
    type: number;
    ipAddress: string | undefined;
    subnetMask: string | undefined;
    router: string | undefined;
    preferredDns: string | undefined;
    alternateDns: string | undefined;
}
export interface ScanRemoteKeyModal {
    remoteKeyName: string;
    remoteKeyMac: string;
    rssi: number;
}
export interface ScanDoorSensorModal {
    name: string;
    mac: string;
    rssi: number;
    scanTime: number;
}
export interface ScanWirelessKeypadModal {
    name: string;
    mac: string;
    rssi: number;
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
    type: number;
    gatewayName: string;
    wifi: string | undefined;
    wifiPassword: string | undefined;
    ttlockUid: number;
    ttlockLoginPassword: string;
    ipSettingType: number | undefined;
    ipAddress: string | undefined;
    subnetMask: string | undefined;
    router: string | undefined;
    preferredDns: string | undefined;
    alternateDns: string | undefined;
}
export interface InitGatewayModal {
    modelNum: string;
    hardwareRevision: string;
    firmwareRevision: string;
}
export interface DeviceSystemModal {
    modelNum: string;
    hardwareRevision: string;
    firmwareRevision: string;
    nbOperator: string;
    nbNodeId: string;
    nbCardNumber: string;
    nbRssi: string;
    passcodeKeyNumber: string;
    lockData: string;
}
export interface CycleDateParam {
    weekDay: number;
    startTime: number;
    endTime: number;
}
