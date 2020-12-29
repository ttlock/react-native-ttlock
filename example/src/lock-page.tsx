import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Ttlock } from 'react-native-ttlock';
import * as Toast from './toast-page';

const optionsData = [
  "Unlock/Lock",
  "Get lock time",
  "Set lock time",
  "Get lock operate record",
  "Create custom passcode 1122",
  "Modify passcode 1122 -> 2233",
  "Delete passcode 2233",
  "Reset passcode",
  "Get lock switch state",
  "Add card",
  "Modify card validity period",
  "Delete card",
  "Clear all cards",
  "Add fingerprint",
  "Modify fingerprint validity period",
  "Delete fingerprint",
  "Clear all fingerprints",
  "Get lock automatic locking periodic time",
  "Set lock automatic locking periodic time",
  "Set lock remote unlock switch state",
  "Get lock config",
  "Set lock config",
  "Add passage mode",
  "Clear all passageModes",
  "Modify admin passcode to 9999",
  "Reset ekey",
  "Rest lock",
]

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

var cardNumber: undefined|string;
var fingerprintNumber: undefined|string;

const optionClick = (option: string, lockData: string) => {
  
  Toast.showToastLoad("load...");

  // Ttlock.supportFunction(Ttlock.lockFunction.passageMode,lockData,(isSupport: boolean)=>{
  //   console.log("isSupportPassageMode",isSupport)
  // })

  if (option === "Unlock/Lock") {
    Ttlock.controlLock(Ttlock.controlEnum.unlock, lockData, (lockTime: number, electricQuantity: number, uniqueId: number) => {
      let text = "lockTime:" + lockTime + "\n" + "electricQuantity:" + electricQuantity + "\n" + "uniqueId:" + uniqueId;
      successCallback(text);
    }, failedCallback)

  }

  if (option === "Get lock time") {
    Ttlock.getLockTime(lockData, (lockTimestamp: number) => {
      let text = "lockTimestamp:" + lockTimestamp;
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Set lock time") {
    let timestamp = new Date().getTime();
    Ttlock.setLockTime(timestamp, lockData, () => {
      successCallback("set lock time success");
    }, failedCallback);
  }
  else if (option === "Get lock operate record") {
    Ttlock.getLockOperateRecord(Ttlock.lockRecordEnum.latest, lockData, successCallback, failedCallback);
  }
  else if (option === "Create custom passcode 1122") {
    // passcode valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.createCustomPasscode("1122", startDate, endDate, lockData, () => {
      successCallback("create cutome passcode success");
    }, failedCallback);
  }
  else if (option === "Modify passcode 1122 -> 2233") {

    // passcode valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.modifyPasscode("1122", "2233", startDate, endDate, lockData, () => {
      successCallback("modify passcode success");
    }, failedCallback);
  }

  else if (option === "Delete passcode 2233") {
    Ttlock.deletePasscode("2233", lockData, () => {
      successCallback("delete passcode success");
    }, failedCallback);
  }

  else if (option === "Reset passcode") {
    Ttlock.resetPasscode(lockData, (lockDataNew: string) => {
      //important: upload lockDataNew to ttlock server. 
      successCallback("reset passcode success, please upload lockDataNew to server");
      console.log(lockDataNew)
    }, failedCallback);
  }

  else if (option === "Get lock switch state") {

    Ttlock.getLockSwitchState(lockData, (state: number, description: string) => {
      let text = "state:" + state + "\n" + "description:" + description;
      successCallback(text);
    }, failedCallback);


  }
  else if (option === "Add card") {
    // card valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addCard(null, startDate, endDate, lockData, () => { }, (cNumber: string) => {
      cardNumber = cNumber;
      let text = "cardNumber:" + cardNumber;
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Modify card validity period") {
    if(cardNumber === undefined){
      Toast.showToast("Please add a card first");
      return;
    }
    // card valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyCardValidityPeriod(cardNumber, null, startDate, endDate, lockData, () => {
      let text = "modify card validity period success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Delete card") {
    if(cardNumber === undefined){
      Toast.showToast("Please add a card first");
      return;
    }
    Ttlock.deleteCard(cardNumber, lockData, () => {
      let text = "delete card success";
      successCallback(text);
      cardNumber = undefined;
    }, failedCallback);
  }
  else if (option === "Clear all cards") {
    Ttlock.clearAllCards(lockData, () => {
      let text = "clear all cards success";
      successCallback(text);
      cardNumber = undefined;
    }, failedCallback);
  }
  else if (option === "Add fingerprint") {
    // card valid one day
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
  else if (option === "Modify fingerprint validity period") {
    if(fingerprintNumber === undefined){
      Toast.showToast("Please add a fingerprint first");
      return;
    }

    // card valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyFingerprintValidityPeriod(fingerprintNumber, null, startDate, endDate, lockData, () => {
      let text = "modify fingerprint validity period success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Delete fingerprint") {
    if(fingerprintNumber === undefined){
      Toast.showToast("Please add a fingerprint first");
      return;
    }
    Ttlock.deleteFingerprint(fingerprintNumber, lockData, () => {
      let text = "delete fingerprint success";
      successCallback(text);
      fingerprintNumber = undefined;
    }, failedCallback);
  }
  else if (option === "Clear all fingerprints") {

    Ttlock.clearAllFingerprints(lockData, () => {
      let text = "clear all fingerprints success";
      successCallback(text);
      fingerprintNumber = undefined;
    }, failedCallback);
  }
  else if (option === "Get lock automatic locking periodic time") {
    Ttlock.getLockAutomaticLockingPeriodicTime(lockData, (currentTime: number, maxTime: number, minTime: number) => {
      let text = "currentTime:" + currentTime + "\n" + "maxTime:" + maxTime + "\n" + "minTime:" + minTime;
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Set lock automatic locking periodic time") {
    let seconds = 20;
    Ttlock.setLockAutomaticLockingPeriodicTime(seconds, lockData, () => {
      let text = "set lock automatic lock periodic time success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Set lock remote unlock switch state") {
    let isOn = true;
    Ttlock.setLockRemoteUnlockSwitchState(isOn, lockData, (lockDataNew: string) => {
      let text = "set lock remote unlock switch success, please upload lockDataNew to server";
      successCallback(text);
      console.log(lockDataNew);
    }, failedCallback);
  }
  else if (option === "Get lock config") {
    Ttlock.getLockConfig(Ttlock.lockConfigEnum.audio, lockData, (type: number, isOn: boolean) => {
      let text = "type:" + type + "\n" + "isOn:" + isOn;
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Set lock config") {
    let isOn = true;
    Ttlock.setLockConfig(Ttlock.lockConfigEnum.audio, isOn, lockData, () => {
      let text = "config lock success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Add passage mode") {
    //minutes  8:00 am ---   17:00 pm
    let startTime = 8 * 60;
    let endTime = 17 * 60;
    // Ttlock.addPassageMode(Ttlock.lockPassageModeEnum.monthly, [1, 3, 9,28], startTime, endTime, lockData, successCallback, failedCallback);
    Ttlock.addPassageMode(Ttlock.lockPassageModeEnum.weekly, [1, 2, 7], startTime, endTime, lockData, () => {
      let text = "add passage mode success";
      successCallback(text);
    }, failedCallback);

  }
  else if (option === "Clear all passageModes") {
    Ttlock.clearAllPassageModes(lockData, () => {
      let text = "clear all passage modes success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Modify admin passcode to 9999") {
    let adminPasscode = "9999";
    Ttlock.modifyAdminPasscode(adminPasscode, lockData, () => {
      let text = "modify admin passcode success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Rest lock") {
    Ttlock.resetLock(lockData, () => {
      let text = "reset lock success";
      successCallback(text);
    }, failedCallback)
  }
  else if (option === "Reset ekey") {
    Ttlock.resetEkey(lockData, (lockDataNew) => {
      //important: upload lockDataNew to ttlock server. 
      let text = "reset ekey success";
      successCallback(text);
      console.log(lockDataNew);
    }, failedCallback)
  }
}

// const LockPage = () => {
  const LockPage = (props: any) => {
  const { route } = props;
  const { lockData } = route.params;
  // const lockData = "Wfvfx7/KfqzhMs/j0nXvPJAzVTKAbGoGkNGVulDSOqizhP4J096h1eVdq6c/SM0ugpb6xaUF0E6lh5D+1VHT4VmS2C4AmJUcJKBBz5tB2GLFNmA+Jo641OQ5qdMbsSW4U/RvVbr3lNXls9jp3zqvwa8Mhmr6iLwQJa1ltDnvpyXNyTe4Wv87DTyj2uTxSJe+7XQQI6JWuPYCXfpF4Eb4JqlXmCFN1oNqe7Yx2vQuNIjaUDlM9+8TDiQvk8x2FQmlfn2AmFscgWuXFjsy2eDpJ94d6oahwtalIjVMo97bCgf7Wfam3ejDyuWC/vCxML9la2osESVZOifNEqrCeWz1wDpGKiwisq2pYnBey3XfQRgjit/TkzlNhK1PbLtd4k0EVoBcxZESI/Z6sWgOBGcqcajQDROBzFB+7Mh0r95/ABj6vGLRnCk8if+FmBAKBgn4t9ICAJikKkeeAVR1n1ZbgZ39nmuEoPdNJygwxtLEPHCQaaGB4sZ/6QS+sPeKTlmMMIkvSi48unIVtfj1ISWXMDDAyUqkZLOk5yfdmid31of37RSrcut95IeMTnUz1XTpilROOSDlHe2Bg7ZhrWSw0nUqI8HiEEoYpUtw/6vTDwogtd1SCtoFBrgMv6aTe6CTzkCVWx9Zh72wynqXszz5/SsFsB0sgCohvXHK1TYSoBH3i4XtTtoIXE+5eEPPO3GqLHwzB3HkuzOrZLanaRwV0oX3wwEwB6ak73+BeGOZnq9iphXceQ6woFIehuymVw+3HUKk48nb0gW1yWCVmB8PGLWK4yYw2VQx/PDqAguh4B7HqUQ/s8Q4jwb+O5W+JdX07DcWsDBdoPevd3XvDsP+dX5YeZwyoDIxjSqu97lc183IP0p3IqcKHvk0TvSIzewXsEAxvb5uFROPUyXEyZG78EdtRtMcvF7C0+thHdJ1CbCy010dQfchlTeDZ7JZ+IjUsuWr1qDxuMmRg1N/kYIDxy8RS/hKqAbcq/ZARVkgtYLGHyCPHfl3Ekp2Y/oJ17oq3xsTU67PclEbMpYLpG0kSX2jJG8BoWReEZ/wns2P5yng7PTueLS3HugW8AHFIirGdKENNTVxpkVp4AuHdPDBhuBLjH/+5JmnTm3lYR88emMdcbhuXft7w1OyRPLTVX3Ke38L3aMiCnxDrXSFjYYfr5SWUWWTUS02C0e4lpf/XIumF9qoCr4CuY5Ex25gyHZtNZ6AXBwjPxL66qCOKQh62y/CBGnhftFiXdlTcC5iuzk0uXeq+/plD0/MaLIsTqhK/5a5fRTAiCgZgRg7HG2nR88DxwIpoRNGJ+HtAIWTItUPRwm2en/TkmROVHctKWibDRq4HhOueFzpO88OMK1czlIIlrQD5VqGTdC1WzMF8eE+9jXX1RHJ6Mq+dlqWKgzyQlamtaRgfheZICy9KqEYT4g1/xJAgOWIbVUl9xwDkKBxSiOeAtE26g9/ov1UsATRAnyWivfAJzJESn3o1LV8UkWAkDX9prh8Jfb9yJNQHcFD3/LJGDJcdtWvOBZrH3EkQB8lmN6x+HMST58X1VcUflBrE0gI8sd31OYmuWFh+g4ARAanZ2aK7s+whFUhk6pb+2ea8LTDi/jZJrDuVYL7BoMXxC/IYb3em9aad5IGNDu/Lg2C9er3nl+JCsll7YtKpxmjHgGJkCnluheGbt1gHID8Kob6LiU2ub9wnBLN1/kE6V2zfhKu0S6KgOH80OtxM/2X5guIMhrIrtSD07aI6/V+IxZafdbHS6yXhfDXM7GYylFgehhHblSIeUjO/lLo4dgqRZla7y0c+hQz0oN46s628MiCSdw7MST5Tqd1I3rgDoqCP4UFp+UJoETcD9vS/YVRbTo77FxgWaaMum4bIWC3iwuO/BmR6hQ6pV/VYmp1Vndbr3oKuFrr4sBzF+aiHIwqrGbEr627EF8QwujpvDhrv2jtwSgf+WCZP3W7H+lxgfQ4Ovomcuc1vJDwMX0D8FJ+j8Qk5MOq87qHdvNEFME+1asPERTVWssXZtm4g/U0Z9TSHQpNoV9IQ6ah/lYIhSzrTqhU+b/07N6kSWDbQc2xD/0H5EA5CkDZ28wFiE0xz9ZddlO63YCJUl5GAN6VZ0klzV65AxFQDi1X7mq3nI9wgIAUcQbtA62/QcEUvKbFcSHHgho=";
  const renderItem = ({ item }: { item: string }) => {
    return (
      <TouchableHighlight
        onPress={() => {
          optionClick(item, lockData);
        }}>
        <Text style={styles.item}>{item}</Text>
      </TouchableHighlight>

    );
  };


  // React.useEffect(()=>{
  //   //Reset Lock after componentWillUnmount
  //   return function resetLock(){Ttlock.resetLock(lockData,()=>{},()=>{})}
  // })

  return (
    <FlatList
      data={optionsData}
      renderItem={renderItem}
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

export default LockPage;