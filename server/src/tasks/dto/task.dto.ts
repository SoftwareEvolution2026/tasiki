import { ApiProperty } from '@nestjs/swagger';
import type { Task } from '@tasiki/shared';

export class TaskDto implements Task {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Buy milk' })
  title!: string;

  @ApiProperty()
  done!: boolean;

  @ApiProperty()
  createdAt!: string;
}
