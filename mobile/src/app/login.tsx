import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { AuthForm } from '@/components/auth-form';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/lib/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <AuthForm
      title="Welcome back"
      submitLabel="Log in"
      onSubmit={async (email, password) => {
        await login(email, password);
        router.replace('/tasks');
      }}
      footer={
        <Text style={styles.footerText}>
          No account?{' '}
          <Link href="/register" replace style={styles.link}>
            Sign up
          </Link>
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  footerText: { color: colors.muted },
  link: { color: colors.primary, fontWeight: '600' },
});
