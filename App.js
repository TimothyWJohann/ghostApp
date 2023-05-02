import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useState, Component } from 'react';
import { WebView } from 'react-native-webview';

export default function App() {
const [pageHTML, setPageHTML] = useState('');
  /* async function logJSONData() {
    const response = await fetch("https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=1&fields=title,html");
    const jsonData = await response.json();
  //  console.log(jsonData);
    jsonData = postData["posts"][0]["html"]
    return jsonData;
  }
  let postData = await logJSONData();
  */ 

  fetch("https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=1&fields=title,html")
  .then(result => result.json())
  .then(json => {
    //console.log('got json:', json);
    postData = json["posts"][0]["html"];
    setPageHTML(postData);
  });
  
  /*let htmlData = postData["posts"][0]["html"];
  console.log('HTML DATA');
  console.log(htmlData);*/

  return (
    <View style={{ flex: 1 }}>
      <WebView style={styles.webView}
        originWhitelist={['*']}
        source={{ html: pageHTML }}
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
