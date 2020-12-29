import React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import type { ScanWifiModal } from "react-native-ttlock";
import { observer } from 'mobx-react';
import * as Toast from './toast-page';


const gotoInitGateway = (item: ScanWifiModal, navigation: any) => {
  navigation.navigate("GatewayPage", { wifi: item.wifi });
}

const renderItem = (item: ScanWifiModal, navigation: any) => {
  let titleColor = "black";
  let title = "Init Gateway"
  return (
    <View style={styles.item}>
      <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.wifi}</Text>
      <Button title={title} color="blue" onPress={() => { gotoInitGateway(item, navigation) }}>
      </Button>
    </View>
  );
}

const ScanWifiPage = (props: any) => {
  const { navigation, route } = props;
  const {store} = route.params;

  Toast.showToast("scan wifi ...");
  return (
    <View>
      <FlatList
        data={store.wifiList}
        renderItem={({ item }) => {return renderItem(item, navigation)}}
        keyExtractor={item => item.wifi}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

export default observer(ScanWifiPage)