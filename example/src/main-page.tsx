import * as React from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import config from './config'
import * as Toast from './toast-page';

const MainPage = ({ navigation }: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          // let lockData = "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"
          // let lockMac = "D3:D9:02:56:F2:12"
          // navigation.navigate("LockPage", {lockData: lockData, lockMac: lockMac});
          navigation.navigate("ScanLockPage");
        }}>
        <Text style={styles.touchButtonText}>Lock</Text>
      </TouchableHighlight>

     

      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          if(config.gatewayName === undefined || config.ttlockUid === undefined || config.ttlockLoginPassword === undefined){
            let warnText = "Please fill in the configuration information";
            console.log(warnText);
            Toast.showToast(warnText);
            return;
          }
          navigation.navigate("ScanGatewayPage");
        }}>
        <Text style={styles.touchButtonText}>Gateway</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    justifyContent: "center"
  },


  touchButton: {
    backgroundColor: "white",
    marginTop: 80,
    marginHorizontal: 100,
    height: 150,

    borderRadius: 20,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  touchButtonText: {
    color: '#333333',
    textAlign: 'center',
  }
});

export default MainPage;