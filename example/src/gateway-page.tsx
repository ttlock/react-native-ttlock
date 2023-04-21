import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { GatewayType, TtGateway, GatewayIpSettingType } from 'react-native-ttlock';
import type { InitGatewayParam, InitGatewayModal } from 'react-native-ttlock';
import * as Toast from './toast-page';
import config from './config'



const GatewayPage = (props: { navigation: any; route: any; }) => {
  const { route } = props;
  const { wifi, type } = route.params;
  const [wifiPassword, setWifiPassword] = useState<string>();

  const initGateway = () => {
    let initGatewayParam: InitGatewayParam;
    if (type == GatewayType.G2) {
      if (wifiPassword === undefined || wifiPassword.length === 0) {
        Toast.showToast("please input wifi password");
        return;
      }
  //for static ip setting

      initGatewayParam = {
        type: type,
        gatewayName: config.gatewayName,
        ttlockUid: config.ttlockUid,
        ttlockLoginPassword: config.ttlockLoginPassword,
        wifi: wifi,
        wifiPassword: wifiPassword,

        ipSettingType: undefined,
        ipAddress: undefined,
        subnetMask: undefined,
        router: undefined,
        preferredDns: undefined,
        alternateDns: undefined

        //for static ip setting (option)
       //  ipSettingType: GatewayIpSettingType.STATIC_IP,
       //  ipAddress: "172.16.0.199",
       //  subnetMask: "255.255.0.0",
       //  router: "172.16.0.1",
       //  preferredDns: "223.6.6.6",
       //  alternateDns: "223.5.5.5"
      }
    } else {
      initGatewayParam = {
        type: type,
        gatewayName: config.gatewayName,
        ttlockUid: config.ttlockUid,
        ttlockLoginPassword: config.ttlockLoginPassword,
        wifi: undefined,
        wifiPassword: undefined,

        ipSettingType: undefined,
        ipAddress: undefined,
        subnetMask: undefined,
        router: undefined,
        preferredDns: undefined,
        alternateDns: undefined

        //for static ip setting (option)
        // ipSettingType: GatewayIpSettingType.STATIC_IP,
        // ipAddress: "192.168.1.100",
        // subnetMask: "255.255.255.0",
        // router: "192.168.1.1",
        // preferredDns: "xxx.xxx.xxx.xxx",
        // alternateDns: "xxx.xxx.xxx.xxx"
      }
    }

    Toast.showToastLoad("init...");
    TtGateway.initGateway(initGatewayParam, (data: InitGatewayModal) => {
      let text = "Gateway init success: " + data.firmwareRevision;
      Toast.showToast(text);
      console.log(text);
    }, (errorCode: number, errorMessage: string) => {
      let text = "errorCode:" + errorCode + " errorMessage:" + errorMessage;
      Toast.showToast(text);
    })
  }

  const editWifiPassword = (text: string) => {
    setWifiPassword(text);
  }


  let WifiView = <View></View>;
  if(type === GatewayType.G2){
    WifiView = (
      <View>
        <Text style={{ fontSize: 40 }}>Wifi: {wifi}</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20 }}
          onChangeText={editWifiPassword}
          placeholder="Please input the wifi password"
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {WifiView}
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
