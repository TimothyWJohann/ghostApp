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

function LandingScreenSeparator() {
  return (
    <View style={{ height: 2, width: "100%", backgroundColor: "black" }} />
  )
}

function LandingScreen(navigation) {
  const [numberThumbnails, setNumberThumbnails] = useState(6);
  const [thumbnailData, setThumbnailData] = useState({});
  const [newPostsReady, setNewPostsReady] = useState('true');
  useEffect(() => {
    fetch(`https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=${numberThumbnails}&fields=id,title,feature_image,custom_excerpt`)
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
        setNewPostsReady(!newPostsReady);
        console.log("THUMBNAILDATA", thumbnailData["63c469bc09f2381d5f266e18"]['custom_excerpt']);
      })
      .catch(error => { console.log("ERROR", error) });
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={Object.keys(thumbnailData)}
        renderItem={({ item }) =>
          <View style={styles.landingpost}>
            <Text style={styles.landingtitle}>{thumbnailData[item]['title']}</Text>
            <Text style={styles.landingexcerpt}>{thumbnailData[item]['excerpt']}</Text>
            <Image style={styles.container} source={{ uri: `${thumbnailData[item]['image']}` }} />
          </View>
        }
        keyExtractor={item => item}
        extraData={newPostsReady}
        ItemSeparatorComponent={LandingScreenSeparator}
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
    width: '50%',
    resizeMode: 'contain',
    flex: 1,
    minHeight: 100,
  },
  webView: {
    width: '100%',
  },
  landingpost: {
    flex: 1,
    width: '90%',
    flexGrow: 1,
    minHeight: 200,
    margin: 15,
  },
  landingtitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  }
});
