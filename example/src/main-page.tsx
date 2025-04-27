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
          // let lockData = "Wfvfx7/KfqzhMs/j0nXvPJAzVTKAbGoGkNGVulDSOqizhP4J096h1eVdq6c/SM0uul5IZN//ODEjjLzdOXR1myRoFtc/46ZILmtCYPoC0CEk9Dh8z1j3j3c6+64QhxgVGgQ57gcBkhPY6cZvtjsSXqSD3X75gp/QRDapUV4rXIYXIyCB5YFfFgUUH931AgeSxbbWqR+u3mtolj695hOA6Xw/3LK2TbwEEug9V6TAxpFDpd3rOYwMd9FJ0hhP5kvDvkhqWhtKLNsujFmZ/RA75PGCshyqWxy/yIYRvFIXxtoSzyTWUks0mwmujuGAsHHG7QTOyENmjDNDRHcovaWjWH8KIFQH2ucuHcf01V3+kCsny61cd5T5VeY6gtgPMMHhqKVJHASPVNpfLIDwhWWI3sU6TKd8I8lyizTqShkCxT3G7M8/wmvDK8s81DNaxxZUBvBa0WlbnOD82g8vgW+XjujuAYEuAKe5zK6iyLMw2KhqTLIMbVMK7u3D9hv8z/UBogAGulSEZjVgaHM2q5179Qr8zRCJ1p1jTy0yylRG84F3qYbGN7EtL7m31DY3vhn1ej8hJalOR5HxL9dzrq6yHa0Ni6hVNVOe/n7xxt5vFYIKd3pEbHCgvP8qeB+dTXTWbRDsdixD+yGeJCKbY7uhTWw0lOyTrHZ1/9W/li9NE2jzgN26/WxsffEFiGEewcBej9q4XxRVygbtvQvByxhie6UdnLjf4Dptlz5LpZVA4MqMVf/ZwtONXLiwNZGVS0dl6gLAsgaahLIWRKxAsSATWWfj/2cbnWTrMYKpRj1s04PCfVc3u2W91tYM/47RI5XJ+5F20+VOPmns5w/DiH6MbUwiwjivMcrVLQnjSqk5l6xACO0aeN7sEBc5LQRpKoFv+IhX1Fc42KR8PcQH6SoWxx7zbuUAk8rHQVvUaL1N+N7JhRmMcKRB49yvLsvNuyCyKw1p/swqn45TjVKScrhPKeLqh2TmWxKMEMwaDc21a299ojp61EaJBjV3bbRrW2MTo3Evts679lB4gdy7E2egORLCq6aC2q91qeoaUUykpXkpN1oeA9nIppsYSYFo7saWqQysBFwlpKsQyNje8tOOBNkCO+bNwk23Kc1Ezk2G/K+JGxdvIrlb6jnMvQr/oeFP20+88sBJH8YMZBn5HoOo4dKjrt6qt5egLiOYaCms3Ijba+qUCumGk/7xcuqZjwKmL/25vIHmnpwlcvWIaMgFKkZYRVZVye6j4XfZo5k/HOUF7L9ekXVatLsMPQm+0kMojVXl22hTnsf3ioOW3r9apUby7qoh6bt8n8rl4rHL7vd1O6tmGcU2sc/ajo/dUwx9qcrydUE5ufdGqO5m8F9hfLzG474REfU+RhUxj1xeTgIRnM/Lv/rq2PUklvth5kQSkyGp6AhkV7Ry5uoMoHSBewAFocMV2pLMiwbdx278tG775w/lkzMQUF3Wre5GhVjmXijI/hYbDQGbS4BJdWAz7ufCP8OyVGwo/luOBifcYoZXKa9K+Bjf6vUR4tLzpPW42uXkmynnfGeZ3i6dRiu+zgnDQdgpuV8Z9QYmvbY/1m5mu6rbbSBhTVyYOllvoSJ/OBMWI9Xcbac+/gP/4JwJsk8MR3R8bnx4+8uemp1pblRfBaXNliO1DAIFC8iT85ZjQSB0badXWuI3EhFFDmY8DcBhREf3OT3UHajGayRHiBmPNeZApzpmT+Pwr9YI32WMcCYjXTMdnuANVJSko/CV1+/OEu8UvsQYh358ywDVE9ejwcDIKpgSFGFKNcAsNlKI61sRUcVI9jOR36Rgrw/+E4oSSPaOxrqJvDzjgH6I3ofebgWEZnl2oxZ86QfFMiQ/a+6TpUUtoiwmzJGmF1MXJGYn6MhSCTSjzA0mE6yxDHZqqcNDOks+ddwXOy1PP0VY22zN/wlRN2HLyHdQV5pCVT6qDIfmYba6yHeF/W4nYspkbyjpMOR6pL7nFPzIr9w6jhIYKilLFoZ7v+eMzfGkgV8slA919dy0thy+whEz/FEJqUNDsqMKjhPXJnxPHEHpJ1QZ+v7qo0573q+oQwLxpgwJUCGEbZESR7J0756+EnyocGZ1lspxW1QmDS8spzid78PAkqW3GjgmyKx6htKdBcVxIceCGg=="
          // let lockMac = "C5:71:21:C7:82:1A"
          // navigation.navigate("LockPage", {lockData: lockData, lockMac: lockMac});
          navigation.navigate("ScanLockPage");
        }}>
        <Text style={styles.touchButtonText}>Lock</Text>
      </TouchableHighlight>

     

      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          if(config.gatewayName === undefined || config.ttLockUid === undefined || config.ttLockLoginPassword === undefined){
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