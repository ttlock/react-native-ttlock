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
          let lockData = "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"
          let lockMac = "EC:5F:73:38:6A:CD"
          navigation.navigate("LockPage", {lockData: lockData, lockMac: lockMac});
          // navigation.navigate("ScanLockPage");
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