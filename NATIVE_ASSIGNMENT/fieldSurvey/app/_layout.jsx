import { Stack } from 'expo-router';

// Root layout — single stack with no default header (screens control their own header)
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
