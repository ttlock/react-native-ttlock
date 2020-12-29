import { observer } from 'mobx-react';
import React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { TtGateway, ScanGatewayModal } from 'react-native-ttlock';
import * as Toast from './toast-page';


const connectGateway = (item: ScanGatewayModal, navigation: any,store: any) => {
  Toast.showToastLoad("connect...")
  TtGateway.stopScan();
  TtGateway.connect(item.gatewayMac, ()=> {
    Toast.hidden();
    navigation.navigate("ScanWifiPage",{store: store});
    store.startScanWifi();
  }, (errorCode: number,errorMessage: string) => {
    console.log(errorCode,errorMessage);
    Toast.showToast("Connect fail");
  } )
}


const renderItem = (item: ScanGatewayModal, navigation: any,store: any) => {
  let titleColor = "black";
  let title = "Connect"
  return (
    <View style={styles.item}>
      <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.gatewayName}</Text>
      <Button title={title} color="blue" onPress={() => { connectGateway(item, navigation,store) }}>
      </Button>
    </View>
  );
}


const ScanGatewayPage = (props: any) => {
  const { navigation, route } = props;
  const {store} = route.params;
  
  return (
    <FlatList
      data={store.gatewayList}
      renderItem={({ item })=>renderItem(item,navigation,store)}
      keyExtractor={item => item.gatewayMac}
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

export default observer(ScanGatewayPage);