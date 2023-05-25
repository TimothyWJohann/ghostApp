import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, Pressable, View, Button} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { NumPostsDisplay } from './context';


async function storeNumPosts (numPosts) {
    try {
        const jsonNumPosts = JSON.stringify(numPosts);
        await AsyncStorage.setItem('numberPostsDisplay', jsonNumPosts);
    } catch (e) {
        console.log('ERROR', e);
    }
}
/*export async function getNumPosts () {
    const { numberThumbnails, setNumberThumbnails } = useContext(NumPostsDisplay);
    console.log('IN GETNUMPOSTS')
    try {
        const numPosts = await AsyncStorage.getItem('numberPostsDisplay');
        console.log("NUMPOSTSDISPLAY", numPosts);
        setNumberThumbnails(+numPosts);
    } catch (e) {console.log("ERROR", e);
    }
}*/

export function Settings() {
    const { numberThumbnails, setNumberThumbnails } = useContext(NumPostsDisplay);
    return (
        <View>
            <Text style={{ fontSize: 40 }}>SETTINGS PAGE</Text>
            <Text style={{ fontSize: 40 }}>{numberThumbnails}</Text>
            <Button title="Increase" onPress={() => {
                setNumberThumbnails(numberThumbnails + 1);
                storeNumPosts(numberThumbnails + 1);
                }}/>
            <Button title="Decrease" onPress={() => {
                setNumberThumbnails(numberThumbnails - 1);
                storeNumPosts(numberThumbnails - 1);
            }}/>
        </View>
    )
};