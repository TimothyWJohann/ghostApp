import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, ScrollView } from 'react-native';
import React, { useState, Component, useEffect } from 'react';
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

/*function RenderLandingScreen(thumbnails) {
  /*console.log("IN RENDER SCREEN");
  const data = thumbnails.thumbnailData;
  console.log("DATA", data);
  console.log("KEYSDATA", Object.keys(data));
  tempData = Object.keys(data);
  testData = ["oranges", "apples", "bananas"];
  return (
    <View style={styles.test}>
      <Text style={styles.landing}>Test text</Text>
    </View>
  );
}*/

function LandingScreen(navigation) {
  const [numberThumbnails, setNumberThumbnails] = useState(6);
  const [thumbnailData, setThumbnailData] = useState({});
  useEffect(() => {
    fetch(`https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=${numberThumbnails}&fields=id,title,feature_image`)
      .then(result => result.json())
      .then(json => {
        let tempThumbnailData = thumbnailData;
        for (let thumbnail = 0; thumbnail < numberThumbnails; thumbnail++) {
          let thumbnailId = json["posts"][thumbnail]["id"];
          let thumbnailImageAddress = json["posts"][thumbnail]["feature_image"];
          let thumbnailTitle = json["posts"][thumbnail]["title"];
          tempThumbnailData[thumbnailId] = { image: thumbnailImageAddress, title: thumbnailTitle };
        };
        setThumbnailData(tempThumbnailData);
        console.log("THUMBNAILDATA", thumbnailData["63c469bc09f2381d5f266e18"]['image']);
      })
      .catch(error => { console.log("ERROR", error) });
  }, [])

  return (
    <View style={{ flex: 1, borderWidth: 5, borderColor: 'pink' }}>
      <FlatList
        data={Object.keys(thumbnailData)}
        renderItem={({ item }) =>
          <View style={styles.test}>
            <Text>{thumbnailData[item]['title']}</Text>
            <Image style={styles.container} source={{ uri: `${thumbnailData[item]['image']}` }} />
          </View>
        }
        keyExtractor={item => item}
      />
    </View>
  )
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingScreen">
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="ActivePost" component={ActivePost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: '50%',
    resizeMode: 'contain',
    flex: 1
  },
  webView: {
    width: '100%',
  },
  test: {
    flex: 1,
    flexGrow: 1,
    borderWidth: 5,
    borderColor: 'blue',
    width: '100%',
    height: 200
  }
});
