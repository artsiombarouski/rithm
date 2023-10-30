import { Analytics } from '@artsiombarouski/rn-analytics';
import { Button, Heading, HStack, VStack } from 'native-base';

const AnalyticsPage = () => {
  return (
    <VStack space={8}>
      <Heading size={'lg'}>Analytics</Heading>
      <HStack space={8}>
        <Button
          onPress={() => {
            Analytics.event('test-event', {
              testPropertyBool: true,
              testPropertyString: 'test-string',
              testPropertyNumber: 1234.5,
            });
          }}
        >
          Event
        </Button>
        <Button
          onPress={() => {
            Analytics.event('test-event-2', {
              testPropertyBool: true,
              testPropertyString: 'test-string',
              testPropertyNumber: 1234.5,
            });
          }}
        >
          Second event
        </Button>
      </HStack>
    </VStack>
  );
};

export default AnalyticsPage;
