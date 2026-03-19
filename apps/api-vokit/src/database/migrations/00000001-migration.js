'use strict';

import { INTEGER, STRING, JSON, TEXT, DATE, BOOLEAN, DATEONLY, DECIMAL } from 'sequelize';

/**
 * Actions summary:
 *
 * createTable "adminConfig", deps: []
 * createTable "cardSerie", deps: []
 * createTable "logConsole", deps: []
 * createTable "preSignedUrl", deps: []
 * createTable "user", deps: []
 * createTable "card", deps: [cardSet]
 * createTable "cardSet", deps: [cardSerie]
 * createTable "tag", deps: [user]
 * createTable "cardAdditionalPrinting", deps: [card]
 * createTable "cardType", deps: [card]
 * createTable "logEndpoint", deps: [logConsole]
 * createTable "userCardPossession", deps: [user, card, cardAdditionalPrinting]
 * createTable "cardTags", deps: [tag, userCardPossession]
 * addIndex "card_additional_printing_card_id" to table "cardAdditionalPrinting"
 * addIndex "card_set_card_serie_id" to table "cardSet"
 * addIndex "card_set_code" to table "cardSet"
 * addIndex "card_set_name" to table "cardSet"
 * addIndex "card_tags_card_possession_id" to table "cardTags"
 * addIndex "card_tags_tag_id" to table "cardTags"
 * addIndex "card_type_card_id" to table "cardType"
 * addIndex "card_local_id" to table "card"
 * addIndex "card_set_id" to table "card"
 * addIndex "card_rarity" to table "card"
 * addIndex "card_name" to table "card"
 * addIndex "pre_signed_url_token" to table "preSignedUrl"
 * addIndex "tag_user_id" to table "tag"
 * addIndex "tag_name" to table "tag"
 * addIndex "user_card_possession_printing_id" to table "userCardPossession"
 * addIndex "user_card_possession_card_id" to table "userCardPossession"
 * addIndex "user_card_possession_user_id" to table "userCardPossession"
 *
 **/

const info = {
  revision: 1,
  name: 'migration',
  created: '2023-07-13T10:38:16.300Z',
  comment: '',
};

