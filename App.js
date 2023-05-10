import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useState, Component } from 'react';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function ActivePost({ navigation }) {
  const [pageHTML, setPageHTML] = useState('');
  const [topImage, setTopImage] = useState('');
  const [topImageCaption, setTopImageCaption] = useState('');

  fetch("https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=1")
    .then(result => result.json())
    .then(json => {
      postData = json["posts"][0]["html"];
      imageAddress = json["posts"][0]["feature_image"];
      imageCaption = json["posts"][0]["feature_image_caption"];
      setPageHTML(postData);
      setTopImage(imageAddress);
      setTopImageCaption(imageCaption);
      //console.log(json);
    });

  return (
    <View style={styles.container}>
      <WebView style={styles.webView}
        originWhitelist={['*']}
        source={{
          html: `<style> 
        body { font-size: 4rem }
        ol {margin-left: 5rem}
        #bmc-wbtn { width: 10rem !important; height: 10rem !important; border-radius: 10rem !important}
        #bmc-wbtn img { width: 5rem !important; height: 5rem !important}
        img { max-width: 100% !important; height: auto !important}
        </style>`+ '<body>' + `<img src="${topImage}">` + topImageCaption + pageHTML + '</body>'
        }}
      />
    </View>
  );
}

function LandingScreen() {
  const [numberThumbnails, setNumberThumbnails] = useState('4');
  const [imageArray, setImageArray] = useState('');
  const [captionArray, setCaptionArray] = useState('');
  fetch(`https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=${numberThumbnails}&include=id,title`)
    .then(result => result.json())
    .then(json => {
      for (let thumbnails = 0; thumbnails < numberThumbnails; thumbnails++) {
        imageAddress = json["posts"][thumbnail]["feature_image"];
        imageCaption = json["posts"][thumbnail]["feature_image_caption"];
        let tempImageAddressArray = imageArray.push(imageAddress);
        setImageArray(tempImageAddressArray);
        let tempImageCaptionArray = captionArray.push(imageCaption);
        setCaptionArray(tempImageCaptionArray);
      }
    });
    return(
//FLATLIST HERE?

    );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ActivePost">
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="ActivePost" component={ActivePost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,

  },
  webView: {
    width: '100%',
  }
});
