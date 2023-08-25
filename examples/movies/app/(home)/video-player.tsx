import { VideoPlayer } from '@artsiombarouski/rn-video-player';
import { Box, ScrollView, VStack } from 'native-base';
import { useState } from 'react';

export default function VideoPage() {
  const [isPlaying, setPlaying] = useState(false);
  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <VStack flex={1}>
          {/*<VideoView*/}
          {/*  source={*/}
          {/*    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'*/}
          {/*  }*/}
          {/*  paused={!isPlaying}*/}
          {/*/>*/}
          {/*<Button onPress={() => setPlaying((current) => !current)}>*/}
          {/*  {isPlaying ? 'Pause' : 'Play'}*/}
          {/*</Button>*/}
          {/*<Box style={{ aspectRatio: 1 }} />*/}
          <VideoPlayer
            source={
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
            }
          />
        </VStack>
      </ScrollView>
    </Box>
  );
}
