import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TtDoorSensor, Ttlock, ScanDoorSensorModal, DeviceSystemModal } from 'react-native-ttlock';
import * as Toast from './toast-page';
import store from './store'




const renderItem = (item: ScanDoorSensorModal, operation: string, lockData: string, navigation: any) => (
  <TouchableOpacity onPress={
    () => {
      Toast.showToastLoad(operation + "...");
      TtDoorSensor.stopScan();

      if (operation === "Init door sensor") {
        initDoorSensor(item.mac, lockData, navigation);
      } else if (operation === "Add door sensor to lock") {
        addDoorSensorToLock(item.mac, lockData, navigation);
      } 
    }
  }>
    <Text style={styles.item}>{item.name}</Text>
  </TouchableOpacity>
)

const initDoorSensor = (doorSensorMac: string, lockData: string, navigation: any) => {
  TtDoorSensor.stopScan()
  TtDoorSensor.init(doorSensorMac, lockData, (electricQuantity: number, systemModel: DeviceSystemModal) => {
    Toast.showToast("init door sensor success")
    console.log("electricQuantity:" + String(electricQuantity));
    console.log("systemModel:" + JSON.stringify(systemModel));
    navigation.pop();
  }, (errorCode: number, description: string) => {
    Toast.showToast("init door sensor " + errorCode.toString())
  });
}


const addDoorSensorToLock = (doorSensorMac: string, lockData: string, navigation: any) => {
  Ttlock.addDoorSensor(doorSensorMac, lockData, () => {
    Toast.showToast("add door sensor success")
    navigation.pop();
  }, (errorCode: number, description: string) => {
    Toast.showToast("add door sensor fail " + errorCode.toString())
  })
}

const setDoorSensorAlertTime = (time:number, lockData: string, navigation: any) => {

 
}

const ScanDoorSensorPage = (props: any) => {
  const { navigation, route } = props;
  let { lockData, operation } = route.params;

  useEffect(() => {
    if (store.doorSensorList.length === 0) {
      Toast.showToastLoad("Please long press the reset button of the door sensor for 5 seconds");
      store.startScanDoorSensor();
    } else {
      Toast.hidden();
    }
  }, []);

  return (
    <FlatList
      data={store.doorSensorList}
      renderItem={({ item }) => renderItem(item, operation, lockData, navigation)}
      keyExtractor={item => item.mac}
    />
  );
}


const styles = StyleSheet.create({
  item: {
    lineHeight: 70,
    paddingLeft: 20,
    borderBottomColor: "gray",
    backgroundColor: 'white',
    borderWidth: 0.5
  },

});

export default observer(ScanDoorSensorPage);