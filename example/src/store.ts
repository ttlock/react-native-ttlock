
import { makeAutoObservable, runInAction } from "mobx"
import { Ttlock, TtGateway, ScanLockModal, ScanGatewayModal, ScanWifiModal } from 'react-native-ttlock';


class Store {
  constructor() {
    makeAutoObservable(this)
  }


  lockList: ScanLockModal[] = []

  gatewayList: ScanGatewayModal[] = []

  wifiList: ScanWifiModal[] = []


  startScanLock() {
    runInAction(() => {
      this.lockList = [];
    });



    Ttlock.startScan((scanLockModal: ScanLockModal) => {
      let isContainModal = false;
      let isInitStateChanged = false;

      runInAction(() => {
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
          this.lockList = this.lockList.concat([]);
        }
      });


    });
  }

  startScanGateway() {
    runInAction(() => {
      this.gatewayList = [];
    });
    TtGateway.startScan((data) => {
      let isContainData = false;

      runInAction(() => {
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
    });
  }

  startScanWifi() {
    TtGateway.getNearbyWifi((list) => {
      this.wifiList = list
    }, () => {
      // finished
    }, null)
  }


}

export default new Store()
