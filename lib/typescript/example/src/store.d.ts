import { ScanLockModal, ScanGatewayModal, ScanWifiModal } from 'react-native-ttlock';
declare class Store {
    constructor();
    lockList: ScanLockModal[];
    gatewayList: ScanGatewayModal[];
    wifiList: ScanWifiModal[];
    startScanLock(): void;
    startScanGateway(): void;
    startScanWifi(): void;
}
declare const _default: Store;
export default _default;
