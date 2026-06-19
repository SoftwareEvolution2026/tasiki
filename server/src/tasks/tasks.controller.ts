import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from '../auth/jwt.strategy';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskDto> {
    return this.tasks.create(user.id, dto.title);
  }

  @Get()
  @ApiOperation({ summary: "List the current user's tasks" })
  findAll(@CurrentUser() user: AuthUser): Promise<TaskDto[]> {
    return this.tasks.findAllForUser(user.id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle a task done/undone' })
  toggle(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<TaskDto> {
    return this.tasks.toggle(user.id, id);
  }
}
