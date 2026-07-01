import { ApiProperty } from '@nestjs/swagger';
import type { Task } from '@tasiki/shared';

export class TaskDto implements Task {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Buy milk' })
  title!: string;

  @ApiProperty({ nullable: true, example: 'Semi-skimmed, two bottles' })
  description!: string | null;

  @ApiProperty()
  done!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
