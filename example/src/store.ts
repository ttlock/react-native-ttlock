
import { makeAutoObservable, runInAction } from "mobx"
import { Ttlock, TtGateway, TtRemoteKey, type ScanLockModal, type ScanGatewayModal, type ScanWifiModal, type ScanRemoteKeyModal, type ScanDoorSensorModal, TtDoorSensor, TtWirelessKeypad, type ScanWirelessKeypadModal } from 'react-native-ttlock';


class Store {
  constructor() {
    makeAutoObservable(this)
  }


  lockList: ScanLockModal[] = []

  gatewayList: ScanGatewayModal[] = []

  wifiList: ScanWifiModal[] = []

  remoteKeyList: ScanRemoteKeyModal[] = []

  doorSensorList: ScanDoorSensorModal[] = []

  wirelessKeypadList: ScanWirelessKeypadModal[] = []


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

  startScanWifi(finished:()=>void) {
   
    TtGateway.getNearbyWifi((list) => {
      var wifiList1 = [...this.wifiList];
      wifiList1.push(...list);
      //  wifi remove duplicates
     var wifiList2 = [...new Set(wifiList1.map(item => item.wifi))].map(wifi => wifiList1.find(item => item.wifi === wifi)); 
     //  rssi sort asc
     var wifiList3 = wifiList2.sort((a, b) => a!.rssi - b!.rssi); 

     var wifiList4: ScanWifiModal[] = []
     for (let i = 0; i < wifiList3.length; i++) {
      if (wifiList3[i] === undefined) {
      }else{
        wifiList4.push(wifiList3[i]!)
      }
    }

    runInAction(() => {
      this.wifiList = wifiList4;
    });
     
    }, () => {
      finished();
    }, null)
  }

  startScanRemoteKey() {
    runInAction(() => {
      this.remoteKeyList = [];
    });

    TtRemoteKey.startScan((sancModel)=>{
      let isContainData = false;
      runInAction(() => {
        this.remoteKeyList.forEach((oldData) => {
          if (oldData.remoteKeyMac === sancModel.remoteKeyMac) {
            isContainData = true;
          }
        });
        if (isContainData === false) {
          this.remoteKeyList.push(sancModel);
          this.remoteKeyList = this.remoteKeyList.slice();
        }
      });
    })
  }


  startScanDoorSensor() {
    runInAction(() => {
      this.doorSensorList = [];
    });

    TtDoorSensor.startScan((sancModel)=>{
      let isContainData = false;
      runInAction(() => {
        this.doorSensorList.forEach((oldData) => {
          if (oldData.mac === sancModel.mac) {
            isContainData = true;
          }
        });
        if (isContainData === false) {
          this.doorSensorList.push(sancModel);
          this.doorSensorList = this.doorSensorList.slice();
        }
      });
    })
  }



  startWirelessKeypad() {
    runInAction(() => {
      this.wirelessKeypadList = [];
    });

    TtWirelessKeypad.startScan((sancModel)=>{
      let isContainData = false;
      runInAction(() => {
        this.wirelessKeypadList.forEach((oldData) => {
          if (oldData.mac === sancModel.mac) {
            isContainData = true;
          }
        });
        if (isContainData === false) {
          this.wirelessKeypadList.push(sancModel);
          this.wirelessKeypadList = this.wirelessKeypadList.slice();
        }
      });
    })
  }


}




export default new Store()
