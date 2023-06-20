import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Member from './Member.entity';
import Answer from './Answer.entity';

@Entity('questions')
export default class Question {
  @PrimaryGeneratedColumn('increment')
  questionId!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 10000 })
  content!: string;

  @Column({ type: 'int', default: 0 })
  viewCount!: number;

  @ManyToOne(() => Member, (member) => member.questions)
  @JoinColumn({
    name: 'memberId',
    referencedColumnName: 'memberId',
  })
  member!: number;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers!: Answer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
