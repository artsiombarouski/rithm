### Usage example

```tsx

const RootLayout = () => {
    const analyticsServices = [
        new AmplitudeAnalyticsService({
            apiKey: 'YOUR_API_KEY',
        }),
    ];
    return (
        <AnalyticsWrapper services={analyticsServices}> / >
            {YOUR_CONTENT}
        </AnalyticsWrapper>
    );
};
```
