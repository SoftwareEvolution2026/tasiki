import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task as PrismaTask } from '@prisma/client';
import type { Task, UpdateTaskInput } from '@tasiki/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    title: string,
    description?: string,
  ): Promise<Task> {
    const task = await this.prisma.task.create({
      data: { title, description, userId },
    });
    return this.toDto(task);
  }

  async findAllForUser(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return tasks.map((t) => this.toDto(t));
  }

  /** Apply a partial update to a task, scoped to the owning user. */
  async update(
    userId: string,
    id: string,
    changes: UpdateTaskInput,
  ): Promise<Task> {
    await this.ensureOwned(userId, id);
    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: changes.title,
        description: changes.description,
        done: changes.done,
      },
    });
    return this.toDto(updated);
  }

  /** Toggle a task's done flag, scoped to the owning user. */
  async toggle(userId: string, id: string): Promise<Task> {
    const task = await this.ensureOwned(userId, id);
    const updated = await this.prisma.task.update({
      where: { id: task.id },
      data: { done: !task.done },
    });
    return this.toDto(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.ensureOwned(userId, id);
    await this.prisma.task.delete({ where: { id } });
  }

  private async ensureOwned(userId: string, id: string): Promise<PrismaTask> {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  private toDto(task: PrismaTask): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      done: task.done,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
