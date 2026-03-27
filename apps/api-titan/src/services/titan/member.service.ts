import { Service } from '../../core';
import { ClubMember, License, MedicalCertificate } from '../../database';
import { User } from '../../database';
import {
  ICreateClubMemberBody,
  IUpdateClubMemberBody,
  ICreateLicenseBody,
  ICreateMedicalCertificateBody,
  ClubMemberStatus,
  LicenseStatus,
} from 'titan_core';
import createError from 'http-errors';

class MemberService extends Service {
  async createMember(
    clubId: string,
    body: ICreateClubMemberBody,
  ): Promise<ClubMember> {
    const existing = await ClubMember.findOne({
      where: { clubId, userId: body.userId, seasonId: body.seasonId },
    });
    if (existing)
      throw createError(409, 'Member already exists for this season');

    return ClubMember.create({
      clubId,
      userId: body.userId,
      seasonId: body.seasonId,
      role: body.role,
      position: body.position ?? null,
      jerseyNumber: body.jerseyNumber ?? null,
      emergencyContact: body.emergencyContact ?? null,
      emergencyPhone: body.emergencyPhone ?? null,
    });
  }

  async getMembers(clubId: string, seasonId?: string): Promise<ClubMember[]> {
    const where: any = { clubId };
    if (seasonId) where.seasonId = seasonId;

    return ClubMember.findAll({
      where,
      include: [
        {
          model: User,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'shownName',
            'mail',
            'avatarUrl',
          ],
        },
        { model: License },
        { model: MedicalCertificate },
      ],
      order: [['joinedAt', 'ASC']],
    });
  }

  async getMember(memberId: string): Promise<ClubMember> {
    const member = await ClubMember.findByPk(memberId, {
      include: [
        {
          model: User,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'shownName',
            'mail',
            'avatarUrl',
          ],
        },
        { model: License },
        { model: MedicalCertificate },
      ],
    });
    if (!member) throw createError(404, 'Member not found');
    return member;
  }

  async updateMember(
    memberId: string,
    body: IUpdateClubMemberBody,
  ): Promise<ClubMember> {
    const member = await ClubMember.findByPk(memberId);
    if (!member) throw createError(404, 'Member not found');
    await member.update(body);
    return member;
  }

  async deleteMember(memberId: string): Promise<void> {
    const member = await ClubMember.findByPk(memberId);
    if (!member) throw createError(404, 'Member not found');
    await member.destroy();
  }

  // --- Licenses ---

  async createLicense(body: ICreateLicenseBody): Promise<License> {
    return License.create({
      clubMemberId: body.clubMemberId,
      licenseNumber: body.licenseNumber,
      type: body.type ?? null,
      startDate: body.startDate,
      expirationDate: body.expirationDate,
    });
  }

  // --- Medical Certificates ---

  async createMedicalCertificate(
    body: ICreateMedicalCertificateBody,
  ): Promise<MedicalCertificate> {
    return MedicalCertificate.create({
      clubMemberId: body.clubMemberId,
      issueDate: body.issueDate,
      expirationDate: body.expirationDate,
    });
  }
}

export default new MemberService();
