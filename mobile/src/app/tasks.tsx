import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import type { Task } from '@tasiki/shared';
import { TaskRow } from '@/components/task-row';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/lib/theme';

export default function TasksScreen() {
  const { user, initializing, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get<Task[]>('/tasks');
      setTasks(data);
    } catch {
      // ignore — kept simple for the course build
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload whenever the screen regains focus (e.g. returning from edit).
  useFocusEffect(
    useCallback(() => {
      if (user) void load();
    }, [user, load]),
  );

  const addTask = async () => {
    const trimmed = title.trim();
    if (!trimmed || adding) return;
    setAdding(true);
    try {
      const { data } = await api.post<Task>('/tasks', { title: trimmed });
      setTasks((prev) => [data, ...prev]);
      setTitle('');
    } catch {
      // ignore
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
    try {
      const { data } = await api.patch<Task>(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      );
    }
  };

  const remove = async (id: string) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      setTasks(previous); // rollback on failure
    }
  };

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>tasiki</Text>
          <Text style={styles.subtitle}>{user.email}</Text>
        </View>
        <Pressable onPress={logout} hitSlop={8}>
          <Text style={styles.logout}>Log out</Text>
        </Pressable>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a task…"
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          onPress={addTask}
        >
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors.primary}
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No tasks yet — add your first one.</Text>
          }
          renderItem={({ item }) => (
            <TaskRow
              task={item}
              onToggle={toggle}
              onDelete={remove}
              onPress={(task) =>
                router.push({
                  pathname: '/task/[id]',
                  params: {
                    id: task.id,
                    title: task.title,
                    description: task.description ?? '',
                  },
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -1,
  },
  subtitle: { fontSize: 13, color: colors.muted },
  logout: { color: colors.danger, fontWeight: '600' },
  addRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addBtnPressed: { backgroundColor: colors.primaryDark },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  loader: { marginTop: 40 },
  list: { paddingHorizontal: 20, paddingTop: 4, gap: 8 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
});
