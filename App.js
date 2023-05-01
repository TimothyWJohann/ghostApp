import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export default function App() {

  async function logJSONData() {
    const response = await fetch("https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=1&fields=title,html");
    const jsonData = await response.json();
    console.log(jsonData);
  }
  logJSONData();
  return (
    <View style={{ flex: 1 }}>
      <WebView style={styles.webView}
        originWhitelist={['*']}
        source={{ html: '<h1>HELLO WORLD</h1>' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    margin: 20,
  },
  webView: {
    borderWidth: 5,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  }
});
