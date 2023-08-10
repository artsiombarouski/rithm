import { Path } from 'react-native-svg';
import { createIcon } from 'native-base';

export const AddIcon = createIcon({
  viewBox: '0 0 24 24',
  path: [
    <Path
      d={'M11.9796 4L11.9596 11.9595L4.00005 11.9796'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={2}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />,
    <Path
      d={'M19.9995 12.0205L12.04 12.0406L12.0199 20.0001'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={2}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />,
  ],
});

export const ReplaceIcon = createIcon({
  viewBox: '0 0 24 24',
  path: [
    <Path
      d={'M2 13.0859L4.08578 11.0002L6.17157 13.0859'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={1.5}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />,

    <Path
      d={'M22.2578 11.1289L20.129 13.2578L18.0001 11.1289'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={1.5}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />,

    <Path
      d={
        'M20 12C20 7.58172 16.4183 4 12 4C9.71214 4 7.64859 4.96038 6.1905 6.5M4 12C4 16.4183 7.58172 20 12 20C14.1304 20 16.0663 19.1672 17.5 17.8095'
      }
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={1.5}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />,
  ],
});

export const EyeIcon = createIcon({
  viewBox: '0 0 24 24',
  d: 'M22.0828 11.3953C19.861 6.71484 16.5024 4.35938 12 4.35938C7.49533 4.35938 4.13908 6.71484 1.9172 11.3977C1.82808 11.5864 1.78186 11.7925 1.78186 12.0012C1.78186 12.2099 1.82808 12.416 1.9172 12.6047C4.13908 17.2852 7.49767 19.6406 12 19.6406C16.5047 19.6406 19.861 17.2852 22.0828 12.6023C22.2633 12.2227 22.2633 11.782 22.0828 11.3953ZM12 17.9531C8.21954 17.9531 5.45158 16.0359 3.49923 12C5.45158 7.96406 8.21954 6.04688 12 6.04688C15.7805 6.04688 18.5485 7.96406 20.5008 12C18.5508 16.0359 15.7828 17.9531 12 17.9531ZM11.9063 7.875C9.62814 7.875 7.78126 9.72188 7.78126 12C7.78126 14.2781 9.62814 16.125 11.9063 16.125C14.1844 16.125 16.0313 14.2781 16.0313 12C16.0313 9.72188 14.1844 7.875 11.9063 7.875ZM11.9063 14.625C10.4555 14.625 9.28126 13.4508 9.28126 12C9.28126 10.5492 10.4555 9.375 11.9063 9.375C13.357 9.375 14.5313 10.5492 14.5313 12C14.5313 13.4508 13.357 14.625 11.9063 14.625Z',
});

export const DeleteIcon = createIcon({
  viewBox: '0 0 24 24',
  d: 'M5.11111 19.7778C5.11111 21 6.11111 22 7.33333 22H16.2222C17.4444 22 18.4444 21 18.4444 19.7778V6.44444H5.11111V19.7778ZM19.5556 3.11111H15.6667L14.5556 2H9L7.88889 3.11111H4V5.33333H19.5556V3.11111Z',
});
