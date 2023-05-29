## Example

```tsx
// Define you service (including @service class annotation)
@service()
class TestService {
    constructor(testService: SecondTestService) {
    }

    getValue(): string {
        return 'Test service value';
    }
}

// Use ServiceContainerBootstrap to load you services
const RootComponent = () => {
    return (
        <ServiceContainerBootstrap
            container={
                new ServiceContainer({
                    services: [TestService],
                })
            }
        >
            <ChildComponent/>
        </ServiceContainerBootstrap>
    );
};

```
