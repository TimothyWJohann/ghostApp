import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, ScrollView, Pressable, Button } from 'react-native';
import React, { useState, Component, useEffect, useContext } from 'react';
import { WebView } from 'react-native-webview';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Entypo';
import { HeaderLeft, HeaderRight, HeaderTitle } from './header';
import { styles } from './styles';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DownloadPost, DownloadList } from './downloaded-posts';
import { Settings } from './settings';
import { NumPostsDisplay, numPostsDisplay } from './context';
import AsyncStorage from '@react-native-async-storage/async-storage'

function ActivePost({ route, navigation }) {
  const [pageHTML, setPageHTML] = useState('');
  const [topImage, setTopImage] = useState('');
  const [topImageCaption, setTopImageCaption] = useState('');

  let idOfPostToDisplay = route.params.idOfPostToDisplay;
  let postIds = route.params.postIdList;
  let indexOfPostToDisplay = postIds.indexOf(idOfPostToDisplay);
  let idOfNextPost = postIds[indexOfPostToDisplay + 1];
  let idOfPreviousPost = postIds[indexOfPostToDisplay - 1];

  console.log("CURRENT POST ID", idOfPostToDisplay);
  console.log("NEXT POST ID", idOfNextPost);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight idOfNextPost={idOfNextPost} postIds={postIds} navigation={navigation} />
      ),
      headerLeft: () => (
        <HeaderLeft idOfPreviousPost={idOfPreviousPost} postIds={postIds} navigation={navigation} />
      ),
      headerTitle: ''
    });
  }, [navigation]);


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
  const [thumbnailData, setThumbnailData] = useState({});
  const [newPostsReady, setNewPostsReady] = useState('true');
  const [postIdList, setPostIdList] = useState([]);
  const [oldThumbnails, setOldThumbnails] = useState(0);
  const { numberThumbnails, setNumberThumbnails } = useContext(NumPostsDisplay);
  const isFocused = useIsFocused();
  console.log('NUMBERTHUMBNAILS', numberThumbnails);

  useEffect(() => {

    if (numberThumbnails !== 0){

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
    console.log("useEffect fire, numberThumbnails is", numberThumbnails)

    fetch(`https://cathy.sarisky.link/ghost/api/content/posts/?key=e40b1d2e5d73dbfce53c612c7a&limit=${numberThumbnails}&fields=id,title,feature_image,excerpt,feature_image_caption,html`)
      .then(result => result.json())
      .then(json => {
        
        //let tempThumbnailData = thumbnailData;
        let tempThumbnailData = {}
        console.log('reset tempThumbnailData with numberThumbnails = ', numberThumbnails)
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
  }}, [numberThumbnails])

  return (
    <View>
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
    </View>
  )
}

const Stack = createNativeStackNavigator();

function ContentNavigator() {
  return (
    <Stack.Navigator initialRouteName="Pick A Post">
      <Stack.Screen name="Pick A Post" component={LandingScreen} />
      <Stack.Screen name="ActivePost" component={ActivePost} />
    </Stack.Navigator>
  );
};


const Tab = createBottomTabNavigator();

function App({ }) {
  const [numberThumbnails, setNumberThumbnails] = useState(0);
  console.log('numberThumbnails before getNumPosts', numberThumbnails);
  
  async function getNumPosts () {
    //const { numberThumbnails, setNumberThumbnails } = useContext(NumPostsDisplay);
    console.log('IN GETNUMPOSTS')
    try {
        const numPosts = await AsyncStorage.getItem('numberPostsDisplay');
        console.log("NUMPOSTSDISPLAY", numPosts);
        setNumberThumbnails(+numPosts);
    } catch (e) {console.log("ERROR", e);
    }
}

  getNumPosts();

  console.log('numberThumbnails after getNumPosts', numberThumbnails);
  
  return (
    <NavigationContainer>
      <NumPostsDisplay.Provider value={{ numberThumbnails, setNumberThumbnails }}>
        <Tab.Navigator initialRouteName="ContentNavigator"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: 'blue',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'ContentNavigator') {
                iconName = focused ? 'home' : 'home';
              }
              else if (route.name === 'DownloadPost') {
                iconName = focused ? 'download' : 'download';
              }
              else if (route.name === 'DownloadList') {
                iconName = focused ? 'archive' : 'archive';
              }
              else if (route.name === 'Settings') {
                iconName = focused ? 'cog' : 'cog';
              }
              return (
                <Icon
                  name={iconName}
                  size={size}
                  color={color}
                />
              )
            }
          })}>
          <Tab.Screen name="ContentNavigator" component={ContentNavigator} options={{ title: 'Home', unmountOnBlur: true}} />
          <Tab.Screen name="DownloadPost" component={DownloadPost} />
          <Tab.Screen name="DownloadList" component={DownloadList} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NumPostsDisplay.Provider>
    </NavigationContainer>
  );
}

export default App;


