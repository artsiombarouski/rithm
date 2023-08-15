import {action, computed, makeObservable, observable, observe, runInAction,} from "mobx";
import React from "react";
import Video from "react-native-video";
import {Platform} from "react-native";
import {isUndefined} from "lodash";
import {SharedValue} from "react-native-reanimated";
import {VideoError} from "./types";
import MediaControls, {MediaMetaData} from "./media-controls";

export type ProgressInfo = {
    currentTime: number;
    playableDuration: number;
};

export const UI_TOGGLE_DELAY = Platform.select({
    default: 5000,
    web: 2000,
});

const DISPLAY_PAYWALL_DELAY = 30000;

export abstract class BasePlaybackController {
    @observable
    duration: number | undefined = undefined;
    @observable
    playProgress: ProgressInfo | undefined = undefined;
    @observable
    error: VideoError | undefined;
    @observable
    isVideoReady: boolean = false;
    @observable
    isManualPaused: boolean = false;
    @observable
    isMuted: boolean = false;
    @observable
    isVideoFinished: boolean = false;
    @observable
    isUiVisible: boolean = true;

    private readonly controls: MediaControls | undefined;
    private uiHideTimerId: NodeJS.Timeout | undefined = undefined;
    private displayPaywallTimerId: NodeJS.Timeout | undefined = undefined;

    protected hideUiOnFinish: boolean = true;

    protected constructor(
        readonly videoRef: React.MutableRefObject<Video>,
        readonly uiVisibilityValue?: SharedValue<number> | undefined,
    ) {
        makeObservable(this);
        if (uiVisibilityValue) {
            uiVisibilityValue.value = this.isUiVisible ? 1.0 : 0.0;
            observe(this, "isUiVisible", (change) => {
                uiVisibilityValue.value = change.newValue === true ? 1.0 : 0.0;
            });
        }
        this.controls = new MediaControls({
            onPlay: () => {
                this.setPaused(false);
            },
            onPause: () => {
                this.setPaused(true);
            },
            onStop: () => {
                this.setPaused(true);
            },
            onSkipBackward: () => {
                this.seekBy(-30);
            },
            onSkipForward: () => {
                this.seekBy(30);
            },
        });
    }

    @action
    setVideoLoaded(duration: number) {
        this.duration = duration;
        this.onVideoLoaded(duration);
    }

    protected onVideoLoaded(duration: number) {
    }

    @action
    setVideoReady() {
        if (this.isVideoReady) {
            return;
        }
        const initialPosition = this.getInitialPosition();
        if (initialPosition > 0) {
            this.playProgress = {
                currentTime: initialPosition,
                playableDuration: 0,
            };
            this.videoRef.current?.seek(initialPosition);
        }
        if (this.controls) {
            this.controls.init();
            this.controls.setCurrentMetaData(this.getMediaMetaData());
        }
        this.isVideoReady = true;
        if (!this.isManualPaused) {
            this.startUiHideTimer(1000);
        }
        if (this.shouldDisplayPaywall()) {
            this.startDisplayPaywallTimer(DISPLAY_PAYWALL_DELAY);
        }
        this.onVideoReady(initialPosition === 0);
    }

    abstract shouldDisplayPaywall(): boolean;

    abstract openPaywall(): void;

    startDisplayPaywallTimer(delay = DISPLAY_PAYWALL_DELAY) {
        if (this.displayPaywallTimerId) {
            clearTimeout(this.displayPaywallTimerId);
        }
        this.displayPaywallTimerId = setTimeout(() => {
            this.openPaywall();
        }, delay);
    }

    cancelDisplayPaywallTimer() {
        if (this.displayPaywallTimerId) {
            clearTimeout(this.displayPaywallTimerId);
            this.displayPaywallTimerId = undefined;
        }
    }

    protected getInitialPosition(): number {
        return 0;
    }

    protected onVideoReady(firstTime: boolean) {
    }

    @action
    setVideoError(error: VideoError) {
        this.error = error;
        this.onVideoError(error);
    }

    @action
    clearVideoError() {
        this.error = undefined;
    }

    protected onVideoError(error: VideoError) {
    }

