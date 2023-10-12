import { Button, Center, Heading, Text } from 'native-base';
import {
  AttachStep,
  TourBox,
  TourStep,
  useSpotlightTour,
} from '@artsiombarouski/rn-spotlight';
import { useEffect } from 'react';

const step1: TourStep = {
  key: 'tab3-step1',
  motion: 'fade',
  render: (props) => (
    <TourBox
      title="Tour: Customization"
      backText="Previous"
      nextText="Next"
      {...props}
    >
      <Text>
        {'This is the first step of tour example.\n'}
        {'If you want to go to the next step, please press '}
        <Text bold={true}>{'Next.\n'}</Text>
        {'If you want to go to the previous step, press '}
        <Text bold={true}>{'Previous.\n'}</Text>
      </Text>
    </TourBox>
  ),
};

export default function Tab3() {
  const spotlight = useSpotlightTour();
  useEffect(() => {
    spotlight.setCurrentStep(step1);
  }, []);
  return (
    <Center flex={1}>
      <Heading>Tab 3</Heading>
      <AttachStep step={step1}>
        <Button>Test</Button>
      </AttachStep>
    </Center>
  );
}
