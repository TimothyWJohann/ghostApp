import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, Pressable, View, Button } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { NumPostsDisplay } from './context';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/Entypo';


async function storeNumPosts(numPosts) {
    try {
        const jsonNumPosts = JSON.stringify(numPosts);
        await AsyncStorage.setItem('numberPostsDisplay', jsonNumPosts);
    } catch (e) {
        console.log('ERROR', e);
    }
}

function ChangeNumPostsDisplayed() {
    const { numberThumbnails, setNumberThumbnails } = useContext(NumPostsDisplay);
    return(
    <View style={{height: 'auto'}}>
        <Text style={styles.settingsbuttonheadings}>Posts Displayed on Homepage</Text>
        <View style={styles.settingsButtonView}>
            <Pressable onPress={() => {
                setNumberThumbnails(numberThumbnails - 1);
                storeNumPosts(numberThumbnails - 1);
            }}><Icon name="arrow-bold-down" size={35} /></Pressable>
            <Text style={styles.settingsbuttontext}>{numberThumbnails}</Text>
            <Pressable onPress={() => {
                setNumberThumbnails(numberThumbnails + 1);
                storeNumPosts(numberThumbnails + 1);
            }}><Icon name="arrow-bold-up" size={33} /></Pressable>
        </View>
    </View>
    )
}

export function Settings() {
    const { numberThumbnails, setNumberThumbnails } = useContext(NumPostsDisplay);
    return (
        <View style={{height: 'auto'}}>
            <ChangeNumPostsDisplayed />
        </View>
    )
};