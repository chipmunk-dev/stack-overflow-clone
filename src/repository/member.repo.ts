import Member from '../data/Member.entity';
import { dataSource } from '../db/db';

const memberResource = dataSource.Member;

export const saveMember = async (newMember: Member) => {
  return await memberResource.save(newMember);
};

export const findMemberByEmail = async (email: string) => {
  return await memberResource.findOneBy({ email });
};
