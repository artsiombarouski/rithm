import React, {useCallback, useContext, useEffect, useState} from "react";
import {action, IObservableArray, makeObservable, observable, runInAction,} from "mobx";
import {useLocalObservable} from "mobx-react-lite";
import {useFocusEffect} from "@react-navigation/native";
import {useAppState} from "./hooks";

export class VideoHelper {
    @observable
    canPlayVideos: boolean = false;
    @observable
    isVideoMuted: boolean = true;
    @observable
    visibleVideos: IObservableArray = [] as any;

    constructor(
        initialParams: { isVideoMuted?: boolean; canPlayVideos?: boolean } = {},
    ) {
        this.isVideoMuted = initialParams.isVideoMuted ?? true;
        this.canPlayVideos = initialParams.canPlayVideos ?? false;
        makeObservable(this);
    }

    @action.bound
    setCanPlayVideos(value: boolean) {
        runInAction(() => {
            this.canPlayVideos = value;
        });
    }

    @action
    setVideoMuted(value: boolean) {
        this.isVideoMuted = value;
    }

    @action
    addVisibleVideo(key: any) {
        if (this.visibleVideos.includes(key)) {
            return;
        }
        this.visibleVideos.push(key);
    }

    @action
    removeVisibleVideo(key: any) {
        if (!this.visibleVideos.includes(key)) {
            return;
        }
        this.visibleVideos.remove(key);
    }

    canPlay(key: string) {
        return (
            this.canPlayVideos &&
            this.visibleVideos.length > 0 &&
            this.visibleVideos[0] === key
        );
    }
}

export const VideoHelperContext = React.createContext<VideoHelper>(
    {} as any,
);

export interface VideoHelperWrapperProps {
    children?: any;
    initialMuted?: boolean;
}

export const VideoHelperWrapper = (
    props: VideoHelperWrapperProps,
) => {
    const {children, initialMuted} = props;
    const {isAppFocused} = useAppState();
    const [isScreenFocused, setScreenFocused] = useState(false);
    const attachmentHelper = useLocalObservable(
        () =>
            new VideoHelper({
                isVideoMuted: initialMuted,
            }),
    );
    const screenFocusCallback = useCallback(() => {
        setScreenFocused(true);
        return () => {
            setScreenFocused(false);
        };
    }, []);
    useFocusEffect(screenFocusCallback);
    useEffect(() => {
        attachmentHelper.setCanPlayVideos(isAppFocused && isScreenFocused);
    }, [isAppFocused, isScreenFocused]);

    return (
        <VideoHelperContext.Provider value={attachmentHelper}>
            {children}
        </VideoHelperContext.Provider>
    );
};

export function useVideoHelper(): VideoHelper {
    return useContext(VideoHelperContext);
}
