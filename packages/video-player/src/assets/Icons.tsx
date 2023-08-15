import { createIcon } from 'native-base';
import { Path } from 'react-native-svg';

export const icFullscreen = createIcon({
  viewBox: '0 0 24 24',
  d: 'M21 21H13.8V19.2H19.2V13.8H21V21ZM10.2 21H3V13.8H4.8V19.2H10.2V21ZM4.8 10.2H3V3H10.2V4.8H4.8V10.2ZM21 10.2H19.2V4.8H13.8V3H21V10.2Z',
});

export const icPause = createIcon({
  viewBox: '0 0 24 24',
  path: [
    <Path
      d={
        'M9.71373 18.8571C9.71373 19.1602 9.59332 19.4509 9.37899 19.6653C9.16467 19.8796 8.87398 20 8.57087 20H7.42801C7.12491 20 6.83422 19.8796 6.61989 19.6653C6.40556 19.4509 6.28516 19.1602 6.28516 18.8571V5.14286C6.28516 4.83975 6.40556 4.54906 6.61989 4.33474C6.83422 4.12041 7.12491 4 7.42801 4H8.57087C8.87398 4 9.16467 4.12041 9.37899 4.33474C9.59332 4.54906 9.71373 4.83975 9.71373 5.14286V18.8571ZM17.7137 18.8571C17.7137 19.1602 17.5933 19.4509 17.379 19.6653C17.1647 19.8796 16.874 20 16.5709 20H15.428C15.1249 20 14.8342 19.8796 14.6199 19.6653C14.4056 19.4509 14.2852 19.1602 14.2852 18.8571V5.14286C14.2852 4.83975 14.4056 4.54906 14.6199 4.33474C14.8342 4.12041 15.1249 4 15.428 4H16.5709C16.874 4 17.1647 4.12041 17.379 4.33474C17.5933 4.54906 17.7137 4.83975 17.7137 5.14286V18.8571Z'
      }
      fillRule={'evenodd'}
      clipRule={'evenodd'}
      fill={'currentColor'}
    />,
  ],
});

export const icPlay = createIcon({
  viewBox: '0 0 30 30',
  d: 'M11.3209 5.21702C10.3223 4.58155 9.01562 5.29887 9.01562 6.48251V23.5175C9.01562 24.7011 10.3224 25.4184 11.3209 24.783L24.7056 16.2655C25.6318 15.6761 25.6318 14.3239 24.7056 13.7345L11.3209 5.21702Z',
});

export const icSoundUp = createIcon({
  viewBox: '0 0 24 24',
  path: [
    <Path
      d={'M3 9.15385V15.3846H6.46154L12 19.5385V5L6.46154 9.15385H3Z'}
      fill={'currentColor'}
    />,
    <Path
      d={
        'M15.4615 9.84615C15.4615 9.84615 16.8462 10.5385 16.8462 12.2692C16.8462 14 15.4615 14.6923 15.4615 14.6923M16.8462 5.69231C19.6154 7.07692 21 9.15385 21 12.2692C21 15.3846 19.6154 17.4615 16.8462 18.8462M3 9.15385V15.3846H6.46154L12 19.5385V5L6.46154 9.15385H3Z'
      }
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={1.5}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />,
  ],
});

export const icSoundOff = createIcon({
  viewBox: '0 0 24 24',
  path: [
    <Path
      d={'M21 14.9L15.6 9.5M21 9.5L15.6 14.9'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={1.5}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />,
    <Path
      d={'M3 9.15385V15.3846H6.46154L12 19.5385V5L6.46154 9.15385H3Z'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={1.5}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />,
  ],
});
