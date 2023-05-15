import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, ScrollView, Pressable, Button } from 'react-native';
import React, { useState, Component, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function ActivePost({ route, navigation }) {
  const [pageHTML, setPageHTML] = useState('');
  const [topImage, setTopImage] = useState('');
  const [topImageCaption, setTopImageCaption] = useState('');

  let idOfPostToDisplay = route.params.idOfPostToDisplay;
  let postIds = route.params.postIdList;
  let indexOfPostToDisplay = postIds.indexOf(idOfPostToDisplay);
  let idOfNextPost = postIds[indexOfPostToDisplay + 1];

  console.log("CURRENT POST ID", idOfPostToDisplay );
  console.log("NEXT POST ID", idOfNextPost );


    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('ActivePost', { idOfPostToDisplay: idOfNextPost, postIdList: postIds })} title="Next Post" />
      ),
    });
 

  fetch(`https://cathy.sarisky.link/ghost/api/content/posts/${idOfPostToDisplay}/?key=e40b1d2e5d73dbfce53c612c7a`)
    .then(result => result.json())
    .then(json => {
      let postData = json["posts"][0]["html"];
      let imageAddress = json["posts"][0]["feature_image"];
      let imageCaption = json["posts"][0]["feature_image_caption"];
      //need some logic to not set if it doesn't exist
      setPageHTML(postData);
      setTopImage(imageAddress);
      setTopImageCaption(imageCaption);
    });

  return (
    <View style={styles.activepost}>
      <WebView style={styles.webView}
        originWhitelist={['*']}
        source={{
          html: `<style> 
      body { font-size: 4rem; padding: 20px }
      ol {margin-left: 5rem}
      #bmc-wbtn { width: 10rem !important; height: 10rem !important; border-radius: 10rem !important}
      #bmc-wbtn img { width: 5rem !important; height: 5rem !important}
      img { max-width: 100% !important; height: auto !important }
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

function LandingScreen({ navigation }) {
  const [numberThumbnails, setNumberThumbnails] = useState(8);
  const [thumbnailData, setThumbnailData] = useState({});
  const [newPostsReady, setNewPostsReady] = useState('true');
  const [postIdList, setPostIdList] = useState([]);

  useEffect(() => {

    fetch(`https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=all&fields=id`)
      .then(fetchedIdList => fetchedIdList.json())
      .then(jsonIdList => {
        let tempIdList = [];
        for (let post of jsonIdList["posts"]) {
          tempIdList.push(post["id"]);
        }
        setPostIdList(tempIdList);
      })
      .catch(error => { console.log("ERROR", error) });

    fetch(`https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=${numberThumbnails}&fields=id,title,feature_image,excerpt,feature_image_caption,html`)
      .then(result => result.json())
      .then(json => {
        let tempThumbnailData = thumbnailData;
        for (let thumbnail = 0; thumbnail < numberThumbnails; thumbnail++) {
          let thumbnailId = json["posts"][thumbnail]["id"];
          let thumbnailImageAddress = json["posts"][thumbnail]["feature_image"];
          let thumbnailTitle = json["posts"][thumbnail]["title"];
          let thumbnailExcerpt = json["posts"][thumbnail]["excerpt"];
          let thumbnailHTML = json["posts"][thumbnail]["html"];
          let thumbnailCaption = json["posts"][thumbnail]["feature_image_caption"];
          tempThumbnailData[thumbnailId] = {
            image: thumbnailImageAddress,
            title: thumbnailTitle,
            excerpt: thumbnailExcerpt,
            html: thumbnailHTML,
            caption: thumbnailCaption
          };
        };
        setThumbnailData(tempThumbnailData);
        setNewPostsReady(!newPostsReady);
      })
      .catch(error => { console.log("ERROR", error) });
  }, [])

  return (
    <FlatList
      data={Object.keys(thumbnailData)}
      renderItem={({ item }) =>
        <Pressable style={styles.landingpost} onPress={() => {
          navigation.navigate('ActivePost', { idOfPostToDisplay: item, postIdList: postIdList })
        }}>
          <Text style={styles.landingtitle}>{thumbnailData[item]['title']}</Text>
          <Text style={styles.landingexcerpt}>{thumbnailData[item]['excerpt']}</Text>
          <Image style={styles.container} source={{ uri: `${thumbnailData[item]['image']}` }} />
        </Pressable>
      }
      keyExtractor={item => item}
      extraData={newPostsReady}
      ItemSeparatorComponent={LandingScreenSeparator}
    />
  )
}

const Stack = createNativeStackNavigator();

function App({ }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Pick A Post">
        <Stack.Screen name="Pick A Post" component={LandingScreen} />
        <Stack.Screen name="ActivePost" component={ActivePost} options={{ title: '' }} />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  landingexcerpt: {
    margin: 10,
  },
  activepost: {
    width: '100%',
    resizeMode: 'contain',
    flex: 1,
    minHeight: 100,
  }
});
