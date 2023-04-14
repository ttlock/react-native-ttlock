import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import {FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TtRemoteDeivce, ScanRemoteDeviceModal } from 'react-native-ttlock';
import * as Toast from './toast-page';
import store from './store'

const initRemoteDevice = (item: ScanRemoteDeviceModal, lockData: string, navigation: any,store: any) => {
  Toast.showToastLoad("init...")
  TtRemoteDeivce.stopScan();
  TtRemoteDeivce.init(item.remoteDeviceMac, lockData, (electricQuantity: number) => {
    Toast.showToast("init remote device success")
  }, (errorCode: number, description: string)=>{
    Toast.showToast("init remote device fail " + errorCode.toString())

  }); 
}


const renderItem = (item: ScanRemoteDeviceModal, lockData: string, navigation: any,store: any) => {
  return (<TouchableOpacity onPress={()=>{initRemoteDevice(item, lockData,navigation,store)}}>
        <Text style={styles.item}>{item.remoteDeviceName}</Text>
      </TouchableOpacity>);
}

const ScanRemoteDevicePage = (props: any) => {
  const { navigation, route } = props;
  let {lockData} = route.params;

  lockData = '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'
  useEffect(() => {
    store.startScanRemoteDevice();
   },[])

  
  return (
    <FlatList
      data={store.remoteDeviceList}
      renderItem={({ item })=> renderItem(item,lockData,navigation,store)}
      keyExtractor={item => item.remoteDeviceMac}
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

export default observer(ScanRemoteDevicePage);