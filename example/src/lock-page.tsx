import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ttlock, LockFunction, LockRecordType, LockConfigType, LockPassageMode, LockControlType, LockState, LockSoundVolume, LockUnlockDirection } from 'react-native-ttlock';
import * as Toast from './toast-page';

const getLockSupportOperationList = (lockData: string) => {

  const functionAllList: LockFunctionItemData[] = [
    {lockOperation: "Unlock", lockFuctionValue: null },
    {lockOperation: "Lock", lockFuctionValue: LockFunction.Locking },
    {lockOperation: "Get lock time", lockFuctionValue: null },
    {lockOperation: "Set lock time", lockFuctionValue: null },
    {lockOperation: "Get lock operate record", lockFuctionValue: null },
    {lockOperation: "Get lock electric quantity", lockFuctionValue: null },
    {lockOperation: "Create custom passcode 1122", lockFuctionValue: LockFunction.ManagePasscode },
    {lockOperation: "Modify passcode 1122 -> 2233", lockFuctionValue: LockFunction.ManagePasscode },
    {lockOperation: "Delete passcode 2233", lockFuctionValue: LockFunction.Passcode },
    {lockOperation: "Reset passcode", lockFuctionValue: LockFunction.Passcode },
    {lockOperation: "Get lock switch state", lockFuctionValue: null },

    {lockOperation: "Add IC card", lockFuctionValue: LockFunction.IcCard },
    {lockOperation: "Modify IC card validity period", lockFuctionValue: LockFunction.IcCard },
    {lockOperation: "Delete IC card", lockFuctionValue: LockFunction.IcCard },
    {lockOperation: "Clear all IC cards", lockFuctionValue: LockFunction.IcCard },

    {lockOperation: "Add fingerprint", lockFuctionValue: LockFunction.Fingerprint },
    {lockOperation: "Modify fingerprint validity period", lockFuctionValue: LockFunction.Fingerprint },
    {lockOperation: "Delete fingerprint", lockFuctionValue: LockFunction.Fingerprint },
    {lockOperation: "Clear all fingerprints", lockFuctionValue: LockFunction.Fingerprint },


    {lockOperation: "Get lock automatic locking periodic time", lockFuctionValue: LockFunction.AutoLock },
    {lockOperation: "Set lock automatic locking periodic time", lockFuctionValue: LockFunction.AutoLock },

    {lockOperation: "Set lock remote unlock switch state", lockFuctionValue: LockFunction.RemoteUnlockSwicth },

    {lockOperation: "Get lock config", lockFuctionValue: null },
    {lockOperation: "Set lock config", lockFuctionValue: null },

    {lockOperation: "Get lock sound volume", lockFuctionValue: LockFunction.SoundVolume },
    {lockOperation: "Set lock sound volume", lockFuctionValue: LockFunction.SoundVolume },

    {lockOperation: "Get lock unlock direction", lockFuctionValue: null },
    {lockOperation: "Set lock unlock direction", lockFuctionValue: null },


    {lockOperation: "Add passage mode", lockFuctionValue: LockFunction.PassageMode },
    {lockOperation: "Clear all passageModes", lockFuctionValue: LockFunction.PassageMode },

    {lockOperation: "Init remote key", lockFuctionValue: null},

    {lockOperation: "Add remote key to lock", lockFuctionValue: LockFunction.RemoteKey },
    {lockOperation: "Modify remote key valid date", lockFuctionValue: LockFunction.RemoteKey },
    {lockOperation: "Delete remote key from lock", lockFuctionValue: LockFunction.RemoteKey },
    {lockOperation: "Clear all remote key from lock", lockFuctionValue: LockFunction.RemoteKey },

    {lockOperation: "Modify admin passcode to 9999", lockFuctionValue: LockFunction.Passcode },
    {lockOperation: "Reset ekey", lockFuctionValue: null },
    {lockOperation: "Rest lock", lockFuctionValue: null },
    {lockOperation: "Get lock version", lockFuctionValue: null },
  ]

  let supportOperationList: string[] = []
  functionAllList.map((item: LockFunctionItemData) => {
    if (item.lockFuctionValue) {
      Ttlock.supportFunction(item.lockFuctionValue!, lockData, (isSupport: boolean) => {
        if (!isSupport) {
          console.log("The lock not support function " + item.lockOperation);
        } else {
          supportOperationList.push(item.lockOperation);
        }
      })
    } else {
      supportOperationList.push(item.lockOperation);
    }
  });

  return supportOperationList;

}

const successCallback = function (text: string) {
  console.log("Success:", text);
  Toast.showToast(text);
}
const progressCallback = function (text: string) {
  console.log("progress:", text);
  Toast.showToast(text);
}

const failedCallback = function (errorCode: number, errorMessage: string) {
  let text = "errorCode:" + errorCode + "    errorMessage:" + errorMessage;
  console.log(text);
  Toast.showToast(text);
}

var cardNumber: undefined | string;
var fingerprintNumber: undefined | string;

