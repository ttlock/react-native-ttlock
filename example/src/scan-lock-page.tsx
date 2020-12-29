import React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Ttlock, ScanLockModal } from 'react-native-ttlock';
import { observer } from 'mobx-react';
import * as Toast from './toast-page';

const initLock = (scanLockModal: ScanLockModal, navigation: any) => {
  Toast.showToastLoad("Init ...");

  let object = {
    lockMac: scanLockModal.lockMac,
    lockVersion: scanLockModal.lockVersion
  }
  Ttlock.initLock(object, (lockData) => {
    Ttlock.stopScan();
    navigation.navigate("LockPage", { scanLockModal: scanLockModal, lockData: lockData });
    Toast.hidden();
  }, (errorCode, errorDesc) => {
    Toast.showToast("errorCode："+ errorCode + " errorDesc:"+errorDesc);
  })
}

const renderItem = (item: ScanLockModal, navigation: any) => {
  let titleColor = item.isInited ? "lightgray" : "black";
  let title = item.isInited ? "" : "Init"
  return (
    <View style={styles.item}>
      <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.lockName}</Text>
      <Button title={title} color="blue" onPress={() => { initLock(item, navigation)}}>
      </Button>
    </View>
  );
}

const ScanLockPage = (props: { navigation: any; route: any; }) => {
  const { navigation, route } = props;
  const { store } = route.params;
  return (
    <FlatList
      data={store.lockList}
      renderItem={({item})=>renderItem(item,navigation)}
      keyExtractor={item => item.lockMac}
    />
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   marginTop: StatusBar.currentHeight || 0,
  // },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },

});

export default observer(ScanLockPage)