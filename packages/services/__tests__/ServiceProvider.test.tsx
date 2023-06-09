import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import {
  BaseService,
  OnServicesLoaded,
  OnServicesReady,
  service,
  ServiceContainer,
  ServiceContainerBootstrap,
  useService,
} from '../src';

@service()
class TestService {
  constructor() {}

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

  it('service onLoad + onReady', async () => {
    @service()
    class Service1
      extends BaseService
      implements OnServicesLoaded, OnServicesReady
    {
      isLoadCalled?: boolean;
      isReadyCalled?: boolean;

      onServicesLoaded(): void | Promise<void> {
        this.isLoadCalled = true;
      }

      onServicesReady(): void | Promise<void> {
        this.isReadyCalled = true;
      }
    }

    @service()
    class Service2
      extends BaseService
      implements OnServicesLoaded, OnServicesReady
    {
      isLoadCalled?: boolean;
      isReadyCalled?: boolean;

      onServicesLoaded(): void | Promise<void> {
        this.isLoadCalled = true;
      }

      onServicesReady(): void | Promise<void> {
        this.isReadyCalled = true;
      }
    }

    const serviceContainer = new ServiceContainer({
      services: [Service1, Service2],
    });

    await serviceContainer.init();
    expect(serviceContainer.getService(Service1).isLoadCalled).toBeTruthy();
    expect(serviceContainer.getService(Service1).isReadyCalled).toBeTruthy();

    expect(serviceContainer.getService(Service2).isLoadCalled).toBeTruthy();
    expect(serviceContainer.getService(Service2).isReadyCalled).toBeTruthy();
  });
});
