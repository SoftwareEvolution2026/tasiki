import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { AuthForm } from '@/components/auth-form';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/lib/theme';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  return (
    <AuthForm
      title="Create your account"
      submitLabel="Sign up"
      onSubmit={async (email, password) => {
        await register(email, password);
        router.replace('/tasks');
      }}
      footer={
        <Text style={styles.footerText}>
          Have an account?{' '}
          <Link href="/login" replace style={styles.link}>
            Log in
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
