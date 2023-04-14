import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import {FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TtRemoteKey, ScanRemoteKeyModal as ScanRemoteKeyModal, Ttlock } from 'react-native-ttlock';
import * as Toast from './toast-page';
import store from './store'




const renderItem = (item: ScanRemoteKeyModal, operation: string, lockData: string, navigation: any) => {
  return (<TouchableOpacity onPress={
    ()=>{
      Toast.showToastLoad(operation + "...");
      TtRemoteKey.stopScan();

      if(operation === "Init remote key"){
        initRemoteKey(item.remoteKeyMac, lockData,navigation);
      }else if(operation === "Add remote key to lock"){
        addRemoteKeyToLock(item.remoteKeyMac,lockData,navigation);
      }else if(operation === "Modify remote key valid date"){
        modifyRemoteKeyValidDate(item.remoteKeyMac,lockData,navigation);
      }else if(operation === "Delete remote key from lock"){
        deleteRemoteKeyFromLock(item.remoteKeyMac,lockData,navigation);
      }
    }
  }>
        <Text style={styles.item}>{item.remoteKeyName}</Text>
      </TouchableOpacity>);
}

const initRemoteKey = (remoteKeyMac: string, lockData: string, navigation: any) => {
  TtRemoteKey.init(remoteKeyMac, lockData, (electricQuantity: number) => {
    Toast.showToast("init remote key success")
    navigation.pop();
  }, (errorCode: number, description: string)=>{
    Toast.showToast("init remote key fail " + errorCode.toString())

  }); 
}

const addRemoteKeyToLock = (remoteKeyMac: string, lockData: string, navigation: any) => {
  // remote key valid 1 hour
  let startDate = new Date().getTime();
  let endDate = startDate + 1 * 60 * 60 * 1000;
  Ttlock.addRemoteKey(remoteKeyMac, null, startDate, endDate, lockData, ()=>{
    Toast.showToast("add remote key success")
    navigation.pop();
  }, (errorCode: number, description: string)=>{
    Toast.showToast("add remote key fail " + errorCode.toString())
  })
}

const modifyRemoteKeyValidDate = (remoteKeyMac: string, lockData: string, navigation: any) => {
  // remote key valid 24 hour
  let startDate = new Date().getTime();
  let endDate = startDate + 24 * 60 * 60 * 1000;
  Ttlock.modifyRemoteKey(remoteKeyMac, null, startDate, endDate, lockData, ()=>{
    Toast.showToast("modify remote key valid date success")
    navigation.pop();
  }, (errorCode: number, description: string)=>{
    Toast.showToast("modify remote key valid date fail " + errorCode.toString())
  })
}

const deleteRemoteKeyFromLock = (remoteKeyMac: string, lockData: string, navigation: any) => {
  Ttlock.deleteRemoteKey(remoteKeyMac, lockData, ()=>{
    Toast.showToast("delete remote key success")
    navigation.pop();
  }, (errorCode: number, description: string)=>{
    Toast.showToast("delete remote key fail " + errorCode.toString())
  })
}




const ScanRemoteKeyPage = (props: any) => {
  const { navigation, route } = props;
  let {lockData, operation} = route.params;

  useEffect(() => {
    if(store.remoteKeyList.length === 0){
      Toast.showToastLoad("Please long press the lock button of the remote key for 5 seconds");
    }else{
      Toast.hidden();
    }
    
    store.startScanRemoteKey();
   },[]);

  return (
    <FlatList
      data={store.remoteKeyList}
      renderItem={({ item })=> renderItem(item,operation,lockData,navigation)}
      keyExtractor={item => item.remoteKeyMac}
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

export default observer(ScanRemoteKeyPage);