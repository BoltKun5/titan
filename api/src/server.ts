import { getSetIcons, renamePokecardexSetIcons, getAllTGCardImg, getAllCardImg } from './serverFunctions';
import { existsSync, readdirSync, statSync } from "fs-extra";
import { LogType } from "abyss_crypt_core";
import { startServer } from "./app";
import AppConfig from "./modules/AppConfig";
import Logger from "./modules/Logger";
import path from "path";
import { Card, CardAttack, CardAttribute, CardSerie, CardSet, CardDexId, CardType, CardAbility, CardAttackCost, CardDamageModification } from "./database";
import { canBeReverse } from "./utils/global.utils";
import 'module-alias/register'
import { CardTypeEnum, CardCountType, CardRarityEnum, CardCategoryEnum, CardEvolutionStageEnum, CardAbilityTypeEnum, CardDamageModificationType, CardTrainerTypeEnum, CardAttributeEnum, HeldItemType, CardEnergyTypeEnum } from "../../local-core";

(async () => {
  try {
    AppConfig.consoleSetup();
    await startServer();

    setTimeout(test, 1);

  } catch (error) {
    Logger.error(error, LogType.SYSTEM_STARTUP);
  }
})();

process.on("unhandledRejection", (error) => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection", error);
});

async function test() {
  try {
    console.time("seed");

    // getAllCardImg()

    console.timeEnd("seed");
  } catch (error) {
    console.error(error);
    Logger.error(error, LogType.SYSTEM_STARTUP);
  }
}
