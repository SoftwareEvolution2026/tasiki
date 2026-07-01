import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Task } from '@tasiki/shared';
import { api } from '@/lib/api';
import { colors } from '@/lib/theme';

export default function EditTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
  }>();

  const [title, setTitle] = useState(params.title ?? '');
  const [description, setDescription] = useState(params.description ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/tasks');
  };

  const save = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Title cannot be empty.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.patch<Task>(`/tasks/${params.id}`, {
        title: trimmed,
        description: description.trim() ? description.trim() : null,
      });
      close();
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api.delete(`/tasks/${params.id}`);
      close();
    } catch {
      setError('Could not delete. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={close} hitSlop={8}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit task</Text>
          <Pressable onPress={save} hitSlop={8} disabled={saving}>
            {saving ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.save}>Save</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={colors.muted}
            autoFocus
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add more detail (optional)"
            placeholderTextColor={colors.muted}
            multiline
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.deleteBtnPressed,
            ]}
            onPress={remove}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color={colors.danger} />
            ) : (
              <Text style={styles.deleteText}>Delete task</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cancel: { color: colors.muted, fontSize: 16 },
  save: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  form: { padding: 20, gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  error: { color: colors.danger, fontSize: 14, marginTop: 4 },
  deleteBtn: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteBtnPressed: { backgroundColor: '#FEF2F2' },
  deleteText: { color: colors.danger, fontWeight: '700', fontSize: 16 },
});
