import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task as PrismaTask } from '@prisma/client';
import type { Task } from '@tasiki/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, title: string): Promise<Task> {
    const task = await this.prisma.task.create({
      data: { title, userId },
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

  /** Toggle a task's done flag, scoped to the owning user. */
  async toggle(userId: string, id: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const updated = await this.prisma.task.update({
      where: { id: task.id },
      data: { done: !task.done },
    });
    return this.toDto(updated);
  }

  private toDto(task: PrismaTask): Task {
    return {
      id: task.id,
      title: task.title,
      done: task.done,
      createdAt: task.createdAt.toISOString(),
    };
  }
}
