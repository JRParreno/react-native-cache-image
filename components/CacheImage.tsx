import * as React from 'react';
import { useEffect, useState } from 'react';
import shorthash from 'shorthash';
import { Image, StyleProp, ImageStyle } from 'react-native';
import * as FileSystem from 'expo-file-system';

interface Props {
    style?: StyleProp<ImageStyle>;
    uri: string;
}

export default function CacheImage(props: Props) {

    const [source, setSource] = useState<string>('');

    const handleImage = async () => {
        const name = shorthash.unique(props.uri);
        const path = `${FileSystem.cacheDirectory}${name}`;
        const image = await FileSystem.getInfoAsync(path);

        if (image.exists) {
            console.log("read from the cache");
            setSource(image.uri);
            return;
        }

        console.log('downloading image to cache');
        const newImage = await FileSystem.downloadAsync(props.uri, path);

        setSource(newImage.uri);
    }

    useEffect(() => {
        let isMount = true;

        if (isMount) {
            handleImage();
        }

        return () => {
            isMount = false
        }
    }, []);


    // use props.style to customize image style
    return (
        <Image style={{ height: 35, width: 35 }} source={{ uri: source }} />
    );
}
