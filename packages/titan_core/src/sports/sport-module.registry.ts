import { SportType } from '../enums';
import { SportModule } from './sport-module.interface';
import { HandballModule } from './handball.module';

const REGISTRY: Partial<Record<SportType, SportModule>> = {
  [SportType.HANDBALL]: HandballModule,
};

export const getSportModule = (sport: SportType): SportModule => {
  const module = REGISTRY[sport];
  if (!module) {
    throw new Error(`No SportModule registered for sport: ${sport}`);
  }
  return module;
};

export const isSportSupported = (sport: SportType): boolean =>
  REGISTRY[sport] !== undefined;