    @action
    setVideoFinished() {
        if (this.isVideoFinished) {
            return;
        }
        this.isVideoFinished = true;
        this.isUiVisible = !this.hideUiOnFinish;
        this.isManualPaused = true;
        this.controls?.setPlaybackState({
            paused: true,
            duration: this.duration,
            progress: this.duration,
        });
        this.cancelUiHideTimer();
        this.cancelDisplayPaywallTimer();
        this.onVideoFinished();
    }

    protected onVideoFinished() {
    }

    @action
    setPlayProgress(progress: ProgressInfo) {
        this.clearVideoError();
        this.playProgress = progress;
        this.onPlayProgress(progress);
    }

    protected onPlayProgress(progress: ProgressInfo) {
    }

    @computed
    get currentProgressPercent(): number {
        return this.duration && this.playProgress
            ? Math.min(1.0, this.playProgress?.currentTime / this.duration)
            : 0;
    }

    @action
    destroy() {
        this.controls?.destroy();
        this.cancelUiHideTimer();
        this.cancelDisplayPaywallTimer();
        this.onDestroy();
    }

    protected onDestroy() {
    }

    @action
    togglePause() {
        return this.setPaused(!this.isManualPaused);
    }

    @action
    setPaused(paused: boolean) {
        if (this.isVideoFinished) {
            this.reply();
            return;
        }
        this.isManualPaused = paused;
        (this.videoRef.current as any)?.setNativeProps({
            paused: this.isManualPaused,
        });
        if (this.isManualPaused) {
            this.isUiVisible = true;
            this.cancelUiHideTimer();
        } else if (this.isUiVisible) {
            this.startUiHideTimer(500);
        }
        this.controls?.setPlaybackState({
            paused: paused,
            duration: this.duration,
            progress: this.playProgress?.currentTime,
        });
        this.onPauseChange(paused);
    }

    protected onPauseChange(paused: boolean) {
    }

    @action
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.onMuteChange(this.isMuted);
    }

    protected onMuteChange(muted: boolean) {
    }

    @action
    setAutoPlayFailed() {
        this.setPaused(true);
    }

    @action
    seekTo(time: number, commit: boolean = true) {
        if (isNaN(time) || !this.isVideoReady) {
            return;
        }
        this.setPlayProgress({
            ...this.playProgress,
            currentTime: time,
        });
        this.videoRef.current?.seek(time);
        if (commit) {
            this.setPaused(false);
            this.startUiHideTimer();
        }
    }

    @action
    seekBy(duration: number) {
        if (!this.playProgress) {
            return;
        }
        return this.seekTo(
            Math.max(
                0,
                Math.min(this.duration, this.playProgress.currentTime + duration),
            ),
        );
    }

    @action
    reply() {
        if (!this.isVideoReady) {
            return;
        }
        this.isVideoFinished = false;
        this.videoRef.current?.seek(0);
        this.setPaused(false);
        this.onReply();
    }

    protected onReply() {
    }

    @action
    enterFullscreen() {
        this.videoRef.current?.presentFullscreenPlayer();
        this.onEnterFullscreen();
    }

    protected onEnterFullscreen() {
    }

    protected abstract getMediaMetaData(): MediaMetaData | undefined;

    /* UI controls */

    @action
    toggleUi(visible?: boolean) {
        if (this.isManualPaused || !this.isVideoReady || this.isVideoFinished) {
            return;
        }
        this.isUiVisible = isUndefined(visible) ? !this.isUiVisible : visible;
        this.cancelUiHideTimer();
        if (this.isUiVisible) {
            this.startUiHideTimer();
        }
    }

    @action
    setUiVisible(visible: boolean) {
        this.isUiVisible = visible;
    }

    startUiHideTimer(delay = UI_TOGGLE_DELAY) {
        if (this.uiHideTimerId) {
            clearTimeout(this.uiHideTimerId);
        }
        this.uiHideTimerId = setTimeout(() => {
            runInAction(() => {
                this.isUiVisible = false;
            });
        }, delay);
    }

    cancelUiHideTimer() {
        if (this.uiHideTimerId) {
            clearTimeout(this.uiHideTimerId);
            this.uiHideTimerId = undefined;
        }
    }
}
