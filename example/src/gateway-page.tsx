import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { TtGateway } from 'react-native-ttlock';
import type { InitGatewayParam } from 'react-native-ttlock';
import * as Toast from './toast-page';
import config from './config'



const GatewayPage = (props: { navigation: any; route: any; }) => {
  const { route } = props;
  const { wifi } = route.params;
  const [wifiPassword, setWifiPassword] = useState<string>();


  const editWifiPassword = (text: string) => {
    setWifiPassword(text);
  }

  const initGateway = () => {
    if(wifiPassword === undefined || wifiPassword.length === 0){
      Toast.showToast("please input wifi password");
      return;
    }

    let object: InitGatewayParam = {
      wifi: wifi,
      wifiPassword: wifiPassword!,
      gatewayName: config.gatewayName,
      ttlockUid: config.ttlockUid,
      ttlockLoginPassword: config.ttlockLoginPassword
    }

    Toast.showToastLoad("init...");

    TtGateway.initGateway(object, (data: InitGatewayModal)=>{
      let text = "Gateway init success: " + data.firmwareRevision;
      Toast.showToast(text);
      console.log(text);
    }, (errorCode: number, errorMessage: string) => {
      let text = "errorCode:" + errorCode + " errorMessage:" + errorMessage;
      Toast.showToast(text);
    })
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>Wifi: {wifi}</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20 }}
        onChangeText={editWifiPassword}
        placeholder="Please input the wifi password"
      />
      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={initGateway}>
        <Text style={styles.touchButtonText}>Init Gateway</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    justifyContent: "center",
    margin: 40,
  },

  touchButton: {
    backgroundColor: "white",
    marginTop: 80,
    marginHorizontal: 50,
    height: 50,

    borderRadius: 6,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
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

  touchButtonText: {
    color: '#333333',
    textAlign: 'center',
  }
});

export default GatewayPage;