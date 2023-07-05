import { Button, Heading, HStack, VStack } from 'native-base';
import { Analytics } from '@artsiombarouski/rn-analytics';

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
      </HStack>
    </VStack>
  );
};

export default AnalyticsPage;
