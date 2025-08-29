import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

interface Spec extends TurboModule {
  getBluetoothState(callback: (state: number) => void): void;
  startScan(): void;
  stopScan(): void;

  
  initLock(object: Object, success: ((lockData: string) => void), fail: ((errorCode: number, description: string) => void)) : void;
   
  getLockVersionWithLockMac(lockMac: string, success: null | ((lockVersion: Object) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  getAccessoryElectricQuantity(accessoryType: number, accessoryMac: string, lockData: string, success: ((dataArray: number[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
  resetLock(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  resetEkey(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  controlLock(control: number, lockData: string, success: null | ((dataArray: any[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
   modifyPasscode(passcodeOrigin: string, passcodeNew: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
   deletePasscode(passcode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
   resetPasscode(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
   getLockSwitchState(lockData: string, success: null | ((state: number) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
   addCard(cycleList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | ((cardNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    modifyCardValidityPeriod(cardNumber: string, cycleList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    deleteCard(cardNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    clearAllCards(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    addFingerprint(cycleList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | ((fingerprintNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    modifyFingerprintValidityPeriod(fingerprintNumber: string, cycleList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    deleteFingerprint(fingerprintNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    clearAllFingerprints(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    modifyAdminPasscode(adminPasscode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    setLockTime(timestamp: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    getLockTime(lockData: string, success: null | ((lockTimestamp: number) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    getLockSystem(lockData: string, success: null | ((systemModel: Object) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    getLockElectricQuantity(lockData: string, success: null | ((electricQuantity: number) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
   
    getLockOperationRecord(type: number, lockData: string, success: null | ((records: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  

    getLockAutomaticLockingPeriodicTime(lockData: string, success: null | ((data: any[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    setLockAutomaticLockingPeriodicTime(seconds: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    getLockRemoteUnlockSwitchState(lockData: string, success: null | ((isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    setLockRemoteUnlockSwitchState(isOn: boolean, lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
    getLockConfig(config: number, lockData: string, success: null | ((dataArray: any[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  

    setLockConfig(config: number, isOn: boolean, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
  
    setLockSoundVolume(soundVolume: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
     
  
    getLockSoundVolume(lockData: string, success: null | ((lockSoundVolume: number) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
  
    getUnlockDirection(lockData: string, success: null | ((direction: number) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
     
  
  
    setUnlockDirection(direction: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
  
    setUnlockDirectionAutomatic(lockData: string, success: null | ((direction: number) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
    addPassageMode(mode: Object, weekDays: number[], monthDays: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      

    clearAllPassageModes(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    addRemoteKey(remoteKeyMac: string, cycleDateList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    modifyRemoteKey(remoteKeyMac: string, cycleDateList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    deleteRemoteKey(remoteKeyMac: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    clearAllRemoteKey(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    addDoorSensor(doorSensorMac: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    clearAllDoorSensor(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
  
    setDoorSensorAlertTime(time: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
    recoverCard(cardNumber: string, cycleList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | ((cardNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
    recoverPasscode(passcode: string, passcodeType: number, cycleType: number, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    scanWifi(lockData: string, fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    configWifi(wifiName: string, wifiPassword: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
  
    configServer(ip: string, port: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    getWifiInfo(lockData: string, success: null | ((data: any[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
  
    getWifiPowerSavingTime(lockData: string, success: ((timesJsonString: undefined | string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
      
  
    configWifiPowerSavingTime(weekDays: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
  
  
    clearWifiPowerSavingTime(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;

  
    configIp(info: Object, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;

  
    addFace(cycleList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | ((faceNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
   
  
    addFaceFeatureData(faceFeatureData: string, cycleList: null | Object[], startDate: number, endDate: number, lockData: string, success: null | ((faceNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) : void;

  
    modifyFaceValidityPeriod(cycleList: null | Object[], startDate: number, endDate: number, faceNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
    deleteFace(faceNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
    clearFace(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
    activateLiftFloors(floors: string, lockData: string, success: null | ((dataArray: any[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;
    setLiftControlEnableFloors(floors: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
    setLiftWorkMode(workMode: Object, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) : void;
    supportFunction(lockFunction: number, lockData: string, callback: (isSupport: boolean) => void) : void;











 startScanWirelessKeypad() : void;

   stopScanWirelessKeypad() : void;

   initWirelessKeypad(mac: string, lockMac: string, success: ((dataArray: any[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;



   startScanDoorSensor() : void;

   stopScanDoorSensor() : void;

   initDoorSensor(mac: string, lockData: string, success: ((dataArray: any[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;



      startScanRemoteKey() : void;

      stopScanRemoteKey() : void;


   initRemoteKey(mac: string, lockData: string, success: ((dataArray: any[]) => void), fail: null | ((errorCode: number, description: string) => void)) : void;



  startScanGateway() : void;

      stopScanGateway() : void;
   
   connect(mac: string, callback: ((state: number) => void)) : void;


   getNearbyWifi(callback: ((state: number) => void)) : void;

   initGateway(object: Object, success: ((initGatewayModal: Object) => void), fail: null | ((errorCode: number, description: string) => void)) : void;



}

export default TurboModuleRegistry.getEnforcing<Spec>('Ttlock');
