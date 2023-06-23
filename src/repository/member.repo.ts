import Member from '../data/Member.entity';
import { dataSource } from '../db/db';

const memberResource = dataSource.Member;

export const saveMember = async (newMember: Member) => {
  return await memberResource.save(newMember);
};

export const findMemberById = async (
  memberId: number,
  relations?: string[],
) => {
  return await memberResource.findOne({ where: { memberId }, relations });
};

export const findMemberByEmail = async (
  email: string,
  relations?: string[],
) => {
  return await memberResource.findOne({ where: { email }, relations });
};

export const removeMember = async (member: Member) => {
  return await memberResource.remove(member);
};
