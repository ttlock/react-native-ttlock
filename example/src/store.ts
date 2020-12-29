
import { makeAutoObservable } from "mobx"
import { Ttlock, TtGateway, ScanLockModal, ScanGatewayModal, ScanWifiModal } from 'react-native-ttlock';


class Store {
  constructor() {
    makeAutoObservable(this)
  }


  lockList: ScanLockModal[] = []

  gatewayList: ScanGatewayModal[] = []

  wifiList : ScanWifiModal[]= []


  startScanLock() {
    this.lockList = [];
    Ttlock.startScan((scanLockModal: ScanLockModal) => {
      let isContainModal = false;
      let isInitStateChanged = false;
      this.lockList.forEach((oldScanLockModal: ScanLockModal) => {
        if (oldScanLockModal.lockMac === scanLockModal.lockMac) {
          isContainModal = true;
          if (oldScanLockModal.isInited !== scanLockModal.isInited) {
            oldScanLockModal.isInited = scanLockModal.isInited;
            isInitStateChanged = true;
          }
        }
      });
      if (isContainModal === false) {
        this.lockList.push(scanLockModal)
      }

      if (isContainModal === false || isInitStateChanged) {
        this.lockList.sort((modal1, modal2) => {
          let value1 = modal1.isInited ? 1 : 0;
          let value2 = modal2.isInited ? 1 : 0;
          return value1 - value2;
        })
      }
    });
  }

  startScanGateway() {
    this.gatewayList = [];
    TtGateway.startScan((data) => {
      let isContainData = false;
      this.gatewayList.forEach((oldData) => {
        if (oldData.gatewayMac === data.gatewayMac) {
          isContainData = true;
        }
      });
      if (isContainData === false) {
        this.gatewayList.push(data);
        this.gatewayList = this.gatewayList.slice();
      }
    });
  }

  startScanWifi() {
    this.wifiList = [];
    TtGateway.getNearbyWifi((list) => {
      list.forEach(data => {
        this.wifiList.push(data)
      });
      this.wifiList = this.wifiList.slice();
    }, () => {

    }, null)
  }


}

export default new Store()
