import Member from '../data/Member.entity';

export const memberToMemberResponseDto = (member: Member) => {
  const { memberId, name, email, createdAt, modifiedAt } = member;

  return { memberId, name, email, createdAt, modifiedAt };
};
