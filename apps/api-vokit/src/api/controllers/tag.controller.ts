import {
  IUserTagsBody,
  IResponse,
  IUserTagsResponse,
  ICreateTagBody,
  ICreateTagResponse,
} from 'vokit_core';
import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import { Tag } from '../../database/models/tag.model';

class TagController implements Controller {
  private static readonly logger = new LoggerModel(TagController.name);

  async getTags(
    req: Request<Record<string, never>, IUserTagsResponse, IUserTagsBody>,
    res: Response<IResponse<IUserTagsResponse>, ILocals>,
  ): Promise<void> {
    const result = await Tag.findAll({
      where: {
        userId: res.locals.currentUser.id,
      },
    });
    res.json({ data: { tags: result } });
  }

  async createTag(
    req: Request<any, any, ICreateTagBody>,
    res: Response<IResponse<ICreateTagResponse>, ILocals>,
  ): Promise<void> {
    await Tag.create({
      userId: res.locals.currentUser.id,
      name: req.body.name,
      type: 0,
    });
    const allTags = await Tag.findAll({
      where: {
        userId: res.locals.currentUser.id,
      },
    });
    res.json({ data: { tags: allTags } });
  }
}

export default new TagController();
