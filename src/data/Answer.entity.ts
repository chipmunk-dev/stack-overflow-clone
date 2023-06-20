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
  answerId!: number;

  @Column({ type: 'varchar', length: 5000 })
  content!: string;

  @ManyToOne(() => Member, (member) => member.questions)
  @JoinColumn({
    name: 'memberId',
    referencedColumnName: 'memberId',
  })
  member!: Member;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({
    name: 'questionId',
    referencedColumnName: 'questionId',
  })
  question!: Question;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
