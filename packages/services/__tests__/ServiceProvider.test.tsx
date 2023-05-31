import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import {
  BaseService,
  service,
  ServiceContainer,
  ServiceContainerBootstrap,
  useService,
} from '../src';

@service()
class TestService {
  constructor(testService: SecondTestService) {}

  getValue(): string {
    return 'Test service value';
  }
}

@service()
class SecondTestService extends BaseService {
  getValue() {
    return this.getService(TestService).getValue() + ' / Second';
  }
}

const ChildComponent = () => {
  const testService = useService(SecondTestService);
  return <div data-testid="value-field">{testService.getValue()}</div>;
};

const RootComponent = () => {
  return (
    <ServiceContainerBootstrap
      container={
        new ServiceContainer({
          services: [TestService, SecondTestService],
        })
      }
    >
      <ChildComponent />
    </ServiceContainerBootstrap>
  );
};

describe('Service Provider', function () {
  it('bootstrap + useService', async () => {
    await act(() => render(<RootComponent />));
    expect(screen.getByTestId('value-field')).toHaveTextContent(
      'Test service value / Second',
    );
  });
});
