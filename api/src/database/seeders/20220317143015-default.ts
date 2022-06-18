import { CardRarityEnum } from './../../type/enums/card-rarity.enum';
import axios from "axios";
import { CardEntity } from "../models/CardEntity";

module.exports = {
  up: async (_queryInterface) => {
    const response = await axios.get('https://api.tcgdex.net/v2/fr/cards/swsh6-201');
    const card: any = response.data;
    CardEntity.create({
      name: card.name,
      rarity: CardRarityEnum[card.rarity],
    });


    
  },

  down: async (_queryInterface, _Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
