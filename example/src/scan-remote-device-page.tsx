import { observer } from 'mobx-react';
import React from 'react';
import {FlatList, Text, TouchableOpacity, View } from 'react-native';
import { TtRemoteDeivce, ScanRemoteDeviceModal } from 'react-native-ttlock';
import * as Toast from './toast-page';

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
        <Text>{item.remoteDeviceName}</Text>
      </TouchableOpacity>);
}

const ScanRemoteDevicePage = (props: any) => {
  const { navigation, route } = props;
  const {store, lockData} = route.params;
  
  return (
    <FlatList
      data={store.gatewayList}
      renderItem={({ item })=> renderItem(item,lockData,navigation,store)}
      keyExtractor={item => item.remoteDeviceMac}
    />
  );
}


export default observer(ScanRemoteDevicePage);