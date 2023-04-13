import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ttlock, LockFunction, LockRecordType, LockConfigType, LockPassageMode, LockControlType, LockState, LockSoundVolume } from 'react-native-ttlock';
import * as Toast from './toast-page';

const getLockSupportFunctionList = (lockData: string) => {

  const functionAllList: LockFunctionItemData[] = [
    {lockFunction: "Unlock", lockFuctionValue: null },
    {lockFunction: "Lock", lockFuctionValue: LockFunction.Locking },
    {lockFunction: "Get lock time", lockFuctionValue: null },
    {lockFunction: "Set lock time", lockFuctionValue: null },
    {lockFunction: "Get lock operate record", lockFuctionValue: null },
    {lockFunction: "Get lock electric quantity", lockFuctionValue: null },
    {lockFunction: "Create custom passcode 1122", lockFuctionValue: LockFunction.ManagePasscode },
    {lockFunction: "Modify passcode 1122 -> 2233", lockFuctionValue: LockFunction.ManagePasscode },
    {lockFunction: "Delete passcode 2233", lockFuctionValue: LockFunction.Passcode },
    {lockFunction: "Reset passcode", lockFuctionValue: LockFunction.Passcode },
    {lockFunction: "Get lock switch state", lockFuctionValue: null },

    {lockFunction: "Add IC card", lockFuctionValue: LockFunction.IcCard },
    {lockFunction: "Modify IC card validity period", lockFuctionValue: LockFunction.IcCard },
    {lockFunction: "Delete IC card", lockFuctionValue: LockFunction.IcCard },
    {lockFunction: "Clear all IC cards", lockFuctionValue: LockFunction.IcCard },

    {lockFunction: "Add fingerprint", lockFuctionValue: LockFunction.Fingerprint },
    {lockFunction: "Modify fingerprint validity period", lockFuctionValue: LockFunction.Fingerprint },
    {lockFunction: "Delete fingerprint", lockFuctionValue: LockFunction.Fingerprint },
    {lockFunction: "Clear all fingerprints", lockFuctionValue: LockFunction.Fingerprint },


    {lockFunction: "Get lock automatic locking periodic time", lockFuctionValue: LockFunction.AutoLock },
    {lockFunction: "Set lock automatic locking periodic time", lockFuctionValue: LockFunction.AutoLock },

    {lockFunction: "Set lock remote unlock switch state", lockFuctionValue: LockFunction.RemoteUnlockSwicth },

    {lockFunction: "Get lock config", lockFuctionValue: null },
    {lockFunction: "Set lock config", lockFuctionValue: null },

    {lockFunction: "Get lock sound volume", lockFuctionValue: LockFunction.SoundVolume },
    {lockFunction: "Set lock sound volume", lockFuctionValue: LockFunction.SoundVolume },

    {lockFunction: "Add passage mode", lockFuctionValue: LockFunction.PassageMode },
    {lockFunction: "Clear all passageModes", lockFuctionValue: LockFunction.PassageMode },

    {lockFunction: "Modify admin passcode to 9999", lockFuctionValue: LockFunction.Passcode },
    {lockFunction: "Reset ekey", lockFuctionValue: null },
    {lockFunction: "Rest lock", lockFuctionValue: null },
    {lockFunction: "Get lock version", lockFuctionValue: null },
  ]

  let supportFunctionList: string[] = []
  functionAllList.map((item: LockFunctionItemData) => {
    if (item.lockFuctionValue) {
      Ttlock.supportFunction(item.lockFuctionValue!, lockData, (isSupport: boolean) => {
        if (!isSupport) {
          console.log("The lock not support function " + item.lockFunction);
        } else {
          supportFunctionList.push(item.lockFunction);
        }
      })
    } else {
      supportFunctionList.push(item.lockFunction);
    }
  });

  return supportFunctionList;

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

const lockFunctionClick = (lockFunction: string, lockData: string, lockMac: string) => {
  Toast.showToastLoad(lockFunction +  "...");

  if (lockFunction === "Unlock") {
    Ttlock.controlLock(LockControlType.Unlock, lockData, (lockTime: number, electricQuantity: number, uniqueId: number) => {
      let text = "lockTime:" + lockTime + "\n" + "electricQuantity:" + electricQuantity + "\n" + "uniqueId:" + uniqueId;
      successCallback(text);
    }, failedCallback)
  }

  if (lockFunction === "Lock") {
    Ttlock.controlLock(LockControlType.Lock, lockData, (lockTime: number, electricQuantity: number, uniqueId: number) => {
      let text = "lockTime:" + lockTime + "\n" + "electricQuantity:" + electricQuantity + "\n" + "uniqueId:" + uniqueId;
      successCallback(text);
    }, failedCallback)
  }

  if (lockFunction === "Get lock time") {
    Ttlock.getLockTime(lockData, (lockTimestamp: number) => {
      let text = "lockTimestamp:" + lockTimestamp;
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Set lock time") {
    let timestamp = new Date().getTime();
    Ttlock.setLockTime(timestamp, lockData, () => {
      successCallback("set lock time success");
    }, failedCallback);
  }
  else if (lockFunction === "Get lock electric quantity") {
    Ttlock.getLockElectricQuantity(lockData, (electricQuantity: number) => {
      successCallback("lock electric quantity: " + electricQuantity.toString());
    }, failedCallback);
  }
  else if (lockFunction === "Get lock operate record") {
    Ttlock.getLockOperationRecord(LockRecordType.Latest, lockData, successCallback, failedCallback);
  }
  else if (lockFunction === "Create custom passcode 1122") {
    // passcode valid 24 hours
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.createCustomPasscode("1122", startDate, endDate, lockData, () => {
      successCallback("create cutome passcode success");
    }, failedCallback);
  }
  else if (lockFunction === "Modify passcode 1122 -> 2233") {

    // passcode valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyPasscode("1122", "2233", startDate, endDate, lockData, () => {
      successCallback("modify passcode success");
    }, failedCallback);
  }

  else if (lockFunction === "Delete passcode 2233") {
    Ttlock.deletePasscode("2233", lockData, () => {
      successCallback("delete passcode success");
    }, failedCallback);
  }

  else if (lockFunction === "Reset passcode") {
    Ttlock.resetPasscode(lockData, (lockDataNew: string) => {
      //important: upload lockDataNew to ttlock server. 
      successCallback("reset passcode success, please upload lockDataNew to server");
      console.log(lockDataNew)
    }, failedCallback);
  }

  else if (lockFunction === "Get lock switch state") {

    Ttlock.getLockSwitchState(lockData, (state: LockState) => {
      let text = "state:" + state;
      successCallback(text);
    }, failedCallback);


  }
  else if (lockFunction === "Add IC card") {
    // card valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addCard(null, startDate, endDate, lockData, () => { }, (cNumber: string) => {
      cardNumber = cNumber;
      let text = "cardNumber:" + cardNumber;
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Modify IC card validity period") {
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
  else if (lockFunction === "Delete IC card") {
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
  else if (lockFunction === "Clear all IC cards") {
    Ttlock.clearAllCards(lockData, () => {
      let text = "Clear all IC cards success";
      successCallback(text);
      cardNumber = undefined;
    }, failedCallback);
  }
  else if (lockFunction === "Add fingerprint") {
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
  else if (lockFunction === "Modify fingerprint validity period") {
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
  else if (lockFunction === "Delete fingerprint") {
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
  else if (lockFunction === "Clear all fingerprints") {

    Ttlock.clearAllFingerprints(lockData, () => {
      let text = "clear all fingerprints success";
      successCallback(text);
      fingerprintNumber = undefined;
    }, failedCallback);
  }
  else if (lockFunction === "Get lock automatic locking periodic time") {
    Ttlock.getLockAutomaticLockingPeriodicTime(lockData, (currentTime: number, maxTime: number, minTime: number) => {
      let text = "currentTime:" + currentTime + "\n" + "maxTime:" + maxTime + "\n" + "minTime:" + minTime;
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Set lock automatic locking periodic time") {
    let seconds = 20;
    Ttlock.setLockAutomaticLockingPeriodicTime(seconds, lockData, () => {
      let text = "set lock automatic lock periodic time success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Set lock remote unlock switch state") {
    let isOn = true;
    Ttlock.setLockRemoteUnlockSwitchState(isOn, lockData, (lockDataNew: string) => {
      let text = "set lock remote unlock switch success, please upload lockDataNew to server";
      successCallback(text);
      console.log(lockDataNew);
    }, failedCallback);
  }
  else if (lockFunction === "Get lock config") {
    Ttlock.getLockConfig(LockConfigType.Audio, lockData, (type: number, isOn: boolean) => {
      let text = "type:" + type + "\n" + "isOn:" + isOn;
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Set lock config") {
    let isOn = true;
    Ttlock.setLockConfig(LockConfigType.Audio, isOn, lockData, () => {
      let text = "config lock success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Get lock sound volume") {
    Ttlock.getLockSoundVolume(lockData, (soundVolume: LockSoundVolume) => {
      let text = "get lock sounde volume: " + soundVolume.toString();
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Set lock sound volume") {
    Ttlock.setLockSoundVolume(LockSoundVolume.Livel_3, lockData, () => {
      let text = "set lock sound volume success";
      successCallback(text);
    }, failedCallback);
  }

  else if (lockFunction === "Add passage mode") {
    //minutes  8:00 am ---   17:00 pm
    let startTime = 8 * 60;
    let endTime = 17 * 60;
    Ttlock.addPassageMode(LockPassageMode.Weekly, [1, 2, 7], startTime, endTime, lockData, () => {
      let text = "add passage mode success";
      successCallback(text);
    }, failedCallback);

  }
  else if (lockFunction === "Clear all passageModes") {
    Ttlock.clearAllPassageModes(lockData, () => {
      let text = "clear all passage modes success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Modify admin passcode to 9999") {
    let adminPasscode = "9999";
    Ttlock.modifyAdminPasscode(adminPasscode, lockData, () => {
      let text = "modify admin passcode success";
      successCallback(text);
    }, failedCallback);
  }
  else if (lockFunction === "Rest lock") {
    Ttlock.resetLock(lockData, () => {
      let text = "reset lock success";
      successCallback(text);
    }, failedCallback)
  }
  else if (lockFunction === "Reset ekey") {
    Ttlock.resetEkey(lockData, (lockDataNew) => {
      //important: upload lockDataNew to ttlock server. 
      let text = "reset ekey success";
      successCallback(text);
      console.log(lockDataNew);
    }, failedCallback)
  }
  else if (lockFunction === "Get lock version") {
    Ttlock.getLockVersionWithLockMac(lockMac, (lockVersion) => {
      let text = "get lock version";
      successCallback(text);
      console.log(lockVersion);
    }, failedCallback)
  }
}


const LockPage = (props: any) => {
  const { route } = props;
  const { lockData, lockMac } = route.params;
  const lockSupportFunctions = getLockSupportFunctionList(lockData);
  const _renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => {
        lockFunctionClick(item, lockData, lockMac);
      }}>
      <Text style={styles.item}>{item}</Text>
    </TouchableOpacity>
  );




  return (
    <FlatList
      data={lockSupportFunctions}
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
  lockFunction: string,
  lockFuctionValue: null | LockFunction
}

export default LockPage;