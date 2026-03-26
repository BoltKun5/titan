import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { memberService } from '../../../services/titan';
import MemberValidation from '../../validations/titan/member.validation';

class MemberController implements Controller {
  private static readonly logger = new LoggerModel(MemberController.name);

  async create(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = MemberValidation.createMemberBody(req.body);
    const member = await memberService.createMember(req.params.clubId, body);
    res.json({ data: member });
  }

  async list(
    req: Request<{ clubId: string }, any, any, { seasonId?: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const members = await memberService.getMembers(
      req.params.clubId,
      req.query.seasonId,
    );
    res.json({ data: members });
  }

  async get(
    req: Request<{ clubId: string; memberId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const member = await memberService.getMember(req.params.memberId);
    res.json({ data: member });
  }

  async update(
    req: Request<{ clubId: string; memberId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = MemberValidation.updateMemberBody(req.body);
    const member = await memberService.updateMember(req.params.memberId, body);
    res.json({ data: member });
  }

  async remove(
    req: Request<{ clubId: string; memberId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await memberService.deleteMember(req.params.memberId);
    res.json({ data: null });
  }

  async createLicense(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = MemberValidation.createLicenseBody(req.body);
    const license = await memberService.createLicense(body);
    res.json({ data: license });
  }

  async createMedicalCertificate(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = MemberValidation.createMedicalCertificateBody(req.body);
    const cert = await memberService.createMedicalCertificate(body);
    res.json({ data: cert });
  }
}

export default new MemberController();
