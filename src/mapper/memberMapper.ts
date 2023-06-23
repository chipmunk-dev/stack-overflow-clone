import Member from '../data/Member.entity';

export const memberToMemberResponseDto = (member: Member) => {
  const data: Partial<Member> = { ...member };
  delete data['password'];

  return data;
};
