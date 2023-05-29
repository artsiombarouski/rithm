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
import { BaseService, service } from '@artsiombarouski/rn-core';
import { NavigationService } from '@artsiombarouski/rn-expo-router-service';

@service()
export class MovieActions extends BaseService {
  onMovieClicked(movieId: string) {
    this.getService(NavigationService).navigate(`/movies/${movieId}`);
  }
}
```

#### Using hook
```typescript

```