const migrationCommands = [
  {
    fn: 'createTable',
    params: [
      'SequelizeMigrationsMeta',
      {
        revision: {
          primaryKey: true,
          type: INTEGER,
        },
        name: {
          allowNull: false,
          type: STRING,
        },
        state: {
          allowNull: false,
          type: JSON,
        },
      },
      {},
    ],
  },
  {
    fn: 'bulkDelete',
    params: [
      'SequelizeMigrationsMeta',
      [
        {
          revision: info.revision,
        },
      ],
      {},
    ],
  },
  {
    fn: 'bulkInsert',
    params: [
      'SequelizeMigrationsMeta',
      [
        {
          revision: info.revision,
          name: info.name,
          state:
            '{"revision":1,"tables":{"adminConfig":{"tableName":"adminConfig","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"name":{"seqType":"Sequelize.STRING"},"label":{"seqType":"Sequelize.STRING"},"type":{"seqType":"Sequelize.INTEGER"},"value":{"seqType":"Sequelize.STRING"}},"indexes":{}},"cardAdditionalPrinting":{"tableName":"cardAdditionalPrinting","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"cardId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"card","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"type":{"seqType":"Sequelize.INTEGER"},"name":{"seqType":"Sequelize.STRING"},"creator":{"seqType":"Sequelize.INTEGER"}},"indexes":{"41051446093ee6078e42d18d6e02ad4cf7b69ee0":{"name":"card_additional_printing_card_id","type":"","fields":[{"name":"cardId"}],"options":{"indexName":"card_additional_printing_card_id"}}}},"cardSerie":{"tableName":"cardSerie","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"name":{"seqType":"Sequelize.STRING","unique":true},"code":{"seqType":"Sequelize.STRING"}},"indexes":{}},"cardSet":{"tableName":"cardSet","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"name":{"seqType":"Sequelize.STRING"},"cardCount":{"seqType":"Sequelize.JSON"},"releaseDate":{"seqType":"Sequelize.DATEONLY"},"code":{"seqType":"Sequelize.STRING"},"imageId":{"seqType":"Sequelize.STRING"},"logoId":{"seqType":"Sequelize.STRING"},"cardSerieId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"cardSerie","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{"06e6f07862e3eaed48f66c3b3d20fab1ca510d8a":{"name":"card_set_name","type":"","fields":[{"name":"name"}],"options":{"indexName":"card_set_name"}},"1d31cf4fe167be45afb274eaac2699715302e5ed":{"name":"card_set_code","type":"","fields":[{"name":"code"}],"options":{"indexName":"card_set_code"}},"128a6d38556c36eafc5240bf3ab133fef8f6599f":{"name":"card_set_card_serie_id","type":"","fields":[{"name":"cardSerieId"}],"options":{"indexName":"card_set_card_serie_id"}}}},"cardTags":{"tableName":"cardTags","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"tagId":{"seqType":"Sequelize.STRING","unique":"cardTags_cardPossessionId_tagId_unique","primaryKey":true,"references":{"model":"tag","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"cardPossessionId":{"seqType":"Sequelize.STRING","unique":"cardTags_cardPossessionId_tagId_unique","primaryKey":true,"references":{"model":"userCardPossession","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{"42feb1eb2ce42b204bfd733835643227fae80558":{"name":"card_tags_tag_id","type":"","fields":[{"name":"tagId"}],"options":{"indexName":"card_tags_tag_id"}},"53b1b32a06b9bf8b771de7cb56d02c4bf159b16c":{"name":"card_tags_card_possession_id","type":"","fields":[{"name":"cardPossessionId"}],"options":{"indexName":"card_tags_card_possession_id"}}}},"cardType":{"tableName":"cardType","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"cardId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"card","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"type":{"seqType":"Sequelize.INTEGER"}},"indexes":{"01e8fe8e8657fcda5058719fd8c74d78d97a6311":{"name":"card_type_card_id","type":"","fields":[{"name":"cardId"}],"options":{"indexName":"card_type_card_id"}}}},"card":{"tableName":"card","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"name":{"seqType":"Sequelize.STRING"},"rarity":{"seqType":"Sequelize.INTEGER"},"category":{"seqType":"Sequelize.INTEGER"},"setId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"cardSet","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"canBeReverse":{"seqType":"Sequelize.BOOLEAN"},"localId":{"seqType":"Sequelize.STRING"},"imageId":{"seqType":"Sequelize.STRING"},"thumbnailId":{"seqType":"Sequelize.STRING"}},"indexes":{"9c2ec9e2c1ad6a1545d449f0da4aa8b56e0d8b6d":{"name":"card_name","type":"","fields":[{"name":"name"}],"options":{"indexName":"card_name"}},"a8d09983ffd0fb6312ec64bb55286c1a482500d1":{"name":"card_rarity","type":"","fields":[{"name":"rarity"}],"options":{"indexName":"card_rarity"}},"1c6009a32fd1580a3eb52b4c3ff20886e0fcf4ec":{"name":"card_set_id","type":"","fields":[{"name":"setId"}],"options":{"indexName":"card_set_id"}},"7f4e304498df6c6b87b2178958a894d1dfb53dae":{"name":"card_local_id","type":"","fields":[{"name":"localId"}],"options":{"indexName":"card_local_id"}}}},"logConsole":{"tableName":"logConsole","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"level":{"seqType":"Sequelize.INTEGER"},"processId":{"seqType":"Sequelize.INTEGER"},"context":{"seqType":"Sequelize.STRING","allowNull":true},"requestId":{"seqType":"Sequelize.STRING","allowNull":true},"type":{"seqType":"Sequelize.INTEGER"},"message":{"seqType":"Sequelize.TEXT"},"stack":{"seqType":"Sequelize.TEXT","allowNull":true},"dateValue":{"seqType":"Sequelize.DATE"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}},"logEndpoint":{"tableName":"logEndpoint","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"requestId":{"seqType":"Sequelize.STRING"},"processId":{"seqType":"Sequelize.INTEGER"},"controller":{"seqType":"Sequelize.STRING"},"endpoint":{"seqType":"Sequelize.STRING"},"ips":{"seqType":"Sequelize.JSON"},"durationInMs":{"seqType":"Sequelize.DECIMAL"},"method":{"seqType":"Sequelize.INTEGER"},"requestParams":{"seqType":"Sequelize.JSON"},"requestQuery":{"seqType":"Sequelize.JSON"},"requestBody":{"seqType":"Sequelize.JSON"},"responseBody":{"seqType":"Sequelize.JSON"},"httpResultCode":{"seqType":"Sequelize.INTEGER"},"dateValue":{"seqType":"Sequelize.DATE"},"logConsoleId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"logConsole","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}},"preSignedUrl":{"tableName":"preSignedUrl","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"type":{"seqType":"Sequelize.INTEGER","allowNull":false},"token":{"seqType":"Sequelize.STRING"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{"b20d622186b5a0ca9b4aaab3990939b0505e1127":{"name":"pre_signed_url_token","type":"","fields":[{"name":"token"}],"options":{"indexName":"pre_signed_url_token"}}}},"tag":{"tableName":"tag","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"type":{"seqType":"Sequelize.INTEGER"},"name":{"seqType":"Sequelize.STRING"},"userId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"user","key":"id"},"onUpdate":"CASCADE","onDelete":"NO ACTION"}},"indexes":{"e56071ae3eed784da31a0a6e322e70f7b2a45d1d":{"name":"tag_name","type":"","fields":[{"name":"name"}],"options":{"indexName":"tag_name"}},"2ead83ddc81134a91f7b9342351165a449cc3891":{"name":"tag_user_id","type":"","fields":[{"name":"userId"}],"options":{"indexName":"tag_user_id"}}}},"userCardPossession":{"tableName":"userCardPossession","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"userId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"user","key":"id"},"onUpdate":"CASCADE","onDelete":"NO ACTION"},"cardId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"card","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"condition":{"seqType":"Sequelize.INTEGER"},"grade":{"seqType":"Sequelize.INTEGER"},"printingId":{"seqType":"Sequelize.STRING","allowNull":true,"references":{"model":"cardAdditionalPrinting","key":"id"},"onUpdate":"CASCADE","onDelete":"NO ACTION"},"note":{"seqType":"Sequelize.STRING"},"language":{"seqType":"Sequelize.INTEGER"},"boosterId":{"seqType":"Sequelize.STRING"},"deletionType":{"seqType":"Sequelize.INTEGER"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"deletedAt":{"seqType":"Sequelize.DATE"}},"indexes":{"c63ce71636ac13eca6663257b28315d56b55d2d5":{"name":"user_card_possession_user_id","type":"","fields":[{"name":"userId"}],"options":{"indexName":"user_card_possession_user_id"}},"bbd936c78da2c31fda866986ce775376212f97e1":{"name":"user_card_possession_card_id","type":"","fields":[{"name":"cardId"}],"options":{"indexName":"user_card_possession_card_id"}},"35abb59251b6579d72b1d32f84bc248171c0a396":{"name":"user_card_possession_printing_id","type":"","fields":[{"name":"printingId"}],"options":{"indexName":"user_card_possession_printing_id"}}}},"user":{"tableName":"user","schema":{"id":{"seqType":"Sequelize.STRING","primaryKey":true},"role":{"seqType":"Sequelize.INTEGER","allowNull":false},"shownName":{"seqType":"Sequelize.STRING","allowNull":false},"mail":{"seqType":"Sequelize.STRING"},"options":{"seqType":"Sequelize.JSON","allowNull":true},"password":{"seqType":"Sequelize.STRING","allowNull":false},"isActive":{"seqType":"Sequelize.BOOLEAN"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}}}}',
        },
      ],
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'adminConfig',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        name: {
          type: STRING,
        },
        label: {
          type: STRING,
        },
        type: {
          type: INTEGER,
        },
        value: {
          type: STRING,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'cardSerie',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        name: {
          unique: true,
          type: STRING,
        },
        code: {
          type: STRING,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'logConsole',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        level: {
          type: INTEGER,
        },
        processId: {
          type: INTEGER,
        },
        context: {
          allowNull: true,
          type: STRING,
        },
        requestId: {
          allowNull: true,
          type: STRING,
        },
        type: {
          type: INTEGER,
        },
        message: {
          type: TEXT,
        },
        stack: {
          allowNull: true,
          type: TEXT,
        },
        dateValue: {
          type: DATE,
        },
        createdAt: {
          allowNull: false,
          type: DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DATE,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'preSignedUrl',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        type: {
          allowNull: false,
          type: INTEGER,
        },
        token: {
          type: STRING,
        },
        createdAt: {
          allowNull: false,
          type: DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DATE,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'user',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        role: {
          allowNull: false,
          type: INTEGER,
        },
        shownName: {
          allowNull: false,
          type: STRING,
        },
        mail: {
          type: STRING,
        },
        options: {
          allowNull: true,
          type: JSON,
        },
        password: {
          allowNull: false,
          type: STRING,
        },
        isActive: {
          type: BOOLEAN,
        },
        createdAt: {
          allowNull: false,
          type: DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DATE,
        },
      },
      {},
    ],
  },
  {
    fn: 'createTable',
    params: [
      'cardSet',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        name: {
          type: STRING,
        },
        cardCount: {
          type: JSON,
        },
        releaseDate: {
          type: DATEONLY,
        },
        code: {
          type: STRING,
        },
        imageId: {
          type: STRING,
        },
        logoId: {
          type: STRING,
        },
        cardSerieId: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'cardSerie',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
      },
      {},
    ],
  },
  {
    fn: 'createTable',
    params: [
      'card',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        name: {
          type: STRING,
        },
        rarity: {
          type: INTEGER,
        },
        category: {
          type: INTEGER,
        },
        setId: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'cardSet',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
        canBeReverse: {
          type: BOOLEAN,
        },
        localId: {
          type: STRING,
        },
        imageId: {
          type: STRING,
        },
        thumbnailId: {
          type: STRING,
        },
      },
      {},
    ],
  },
  {
    fn: 'createTable',
    params: [
      'tag',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        type: {
          type: INTEGER,
        },
        name: {
          type: STRING,
        },
        userId: {
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE',
          references: {
            model: 'user',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'cardAdditionalPrinting',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        cardId: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'card',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
        type: {
          type: INTEGER,
        },
        name: {
          type: STRING,
        },
        creator: {
          type: INTEGER,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'cardType',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        cardId: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'card',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
        type: {
          type: INTEGER,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'logEndpoint',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        requestId: {
          type: STRING,
        },
        processId: {
          type: INTEGER,
        },
        controller: {
          type: STRING,
        },
        endpoint: {
          type: STRING,
        },
        ips: {
          type: JSON,
        },
        durationInMs: {
          type: DECIMAL,
        },
        method: {
          type: INTEGER,
        },
        requestParams: {
          type: JSON,
        },
        requestQuery: {
          type: JSON,
        },
        requestBody: {
          type: JSON,
        },
        responseBody: {
          type: JSON,
        },
        httpResultCode: {
          type: INTEGER,
        },
        dateValue: {
          type: DATE,
        },
        logConsoleId: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'logConsole',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
        createdAt: {
          allowNull: false,
          type: DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DATE,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'userCardPossession',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        userId: {
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE',
          references: {
            model: 'user',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
        cardId: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'card',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
        condition: {
          type: INTEGER,
        },
        grade: {
          type: INTEGER,
        },
        printingId: {
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE',
          references: {
            model: 'cardAdditionalPrinting',
            key: 'id',
          },
          allowNull: true,
          type: STRING,
        },
        note: {
          type: STRING,
        },
        language: {
          type: INTEGER,
        },
        boosterId: {
          type: STRING,
        },
        deletionType: {
          type: INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DATE,
        },
        deletedAt: {
          type: DATE,
        },
      },
      {},
    ],
  },

  {
    fn: 'createTable',
    params: [
      'cardTags',
      {
        id: {
          primaryKey: true,
          type: STRING,
        },
        tagId: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'tag',
            key: 'id',
          },
          primaryKey: true,
          unique: 'cardTags_cardPossessionId_tagId_unique',
          type: STRING,
        },
        cardPossessionId: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'userCardPossession',
            key: 'id',
          },
          primaryKey: true,
          unique: 'cardTags_cardPossessionId_tagId_unique',
          type: STRING,
        },
      },
      {},
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'cardAdditionalPrinting',
      [
        {
          name: 'cardId',
        },
      ],
      {
        indexName: 'card_additional_printing_card_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'cardSet',
      [
        {
          name: 'cardSerieId',
        },
      ],
      {
        indexName: 'card_set_card_serie_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'cardSet',
      [
        {
          name: 'code',
        },
      ],
      {
        indexName: 'card_set_code',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'cardSet',
      [
        {
          name: 'name',
        },
      ],
      {
        indexName: 'card_set_name',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'cardTags',
      [
        {
          name: 'cardPossessionId',
        },
      ],
      {
        indexName: 'card_tags_card_possession_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'cardTags',
      [
        {
          name: 'tagId',
        },
      ],
      {
        indexName: 'card_tags_tag_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'cardType',
      [
        {
          name: 'cardId',
        },
      ],
      {
        indexName: 'card_type_card_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'card',
      [
        {
          name: 'localId',
        },
      ],
      {
        indexName: 'card_local_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'card',
      [
        {
          name: 'setId',
        },
      ],
      {
        indexName: 'card_set_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'card',
      [
        {
          name: 'rarity',
        },
      ],
      {
        indexName: 'card_rarity',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'card',
      [
        {
          name: 'name',
        },
      ],
      {
        indexName: 'card_name',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'preSignedUrl',
      [
        {
          name: 'token',
        },
      ],
      {
        indexName: 'pre_signed_url_token',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'tag',
      [
        {
          name: 'userId',
        },
      ],
      {
        indexName: 'tag_user_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'tag',
      [
        {
          name: 'name',
        },
      ],
      {
        indexName: 'tag_name',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'userCardPossession',
      [
        {
          name: 'printingId',
        },
      ],
      {
        indexName: 'user_card_possession_printing_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'userCardPossession',
      [
        {
          name: 'cardId',
        },
      ],
      {
        indexName: 'user_card_possession_card_id',
      },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'userCardPossession',
      [
        {
          name: 'userId',
        },
      ],
      {
        indexName: 'user_card_possession_user_id',
      },
    ],
  },
];

const rollbackCommands = [
  {
    fn: 'bulkDelete',
    params: [
      'SequelizeMigrationsMeta',
      [
        {
          revision: info.revision,
        },
      ],
      {},
    ],
  },
  {
    fn: 'dropTable',
    params: ['cardSet'],
  },
  {
    fn: 'dropTable',
    params: ['card'],
  },
  {
    fn: 'dropTable',
    params: ['tag'],
  },
  {
    fn: 'dropTable',
    params: ['cardAdditionalPrinting'],
  },
  {
    fn: 'dropTable',
    params: ['cardType'],
  },
  {
    fn: 'dropTable',
    params: ['logEndpoint'],
  },
  {
    fn: 'dropTable',
    params: ['userCardPossession'],
  },
  {
    fn: 'dropTable',
    params: ['cardTags'],
  },
  {
    fn: 'dropTable',
    params: ['adminConfig'],
  },
  {
    fn: 'dropTable',
    params: ['cardSerie'],
  },
  {
    fn: 'dropTable',
    params: ['logConsole'],
  },
  {
    fn: 'dropTable',
    params: ['preSignedUrl'],
  },
  {
    fn: 'dropTable',
    params: ['user'],
  },
];

export const pos = 0;
export function up(queryInterface) {
  let index = pos;
  return new Promise(function (resolve, reject) {
    function next() {
      if (index < migrationCommands.length) {
        const command = migrationCommands[index];
        console.log('[#' + index + '] execute: ' + command.fn);
        index++;
        // eslint-disable-next-line prefer-spread
        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
      } else resolve();
    }
    next();
  });
}
export function down(queryInterface) {
  let index = pos;
  return new Promise(function (resolve, reject) {
    function next() {
      if (index < rollbackCommands.length) {
        const command = rollbackCommands[index];
        console.log('[#' + index + '] execute: ' + command.fn);
        index++;
        // eslint-disable-next-line prefer-spread
        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
      } else resolve();
    }
    next();
  });
}
