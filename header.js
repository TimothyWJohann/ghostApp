import { Button, Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { styles } from './styles';

export function HeaderRight({ idOfNextPost, postIds, navigation }) {
    if (idOfNextPost) {
        return (
            <Pressable onPress={() =>
                    navigation.push('ActivePost', { idOfPostToDisplay: idOfNextPost, postIdList: postIds })}>
                <Text style={styles.headertext}>Next Post</Text>
            </Pressable>
        )
    };
};

export function HeaderLeft({ idOfPreviousPost, postIds, navigation }) {
    if (idOfPreviousPost) {
        return (
            <Pressable onPress={() =>
                navigation.push('ActivePost', { idOfPostToDisplay: idOfPreviousPost, postIdList: postIds  })}  >
                <Text style={styles.headertext}>Prev Post</Text>
            </Pressable>
        )
    }
    else {
        return (
            <Pressable onPress={() =>
                navigation.navigate('Pick A Post')} >
                <Text style={styles.headertext}>Pick A Post</Text>
            </Pressable>
        )
    };
};

export function HeaderTitle({ navigation }) {
    return (
        <Pressable onPress={() =>
            navigation.navigate('Pick A Post')} >
            <Icon name="home" color="blue" backgroundColor='white' size={40} marginLeft={0} />
        </Pressable>
    )
};