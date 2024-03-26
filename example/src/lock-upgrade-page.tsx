import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Toast from './toast-page';
import {TtUpgradeError, TtUpgradeProgress, TtlockDFU} from 'react-native-ttlock-upgrade'

const getLockSupportOperationList = (lockData: string) => {
  return [
    "Start upgrade by client",
    "Start upgrade by firmware package",
    "Stop upgrade"
    ]
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


const operationClick = (lockOperation: string, lockData: string, lockMac: string, navigation: any) => {
  // Toast.showToastLoad(lockOperation + "...");

  if (lockOperation === "Start upgrade by client") {
    TtlockDFU.startUpgradeByClient("clientId", "accessToken", 1, "lockData", (progress: TtUpgradeProgress, percentage: number) => {
      console.log("升级状态：" + progress + "    进度：" + percentage)
    }, (error: TtUpgradeError) => {
      console.log("升级失败: " + error)
    })
  }
  // "",
  // "",
  // ""

  else if (lockOperation === "Start upgrade by firmware package") {
    TtlockDFU.startUpgradeByFirmwarePackage("packageUrl", "lockData", (progress: TtUpgradeProgress, percentage: number) => {
        console.log("升级状态：" + progress + "    进度：" + percentage)
    }, (error: TtUpgradeError) => {
      console.log("升级失败: " + error)
    })
  }

  else if (lockOperation === "Stop upgrade") {
    TtlockDFU.stopUpgrade()
  }

}


const LockPage = (props: any) => {
  const { route, navigation } = props;
  const { lockData, lockMac } = route.params;
  console.log("参数：" + JSON.stringify(route.params))
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




export default LockPage;
