import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TtWirelessKeypad, ScanWirelessKeypadModal } from 'react-native-ttlock';
import * as Toast from './toast-page';
import store from './store'




const renderItem = (item: ScanWirelessKeypadModal, operation: string, lockMac: string, navigation: any) => (
  <TouchableOpacity onPress={
    () => {
      Toast.showToastLoad(operation + "...");
      TtWirelessKeypad.stopScan();

      TtWirelessKeypad.init(item.mac, lockMac, (electricQuantity: number, wirelessKeypadFeatureValue: string) => {
        Toast.showToast("init wireless keypad success")
        console.log("electricQuantity:" + String(electricQuantity) + "    wirelessKeypadFeatureValue:" + wirelessKeypadFeatureValue);

        navigation.pop();
      }, (errorCode: number, description: string) => {
        Toast.showToast(description + errorCode.toString())
      });
    }
  }>
    <Text style={styles.item}>{item.name}</Text>
  </TouchableOpacity>
)


const ScanWirelessKeypadPage = (props: any) => {
  const { navigation, route } = props;
  let { lockMac, operation } = route.params;

  useEffect(() => {
    if (store.wirelessKeypadList.length === 0) {
      Toast.showToastLoad("Please type *529# on the wireless keyboard");
      store.startWirelessKeypad();
    } else {
      Toast.hidden();
    }
  }, []);

  return (
    <FlatList
      data={store.wirelessKeypadList}
      renderItem={({ item }) => renderItem(item, operation, lockMac, navigation)}
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

export default observer(ScanWirelessKeypadPage);