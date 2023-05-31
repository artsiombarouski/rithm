## Example

### Register NavigationService in your service container

```typescript
import {NavigationService} from '@artsiombarouski/rn-expo-router-service';

export const services = new ServiceContainer({
    services: [
        NavigationService,
    ],
});
```

### Wrap root layout

Note: if _layout.ts is not exists in root of your app directory - than created it first

```tsx
import {Stack} from 'expo-router';
import {NavigationServiceWrapper} from '@artsiombarouski/rn-expo-router-service';

const Layout = () => {
    return (
        <NavigationServiceWrapper>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </NavigationServiceWrapper>
    );
};

export default Layout;
```

### Usage

#### In services

```typescript
import {BaseService, service} from '@artsiombarouski/rn-core';
import {NavigationService} from '@artsiombarouski/rn-expo-router-service';

@service()
export class MovieActions extends BaseService {
    onMovieClicked(movieId: string) {
        this.getService(NavigationService).navigate(`/movies/${movieId}`);
    }
}
```

#### Using hooks

```tsx
import {useService} from "@artsiombarouski/rn-core";
import {NavigationService} from "@artsiombarouski/rn-expo-router-service";

const Example = () => {
    const navigation = useService(NavigationService);
    return <Button title={'Click me'} onPress={() => {
        navigation.push('/your-route')
    }}/>;
}
```

### Protected Routes

Route protection can be achieved by using 'useRouteGuard' hook. It's accept as parameters 'getRedirect' callback
and if it returns string, then that string will be used as a redirect route

#### Example

Create 'ProtectionLayout' in root layout wrapper (e.g app/_layout.tsx)

```tsx
import {
    NavigationServiceWrapper,
    useRouteGuard,
} from '@artsiombarouski/rn-expo-router-service';

const RouteGuardLayout = observer((props: PropsWithChildren) => {
    const userService = useService(AppUserStoreService);
    useRouteGuard(
        {
            getRedirect: (segments) => {
                if (!userService.currentUser && !segments.includes('(auth)')) {
                    return '/login';
                }
                return null;
            },
        },
        [userService.currentUser],
    );
    return <>{props.children} < />;
});

const RootLayout = () => {
    return (
        <NavigationServiceWrapper>
            <RouteGuardLayout>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </RouteGuardLayout>
        </NavigationServiceWrapper>
    );
};

export default RootLayout;
```
