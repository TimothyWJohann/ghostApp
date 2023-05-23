import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, Pressable, View } from 'react-native';
import React, { useState, useEffect } from 'react';

export function DownloadPost() {
    const [postCounter, setPostCounter] = useState(0);
    console.log('POSTCOUNTER', postCounter);
    const storeData = async (numPosts) => {
        try {
            const jsonNumPosts = JSON.stringify(numPosts)
            await AsyncStorage.setItem('numberPosts', jsonNumPosts)
            //alert('Successfully stored value')
        } catch (e) {
            console.log('ERROR', e);
        }
    }
    const getData = async () => {
        try {
            const numPosts = await AsyncStorage.getItem('numberPosts');
            console.log("NUMPOSTS", numPosts);
            setPostCounter(+numPosts);
        } catch (e) {
        }
    }
    getData();

    return (
        <View style={{ flex: 1, justifyContent: 'space-around' }}>
            <Text style={{ fontSize: 30 }} >DOWNLOAD A POST SCREEN</Text>
            <Pressable onPress={() => {
                setPostCounter(postCounter + 1);
                storeData(postCounter + 1);
            }}>
                <Text style={{ width: 250, height: 250, borderWidth: 5, backgroundColor: 'red' }}>Press to add a Post</Text>
            </Pressable>
            <Text>Post Counter = {postCounter}</Text>
        </View>
    );
}

export function DownloadList() {
    return (
        <Text style={{ fontSize: 30 }}>DOWNLOAD LIST SCREEN</Text>
    );
}