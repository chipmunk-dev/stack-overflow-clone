import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberStatus } from './common/enum';
import Question from './Question.entity';
import Answer from './Answer.entity';

@Entity('members')
export default class Member {
  @PrimaryGeneratedColumn('increment')
  memberId!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 255 })
  status!: MemberStatus;

  @OneToMany(() => Question, (question) => question.member)
  questions!: Question[];

  @OneToMany(() => Answer, (answer) => answer.member)
  answers!: Answer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
