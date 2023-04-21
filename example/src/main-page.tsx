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
          // navigation.navigate("LockPage");
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