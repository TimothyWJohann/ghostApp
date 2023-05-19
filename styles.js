import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    },
    headerbutton: {
        color: 'blue',
    },
    headertext: {
        color: 'blue',
        fontSize: 30
    }
});