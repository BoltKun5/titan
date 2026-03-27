import { Request, Response, NextFunction } from 'express';
import { TitanRole, ClubMemberRole } from 'titan_core';
import { ILocals } from '../../core';
import { StaffRole, ClubMember } from '../../database';
import { HttpResponseError } from '../../modules/http-response-error';

const MEMBER_ROLE_TO_TITAN_ROLE: Record<string, TitanRole> = {
  [ClubMemberRole.PLAYER]: TitanRole.PLAYER,
  [ClubMemberRole.COACH]: TitanRole.COACH,
  [ClubMemberRole.MANAGER]: TitanRole.MANAGER,
  [ClubMemberRole.REFEREE]: TitanRole.VIEWER,
  [ClubMemberRole.VOLUNTEER]: TitanRole.VIEWER,
  [ClubMemberRole.SUPPORTER]: TitanRole.VIEWER,
};

export const resolveClubRole = async (
  userId: string,
  clubId: string,
): Promise<TitanRole | null> => {
  const staffRole = await StaffRole.findOne({ where: { userId, clubId } });
  if (staffRole) return staffRole.role as TitanRole;

  const member = await ClubMember.findOne({ where: { userId, clubId } });
  if (member) return MEMBER_ROLE_TO_TITAN_ROLE[member.role] ?? TitanRole.VIEWER;

  return null;
};

export const requireClubRole = (...allowedRoles: TitanRole[]) => {
  return async (
    req: Request<{ clubId: string }>,
    res: Response<any, ILocals>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = res.locals.currentUser.id;
      const clubId = req.params.clubId;

      if (!clubId) {
        return HttpResponseError.sendError(
          HttpResponseError.createForbidden(),
          req,
          res,
        );
      }

      const role = await resolveClubRole(userId, clubId);

      if (!role) {
        return HttpResponseError.sendError(
          HttpResponseError.createForbidden(),
          req,
          res,
        );
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return HttpResponseError.sendError(
          HttpResponseError.createForbidden(),
          req,
          res,
        );
      }

      res.locals.clubRole = role;
      next();
    } catch (error: any) {
      HttpResponseError.sendError(error, req, res);
    }
  };
};
