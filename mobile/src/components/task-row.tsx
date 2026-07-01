import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { Task } from '@tasiki/shared';
import { colors } from '@/lib/theme';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskRow({ task, onToggle, onPress, onDelete }: TaskRowProps) {
  const swipeRef = useRef<SwipeableMethods>(null);

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={() => (
        <Pressable
          style={styles.deleteAction}
          onPress={() => {
            swipeRef.current?.close();
            onDelete(task.id);
          }}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      )}
    >
      <Pressable style={styles.row} onPress={() => onPress(task)}>
        <Pressable
          hitSlop={8}
          onPress={() => onToggle(task.id)}
          style={[styles.checkbox, task.done && styles.checkboxDone]}
        >
          {task.done ? <Text style={styles.check}>✓</Text> : null}
        </Pressable>

        <View style={styles.body}>
          <Text
            style={[styles.title, task.done && styles.titleDone]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: colors.primary },
  check: { color: '#fff', fontSize: 15, fontWeight: '800', lineHeight: 18 },
  body: { flex: 1, gap: 2 },
  title: { fontSize: 16, color: colors.text },
  titleDone: { color: colors.done, textDecorationLine: 'line-through' },
  description: { fontSize: 13, color: colors.muted },
  deleteAction: {
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    marginLeft: 8,
    borderRadius: 12,
  },
  deleteText: { color: '#fff', fontWeight: '700' },
});
