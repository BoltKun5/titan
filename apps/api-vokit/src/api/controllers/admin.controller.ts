import { Controller, LoggerModel } from '../../core';

class AdminController implements Controller {
  private static readonly logger = new LoggerModel(AdminController.name);
}

export default new AdminController();