const operationClick = (lockOperation: string, lockData: string, lockMac: string, navigation: any) => {
  Toast.showToastLoad(lockOperation +  "...");

  if (lockOperation === "Unlock") {
    Ttlock.controlLock(LockControlType.Unlock, lockData, (lockTime: number, electricQuantity: number, uniqueId: number) => {
      let text = "lockTime:" + lockTime + "\n" + "electricQuantity:" + electricQuantity + "\n" + "uniqueId:" + uniqueId;
      successCallback(text);
    }, failedCallback)
  }

  if (lockOperation === "Lock") {
    Ttlock.controlLock(LockControlType.Lock, lockData, (lockTime: number, electricQuantity: number, uniqueId: number) => {
      let text = "lockTime:" + lockTime + "\n" + "electricQuantity:" + electricQuantity + "\n" + "uniqueId:" + uniqueId;
      successCallback(text);
    }, failedCallback)
  }

  if (lockOperation === "Get lock time") {
    Ttlock.getLockTime(lockData, (lockTimestamp: number) => {
      let text = "lockTimestamp:" + lockTimestamp;
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Set lock time") {
    let timestamp = new Date().getTime();
    Ttlock.setLockTime(timestamp, lockData, () => {
      successCallback("set lock time success");
    }, failedCallback);
  }
  else if (lockOperation === "Get lock electric quantity") {
    Ttlock.getLockElectricQuantity(lockData, (electricQuantity: number) => {
      successCallback("lock electric quantity: " + electricQuantity.toString());
    }, failedCallback);
  }
  else if (lockOperation === "Get lock operate record") {
    Ttlock.getLockOperationRecord(LockRecordType.Latest, lockData, successCallback, failedCallback);
  }
  else if (lockOperation === "Create custom passcode 1122") {
    // passcode valid 24 hours
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.createCustomPasscode("1122", startDate, endDate, lockData, () => {
      successCallback("create cutome passcode success");
    }, failedCallback);
  }
  else if (lockOperation === "Modify passcode 1122 -> 2233") {

    // passcode valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyPasscode("1122", "2233", startDate, endDate, lockData, () => {
      successCallback("modify passcode success");
    }, failedCallback);
  }

  else if (lockOperation === "Delete passcode 2233") {
    Ttlock.deletePasscode("2233", lockData, () => {
      successCallback("delete passcode success");
    }, failedCallback);
  }

  else if (lockOperation === "Reset passcode") {
    Ttlock.resetPasscode(lockData, (lockDataNew: string) => {
      //important: upload lockDataNew to ttlock server. 
      successCallback("reset passcode success, please upload lockDataNew to server");
      console.log(lockDataNew)
    }, failedCallback);
  }

  else if (lockOperation === "Get lock switch state") {

    Ttlock.getLockSwitchState(lockData, (state: LockState) => {
      let text = "state:" + state;
      successCallback(text);
    }, failedCallback);


  }
  else if (lockOperation === "Add IC card") {
    // card valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addCard(null, startDate, endDate, lockData, () => { }, (cNumber: string) => {
      cardNumber = cNumber;
      let text = "cardNumber:" + cardNumber;
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Modify IC card validity period") {
    if (cardNumber === undefined) {
      Toast.showToast("Please add a card first");
      return;
    }
    // card valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyCardValidityPeriod(cardNumber, null, startDate, endDate, lockData, () => {
      let text = "Modify IC card validity period success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Delete IC card") {
    if (cardNumber === undefined) {
      Toast.showToast("Please add a card first");
      return;
    }
    Ttlock.deleteCard(cardNumber, lockData, () => {
      let text = "Delete IC card success";
      successCallback(text);
      cardNumber = undefined;
    }, failedCallback);
  }
  else if (lockOperation === "Clear all IC cards") {
    Ttlock.clearAllCards(lockData, () => {
      let text = "Clear all IC cards success";
      successCallback(text);
      cardNumber = undefined;
    }, failedCallback);
  }
  else if (lockOperation === "Add fingerprint") {
    // fingerprint valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addFingerprint(null, startDate, endDate, lockData, (currentCount: number, totalCount: number) => {
      let text = "currentCount:" + currentCount + "\n" + "totalCount:" + totalCount;
      progressCallback(text);
    }, (fNumber: string) => {
      fingerprintNumber = fNumber;
      let text = "fingerprintNumber:" + fingerprintNumber
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Modify fingerprint validity period") {
    if (fingerprintNumber === undefined) {
      Toast.showToast("Please add a fingerprint first");
      return;
    }

    // fingerprint valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyFingerprintValidityPeriod(fingerprintNumber, null, startDate, endDate, lockData, () => {
      let text = "modify fingerprint validity period success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Delete fingerprint") {
    if (fingerprintNumber === undefined) {
      Toast.showToast("Please add a fingerprint first");
      return;
    }
    Ttlock.deleteFingerprint(fingerprintNumber, lockData, () => {
      let text = "delete fingerprint success";
      successCallback(text);
      fingerprintNumber = undefined;
    }, failedCallback);
  }
  else if (lockOperation === "Clear all fingerprints") {

    Ttlock.clearAllFingerprints(lockData, () => {
      let text = "clear all fingerprints success";
      successCallback(text);
      fingerprintNumber = undefined;
    }, failedCallback);
  }
  else if (lockOperation === "Get lock automatic locking periodic time") {
    Ttlock.getLockAutomaticLockingPeriodicTime(lockData, (currentTime: number, maxTime: number, minTime: number) => {
      let text = "currentTime:" + currentTime + "\n" + "maxTime:" + maxTime + "\n" + "minTime:" + minTime;
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Set lock automatic locking periodic time") {
    let seconds = 20;
    Ttlock.setLockAutomaticLockingPeriodicTime(seconds, lockData, () => {
      let text = "set lock automatic lock periodic time success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Set lock remote unlock switch state") {
    let isOn = true;
    Ttlock.setLockRemoteUnlockSwitchState(isOn, lockData, (lockDataNew: string) => {
      let text = "set lock remote unlock switch success, please upload lockDataNew to server";
      successCallback(text);
      console.log(lockDataNew);
    }, failedCallback);
  }
  else if (lockOperation === "Get lock config") {
    Ttlock.getLockConfig(LockConfigType.Audio, lockData, (type: number, isOn: boolean) => {
      let text = "type:" + type + "\n" + "isOn:" + isOn;
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Set lock config") {
    let isOn = true;
    Ttlock.setLockConfig(LockConfigType.Audio, isOn, lockData, () => {
      let text = "config lock success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Get lock sound volume") {
    Ttlock.getLockSoundVolume(lockData, (soundVolume: LockSoundVolume) => {
      let text = "get lock sounde volume: " + soundVolume.toString();
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Set lock sound volume") {
    Ttlock.setLockSoundVolume(LockSoundVolume.Livel_3, lockData, () => {
      let text = "set lock sound volume success";
      successCallback(text);
    }, failedCallback);
  }

  else if (lockOperation === "Get lock unlock direction") {
    Ttlock.getUnlockDirection(lockData, (unlockDirection: LockUnlockDirection) => {
      let text = "get lock unlock direction: " + unlockDirection.toString();
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Set lock unlock direction") {
    Ttlock.setUnlockDirection(LockUnlockDirection.Left, lockData, () => {
      let text = "set lock unlock direction success";
      successCallback(text);
    }, failedCallback);
  }

  else if (lockOperation === "Add passage mode") {
    //minutes  8:00 am ---   17:00 pm
    let startTime = 8 * 60;
    let endTime = 17 * 60;
    Ttlock.addPassageMode(LockPassageMode.Weekly, [1, 2, 7], startTime, endTime, lockData, () => {
      let text = "add passage mode success";
      successCallback(text);
    }, failedCallback);

  }
  else if (
  lockOperation === "Init remote key"
  || lockOperation === "Add remote key to lock" 
  || lockOperation === "Modify remote key valid date"
  || lockOperation === "Delete remote key from lock") {
    navigation.navigate("ScanRemoteKeyPage", {operation: lockOperation, lockData: lockData});
  }
  else if (lockOperation === "Clear all remote key from lock") {
    Ttlock.clearAllRemoteKey(lockData, ()=>{
      let text = "clear remote key success";
      successCallback(text);
    }, failedCallback)
  }
  else if (lockOperation === "Clear all passageModes") {
    Ttlock.clearAllPassageModes(lockData, () => {
      let text = "clear all passage modes success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Modify admin passcode to 9999") {
    let adminPasscode = "9999";
    Ttlock.modifyAdminPasscode(adminPasscode, lockData, () => {
      let text = "modify admin passcode success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockOperation === "Rest lock") {
    Ttlock.resetLock(lockData, () => {
      let text = "reset lock success";
      successCallback(text);
    }, failedCallback)
  }
  else if (lockOperation === "Reset ekey") {
    Ttlock.resetEkey(lockData, (lockDataNew) => {
      //important: upload lockDataNew to ttlock server. 
      let text = "reset ekey success";
      successCallback(text);
      console.log(lockDataNew);
    }, failedCallback)
  }
  else if (lockOperation === "Get lock version") {
    Ttlock.getLockVersionWithLockMac(lockMac, (lockVersion) => {
      let text = "get lock version";
      successCallback(text);
      console.log(lockVersion);
    }, failedCallback)
  }
}


const LockPage = (props: any) => {
  const { route, navigation } = props;
  const { lockData, lockMac } = route.params;
  const lockSupportOperations = getLockSupportOperationList(lockData);
  const _renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => {
        operationClick(item, lockData, lockMac, navigation);
      }}>
      <Text style={styles.item}>{item}</Text>
    </TouchableOpacity>
  );


  return (
    <FlatList
      data={lockSupportOperations}
      renderItem={_renderItem}
      keyExtractor={item => item}
    />
  );
}


const styles = StyleSheet.create({
  item: {
    lineHeight: 70,
    paddingLeft: 20,
    borderBottomColor: "gray",
    borderWidth: 0.5
  },
});


interface LockFunctionItemData {
  lockOperation: string,
  lockFuctionValue: null | LockFunction
}

export default LockPage;