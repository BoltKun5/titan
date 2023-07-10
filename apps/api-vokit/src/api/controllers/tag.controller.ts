import {
  IResponse,
  IUserTagsResponse,
  ICreateTagBody,
  ICreateTagResponse,
  IUserTagsQuery,
  IDeleteTagQuery,
} from 'vokit_core';
import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import { Tag } from '../../database/models/tag.model';
import { User } from '../../database';
import { HttpResponseError } from '../../modules/http-response-error';
import TagValidation from '../validations/tag.validation';

class TagController implements Controller {
  private static readonly logger = new LoggerModel(TagController.name);

  async getTags(
    req: Request<Record<string, never>, IUserTagsResponse, void, IUserTagsQuery>,
    res: Response<IResponse<IUserTagsResponse>, ILocals>,
  ): Promise<void> {
    req.query = TagValidation.getTags(req.query);

    let user;
    if (req.query?.userId) {
      user = await User.findOne({
        where: {
          id: req.query.userId,
        },
      });
      if (!user) {
        throw HttpResponseError.createNotFoundError();
      }
    } else {
      user = res.locals.currentUser;
    }

    if (!user) throw HttpResponseError.createNotFoundError();

    const result = await Tag.findAll({
      where: {
        userId: user.id,
      },
    });
    res.json({ data: { tags: result } });
  }

  async createTag(
    req: Request<Record<string, never>, ICreateTagResponse, ICreateTagBody>,
    res: Response<IResponse<ICreateTagResponse>, ILocals>,
  ): Promise<void> {
    req.body = TagValidation.createTag(req.body);

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

  async deleteTag(
    req: Request<Record<string, never>, ICreateTagResponse, IDeleteTagQuery, IDeleteTagQuery>,
    res: Response<IResponse<ICreateTagResponse>, ILocals>,
  ): Promise<void> {
    req.query = TagValidation.deleteTag(req.query);

    const tag = await Tag.findOne({
      where: {
        id: req.query.id,
        userId: res.locals.currentUser.id,
      },
    });

    if (!tag) {
      throw HttpResponseError.createNotFoundError();
    }

    await tag.destroy();

    const allTags = await Tag.findAll({
      where: {
        userId: res.locals.currentUser.id,
      },
    });
    res.json({ data: { tags: allTags } });
  }
}

export default new TagController();
