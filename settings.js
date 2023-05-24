import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, Pressable, View, Button} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { NumPostsDisplay } from './context';

export function Settings() {
    const { numberThumbnails, setNumberThumbnails } = useContext(NumPostsDisplay);
    //setNumberThumbnails(4);
    return (
        <View>
            <Text style={{ fontSize: 40 }}>SETTINGS PAGE</Text>
            <Text style={{ fontSize: 40 }}>{numberThumbnails}</Text>
            <Button title="Increase" onPress={() => {setNumberThumbnails(numberThumbnails + 1)}}/>
            <Button title="Decrease" onPress={() => {setNumberThumbnails(numberThumbnails - 1)}}/>
        </View>
    )
};