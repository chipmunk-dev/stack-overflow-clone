import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Member from './Member.entity';
import Question from './Question.entity';

@Entity('answers')
export default class Answer {
  @PrimaryGeneratedColumn('increment')
  answerid!: number;

  @Column({ type: 'varchar', length: 5000 })
  content!: string;

  @ManyToOne(() => Member, (member) => member.questions)
  @JoinColumn({
    name: 'memberId',
    referencedColumnName: 'memberId',
  })
  memberId!: number;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({
    name: 'questionId',
    referencedColumnName: 'questionId',
  })
  questionId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
