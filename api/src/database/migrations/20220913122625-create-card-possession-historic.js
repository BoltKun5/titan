'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.query(`
    --
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Debian 14.3-1.pgdg110+1)
-- Dumped by pg_dump version 14.3

-- Started on 2022-09-13 14:43:44 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 47969)
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 285264)
-- Name: Card; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Card" (
    id character varying(255) NOT NULL,
    name character varying(255),
    rarity integer,
    category integer,
    "setId" character varying(255),
    hp integer,
    "evolveFrom" character varying(255),
    stage integer,
    effect character varying(1047),
    retreat integer,
    "regulationMark" character varying(255),
    "trainerType" integer,
    "canBeNormal" boolean,
    "canBeReverse" boolean,
    "isHolo" boolean,
    "isFirstEdition" boolean,
    "localId" character varying(255),
    "globalId" character varying(255),
    description character varying(255),
    level character varying(255),
    item json,
    "energyType" integer
);


ALTER TABLE public."Card" OWNER TO root;

--
-- TOC entry 215 (class 1259 OID 285276)
-- Name: CardAbility; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardAbility" (
    id character varying(255) NOT NULL,
    "cardEntityId" character varying(255),
    name character varying(255),
    effect character varying(1047),
    type integer
);


ALTER TABLE public."CardAbility" OWNER TO root;

--
-- TOC entry 216 (class 1259 OID 285288)
-- Name: CardAttack; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardAttack" (
    id character varying(255) NOT NULL,
    "cardEntityId" character varying(255),
    name character varying(255),
    effect character varying(1047),
    damage character varying(255)
);


ALTER TABLE public."CardAttack" OWNER TO root;

--
-- TOC entry 217 (class 1259 OID 285300)
-- Name: CardAttackCost; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardAttackCost" (
    id character varying(255) NOT NULL,
    "cardAttackId" character varying(255),
    cost integer,
    type integer
);


ALTER TABLE public."CardAttackCost" OWNER TO root;

--
-- TOC entry 218 (class 1259 OID 285312)
-- Name: CardAttribute; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardAttribute" (
    id character varying(255) NOT NULL,
    "cardEntityId" character varying(255),
    attribute character varying(255)
);


ALTER TABLE public."CardAttribute" OWNER TO root;

--
-- TOC entry 219 (class 1259 OID 285324)
-- Name: CardDamageModification; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardDamageModification" (
    id character varying(255) NOT NULL,
    "cardEntityId" character varying(255),
    "modificationType" integer,
    type integer,
    value character varying(255)
);


ALTER TABLE public."CardDamageModification" OWNER TO root;

--
-- TOC entry 220 (class 1259 OID 285336)
-- Name: CardDexId; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardDexId" (
    id character varying(255) NOT NULL,
    "cardId" character varying(255),
    "dexId" character varying(255)
);


ALTER TABLE public."CardDexId" OWNER TO root;

--
-- TOC entry 211 (class 1259 OID 57880)
-- Name: CardEntity; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardEntity" (
    id character varying(255) NOT NULL,
    name character varying(255),
    rarity integer,
    category integer,
    "setId" character varying(255),
    hp integer,
    "evolveFrom" character varying(255),
    stage integer,
    effect character varying(255),
    retreat integer,
    "regulationMark" character varying(255),
    "trainerType" integer,
    "canBeNormal" boolean,
    "canBeReverse" boolean,
    "isHolo" boolean,
    "isFirstEdition" boolean,
    "localId" integer,
    description character varying(255),
    level character varying(255),
    item json,
    "energyType" integer
);


ALTER TABLE public."CardEntity" OWNER TO root;

--
-- TOC entry 212 (class 1259 OID 285243)
-- Name: CardSerie; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardSerie" (
    id character varying(255) NOT NULL,
    name character varying(255),
    code character varying(255)
);


ALTER TABLE public."CardSerie" OWNER TO root;

--
-- TOC entry 213 (class 1259 OID 285252)
-- Name: CardSet; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardSet" (
    id character varying(255) NOT NULL,
    name character varying(255),
    "cardCount" json,
    "tcgOnline" character varying(255),
    "isPlayableInStandard" boolean,
    "isPlayableInExpanded" boolean,
    "releaseDate" date,
    code character varying(255),
    "cardSerieId" character varying(255)
);


ALTER TABLE public."CardSet" OWNER TO root;

--
-- TOC entry 221 (class 1259 OID 285348)
-- Name: CardType; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."CardType" (
    id character varying(255) NOT NULL,
    "cardId" character varying(255),
    type integer
);


ALTER TABLE public."CardType" OWNER TO root;

--
-- TOC entry 209 (class 1259 OID 47970)
-- Name: SequelizeData; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."SequelizeData" (
    name character varying(255)
);


ALTER TABLE public."SequelizeData" OWNER TO root;

--
-- TOC entry 210 (class 1259 OID 47973)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255)
);


ALTER TABLE public."SequelizeMeta" OWNER TO root;

--
-- TOC entry 224 (class 1259 OID 285380)
-- Name: User; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."User" (
    id character varying(255) NOT NULL,
    role integer,
    "shownName" character varying(255),
    username character varying(255),
    password character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO root;

--
-- TOC entry 225 (class 1259 OID 285387)
-- Name: UserCardPossession; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."UserCardPossession" (
    id character varying(255) NOT NULL,
    "userId" character varying(255),
    "cardId" character varying(255),
    "classicQuantity" integer,
    "reverseQuantity" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserCardPossession" OWNER TO root;

--
-- TOC entry 222 (class 1259 OID 285360)
-- Name: logConsole; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."logConsole" (
    id character varying(255) NOT NULL,
    level integer,
    type integer DEFAULT 100,
    message text,
    stack text,
    "dateValue" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."logConsole" OWNER TO root;

--
-- TOC entry 223 (class 1259 OID 285368)
-- Name: logEndpoint; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."logEndpoint" (
    id character varying(255) NOT NULL,
    controller character varying(255),
    endpoint character varying(255),
    ip character varying(255),
    "durationMs" numeric,
    method integer,
    "requestParams" text,
    "requestQuery" text,
    "requestBody" text,
    "responseBody" text,
    "httpResultCode" integer,
    "dateValue" timestamp with time zone,
    "logConsoleId" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."logEndpoint" OWNER TO root;

--
-- TOC entry 4936 (class 2606 OID 285282)
-- Name: CardAbility CardAbility_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardAbility"
    ADD CONSTRAINT "CardAbility_pkey" PRIMARY KEY (id);


--
-- TOC entry 4940 (class 2606 OID 285306)
-- Name: CardAttackCost CardAttackCost_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardAttackCost"
    ADD CONSTRAINT "CardAttackCost_pkey" PRIMARY KEY (id);


--
-- TOC entry 4938 (class 2606 OID 285294)
-- Name: CardAttack CardAttack_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardAttack"
    ADD CONSTRAINT "CardAttack_pkey" PRIMARY KEY (id);


--
-- TOC entry 4942 (class 2606 OID 285318)
-- Name: CardAttribute CardAttribute_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardAttribute"
    ADD CONSTRAINT "CardAttribute_pkey" PRIMARY KEY (id);


--
-- TOC entry 4944 (class 2606 OID 285330)
-- Name: CardDamageModification CardDamageModification_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardDamageModification"
    ADD CONSTRAINT "CardDamageModification_pkey" PRIMARY KEY (id);


--
-- TOC entry 4946 (class 2606 OID 285342)
-- Name: CardDexId CardDexId_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardDexId"
    ADD CONSTRAINT "CardDexId_pkey" PRIMARY KEY (id);


--
-- TOC entry 3232 (class 2606 OID 57886)
-- Name: CardEntity CardEntity_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardEntity"
    ADD CONSTRAINT "CardEntity_pkey" PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 1269772)
-- Name: CardSerie CardSerie_name_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key" UNIQUE (name);


--
-- TOC entry 3236 (class 2606 OID 1269774)
-- Name: CardSerie CardSerie_name_key1; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key1" UNIQUE (name);


--
-- TOC entry 3238 (class 2606 OID 1269844)
-- Name: CardSerie CardSerie_name_key10; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key10" UNIQUE (name);


--
-- TOC entry 3240 (class 2606 OID 1269304)
-- Name: CardSerie CardSerie_name_key100; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key100" UNIQUE (name);


--
-- TOC entry 3242 (class 2606 OID 1270270)
-- Name: CardSerie CardSerie_name_key101; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key101" UNIQUE (name);


--
-- TOC entry 3244 (class 2606 OID 1270272)
-- Name: CardSerie CardSerie_name_key102; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key102" UNIQUE (name);


--
-- TOC entry 3246 (class 2606 OID 1269714)
-- Name: CardSerie CardSerie_name_key103; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key103" UNIQUE (name);


--
-- TOC entry 3248 (class 2606 OID 1270010)
-- Name: CardSerie CardSerie_name_key104; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key104" UNIQUE (name);


--
-- TOC entry 3250 (class 2606 OID 1269180)
-- Name: CardSerie CardSerie_name_key105; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key105" UNIQUE (name);


--
-- TOC entry 3252 (class 2606 OID 1269716)
-- Name: CardSerie CardSerie_name_key106; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key106" UNIQUE (name);


--
-- TOC entry 3254 (class 2606 OID 1269650)
-- Name: CardSerie CardSerie_name_key107; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key107" UNIQUE (name);


--
-- TOC entry 3256 (class 2606 OID 1269172)
-- Name: CardSerie CardSerie_name_key108; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key108" UNIQUE (name);


--
-- TOC entry 3258 (class 2606 OID 1269174)
-- Name: CardSerie CardSerie_name_key109; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key109" UNIQUE (name);


--
-- TOC entry 3260 (class 2606 OID 1269846)
-- Name: CardSerie CardSerie_name_key11; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key11" UNIQUE (name);


--
-- TOC entry 3262 (class 2606 OID 1269176)
-- Name: CardSerie CardSerie_name_key110; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key110" UNIQUE (name);


--
-- TOC entry 3264 (class 2606 OID 1269178)
-- Name: CardSerie CardSerie_name_key111; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key111" UNIQUE (name);


--
-- TOC entry 3266 (class 2606 OID 1269848)
-- Name: CardSerie CardSerie_name_key112; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key112" UNIQUE (name);


--
-- TOC entry 3268 (class 2606 OID 1269712)
-- Name: CardSerie CardSerie_name_key113; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key113" UNIQUE (name);


--
-- TOC entry 3270 (class 2606 OID 1270132)
-- Name: CardSerie CardSerie_name_key114; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key114" UNIQUE (name);


--
-- TOC entry 3272 (class 2606 OID 1270182)
-- Name: CardSerie CardSerie_name_key115; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key115" UNIQUE (name);


--
-- TOC entry 3274 (class 2606 OID 1270360)
-- Name: CardSerie CardSerie_name_key116; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key116" UNIQUE (name);


--
-- TOC entry 3276 (class 2606 OID 1270362)
-- Name: CardSerie CardSerie_name_key117; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key117" UNIQUE (name);


--
-- TOC entry 3278 (class 2606 OID 1269204)
-- Name: CardSerie CardSerie_name_key118; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key118" UNIQUE (name);


--
-- TOC entry 3280 (class 2606 OID 1269766)
-- Name: CardSerie CardSerie_name_key119; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key119" UNIQUE (name);


--
-- TOC entry 3282 (class 2606 OID 1270370)
-- Name: CardSerie CardSerie_name_key12; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key12" UNIQUE (name);


--
-- TOC entry 3284 (class 2606 OID 1270058)
-- Name: CardSerie CardSerie_name_key120; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key120" UNIQUE (name);


--
-- TOC entry 3286 (class 2606 OID 1269768)
-- Name: CardSerie CardSerie_name_key121; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key121" UNIQUE (name);


--
-- TOC entry 3288 (class 2606 OID 1270050)
-- Name: CardSerie CardSerie_name_key122; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key122" UNIQUE (name);


--
-- TOC entry 3290 (class 2606 OID 1269770)
-- Name: CardSerie CardSerie_name_key123; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key123" UNIQUE (name);


--
-- TOC entry 3292 (class 2606 OID 1270036)
-- Name: CardSerie CardSerie_name_key124; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key124" UNIQUE (name);


--
-- TOC entry 3294 (class 2606 OID 1270044)
-- Name: CardSerie CardSerie_name_key125; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key125" UNIQUE (name);


--
-- TOC entry 3296 (class 2606 OID 1270046)
-- Name: CardSerie CardSerie_name_key126; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key126" UNIQUE (name);


--
-- TOC entry 3298 (class 2606 OID 1270048)
-- Name: CardSerie CardSerie_name_key127; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key127" UNIQUE (name);


--
-- TOC entry 3300 (class 2606 OID 1270358)
-- Name: CardSerie CardSerie_name_key128; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key128" UNIQUE (name);


--
-- TOC entry 3302 (class 2606 OID 1270184)
-- Name: CardSerie CardSerie_name_key129; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key129" UNIQUE (name);


--
-- TOC entry 3304 (class 2606 OID 1270088)
-- Name: CardSerie CardSerie_name_key13; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key13" UNIQUE (name);


--
-- TOC entry 3306 (class 2606 OID 1270186)
-- Name: CardSerie CardSerie_name_key130; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key130" UNIQUE (name);


--
-- TOC entry 3308 (class 2606 OID 1270188)
-- Name: CardSerie CardSerie_name_key131; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key131" UNIQUE (name);


--
-- TOC entry 3310 (class 2606 OID 1270190)
-- Name: CardSerie CardSerie_name_key132; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key132" UNIQUE (name);


--
-- TOC entry 3312 (class 2606 OID 1270354)
-- Name: CardSerie CardSerie_name_key133; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key133" UNIQUE (name);


--
-- TOC entry 3314 (class 2606 OID 1270356)
-- Name: CardSerie CardSerie_name_key134; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key134" UNIQUE (name);


--
-- TOC entry 3316 (class 2606 OID 1269500)
-- Name: CardSerie CardSerie_name_key135; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key135" UNIQUE (name);


--
-- TOC entry 3318 (class 2606 OID 1270124)
-- Name: CardSerie CardSerie_name_key136; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key136" UNIQUE (name);


--
-- TOC entry 3320 (class 2606 OID 1270126)
-- Name: CardSerie CardSerie_name_key137; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key137" UNIQUE (name);


--
-- TOC entry 3322 (class 2606 OID 1270128)
-- Name: CardSerie CardSerie_name_key138; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key138" UNIQUE (name);


--
-- TOC entry 3324 (class 2606 OID 1269976)
-- Name: CardSerie CardSerie_name_key139; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key139" UNIQUE (name);


--
-- TOC entry 3326 (class 2606 OID 1270090)
-- Name: CardSerie CardSerie_name_key14; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key14" UNIQUE (name);


--
-- TOC entry 3328 (class 2606 OID 1270130)
-- Name: CardSerie CardSerie_name_key140; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key140" UNIQUE (name);


--
-- TOC entry 3330 (class 2606 OID 1270276)
-- Name: CardSerie CardSerie_name_key141; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key141" UNIQUE (name);


--
-- TOC entry 3332 (class 2606 OID 1268834)
-- Name: CardSerie CardSerie_name_key142; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key142" UNIQUE (name);


--
-- TOC entry 3334 (class 2606 OID 1268836)
-- Name: CardSerie CardSerie_name_key143; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key143" UNIQUE (name);


--
-- TOC entry 3336 (class 2606 OID 1268842)
-- Name: CardSerie CardSerie_name_key144; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key144" UNIQUE (name);


--
-- TOC entry 3338 (class 2606 OID 1270274)
-- Name: CardSerie CardSerie_name_key145; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key145" UNIQUE (name);


--
-- TOC entry 3340 (class 2606 OID 1268844)
-- Name: CardSerie CardSerie_name_key146; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key146" UNIQUE (name);


--
-- TOC entry 3342 (class 2606 OID 1270416)
-- Name: CardSerie CardSerie_name_key147; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key147" UNIQUE (name);


--
-- TOC entry 3344 (class 2606 OID 1269974)
-- Name: CardSerie CardSerie_name_key148; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key148" UNIQUE (name);


--
-- TOC entry 3346 (class 2606 OID 1270418)
-- Name: CardSerie CardSerie_name_key149; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key149" UNIQUE (name);


--
-- TOC entry 3348 (class 2606 OID 1268830)
-- Name: CardSerie CardSerie_name_key15; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key15" UNIQUE (name);


--
-- TOC entry 3350 (class 2606 OID 1269958)
-- Name: CardSerie CardSerie_name_key150; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key150" UNIQUE (name);


--
-- TOC entry 3352 (class 2606 OID 1268774)
-- Name: CardSerie CardSerie_name_key151; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key151" UNIQUE (name);


--
-- TOC entry 3354 (class 2606 OID 1268776)
-- Name: CardSerie CardSerie_name_key152; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key152" UNIQUE (name);


--
-- TOC entry 3356 (class 2606 OID 1269972)
-- Name: CardSerie CardSerie_name_key153; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key153" UNIQUE (name);


--
-- TOC entry 3358 (class 2606 OID 1269710)
-- Name: CardSerie CardSerie_name_key154; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key154" UNIQUE (name);


--
-- TOC entry 3360 (class 2606 OID 1269584)
-- Name: CardSerie CardSerie_name_key155; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key155" UNIQUE (name);


--
-- TOC entry 3362 (class 2606 OID 1269586)
-- Name: CardSerie CardSerie_name_key156; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key156" UNIQUE (name);


--
-- TOC entry 3364 (class 2606 OID 1269438)
-- Name: CardSerie CardSerie_name_key157; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key157" UNIQUE (name);


--
-- TOC entry 3366 (class 2606 OID 1269440)
-- Name: CardSerie CardSerie_name_key158; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key158" UNIQUE (name);


--
-- TOC entry 3368 (class 2606 OID 1269708)
-- Name: CardSerie CardSerie_name_key159; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key159" UNIQUE (name);


--
-- TOC entry 3370 (class 2606 OID 1269632)
-- Name: CardSerie CardSerie_name_key16; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key16" UNIQUE (name);


--
-- TOC entry 3372 (class 2606 OID 1269016)
-- Name: CardSerie CardSerie_name_key160; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key160" UNIQUE (name);


--
-- TOC entry 3374 (class 2606 OID 1269442)
-- Name: CardSerie CardSerie_name_key161; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key161" UNIQUE (name);


--
-- TOC entry 3376 (class 2606 OID 1269444)
-- Name: CardSerie CardSerie_name_key162; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key162" UNIQUE (name);


--
-- TOC entry 3378 (class 2606 OID 1269446)
-- Name: CardSerie CardSerie_name_key163; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key163" UNIQUE (name);


--
-- TOC entry 3380 (class 2606 OID 1269014)
-- Name: CardSerie CardSerie_name_key164; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key164" UNIQUE (name);


--
-- TOC entry 3382 (class 2606 OID 1269448)
-- Name: CardSerie CardSerie_name_key165; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key165" UNIQUE (name);


--
-- TOC entry 3384 (class 2606 OID 1269300)
-- Name: CardSerie CardSerie_name_key166; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key166" UNIQUE (name);


--
-- TOC entry 3386 (class 2606 OID 1269450)
-- Name: CardSerie CardSerie_name_key167; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key167" UNIQUE (name);


--
-- TOC entry 3388 (class 2606 OID 1269452)
-- Name: CardSerie CardSerie_name_key168; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key168" UNIQUE (name);


--
-- TOC entry 3390 (class 2606 OID 1269862)
-- Name: CardSerie CardSerie_name_key169; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key169" UNIQUE (name);


--
-- TOC entry 3392 (class 2606 OID 1269492)
-- Name: CardSerie CardSerie_name_key17; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key17" UNIQUE (name);


--
-- TOC entry 3394 (class 2606 OID 1269864)
-- Name: CardSerie CardSerie_name_key170; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key170" UNIQUE (name);


--
-- TOC entry 3396 (class 2606 OID 1269298)
-- Name: CardSerie CardSerie_name_key171; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key171" UNIQUE (name);


--
-- TOC entry 3398 (class 2606 OID 1269296)
-- Name: CardSerie CardSerie_name_key172; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key172" UNIQUE (name);


--
-- TOC entry 3400 (class 2606 OID 1269866)
-- Name: CardSerie CardSerie_name_key173; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key173" UNIQUE (name);


--
-- TOC entry 3402 (class 2606 OID 1269868)
-- Name: CardSerie CardSerie_name_key174; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key174" UNIQUE (name);


--
-- TOC entry 3404 (class 2606 OID 1269870)
-- Name: CardSerie CardSerie_name_key175; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key175" UNIQUE (name);


--
-- TOC entry 3406 (class 2606 OID 1269294)
-- Name: CardSerie CardSerie_name_key176; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key176" UNIQUE (name);


--
-- TOC entry 3408 (class 2606 OID 1269292)
-- Name: CardSerie CardSerie_name_key177; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key177" UNIQUE (name);


--
-- TOC entry 3410 (class 2606 OID 1269872)
-- Name: CardSerie CardSerie_name_key178; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key178" UNIQUE (name);


--
-- TOC entry 3412 (class 2606 OID 1269882)
-- Name: CardSerie CardSerie_name_key179; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key179" UNIQUE (name);


--
-- TOC entry 3414 (class 2606 OID 1269494)
-- Name: CardSerie CardSerie_name_key18; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key18" UNIQUE (name);


--
-- TOC entry 3416 (class 2606 OID 1269506)
-- Name: CardSerie CardSerie_name_key180; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key180" UNIQUE (name);


--
-- TOC entry 3418 (class 2606 OID 1270342)
-- Name: CardSerie CardSerie_name_key181; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key181" UNIQUE (name);


--
-- TOC entry 3420 (class 2606 OID 1269282)
-- Name: CardSerie CardSerie_name_key182; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key182" UNIQUE (name);


--
-- TOC entry 3422 (class 2606 OID 1269838)
-- Name: CardSerie CardSerie_name_key183; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key183" UNIQUE (name);


--
-- TOC entry 3424 (class 2606 OID 1269284)
-- Name: CardSerie CardSerie_name_key184; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key184" UNIQUE (name);


--
-- TOC entry 3426 (class 2606 OID 1269832)
-- Name: CardSerie CardSerie_name_key185; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key185" UNIQUE (name);


--
-- TOC entry 3428 (class 2606 OID 1269834)
-- Name: CardSerie CardSerie_name_key186; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key186" UNIQUE (name);


--
-- TOC entry 3430 (class 2606 OID 1269836)
-- Name: CardSerie CardSerie_name_key187; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key187" UNIQUE (name);


--
-- TOC entry 3432 (class 2606 OID 1269278)
-- Name: CardSerie CardSerie_name_key188; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key188" UNIQUE (name);


--
-- TOC entry 3434 (class 2606 OID 1269356)
-- Name: CardSerie CardSerie_name_key189; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key189" UNIQUE (name);


--
-- TOC entry 3436 (class 2606 OID 1268944)
-- Name: CardSerie CardSerie_name_key19; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key19" UNIQUE (name);


--
-- TOC entry 3438 (class 2606 OID 1269218)
-- Name: CardSerie CardSerie_name_key190; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key190" UNIQUE (name);


--
-- TOC entry 3440 (class 2606 OID 1269238)
-- Name: CardSerie CardSerie_name_key191; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key191" UNIQUE (name);


--
-- TOC entry 3442 (class 2606 OID 1269240)
-- Name: CardSerie CardSerie_name_key192; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key192" UNIQUE (name);


--
-- TOC entry 3444 (class 2606 OID 1269276)
-- Name: CardSerie CardSerie_name_key193; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key193" UNIQUE (name);


--
-- TOC entry 3446 (class 2606 OID 1269274)
-- Name: CardSerie CardSerie_name_key194; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key194" UNIQUE (name);


--
-- TOC entry 3448 (class 2606 OID 1269242)
-- Name: CardSerie CardSerie_name_key195; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key195" UNIQUE (name);


--
-- TOC entry 3450 (class 2606 OID 1269244)
-- Name: CardSerie CardSerie_name_key196; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key196" UNIQUE (name);


--
-- TOC entry 3452 (class 2606 OID 1269246)
-- Name: CardSerie CardSerie_name_key197; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key197" UNIQUE (name);


--
-- TOC entry 3454 (class 2606 OID 1269258)
-- Name: CardSerie CardSerie_name_key198; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key198" UNIQUE (name);


--
-- TOC entry 3456 (class 2606 OID 1268828)
-- Name: CardSerie CardSerie_name_key199; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key199" UNIQUE (name);


--
-- TOC entry 3458 (class 2606 OID 1270278)
-- Name: CardSerie CardSerie_name_key2; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key2" UNIQUE (name);


--
-- TOC entry 3460 (class 2606 OID 1268946)
-- Name: CardSerie CardSerie_name_key20; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key20" UNIQUE (name);


--
-- TOC entry 3462 (class 2606 OID 1268822)
-- Name: CardSerie CardSerie_name_key200; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key200" UNIQUE (name);


--
-- TOC entry 3464 (class 2606 OID 1268824)
-- Name: CardSerie CardSerie_name_key201; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key201" UNIQUE (name);


--
-- TOC entry 3466 (class 2606 OID 1268826)
-- Name: CardSerie CardSerie_name_key202; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key202" UNIQUE (name);


--
-- TOC entry 3468 (class 2606 OID 1269648)
-- Name: CardSerie CardSerie_name_key203; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key203" UNIQUE (name);


--
-- TOC entry 3470 (class 2606 OID 1269718)
-- Name: CardSerie CardSerie_name_key204; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key204" UNIQUE (name);


--
-- TOC entry 3472 (class 2606 OID 1269720)
-- Name: CardSerie CardSerie_name_key205; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key205" UNIQUE (name);


--
-- TOC entry 3474 (class 2606 OID 1268958)
-- Name: CardSerie CardSerie_name_key206; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key206" UNIQUE (name);


--
-- TOC entry 3476 (class 2606 OID 1268960)
-- Name: CardSerie CardSerie_name_key207; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key207" UNIQUE (name);


--
-- TOC entry 3478 (class 2606 OID 1270146)
-- Name: CardSerie CardSerie_name_key208; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key208" UNIQUE (name);


--
-- TOC entry 3480 (class 2606 OID 1269154)
-- Name: CardSerie CardSerie_name_key209; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key209" UNIQUE (name);


--
-- TOC entry 3482 (class 2606 OID 1268948)
-- Name: CardSerie CardSerie_name_key21; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key21" UNIQUE (name);


--
-- TOC entry 3484 (class 2606 OID 1269498)
-- Name: CardSerie CardSerie_name_key210; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key210" UNIQUE (name);


--
-- TOC entry 3486 (class 2606 OID 1269156)
-- Name: CardSerie CardSerie_name_key211; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key211" UNIQUE (name);


--
-- TOC entry 3488 (class 2606 OID 1269158)
-- Name: CardSerie CardSerie_name_key212; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key212" UNIQUE (name);


--
-- TOC entry 3490 (class 2606 OID 1269160)
-- Name: CardSerie CardSerie_name_key213; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key213" UNIQUE (name);


--
-- TOC entry 3492 (class 2606 OID 1269162)
-- Name: CardSerie CardSerie_name_key214; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key214" UNIQUE (name);


--
-- TOC entry 3494 (class 2606 OID 1269496)
-- Name: CardSerie CardSerie_name_key215; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key215" UNIQUE (name);


--
-- TOC entry 3496 (class 2606 OID 1268820)
-- Name: CardSerie CardSerie_name_key216; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key216" UNIQUE (name);


--
-- TOC entry 3498 (class 2606 OID 1268792)
-- Name: CardSerie CardSerie_name_key217; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key217" UNIQUE (name);


--
-- TOC entry 3500 (class 2606 OID 1268794)
-- Name: CardSerie CardSerie_name_key218; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key218" UNIQUE (name);


--
-- TOC entry 3502 (class 2606 OID 1268796)
-- Name: CardSerie CardSerie_name_key219; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key219" UNIQUE (name);


--
-- TOC entry 3504 (class 2606 OID 1270348)
-- Name: CardSerie CardSerie_name_key22; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key22" UNIQUE (name);


--
-- TOC entry 3506 (class 2606 OID 1268818)
-- Name: CardSerie CardSerie_name_key220; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key220" UNIQUE (name);


--
-- TOC entry 3508 (class 2606 OID 1269202)
-- Name: CardSerie CardSerie_name_key221; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key221" UNIQUE (name);


--
-- TOC entry 3510 (class 2606 OID 1270060)
-- Name: CardSerie CardSerie_name_key222; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key222" UNIQUE (name);


--
-- TOC entry 3512 (class 2606 OID 1270396)
-- Name: CardSerie CardSerie_name_key223; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key223" UNIQUE (name);


--
-- TOC entry 3514 (class 2606 OID 1270398)
-- Name: CardSerie CardSerie_name_key224; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key224" UNIQUE (name);


--
-- TOC entry 3516 (class 2606 OID 1269200)
-- Name: CardSerie CardSerie_name_key225; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key225" UNIQUE (name);


--
-- TOC entry 3518 (class 2606 OID 1270400)
-- Name: CardSerie CardSerie_name_key226; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key226" UNIQUE (name);


--
-- TOC entry 3520 (class 2606 OID 1269630)
-- Name: CardSerie CardSerie_name_key227; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key227" UNIQUE (name);


--
-- TOC entry 3522 (class 2606 OID 1269198)
-- Name: CardSerie CardSerie_name_key228; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key228" UNIQUE (name);


--
-- TOC entry 3524 (class 2606 OID 1269012)
-- Name: CardSerie CardSerie_name_key229; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key229" UNIQUE (name);


--
-- TOC entry 3526 (class 2606 OID 1268950)
-- Name: CardSerie CardSerie_name_key23; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key23" UNIQUE (name);


--
-- TOC entry 3528 (class 2606 OID 1270008)
-- Name: CardSerie CardSerie_name_key230; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key230" UNIQUE (name);


--
-- TOC entry 3530 (class 2606 OID 1269008)
-- Name: CardSerie CardSerie_name_key231; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key231" UNIQUE (name);


--
-- TOC entry 3532 (class 2606 OID 1269010)
-- Name: CardSerie CardSerie_name_key232; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key232" UNIQUE (name);


--
-- TOC entry 3534 (class 2606 OID 1269880)
-- Name: CardSerie CardSerie_name_key233; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key233" UNIQUE (name);


--
-- TOC entry 3536 (class 2606 OID 1269874)
-- Name: CardSerie CardSerie_name_key234; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key234" UNIQUE (name);


--
-- TOC entry 3538 (class 2606 OID 1269876)
-- Name: CardSerie CardSerie_name_key235; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key235" UNIQUE (name);


--
-- TOC entry 3540 (class 2606 OID 1269878)
-- Name: CardSerie CardSerie_name_key236; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key236" UNIQUE (name);


--
-- TOC entry 3542 (class 2606 OID 1270404)
-- Name: CardSerie CardSerie_name_key237; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key237" UNIQUE (name);


--
-- TOC entry 3544 (class 2606 OID 1268892)
-- Name: CardSerie CardSerie_name_key238; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key238" UNIQUE (name);


--
-- TOC entry 3546 (class 2606 OID 1268894)
-- Name: CardSerie CardSerie_name_key239; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key239" UNIQUE (name);


--
-- TOC entry 3548 (class 2606 OID 1270346)
-- Name: CardSerie CardSerie_name_key24; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key24" UNIQUE (name);


--
-- TOC entry 3550 (class 2606 OID 1268896)
-- Name: CardSerie CardSerie_name_key240; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key240" UNIQUE (name);


--
-- TOC entry 3552 (class 2606 OID 1269272)
-- Name: CardSerie CardSerie_name_key241; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key241" UNIQUE (name);


--
-- TOC entry 3554 (class 2606 OID 1269266)
-- Name: CardSerie CardSerie_name_key242; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key242" UNIQUE (name);


--
-- TOC entry 3556 (class 2606 OID 1269268)
-- Name: CardSerie CardSerie_name_key243; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key243" UNIQUE (name);


--
-- TOC entry 3558 (class 2606 OID 1269270)
-- Name: CardSerie CardSerie_name_key244; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key244" UNIQUE (name);


--
-- TOC entry 3560 (class 2606 OID 1269856)
-- Name: CardSerie CardSerie_name_key245; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key245" UNIQUE (name);


--
-- TOC entry 3562 (class 2606 OID 1269206)
-- Name: CardSerie CardSerie_name_key246; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key246" UNIQUE (name);


--
-- TOC entry 3564 (class 2606 OID 1269208)
-- Name: CardSerie CardSerie_name_key247; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key247" UNIQUE (name);


--
-- TOC entry 3566 (class 2606 OID 1269210)
-- Name: CardSerie CardSerie_name_key248; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key248" UNIQUE (name);


--
-- TOC entry 3568 (class 2606 OID 1269490)
-- Name: CardSerie CardSerie_name_key249; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key249" UNIQUE (name);


--
-- TOC entry 3570 (class 2606 OID 1269502)
-- Name: CardSerie CardSerie_name_key25; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key25" UNIQUE (name);


--
-- TOC entry 3572 (class 2606 OID 1269634)
-- Name: CardSerie CardSerie_name_key250; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key250" UNIQUE (name);


--
-- TOC entry 3574 (class 2606 OID 1269484)
-- Name: CardSerie CardSerie_name_key251; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key251" UNIQUE (name);


--
-- TOC entry 3576 (class 2606 OID 1269486)
-- Name: CardSerie CardSerie_name_key252; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key252" UNIQUE (name);


--
-- TOC entry 3578 (class 2606 OID 1269488)
-- Name: CardSerie CardSerie_name_key253; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key253" UNIQUE (name);


--
-- TOC entry 3580 (class 2606 OID 1269366)
-- Name: CardSerie CardSerie_name_key254; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key254" UNIQUE (name);


--
-- TOC entry 3582 (class 2606 OID 1268966)
-- Name: CardSerie CardSerie_name_key255; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key255" UNIQUE (name);


--
-- TOC entry 3584 (class 2606 OID 1269368)
-- Name: CardSerie CardSerie_name_key256; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key256" UNIQUE (name);


--
-- TOC entry 3586 (class 2606 OID 1269370)
-- Name: CardSerie CardSerie_name_key257; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key257" UNIQUE (name);


--
-- TOC entry 3588 (class 2606 OID 1268964)
-- Name: CardSerie CardSerie_name_key258; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key258" UNIQUE (name);


--
-- TOC entry 3590 (class 2606 OID 1270232)
-- Name: CardSerie CardSerie_name_key259; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key259" UNIQUE (name);


--
-- TOC entry 3592 (class 2606 OID 1269504)
-- Name: CardSerie CardSerie_name_key26; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key26" UNIQUE (name);


--
-- TOC entry 3594 (class 2606 OID 1270234)
-- Name: CardSerie CardSerie_name_key260; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key260" UNIQUE (name);


--
-- TOC entry 3596 (class 2606 OID 1268962)
-- Name: CardSerie CardSerie_name_key261; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key261" UNIQUE (name);


--
-- TOC entry 3598 (class 2606 OID 1270236)
-- Name: CardSerie CardSerie_name_key262; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key262" UNIQUE (name);


--
-- TOC entry 3600 (class 2606 OID 1269808)
-- Name: CardSerie CardSerie_name_key263; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key263" UNIQUE (name);


--
-- TOC entry 3602 (class 2606 OID 1269320)
-- Name: CardSerie CardSerie_name_key264; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key264" UNIQUE (name);


--
-- TOC entry 3604 (class 2606 OID 1269322)
-- Name: CardSerie CardSerie_name_key265; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key265" UNIQUE (name);


--
-- TOC entry 3606 (class 2606 OID 1269324)
-- Name: CardSerie CardSerie_name_key266; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key266" UNIQUE (name);


--
-- TOC entry 3608 (class 2606 OID 1269806)
-- Name: CardSerie CardSerie_name_key267; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key267" UNIQUE (name);


--
-- TOC entry 3610 (class 2606 OID 1269326)
-- Name: CardSerie CardSerie_name_key268; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key268" UNIQUE (name);


--
-- TOC entry 3612 (class 2606 OID 1269328)
-- Name: CardSerie CardSerie_name_key269; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key269" UNIQUE (name);


--
-- TOC entry 3614 (class 2606 OID 1269534)
-- Name: CardSerie CardSerie_name_key27; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key27" UNIQUE (name);


--
-- TOC entry 3616 (class 2606 OID 1269330)
-- Name: CardSerie CardSerie_name_key270; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key270" UNIQUE (name);


--
-- TOC entry 3618 (class 2606 OID 1269332)
-- Name: CardSerie CardSerie_name_key271; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key271" UNIQUE (name);


--
-- TOC entry 3620 (class 2606 OID 1270020)
-- Name: CardSerie CardSerie_name_key272; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key272" UNIQUE (name);


--
-- TOC entry 3622 (class 2606 OID 1269646)
-- Name: CardSerie CardSerie_name_key273; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key273" UNIQUE (name);


--
-- TOC entry 3624 (class 2606 OID 1268898)
-- Name: CardSerie CardSerie_name_key274; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key274" UNIQUE (name);


--
-- TOC entry 3626 (class 2606 OID 1268900)
-- Name: CardSerie CardSerie_name_key275; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key275" UNIQUE (name);


--
-- TOC entry 3628 (class 2606 OID 1268902)
-- Name: CardSerie CardSerie_name_key276; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key276" UNIQUE (name);


--
-- TOC entry 3630 (class 2606 OID 1269644)
-- Name: CardSerie CardSerie_name_key277; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key277" UNIQUE (name);


--
-- TOC entry 3632 (class 2606 OID 1268904)
-- Name: CardSerie CardSerie_name_key278; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key278" UNIQUE (name);


--
-- TOC entry 3634 (class 2606 OID 1268906)
-- Name: CardSerie CardSerie_name_key279; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key279" UNIQUE (name);


--
-- TOC entry 3636 (class 2606 OID 1269536)
-- Name: CardSerie CardSerie_name_key28; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key28" UNIQUE (name);


--
-- TOC entry 3638 (class 2606 OID 1268908)
-- Name: CardSerie CardSerie_name_key280; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key280" UNIQUE (name);


--
-- TOC entry 3640 (class 2606 OID 1269642)
-- Name: CardSerie CardSerie_name_key281; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key281" UNIQUE (name);


--
-- TOC entry 3642 (class 2606 OID 1268910)
-- Name: CardSerie CardSerie_name_key282; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key282" UNIQUE (name);


--
-- TOC entry 3644 (class 2606 OID 1269636)
-- Name: CardSerie CardSerie_name_key283; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key283" UNIQUE (name);


--
-- TOC entry 3646 (class 2606 OID 1269638)
-- Name: CardSerie CardSerie_name_key284; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key284" UNIQUE (name);


--
-- TOC entry 3648 (class 2606 OID 1269640)
-- Name: CardSerie CardSerie_name_key285; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key285" UNIQUE (name);


--
-- TOC entry 3650 (class 2606 OID 1270180)
-- Name: CardSerie CardSerie_name_key286; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key286" UNIQUE (name);


--
-- TOC entry 3652 (class 2606 OID 1269978)
-- Name: CardSerie CardSerie_name_key287; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key287" UNIQUE (name);


--
-- TOC entry 3654 (class 2606 OID 1269980)
-- Name: CardSerie CardSerie_name_key288; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key288" UNIQUE (name);


--
-- TOC entry 3656 (class 2606 OID 1270178)
-- Name: CardSerie CardSerie_name_key289; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key289" UNIQUE (name);


--
-- TOC entry 3658 (class 2606 OID 1269538)
-- Name: CardSerie CardSerie_name_key29; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key29" UNIQUE (name);


--
-- TOC entry 3660 (class 2606 OID 1269290)
-- Name: CardSerie CardSerie_name_key290; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key290" UNIQUE (name);


--
-- TOC entry 3662 (class 2606 OID 1270002)
-- Name: CardSerie CardSerie_name_key291; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key291" UNIQUE (name);


--
-- TOC entry 3664 (class 2606 OID 1270004)
-- Name: CardSerie CardSerie_name_key292; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key292" UNIQUE (name);


--
-- TOC entry 3666 (class 2606 OID 1268848)
-- Name: CardSerie CardSerie_name_key293; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key293" UNIQUE (name);


--
-- TOC entry 3668 (class 2606 OID 1270374)
-- Name: CardSerie CardSerie_name_key294; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key294" UNIQUE (name);


--
-- TOC entry 3670 (class 2606 OID 1270376)
-- Name: CardSerie CardSerie_name_key295; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key295" UNIQUE (name);


--
-- TOC entry 3672 (class 2606 OID 1270378)
-- Name: CardSerie CardSerie_name_key296; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key296" UNIQUE (name);


--
-- TOC entry 3674 (class 2606 OID 1270034)
-- Name: CardSerie CardSerie_name_key297; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key297" UNIQUE (name);


--
-- TOC entry 3676 (class 2606 OID 1270138)
-- Name: CardSerie CardSerie_name_key298; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key298" UNIQUE (name);


--
-- TOC entry 3678 (class 2606 OID 1270230)
-- Name: CardSerie CardSerie_name_key299; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key299" UNIQUE (name);


--
-- TOC entry 3680 (class 2606 OID 1269776)
-- Name: CardSerie CardSerie_name_key3; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key3" UNIQUE (name);


--
-- TOC entry 3682 (class 2606 OID 1270148)
-- Name: CardSerie CardSerie_name_key30; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key30" UNIQUE (name);


--
-- TOC entry 3684 (class 2606 OID 1269826)
-- Name: CardSerie CardSerie_name_key300; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key300" UNIQUE (name);


--
-- TOC entry 3686 (class 2606 OID 1270006)
-- Name: CardSerie CardSerie_name_key301; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key301" UNIQUE (name);


--
-- TOC entry 3688 (class 2606 OID 1269194)
-- Name: CardSerie CardSerie_name_key302; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key302" UNIQUE (name);


--
-- TOC entry 3690 (class 2606 OID 1269818)
-- Name: CardSerie CardSerie_name_key303; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key303" UNIQUE (name);


--
-- TOC entry 3692 (class 2606 OID 1269196)
-- Name: CardSerie CardSerie_name_key304; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key304" UNIQUE (name);


--
-- TOC entry 3694 (class 2606 OID 1269686)
-- Name: CardSerie CardSerie_name_key305; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key305" UNIQUE (name);


--
-- TOC entry 3696 (class 2606 OID 1269628)
-- Name: CardSerie CardSerie_name_key306; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key306" UNIQUE (name);


--
-- TOC entry 3698 (class 2606 OID 1269688)
-- Name: CardSerie CardSerie_name_key307; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key307" UNIQUE (name);


--
-- TOC entry 3700 (class 2606 OID 1269694)
-- Name: CardSerie CardSerie_name_key308; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key308" UNIQUE (name);


--
-- TOC entry 3702 (class 2606 OID 1269690)
-- Name: CardSerie CardSerie_name_key309; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key309" UNIQUE (name);


--
-- TOC entry 3704 (class 2606 OID 1268916)
-- Name: CardSerie CardSerie_name_key31; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key31" UNIQUE (name);


--
-- TOC entry 3706 (class 2606 OID 1269692)
-- Name: CardSerie CardSerie_name_key310; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key310" UNIQUE (name);


--
-- TOC entry 3708 (class 2606 OID 1269286)
-- Name: CardSerie CardSerie_name_key311; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key311" UNIQUE (name);


--
-- TOC entry 3710 (class 2606 OID 1270176)
-- Name: CardSerie CardSerie_name_key312; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key312" UNIQUE (name);


--
-- TOC entry 3712 (class 2606 OID 1269288)
-- Name: CardSerie CardSerie_name_key313; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key313" UNIQUE (name);


--
-- TOC entry 3714 (class 2606 OID 1269406)
-- Name: CardSerie CardSerie_name_key314; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key314" UNIQUE (name);


--
-- TOC entry 3716 (class 2606 OID 1270174)
-- Name: CardSerie CardSerie_name_key315; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key315" UNIQUE (name);


--
-- TOC entry 3718 (class 2606 OID 1269408)
-- Name: CardSerie CardSerie_name_key316; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key316" UNIQUE (name);


--
-- TOC entry 3720 (class 2606 OID 1270172)
-- Name: CardSerie CardSerie_name_key317; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key317" UNIQUE (name);


--
-- TOC entry 3722 (class 2606 OID 1269410)
-- Name: CardSerie CardSerie_name_key318; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key318" UNIQUE (name);


--
-- TOC entry 3724 (class 2606 OID 1269412)
-- Name: CardSerie CardSerie_name_key319; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key319" UNIQUE (name);


--
-- TOC entry 3726 (class 2606 OID 1270344)
-- Name: CardSerie CardSerie_name_key32; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key32" UNIQUE (name);


--
-- TOC entry 3728 (class 2606 OID 1269414)
-- Name: CardSerie CardSerie_name_key320; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key320" UNIQUE (name);


--
-- TOC entry 3730 (class 2606 OID 1270170)
-- Name: CardSerie CardSerie_name_key321; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key321" UNIQUE (name);


--
-- TOC entry 3732 (class 2606 OID 1269426)
-- Name: CardSerie CardSerie_name_key322; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key322" UNIQUE (name);


--
-- TOC entry 3734 (class 2606 OID 1269416)
-- Name: CardSerie CardSerie_name_key323; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key323" UNIQUE (name);


--
-- TOC entry 3736 (class 2606 OID 1269418)
-- Name: CardSerie CardSerie_name_key324; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key324" UNIQUE (name);


--
-- TOC entry 3738 (class 2606 OID 1269424)
-- Name: CardSerie CardSerie_name_key325; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key325" UNIQUE (name);


--
-- TOC entry 3740 (class 2606 OID 1269420)
-- Name: CardSerie CardSerie_name_key326; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key326" UNIQUE (name);


--
-- TOC entry 3742 (class 2606 OID 1269422)
-- Name: CardSerie CardSerie_name_key327; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key327" UNIQUE (name);


--
-- TOC entry 3744 (class 2606 OID 1269680)
-- Name: CardSerie CardSerie_name_key328; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key328" UNIQUE (name);


--
-- TOC entry 3746 (class 2606 OID 1269182)
-- Name: CardSerie CardSerie_name_key329; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key329" UNIQUE (name);


--
-- TOC entry 3748 (class 2606 OID 1270014)
-- Name: CardSerie CardSerie_name_key33; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key33" UNIQUE (name);


--
-- TOC entry 3750 (class 2606 OID 1269184)
-- Name: CardSerie CardSerie_name_key330; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key330" UNIQUE (name);


--
-- TOC entry 3752 (class 2606 OID 1269678)
-- Name: CardSerie CardSerie_name_key331; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key331" UNIQUE (name);


--
-- TOC entry 3754 (class 2606 OID 1269382)
-- Name: CardSerie CardSerie_name_key332; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key332" UNIQUE (name);


--
-- TOC entry 3756 (class 2606 OID 1269220)
-- Name: CardSerie CardSerie_name_key333; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key333" UNIQUE (name);


--
-- TOC entry 3758 (class 2606 OID 1269222)
-- Name: CardSerie CardSerie_name_key334; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key334" UNIQUE (name);


--
-- TOC entry 3760 (class 2606 OID 1269380)
-- Name: CardSerie CardSerie_name_key335; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key335" UNIQUE (name);


--
-- TOC entry 3762 (class 2606 OID 1269376)
-- Name: CardSerie CardSerie_name_key336; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key336" UNIQUE (name);


--
-- TOC entry 3764 (class 2606 OID 1269378)
-- Name: CardSerie CardSerie_name_key337; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key337" UNIQUE (name);


--
-- TOC entry 3766 (class 2606 OID 1269854)
-- Name: CardSerie CardSerie_name_key338; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key338" UNIQUE (name);


--
-- TOC entry 3768 (class 2606 OID 1269850)
-- Name: CardSerie CardSerie_name_key339; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key339" UNIQUE (name);


--
-- TOC entry 3770 (class 2606 OID 1270016)
-- Name: CardSerie CardSerie_name_key34; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key34" UNIQUE (name);


--
-- TOC entry 3772 (class 2606 OID 1269852)
-- Name: CardSerie CardSerie_name_key340; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key340" UNIQUE (name);


--
-- TOC entry 3774 (class 2606 OID 1270000)
-- Name: CardSerie CardSerie_name_key341; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key341" UNIQUE (name);


--
-- TOC entry 3776 (class 2606 OID 1268850)
-- Name: CardSerie CardSerie_name_key342; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key342" UNIQUE (name);


--
-- TOC entry 3778 (class 2606 OID 1269998)
-- Name: CardSerie CardSerie_name_key343; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key343" UNIQUE (name);


--
-- TOC entry 3780 (class 2606 OID 1269264)
-- Name: CardSerie CardSerie_name_key344; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key344" UNIQUE (name);


--
-- TOC entry 3782 (class 2606 OID 1269260)
-- Name: CardSerie CardSerie_name_key345; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key345" UNIQUE (name);


--
-- TOC entry 3784 (class 2606 OID 1269262)
-- Name: CardSerie CardSerie_name_key346; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key346" UNIQUE (name);


--
-- TOC entry 3786 (class 2606 OID 1269352)
-- Name: CardSerie CardSerie_name_key347; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key347" UNIQUE (name);


--
-- TOC entry 3788 (class 2606 OID 1269346)
-- Name: CardSerie CardSerie_name_key348; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key348" UNIQUE (name);


--
-- TOC entry 3790 (class 2606 OID 1269348)
-- Name: CardSerie CardSerie_name_key349; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key349" UNIQUE (name);


--
-- TOC entry 3792 (class 2606 OID 1270372)
-- Name: CardSerie CardSerie_name_key35; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key35" UNIQUE (name);


--
-- TOC entry 3794 (class 2606 OID 1269350)
-- Name: CardSerie CardSerie_name_key350; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key350" UNIQUE (name);


--
-- TOC entry 3796 (class 2606 OID 1270402)
-- Name: CardSerie CardSerie_name_key351; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key351" UNIQUE (name);


--
-- TOC entry 3798 (class 2606 OID 1269816)
-- Name: CardSerie CardSerie_name_key352; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key352" UNIQUE (name);


--
-- TOC entry 3800 (class 2606 OID 1269810)
-- Name: CardSerie CardSerie_name_key353; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key353" UNIQUE (name);


--
-- TOC entry 3802 (class 2606 OID 1269812)
-- Name: CardSerie CardSerie_name_key354; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key354" UNIQUE (name);


--
-- TOC entry 3804 (class 2606 OID 1269814)
-- Name: CardSerie CardSerie_name_key355; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key355" UNIQUE (name);


--
-- TOC entry 3806 (class 2606 OID 1268778)
-- Name: CardSerie CardSerie_name_key356; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key356" UNIQUE (name);


--
-- TOC entry 3808 (class 2606 OID 1269970)
-- Name: CardSerie CardSerie_name_key357; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key357" UNIQUE (name);


--
-- TOC entry 3810 (class 2606 OID 1268780)
-- Name: CardSerie CardSerie_name_key358; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key358" UNIQUE (name);


--
-- TOC entry 3812 (class 2606 OID 1268782)
-- Name: CardSerie CardSerie_name_key359; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key359" UNIQUE (name);


--
-- TOC entry 3814 (class 2606 OID 1270018)
-- Name: CardSerie CardSerie_name_key36; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key36" UNIQUE (name);


--
-- TOC entry 3816 (class 2606 OID 1269964)
-- Name: CardSerie CardSerie_name_key360; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key360" UNIQUE (name);


--
-- TOC entry 3818 (class 2606 OID 1269966)
-- Name: CardSerie CardSerie_name_key361; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key361" UNIQUE (name);


--
-- TOC entry 3820 (class 2606 OID 1269968)
-- Name: CardSerie CardSerie_name_key362; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key362" UNIQUE (name);


--
-- TOC entry 3822 (class 2606 OID 1270144)
-- Name: CardSerie CardSerie_name_key363; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key363" UNIQUE (name);


--
-- TOC entry 3824 (class 2606 OID 1269342)
-- Name: CardSerie CardSerie_name_key364; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key364" UNIQUE (name);


--
-- TOC entry 3826 (class 2606 OID 1269540)
-- Name: CardSerie CardSerie_name_key365; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key365" UNIQUE (name);


--
-- TOC entry 3828 (class 2606 OID 1269542)
-- Name: CardSerie CardSerie_name_key366; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key366" UNIQUE (name);


--
-- TOC entry 3830 (class 2606 OID 1269340)
-- Name: CardSerie CardSerie_name_key367; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key367" UNIQUE (name);


--
-- TOC entry 3832 (class 2606 OID 1269544)
-- Name: CardSerie CardSerie_name_key368; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key368" UNIQUE (name);


--
-- TOC entry 3834 (class 2606 OID 1269546)
-- Name: CardSerie CardSerie_name_key369; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key369" UNIQUE (name);


--
-- TOC entry 3836 (class 2606 OID 1270022)
-- Name: CardSerie CardSerie_name_key37; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key37" UNIQUE (name);


--
-- TOC entry 3838 (class 2606 OID 1269338)
-- Name: CardSerie CardSerie_name_key370; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key370" UNIQUE (name);


--
-- TOC entry 3840 (class 2606 OID 1270110)
-- Name: CardSerie CardSerie_name_key371; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key371" UNIQUE (name);


--
-- TOC entry 3842 (class 2606 OID 1270100)
-- Name: CardSerie CardSerie_name_key372; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key372" UNIQUE (name);


--
-- TOC entry 3844 (class 2606 OID 1270102)
-- Name: CardSerie CardSerie_name_key373; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key373" UNIQUE (name);


--
-- TOC entry 3846 (class 2606 OID 1270108)
-- Name: CardSerie CardSerie_name_key374; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key374" UNIQUE (name);


--
-- TOC entry 3848 (class 2606 OID 1270104)
-- Name: CardSerie CardSerie_name_key375; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key375" UNIQUE (name);


--
-- TOC entry 3850 (class 2606 OID 1270106)
-- Name: CardSerie CardSerie_name_key376; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key376" UNIQUE (name);


--
-- TOC entry 3852 (class 2606 OID 1268806)
-- Name: CardSerie CardSerie_name_key377; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key377" UNIQUE (name);


--
-- TOC entry 3854 (class 2606 OID 1268816)
-- Name: CardSerie CardSerie_name_key378; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key378" UNIQUE (name);


--
-- TOC entry 3856 (class 2606 OID 1268808)
-- Name: CardSerie CardSerie_name_key379; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key379" UNIQUE (name);


--
-- TOC entry 3858 (class 2606 OID 1269556)
-- Name: CardSerie CardSerie_name_key38; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key38" UNIQUE (name);


--
-- TOC entry 3860 (class 2606 OID 1268810)
-- Name: CardSerie CardSerie_name_key380; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key380" UNIQUE (name);


--
-- TOC entry 3862 (class 2606 OID 1268812)
-- Name: CardSerie CardSerie_name_key381; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key381" UNIQUE (name);


--
-- TOC entry 3864 (class 2606 OID 1268814)
-- Name: CardSerie CardSerie_name_key382; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key382" UNIQUE (name);


--
-- TOC entry 3866 (class 2606 OID 1269192)
-- Name: CardSerie CardSerie_name_key383; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key383" UNIQUE (name);


--
-- TOC entry 3868 (class 2606 OID 1270112)
-- Name: CardSerie CardSerie_name_key384; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key384" UNIQUE (name);


--
-- TOC entry 3870 (class 2606 OID 1270114)
-- Name: CardSerie CardSerie_name_key385; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key385" UNIQUE (name);


--
-- TOC entry 3872 (class 2606 OID 1269190)
-- Name: CardSerie CardSerie_name_key386; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key386" UNIQUE (name);


--
-- TOC entry 3874 (class 2606 OID 1269186)
-- Name: CardSerie CardSerie_name_key387; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key387" UNIQUE (name);


--
-- TOC entry 3876 (class 2606 OID 1269188)
-- Name: CardSerie CardSerie_name_key388; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key388" UNIQUE (name);


--
-- TOC entry 3878 (class 2606 OID 1268854)
-- Name: CardSerie CardSerie_name_key389; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key389" UNIQUE (name);


--
-- TOC entry 3880 (class 2606 OID 1270332)
-- Name: CardSerie CardSerie_name_key39; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key39" UNIQUE (name);


--
-- TOC entry 3882 (class 2606 OID 1269314)
-- Name: CardSerie CardSerie_name_key390; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key390" UNIQUE (name);


--
-- TOC entry 3884 (class 2606 OID 1268852)
-- Name: CardSerie CardSerie_name_key391; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key391" UNIQUE (name);


--
-- TOC entry 3886 (class 2606 OID 1269794)
-- Name: CardSerie CardSerie_name_key392; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key392" UNIQUE (name);


--
-- TOC entry 3888 (class 2606 OID 1269780)
-- Name: CardSerie CardSerie_name_key393; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key393" UNIQUE (name);


--
-- TOC entry 3890 (class 2606 OID 1269782)
-- Name: CardSerie CardSerie_name_key394; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key394" UNIQUE (name);


--
-- TOC entry 3892 (class 2606 OID 1269784)
-- Name: CardSerie CardSerie_name_key395; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key395" UNIQUE (name);


--
-- TOC entry 3894 (class 2606 OID 1269684)
-- Name: CardSerie CardSerie_name_key396; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key396" UNIQUE (name);


--
-- TOC entry 3896 (class 2606 OID 1270092)
-- Name: CardSerie CardSerie_name_key397; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key397" UNIQUE (name);


--
-- TOC entry 3898 (class 2606 OID 1268756)
-- Name: CardSerie CardSerie_name_key398; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key398" UNIQUE (name);


--
-- TOC entry 3900 (class 2606 OID 1269682)
-- Name: CardSerie CardSerie_name_key399; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key399" UNIQUE (name);


--
-- TOC entry 3902 (class 2606 OID 1269778)
-- Name: CardSerie CardSerie_name_key4; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key4" UNIQUE (name);


--
-- TOC entry 3904 (class 2606 OID 1269312)
-- Name: CardSerie CardSerie_name_key40; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key40" UNIQUE (name);


--
-- TOC entry 3906 (class 2606 OID 1268758)
-- Name: CardSerie CardSerie_name_key400; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key400" UNIQUE (name);


--
-- TOC entry 3908 (class 2606 OID 1269000)
-- Name: CardSerie CardSerie_name_key401; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key401" UNIQUE (name);


--
-- TOC entry 3910 (class 2606 OID 1269006)
-- Name: CardSerie CardSerie_name_key402; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key402" UNIQUE (name);


--
-- TOC entry 3912 (class 2606 OID 1269002)
-- Name: CardSerie CardSerie_name_key403; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key403" UNIQUE (name);


--
-- TOC entry 3914 (class 2606 OID 1269004)
-- Name: CardSerie CardSerie_name_key404; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key404" UNIQUE (name);


--
-- TOC entry 3916 (class 2606 OID 1269824)
-- Name: CardSerie CardSerie_name_key405; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key405" UNIQUE (name);


--
-- TOC entry 3918 (class 2606 OID 1269820)
-- Name: CardSerie CardSerie_name_key406; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key406" UNIQUE (name);


--
-- TOC entry 3920 (class 2606 OID 1269822)
-- Name: CardSerie CardSerie_name_key407; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key407" UNIQUE (name);


--
-- TOC entry 3922 (class 2606 OID 1270268)
-- Name: CardSerie CardSerie_name_key408; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key408" UNIQUE (name);


--
-- TOC entry 3924 (class 2606 OID 1269626)
-- Name: CardSerie CardSerie_name_key409; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key409" UNIQUE (name);


--
-- TOC entry 3926 (class 2606 OID 1270412)
-- Name: CardSerie CardSerie_name_key41; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key41" UNIQUE (name);


--
-- TOC entry 3928 (class 2606 OID 1268772)
-- Name: CardSerie CardSerie_name_key410; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key410" UNIQUE (name);


--
-- TOC entry 3930 (class 2606 OID 1270266)
-- Name: CardSerie CardSerie_name_key411; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key411" UNIQUE (name);


--
-- TOC entry 3932 (class 2606 OID 1269956)
-- Name: CardSerie CardSerie_name_key412; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key412" UNIQUE (name);


--
-- TOC entry 3934 (class 2606 OID 1270210)
-- Name: CardSerie CardSerie_name_key413; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key413" UNIQUE (name);


--
-- TOC entry 3936 (class 2606 OID 1270212)
-- Name: CardSerie CardSerie_name_key414; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key414" UNIQUE (name);


--
-- TOC entry 3938 (class 2606 OID 1269224)
-- Name: CardSerie CardSerie_name_key415; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key415" UNIQUE (name);


--
-- TOC entry 3940 (class 2606 OID 1270214)
-- Name: CardSerie CardSerie_name_key416; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key416" UNIQUE (name);


--
-- TOC entry 3942 (class 2606 OID 1270216)
-- Name: CardSerie CardSerie_name_key417; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key417" UNIQUE (name);


--
-- TOC entry 3944 (class 2606 OID 1270218)
-- Name: CardSerie CardSerie_name_key418; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key418" UNIQUE (name);


--
-- TOC entry 3946 (class 2606 OID 1270080)
-- Name: CardSerie CardSerie_name_key419; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key419" UNIQUE (name);


--
-- TOC entry 3948 (class 2606 OID 1270410)
-- Name: CardSerie CardSerie_name_key42; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key42" UNIQUE (name);


--
-- TOC entry 3950 (class 2606 OID 1270312)
-- Name: CardSerie CardSerie_name_key420; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key420" UNIQUE (name);


--
-- TOC entry 3952 (class 2606 OID 1270314)
-- Name: CardSerie CardSerie_name_key421; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key421" UNIQUE (name);


--
-- TOC entry 3954 (class 2606 OID 1270078)
-- Name: CardSerie CardSerie_name_key422; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key422" UNIQUE (name);


--
-- TOC entry 3956 (class 2606 OID 1270076)
-- Name: CardSerie CardSerie_name_key423; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key423" UNIQUE (name);


--
-- TOC entry 3958 (class 2606 OID 1270316)
-- Name: CardSerie CardSerie_name_key424; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key424" UNIQUE (name);


--
-- TOC entry 3960 (class 2606 OID 1270318)
-- Name: CardSerie CardSerie_name_key425; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key425" UNIQUE (name);


--
-- TOC entry 3962 (class 2606 OID 1270074)
-- Name: CardSerie CardSerie_name_key426; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key426" UNIQUE (name);


--
-- TOC entry 3964 (class 2606 OID 1270320)
-- Name: CardSerie CardSerie_name_key427; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key427" UNIQUE (name);


--
-- TOC entry 3966 (class 2606 OID 1269372)
-- Name: CardSerie CardSerie_name_key428; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key428" UNIQUE (name);


--
-- TOC entry 3968 (class 2606 OID 1269954)
-- Name: CardSerie CardSerie_name_key429; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key429" UNIQUE (name);


--
-- TOC entry 3970 (class 2606 OID 1268856)
-- Name: CardSerie CardSerie_name_key43; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key43" UNIQUE (name);


--
-- TOC entry 3972 (class 2606 OID 1269552)
-- Name: CardSerie CardSerie_name_key430; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key430" UNIQUE (name);


--
-- TOC entry 3974 (class 2606 OID 1270292)
-- Name: CardSerie CardSerie_name_key431; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key431" UNIQUE (name);


--
-- TOC entry 3976 (class 2606 OID 1270330)
-- Name: CardSerie CardSerie_name_key432; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key432" UNIQUE (name);


--
-- TOC entry 3978 (class 2606 OID 1270294)
-- Name: CardSerie CardSerie_name_key433; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key433" UNIQUE (name);


--
-- TOC entry 3980 (class 2606 OID 1270296)
-- Name: CardSerie CardSerie_name_key434; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key434" UNIQUE (name);


--
-- TOC entry 3982 (class 2606 OID 1270328)
-- Name: CardSerie CardSerie_name_key435; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key435" UNIQUE (name);


--
-- TOC entry 3984 (class 2606 OID 1270298)
-- Name: CardSerie CardSerie_name_key436; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key436" UNIQUE (name);


--
-- TOC entry 3986 (class 2606 OID 1270158)
-- Name: CardSerie CardSerie_name_key437; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key437" UNIQUE (name);


--
-- TOC entry 3988 (class 2606 OID 1270160)
-- Name: CardSerie CardSerie_name_key438; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key438" UNIQUE (name);


--
-- TOC entry 3990 (class 2606 OID 1270162)
-- Name: CardSerie CardSerie_name_key439; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key439" UNIQUE (name);


--
-- TOC entry 3992 (class 2606 OID 1268858)
-- Name: CardSerie CardSerie_name_key44; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key44" UNIQUE (name);


--
-- TOC entry 3994 (class 2606 OID 1270164)
-- Name: CardSerie CardSerie_name_key440; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key440" UNIQUE (name);


--
-- TOC entry 3996 (class 2606 OID 1270326)
-- Name: CardSerie CardSerie_name_key441; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key441" UNIQUE (name);


--
-- TOC entry 3998 (class 2606 OID 1270166)
-- Name: CardSerie CardSerie_name_key442; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key442" UNIQUE (name);


--
-- TOC entry 4000 (class 2606 OID 1269588)
-- Name: CardSerie CardSerie_name_key443; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key443" UNIQUE (name);


--
-- TOC entry 4002 (class 2606 OID 1269590)
-- Name: CardSerie CardSerie_name_key444; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key444" UNIQUE (name);


--
-- TOC entry 4004 (class 2606 OID 1269592)
-- Name: CardSerie CardSerie_name_key445; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key445" UNIQUE (name);


--
-- TOC entry 4006 (class 2606 OID 1270324)
-- Name: CardSerie CardSerie_name_key446; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key446" UNIQUE (name);


--
-- TOC entry 4008 (class 2606 OID 1269398)
-- Name: CardSerie CardSerie_name_key447; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key447" UNIQUE (name);


--
-- TOC entry 4010 (class 2606 OID 1269400)
-- Name: CardSerie CardSerie_name_key448; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key448" UNIQUE (name);


--
-- TOC entry 4012 (class 2606 OID 1270322)
-- Name: CardSerie CardSerie_name_key449; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key449" UNIQUE (name);


--
-- TOC entry 4014 (class 2606 OID 1268860)
-- Name: CardSerie CardSerie_name_key45; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key45" UNIQUE (name);


--
-- TOC entry 4016 (class 2606 OID 1270062)
-- Name: CardSerie CardSerie_name_key450; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key450" UNIQUE (name);


--
-- TOC entry 4018 (class 2606 OID 1269230)
-- Name: CardSerie CardSerie_name_key451; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key451" UNIQUE (name);


--
-- TOC entry 4020 (class 2606 OID 1269232)
-- Name: CardSerie CardSerie_name_key452; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key452" UNIQUE (name);


--
-- TOC entry 4022 (class 2606 OID 1269234)
-- Name: CardSerie CardSerie_name_key453; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key453" UNIQUE (name);


--
-- TOC entry 4024 (class 2606 OID 1269096)
-- Name: CardSerie CardSerie_name_key454; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key454" UNIQUE (name);


--
-- TOC entry 4026 (class 2606 OID 1269236)
-- Name: CardSerie CardSerie_name_key455; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key455" UNIQUE (name);


--
-- TOC entry 4028 (class 2606 OID 1269084)
-- Name: CardSerie CardSerie_name_key456; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key456" UNIQUE (name);


--
-- TOC entry 4030 (class 2606 OID 1269086)
-- Name: CardSerie CardSerie_name_key457; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key457" UNIQUE (name);


--
-- TOC entry 4032 (class 2606 OID 1269094)
-- Name: CardSerie CardSerie_name_key458; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key458" UNIQUE (name);


--
-- TOC entry 4034 (class 2606 OID 1269088)
-- Name: CardSerie CardSerie_name_key459; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key459" UNIQUE (name);


--
-- TOC entry 4036 (class 2606 OID 1268862)
-- Name: CardSerie CardSerie_name_key46; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key46" UNIQUE (name);


--
-- TOC entry 4038 (class 2606 OID 1269090)
-- Name: CardSerie CardSerie_name_key460; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key460" UNIQUE (name);


--
-- TOC entry 4040 (class 2606 OID 1269092)
-- Name: CardSerie CardSerie_name_key461; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key461" UNIQUE (name);


--
-- TOC entry 4042 (class 2606 OID 1268884)
-- Name: CardSerie CardSerie_name_key462; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key462" UNIQUE (name);


--
-- TOC entry 4044 (class 2606 OID 1269802)
-- Name: CardSerie CardSerie_name_key463; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key463" UNIQUE (name);


--
-- TOC entry 4046 (class 2606 OID 1269804)
-- Name: CardSerie CardSerie_name_key464; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key464" UNIQUE (name);


--
-- TOC entry 4048 (class 2606 OID 1268882)
-- Name: CardSerie CardSerie_name_key465; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key465" UNIQUE (name);


--
-- TOC entry 4050 (class 2606 OID 1268876)
-- Name: CardSerie CardSerie_name_key466; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key466" UNIQUE (name);


--
-- TOC entry 4052 (class 2606 OID 1268878)
-- Name: CardSerie CardSerie_name_key467; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key467" UNIQUE (name);


--
-- TOC entry 4054 (class 2606 OID 1268880)
-- Name: CardSerie CardSerie_name_key468; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key468" UNIQUE (name);


--
-- TOC entry 4056 (class 2606 OID 1270310)
-- Name: CardSerie CardSerie_name_key469; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key469" UNIQUE (name);


--
-- TOC entry 4058 (class 2606 OID 1268864)
-- Name: CardSerie CardSerie_name_key47; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key47" UNIQUE (name);


--
-- TOC entry 4060 (class 2606 OID 1270300)
-- Name: CardSerie CardSerie_name_key470; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key470" UNIQUE (name);


--
-- TOC entry 4062 (class 2606 OID 1270302)
-- Name: CardSerie CardSerie_name_key471; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key471" UNIQUE (name);


--
-- TOC entry 4064 (class 2606 OID 1270308)
-- Name: CardSerie CardSerie_name_key472; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key472" UNIQUE (name);


--
-- TOC entry 4066 (class 2606 OID 1270304)
-- Name: CardSerie CardSerie_name_key473; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key473" UNIQUE (name);


--
-- TOC entry 4068 (class 2606 OID 1270306)
-- Name: CardSerie CardSerie_name_key474; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key474" UNIQUE (name);


--
-- TOC entry 4070 (class 2606 OID 1270056)
-- Name: CardSerie CardSerie_name_key475; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key475" UNIQUE (name);


--
-- TOC entry 4072 (class 2606 OID 1270052)
-- Name: CardSerie CardSerie_name_key476; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key476" UNIQUE (name);


--
-- TOC entry 4074 (class 2606 OID 1270054)
-- Name: CardSerie CardSerie_name_key477; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key477" UNIQUE (name);


--
-- TOC entry 4076 (class 2606 OID 1268980)
-- Name: CardSerie CardSerie_name_key478; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key478" UNIQUE (name);


--
-- TOC entry 4078 (class 2606 OID 1269762)
-- Name: CardSerie CardSerie_name_key479; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key479" UNIQUE (name);


--
-- TOC entry 4080 (class 2606 OID 1268866)
-- Name: CardSerie CardSerie_name_key48; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key48" UNIQUE (name);


--
-- TOC entry 4082 (class 2606 OID 1269764)
-- Name: CardSerie CardSerie_name_key480; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key480" UNIQUE (name);


--
-- TOC entry 4084 (class 2606 OID 1268978)
-- Name: CardSerie CardSerie_name_key481; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key481" UNIQUE (name);


--
-- TOC entry 4086 (class 2606 OID 1269860)
-- Name: CardSerie CardSerie_name_key482; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key482" UNIQUE (name);


--
-- TOC entry 4088 (class 2606 OID 1268954)
-- Name: CardSerie CardSerie_name_key483; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key483" UNIQUE (name);


--
-- TOC entry 4090 (class 2606 OID 1268990)
-- Name: CardSerie CardSerie_name_key484; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key484" UNIQUE (name);


--
-- TOC entry 4092 (class 2606 OID 1269858)
-- Name: CardSerie CardSerie_name_key485; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key485" UNIQUE (name);


--
-- TOC entry 4094 (class 2606 OID 1268992)
-- Name: CardSerie CardSerie_name_key486; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key486" UNIQUE (name);


--
-- TOC entry 4096 (class 2606 OID 1268994)
-- Name: CardSerie CardSerie_name_key487; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key487" UNIQUE (name);


--
-- TOC entry 4098 (class 2606 OID 1268996)
-- Name: CardSerie CardSerie_name_key488; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key488" UNIQUE (name);


--
-- TOC entry 4100 (class 2606 OID 1268770)
-- Name: CardSerie CardSerie_name_key489; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key489" UNIQUE (name);


--
-- TOC entry 4102 (class 2606 OID 1270408)
-- Name: CardSerie CardSerie_name_key49; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key49" UNIQUE (name);


--
-- TOC entry 4104 (class 2606 OID 1268998)
-- Name: CardSerie CardSerie_name_key490; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key490" UNIQUE (name);


--
-- TOC entry 4106 (class 2606 OID 1270256)
-- Name: CardSerie CardSerie_name_key491; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key491" UNIQUE (name);


--
-- TOC entry 4108 (class 2606 OID 1269984)
-- Name: CardSerie CardSerie_name_key492; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key492" UNIQUE (name);


--
-- TOC entry 4110 (class 2606 OID 1270258)
-- Name: CardSerie CardSerie_name_key493; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key493" UNIQUE (name);


--
-- TOC entry 4112 (class 2606 OID 1269982)
-- Name: CardSerie CardSerie_name_key494; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key494" UNIQUE (name);


--
-- TOC entry 4114 (class 2606 OID 1270260)
-- Name: CardSerie CardSerie_name_key495; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key495" UNIQUE (name);


--
-- TOC entry 4116 (class 2606 OID 1269044)
-- Name: CardSerie CardSerie_name_key496; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key496" UNIQUE (name);


--
-- TOC entry 4118 (class 2606 OID 1269046)
-- Name: CardSerie CardSerie_name_key497; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key497" UNIQUE (name);


--
-- TOC entry 4120 (class 2606 OID 1269404)
-- Name: CardSerie CardSerie_name_key498; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key498" UNIQUE (name);


--
-- TOC entry 4122 (class 2606 OID 1270438)
-- Name: CardSerie CardSerie_name_key499; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key499" UNIQUE (name);


--
-- TOC entry 4124 (class 2606 OID 1269796)
-- Name: CardSerie CardSerie_name_key5; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key5" UNIQUE (name);


--
-- TOC entry 4126 (class 2606 OID 1268868)
-- Name: CardSerie CardSerie_name_key50; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key50" UNIQUE (name);


--
-- TOC entry 4128 (class 2606 OID 1269402)
-- Name: CardSerie CardSerie_name_key500; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key500" UNIQUE (name);


--
-- TOC entry 4130 (class 2606 OID 1270390)
-- Name: CardSerie CardSerie_name_key501; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key501" UNIQUE (name);


--
-- TOC entry 4132 (class 2606 OID 1270394)
-- Name: CardSerie CardSerie_name_key502; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key502" UNIQUE (name);


--
-- TOC entry 4134 (class 2606 OID 1270392)
-- Name: CardSerie CardSerie_name_key503; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key503" UNIQUE (name);


--
-- TOC entry 4136 (class 2606 OID 1269170)
-- Name: CardSerie CardSerie_name_key504; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key504" UNIQUE (name);


--
-- TOC entry 4138 (class 2606 OID 1269652)
-- Name: CardSerie CardSerie_name_key505; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key505" UNIQUE (name);


--
-- TOC entry 4140 (class 2606 OID 1268922)
-- Name: CardSerie CardSerie_name_key506; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key506" UNIQUE (name);


--
-- TOC entry 4142 (class 2606 OID 1269654)
-- Name: CardSerie CardSerie_name_key507; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key507" UNIQUE (name);


--
-- TOC entry 4144 (class 2606 OID 1268920)
-- Name: CardSerie CardSerie_name_key508; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key508" UNIQUE (name);


--
-- TOC entry 4146 (class 2606 OID 1269656)
-- Name: CardSerie CardSerie_name_key509; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key509" UNIQUE (name);


--
-- TOC entry 4148 (class 2606 OID 1268870)
-- Name: CardSerie CardSerie_name_key51; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key51" UNIQUE (name);


--
-- TOC entry 4150 (class 2606 OID 1268918)
-- Name: CardSerie CardSerie_name_key510; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key510" UNIQUE (name);


--
-- TOC entry 4152 (class 2606 OID 1270282)
-- Name: CardSerie CardSerie_name_key511; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key511" UNIQUE (name);


--
-- TOC entry 4154 (class 2606 OID 1269658)
-- Name: CardSerie CardSerie_name_key512; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key512" UNIQUE (name);


--
-- TOC entry 4156 (class 2606 OID 1270280)
-- Name: CardSerie CardSerie_name_key513; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key513" UNIQUE (name);


--
-- TOC entry 4158 (class 2606 OID 1269660)
-- Name: CardSerie CardSerie_name_key514; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key514" UNIQUE (name);


--
-- TOC entry 4160 (class 2606 OID 1269662)
-- Name: CardSerie CardSerie_name_key515; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key515" UNIQUE (name);


--
-- TOC entry 4162 (class 2606 OID 1270118)
-- Name: CardSerie CardSerie_name_key516; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key516" UNIQUE (name);


--
-- TOC entry 4164 (class 2606 OID 1269664)
-- Name: CardSerie CardSerie_name_key517; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key517" UNIQUE (name);


--
-- TOC entry 4166 (class 2606 OID 1270116)
-- Name: CardSerie CardSerie_name_key518; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key518" UNIQUE (name);


--
-- TOC entry 4168 (class 2606 OID 1269666)
-- Name: CardSerie CardSerie_name_key519; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key519" UNIQUE (name);


--
-- TOC entry 4170 (class 2606 OID 1268886)
-- Name: CardSerie CardSerie_name_key52; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key52" UNIQUE (name);


--
-- TOC entry 4172 (class 2606 OID 1269676)
-- Name: CardSerie CardSerie_name_key520; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key520" UNIQUE (name);


--
-- TOC entry 4174 (class 2606 OID 1269668)
-- Name: CardSerie CardSerie_name_key521; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key521" UNIQUE (name);


--
-- TOC entry 4176 (class 2606 OID 1269670)
-- Name: CardSerie CardSerie_name_key522; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key522" UNIQUE (name);


--
-- TOC entry 4178 (class 2606 OID 1269228)
-- Name: CardSerie CardSerie_name_key523; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key523" UNIQUE (name);


--
-- TOC entry 4180 (class 2606 OID 1270064)
-- Name: CardSerie CardSerie_name_key524; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key524" UNIQUE (name);


--
-- TOC entry 4182 (class 2606 OID 1269226)
-- Name: CardSerie CardSerie_name_key525; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key525" UNIQUE (name);


--
-- TOC entry 4184 (class 2606 OID 1270066)
-- Name: CardSerie CardSerie_name_key526; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key526" UNIQUE (name);


--
-- TOC entry 4186 (class 2606 OID 1270072)
-- Name: CardSerie CardSerie_name_key527; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key527" UNIQUE (name);


--
-- TOC entry 4188 (class 2606 OID 1270068)
-- Name: CardSerie CardSerie_name_key528; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key528" UNIQUE (name);


--
-- TOC entry 4190 (class 2606 OID 1270070)
-- Name: CardSerie CardSerie_name_key529; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key529" UNIQUE (name);


--
-- TOC entry 4192 (class 2606 OID 1270406)
-- Name: CardSerie CardSerie_name_key53; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key53" UNIQUE (name);


--
-- TOC entry 4194 (class 2606 OID 1270352)
-- Name: CardSerie CardSerie_name_key530; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key530" UNIQUE (name);


--
-- TOC entry 4196 (class 2606 OID 1270192)
-- Name: CardSerie CardSerie_name_key531; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key531" UNIQUE (name);


--
-- TOC entry 4198 (class 2606 OID 1270350)
-- Name: CardSerie CardSerie_name_key532; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key532" UNIQUE (name);


--
-- TOC entry 4200 (class 2606 OID 1270194)
-- Name: CardSerie CardSerie_name_key533; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key533" UNIQUE (name);


--
-- TOC entry 4202 (class 2606 OID 1270196)
-- Name: CardSerie CardSerie_name_key534; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key534" UNIQUE (name);


--
-- TOC entry 4204 (class 2606 OID 1270202)
-- Name: CardSerie CardSerie_name_key535; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key535" UNIQUE (name);


--
-- TOC entry 4206 (class 2606 OID 1270204)
-- Name: CardSerie CardSerie_name_key536; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key536" UNIQUE (name);


--
-- TOC entry 4208 (class 2606 OID 1269216)
-- Name: CardSerie CardSerie_name_key537; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key537" UNIQUE (name);


--
-- TOC entry 4210 (class 2606 OID 1270206)
-- Name: CardSerie CardSerie_name_key538; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key538" UNIQUE (name);


--
-- TOC entry 4212 (class 2606 OID 1270208)
-- Name: CardSerie CardSerie_name_key539; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key539" UNIQUE (name);


--
-- TOC entry 4214 (class 2606 OID 1269344)
-- Name: CardSerie CardSerie_name_key54; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key54" UNIQUE (name);


--
-- TOC entry 4216 (class 2606 OID 1269562)
-- Name: CardSerie CardSerie_name_key540; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key540" UNIQUE (name);


--
-- TOC entry 4218 (class 2606 OID 1269214)
-- Name: CardSerie CardSerie_name_key541; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key541" UNIQUE (name);


--
-- TOC entry 4220 (class 2606 OID 1269564)
-- Name: CardSerie CardSerie_name_key542; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key542" UNIQUE (name);


--
-- TOC entry 4222 (class 2606 OID 1269566)
-- Name: CardSerie CardSerie_name_key543; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key543" UNIQUE (name);


--
-- TOC entry 4224 (class 2606 OID 1269212)
-- Name: CardSerie CardSerie_name_key544; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key544" UNIQUE (name);


--
-- TOC entry 4226 (class 2606 OID 1269568)
-- Name: CardSerie CardSerie_name_key545; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key545" UNIQUE (name);


--
-- TOC entry 4228 (class 2606 OID 1269570)
-- Name: CardSerie CardSerie_name_key546; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key546" UNIQUE (name);


--
-- TOC entry 4230 (class 2606 OID 1269572)
-- Name: CardSerie CardSerie_name_key547; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key547" UNIQUE (name);


--
-- TOC entry 4232 (class 2606 OID 1269574)
-- Name: CardSerie CardSerie_name_key548; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key548" UNIQUE (name);


--
-- TOC entry 4234 (class 2606 OID 1269576)
-- Name: CardSerie CardSerie_name_key549; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key549" UNIQUE (name);


--
-- TOC entry 4236 (class 2606 OID 1269354)
-- Name: CardSerie CardSerie_name_key55; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key55" UNIQUE (name);


--
-- TOC entry 4238 (class 2606 OID 1270368)
-- Name: CardSerie CardSerie_name_key550; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key550" UNIQUE (name);


--
-- TOC entry 4240 (class 2606 OID 1269578)
-- Name: CardSerie CardSerie_name_key551; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key551" UNIQUE (name);


--
-- TOC entry 4242 (class 2606 OID 1270024)
-- Name: CardSerie CardSerie_name_key552; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key552" UNIQUE (name);


--
-- TOC entry 4244 (class 2606 OID 1270026)
-- Name: CardSerie CardSerie_name_key553; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key553" UNIQUE (name);


--
-- TOC entry 4246 (class 2606 OID 1270366)
-- Name: CardSerie CardSerie_name_key554; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key554" UNIQUE (name);


--
-- TOC entry 4248 (class 2606 OID 1270028)
-- Name: CardSerie CardSerie_name_key555; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key555" UNIQUE (name);


--
-- TOC entry 4250 (class 2606 OID 1270364)
-- Name: CardSerie CardSerie_name_key556; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key556" UNIQUE (name);


--
-- TOC entry 4252 (class 2606 OID 1270030)
-- Name: CardSerie CardSerie_name_key557; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key557" UNIQUE (name);


--
-- TOC entry 4254 (class 2606 OID 1268976)
-- Name: CardSerie CardSerie_name_key558; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key558" UNIQUE (name);


--
-- TOC entry 4256 (class 2606 OID 1270032)
-- Name: CardSerie CardSerie_name_key559; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key559" UNIQUE (name);


--
-- TOC entry 4258 (class 2606 OID 1269280)
-- Name: CardSerie CardSerie_name_key56; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key56" UNIQUE (name);


--
-- TOC entry 4260 (class 2606 OID 1268974)
-- Name: CardSerie CardSerie_name_key560; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key560" UNIQUE (name);


--
-- TOC entry 4262 (class 2606 OID 1270340)
-- Name: CardSerie CardSerie_name_key561; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key561" UNIQUE (name);


--
-- TOC entry 4264 (class 2606 OID 1268784)
-- Name: CardSerie CardSerie_name_key562; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key562" UNIQUE (name);


--
-- TOC entry 4266 (class 2606 OID 1270338)
-- Name: CardSerie CardSerie_name_key563; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key563" UNIQUE (name);


--
-- TOC entry 4268 (class 2606 OID 1268786)
-- Name: CardSerie CardSerie_name_key564; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key564" UNIQUE (name);


--
-- TOC entry 4270 (class 2606 OID 1268790)
-- Name: CardSerie CardSerie_name_key565; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key565" UNIQUE (name);


--
-- TOC entry 4272 (class 2606 OID 1268788)
-- Name: CardSerie CardSerie_name_key566; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key566" UNIQUE (name);


--
-- TOC entry 4274 (class 2606 OID 1270200)
-- Name: CardSerie CardSerie_name_key567; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key567" UNIQUE (name);


--
-- TOC entry 4276 (class 2606 OID 1270198)
-- Name: CardSerie CardSerie_name_key568; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key568" UNIQUE (name);


--
-- TOC entry 4278 (class 2606 OID 1270290)
-- Name: CardSerie CardSerie_name_key569; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key569" UNIQUE (name);


--
-- TOC entry 4280 (class 2606 OID 1268952)
-- Name: CardSerie CardSerie_name_key57; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key57" UNIQUE (name);


--
-- TOC entry 4282 (class 2606 OID 1269554)
-- Name: CardSerie CardSerie_name_key570; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key570" UNIQUE (name);


--
-- TOC entry 4284 (class 2606 OID 1270288)
-- Name: CardSerie CardSerie_name_key571; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key571" UNIQUE (name);


--
-- TOC entry 4286 (class 2606 OID 1269550)
-- Name: CardSerie CardSerie_name_key572; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key572" UNIQUE (name);


--
-- TOC entry 4288 (class 2606 OID 1269462)
-- Name: CardSerie CardSerie_name_key573; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key573" UNIQUE (name);


--
-- TOC entry 4290 (class 2606 OID 1269548)
-- Name: CardSerie CardSerie_name_key574; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key574" UNIQUE (name);


--
-- TOC entry 4292 (class 2606 OID 1269464)
-- Name: CardSerie CardSerie_name_key575; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key575" UNIQUE (name);


--
-- TOC entry 4294 (class 2606 OID 1269996)
-- Name: CardSerie CardSerie_name_key576; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key576" UNIQUE (name);


--
-- TOC entry 4296 (class 2606 OID 1269466)
-- Name: CardSerie CardSerie_name_key577; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key577" UNIQUE (name);


--
-- TOC entry 4298 (class 2606 OID 1269994)
-- Name: CardSerie CardSerie_name_key578; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key578" UNIQUE (name);


--
-- TOC entry 4300 (class 2606 OID 1269468)
-- Name: CardSerie CardSerie_name_key579; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key579" UNIQUE (name);


--
-- TOC entry 4302 (class 2606 OID 1269374)
-- Name: CardSerie CardSerie_name_key58; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key58" UNIQUE (name);


--
-- TOC entry 4304 (class 2606 OID 1269992)
-- Name: CardSerie CardSerie_name_key580; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key580" UNIQUE (name);


--
-- TOC entry 4306 (class 2606 OID 1269470)
-- Name: CardSerie CardSerie_name_key581; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key581" UNIQUE (name);


--
-- TOC entry 4308 (class 2606 OID 1269990)
-- Name: CardSerie CardSerie_name_key582; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key582" UNIQUE (name);


--
-- TOC entry 4310 (class 2606 OID 1269472)
-- Name: CardSerie CardSerie_name_key583; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key583" UNIQUE (name);


--
-- TOC entry 4312 (class 2606 OID 1269988)
-- Name: CardSerie CardSerie_name_key584; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key584" UNIQUE (name);


--
-- TOC entry 4314 (class 2606 OID 1269474)
-- Name: CardSerie CardSerie_name_key585; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key585" UNIQUE (name);


--
-- TOC entry 4316 (class 2606 OID 1269986)
-- Name: CardSerie CardSerie_name_key586; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key586" UNIQUE (name);


--
-- TOC entry 4318 (class 2606 OID 1268914)
-- Name: CardSerie CardSerie_name_key587; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key587" UNIQUE (name);


--
-- TOC entry 4320 (class 2606 OID 1269476)
-- Name: CardSerie CardSerie_name_key588; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key588" UNIQUE (name);


--
-- TOC entry 4322 (class 2606 OID 1268912)
-- Name: CardSerie CardSerie_name_key589; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key589" UNIQUE (name);


--
-- TOC entry 4324 (class 2606 OID 1268890)
-- Name: CardSerie CardSerie_name_key59; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key59" UNIQUE (name);


--
-- TOC entry 4326 (class 2606 OID 1269478)
-- Name: CardSerie CardSerie_name_key590; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key590" UNIQUE (name);


--
-- TOC entry 4328 (class 2606 OID 1269482)
-- Name: CardSerie CardSerie_name_key591; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key591" UNIQUE (name);


--
-- TOC entry 4330 (class 2606 OID 1269480)
-- Name: CardSerie CardSerie_name_key592; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key592" UNIQUE (name);


--
-- TOC entry 4332 (class 2606 OID 1270042)
-- Name: CardSerie CardSerie_name_key593; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key593" UNIQUE (name);


--
-- TOC entry 4334 (class 2606 OID 1270038)
-- Name: CardSerie CardSerie_name_key594; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key594" UNIQUE (name);


--
-- TOC entry 4336 (class 2606 OID 1270040)
-- Name: CardSerie CardSerie_name_key595; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key595" UNIQUE (name);


--
-- TOC entry 4338 (class 2606 OID 1270238)
-- Name: CardSerie CardSerie_name_key596; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key596" UNIQUE (name);


--
-- TOC entry 4340 (class 2606 OID 1269318)
-- Name: CardSerie CardSerie_name_key597; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key597" UNIQUE (name);


--
-- TOC entry 4342 (class 2606 OID 1270240)
-- Name: CardSerie CardSerie_name_key598; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key598" UNIQUE (name);


--
-- TOC entry 4344 (class 2606 OID 1269316)
-- Name: CardSerie CardSerie_name_key599; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key599" UNIQUE (name);


--
-- TOC entry 4346 (class 2606 OID 1268832)
-- Name: CardSerie CardSerie_name_key6; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key6" UNIQUE (name);


--
-- TOC entry 4348 (class 2606 OID 1270098)
-- Name: CardSerie CardSerie_name_key60; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key60" UNIQUE (name);


--
-- TOC entry 4350 (class 2606 OID 1270242)
-- Name: CardSerie CardSerie_name_key600; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key600" UNIQUE (name);


--
-- TOC entry 4352 (class 2606 OID 1268768)
-- Name: CardSerie CardSerie_name_key601; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key601" UNIQUE (name);


--
-- TOC entry 4354 (class 2606 OID 1270244)
-- Name: CardSerie CardSerie_name_key602; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key602" UNIQUE (name);


--
-- TOC entry 4356 (class 2606 OID 1268766)
-- Name: CardSerie CardSerie_name_key603; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key603" UNIQUE (name);


--
-- TOC entry 4358 (class 2606 OID 1270246)
-- Name: CardSerie CardSerie_name_key604; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key604" UNIQUE (name);


--
-- TOC entry 4360 (class 2606 OID 1268764)
-- Name: CardSerie CardSerie_name_key605; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key605" UNIQUE (name);


--
-- TOC entry 4362 (class 2606 OID 1268762)
-- Name: CardSerie CardSerie_name_key606; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key606" UNIQUE (name);


--
-- TOC entry 4364 (class 2606 OID 1270248)
-- Name: CardSerie CardSerie_name_key607; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key607" UNIQUE (name);


--
-- TOC entry 4366 (class 2606 OID 1268760)
-- Name: CardSerie CardSerie_name_key608; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key608" UNIQUE (name);


--
-- TOC entry 4368 (class 2606 OID 1270250)
-- Name: CardSerie CardSerie_name_key609; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key609" UNIQUE (name);


--
-- TOC entry 4370 (class 2606 OID 1270134)
-- Name: CardSerie CardSerie_name_key61; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key61" UNIQUE (name);


--
-- TOC entry 4372 (class 2606 OID 1270254)
-- Name: CardSerie CardSerie_name_key610; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key610" UNIQUE (name);


--
-- TOC entry 4374 (class 2606 OID 1270252)
-- Name: CardSerie CardSerie_name_key611; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key611" UNIQUE (name);


--
-- TOC entry 4376 (class 2606 OID 1269528)
-- Name: CardSerie CardSerie_name_key612; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key612" UNIQUE (name);


--
-- TOC entry 4378 (class 2606 OID 1269524)
-- Name: CardSerie CardSerie_name_key613; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key613" UNIQUE (name);


--
-- TOC entry 4380 (class 2606 OID 1269526)
-- Name: CardSerie CardSerie_name_key614; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key614" UNIQUE (name);


--
-- TOC entry 4382 (class 2606 OID 1269884)
-- Name: CardSerie CardSerie_name_key615; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key615" UNIQUE (name);


--
-- TOC entry 4384 (class 2606 OID 1269336)
-- Name: CardSerie CardSerie_name_key616; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key616" UNIQUE (name);


--
-- TOC entry 4386 (class 2606 OID 1269056)
-- Name: CardSerie CardSerie_name_key617; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key617" UNIQUE (name);


--
-- TOC entry 4388 (class 2606 OID 1269334)
-- Name: CardSerie CardSerie_name_key618; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key618" UNIQUE (name);


--
-- TOC entry 4390 (class 2606 OID 1269058)
-- Name: CardSerie CardSerie_name_key619; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key619" UNIQUE (name);


--
-- TOC entry 4392 (class 2606 OID 1270136)
-- Name: CardSerie CardSerie_name_key62; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key62" UNIQUE (name);


--
-- TOC entry 4394 (class 2606 OID 1269060)
-- Name: CardSerie CardSerie_name_key620; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key620" UNIQUE (name);


--
-- TOC entry 4396 (class 2606 OID 1268874)
-- Name: CardSerie CardSerie_name_key621; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key621" UNIQUE (name);


--
-- TOC entry 4398 (class 2606 OID 1269062)
-- Name: CardSerie CardSerie_name_key622; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key622" UNIQUE (name);


--
-- TOC entry 4400 (class 2606 OID 1268872)
-- Name: CardSerie CardSerie_name_key623; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key623" UNIQUE (name);


--
-- TOC entry 4402 (class 2606 OID 1269064)
-- Name: CardSerie CardSerie_name_key624; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key624" UNIQUE (name);


--
-- TOC entry 4404 (class 2606 OID 1269066)
-- Name: CardSerie CardSerie_name_key625; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key625" UNIQUE (name);


--
-- TOC entry 4406 (class 2606 OID 1269068)
-- Name: CardSerie CardSerie_name_key626; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key626" UNIQUE (name);


--
-- TOC entry 4408 (class 2606 OID 1269070)
-- Name: CardSerie CardSerie_name_key627; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key627" UNIQUE (name);


--
-- TOC entry 4410 (class 2606 OID 1269072)
-- Name: CardSerie CardSerie_name_key628; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key628" UNIQUE (name);


--
-- TOC entry 4412 (class 2606 OID 1269074)
-- Name: CardSerie CardSerie_name_key629; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key629" UNIQUE (name);


--
-- TOC entry 4414 (class 2606 OID 1268888)
-- Name: CardSerie CardSerie_name_key63; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key63" UNIQUE (name);


--
-- TOC entry 4416 (class 2606 OID 1270122)
-- Name: CardSerie CardSerie_name_key630; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key630" UNIQUE (name);


--
-- TOC entry 4418 (class 2606 OID 1269076)
-- Name: CardSerie CardSerie_name_key631; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key631" UNIQUE (name);


--
-- TOC entry 4420 (class 2606 OID 1270120)
-- Name: CardSerie CardSerie_name_key632; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key632" UNIQUE (name);


--
-- TOC entry 4422 (class 2606 OID 1269078)
-- Name: CardSerie CardSerie_name_key633; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key633" UNIQUE (name);


--
-- TOC entry 4424 (class 2606 OID 1269082)
-- Name: CardSerie CardSerie_name_key634; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key634" UNIQUE (name);


--
-- TOC entry 4426 (class 2606 OID 1269080)
-- Name: CardSerie CardSerie_name_key635; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key635" UNIQUE (name);


--
-- TOC entry 4428 (class 2606 OID 1268840)
-- Name: CardSerie CardSerie_name_key636; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key636" UNIQUE (name);


--
-- TOC entry 4430 (class 2606 OID 1268838)
-- Name: CardSerie CardSerie_name_key637; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key637" UNIQUE (name);


--
-- TOC entry 4432 (class 2606 OID 1270168)
-- Name: CardSerie CardSerie_name_key638; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key638" UNIQUE (name);


--
-- TOC entry 4434 (class 2606 OID 1269428)
-- Name: CardSerie CardSerie_name_key639; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key639" UNIQUE (name);


--
-- TOC entry 4436 (class 2606 OID 1269798)
-- Name: CardSerie CardSerie_name_key64; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key64" UNIQUE (name);


--
-- TOC entry 4438 (class 2606 OID 1269436)
-- Name: CardSerie CardSerie_name_key640; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key640" UNIQUE (name);


--
-- TOC entry 4440 (class 2606 OID 1269430)
-- Name: CardSerie CardSerie_name_key641; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key641" UNIQUE (name);


--
-- TOC entry 4442 (class 2606 OID 1269434)
-- Name: CardSerie CardSerie_name_key642; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key642" UNIQUE (name);


--
-- TOC entry 4444 (class 2606 OID 1269432)
-- Name: CardSerie CardSerie_name_key643; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key643" UNIQUE (name);


--
-- TOC entry 4446 (class 2606 OID 1269396)
-- Name: CardSerie CardSerie_name_key644; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key644" UNIQUE (name);


--
-- TOC entry 4448 (class 2606 OID 1269594)
-- Name: CardSerie CardSerie_name_key645; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key645" UNIQUE (name);


--
-- TOC entry 4450 (class 2606 OID 1269394)
-- Name: CardSerie CardSerie_name_key646; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key646" UNIQUE (name);


--
-- TOC entry 4452 (class 2606 OID 1269390)
-- Name: CardSerie CardSerie_name_key647; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key647" UNIQUE (name);


--
-- TOC entry 4454 (class 2606 OID 1269392)
-- Name: CardSerie CardSerie_name_key648; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key648" UNIQUE (name);


--
-- TOC entry 4456 (class 2606 OID 1269596)
-- Name: CardSerie CardSerie_name_key649; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key649" UNIQUE (name);


--
-- TOC entry 4458 (class 2606 OID 1269310)
-- Name: CardSerie CardSerie_name_key65; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key65" UNIQUE (name);


--
-- TOC entry 4460 (class 2606 OID 1269598)
-- Name: CardSerie CardSerie_name_key650; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key650" UNIQUE (name);


--
-- TOC entry 4462 (class 2606 OID 1269388)
-- Name: CardSerie CardSerie_name_key651; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key651" UNIQUE (name);


--
-- TOC entry 4464 (class 2606 OID 1269600)
-- Name: CardSerie CardSerie_name_key652; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key652" UNIQUE (name);


--
-- TOC entry 4466 (class 2606 OID 1269602)
-- Name: CardSerie CardSerie_name_key653; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key653" UNIQUE (name);


--
-- TOC entry 4468 (class 2606 OID 1269386)
-- Name: CardSerie CardSerie_name_key654; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key654" UNIQUE (name);


--
-- TOC entry 4470 (class 2606 OID 1269604)
-- Name: CardSerie CardSerie_name_key655; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key655" UNIQUE (name);


--
-- TOC entry 4472 (class 2606 OID 1269384)
-- Name: CardSerie CardSerie_name_key656; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key656" UNIQUE (name);


--
-- TOC entry 4474 (class 2606 OID 1269606)
-- Name: CardSerie CardSerie_name_key657; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key657" UNIQUE (name);


--
-- TOC entry 4476 (class 2606 OID 1269610)
-- Name: CardSerie CardSerie_name_key658; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key658" UNIQUE (name);


--
-- TOC entry 4478 (class 2606 OID 1269608)
-- Name: CardSerie CardSerie_name_key659; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key659" UNIQUE (name);


--
-- TOC entry 4480 (class 2606 OID 1270334)
-- Name: CardSerie CardSerie_name_key66; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key66" UNIQUE (name);


--
-- TOC entry 4482 (class 2606 OID 1269168)
-- Name: CardSerie CardSerie_name_key660; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key660" UNIQUE (name);


--
-- TOC entry 4484 (class 2606 OID 1268924)
-- Name: CardSerie CardSerie_name_key661; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key661" UNIQUE (name);


--
-- TOC entry 4486 (class 2606 OID 1268846)
-- Name: CardSerie CardSerie_name_key662; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key662" UNIQUE (name);


--
-- TOC entry 4488 (class 2606 OID 1270380)
-- Name: CardSerie CardSerie_name_key663; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key663" UNIQUE (name);


--
-- TOC entry 4490 (class 2606 OID 1270388)
-- Name: CardSerie CardSerie_name_key664; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key664" UNIQUE (name);


--
-- TOC entry 4492 (class 2606 OID 1270382)
-- Name: CardSerie CardSerie_name_key665; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key665" UNIQUE (name);


--
-- TOC entry 4494 (class 2606 OID 1270386)
-- Name: CardSerie CardSerie_name_key666; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key666" UNIQUE (name);


--
-- TOC entry 4496 (class 2606 OID 1270384)
-- Name: CardSerie CardSerie_name_key667; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key667" UNIQUE (name);


--
-- TOC entry 4498 (class 2606 OID 1269792)
-- Name: CardSerie CardSerie_name_key668; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key668" UNIQUE (name);


--
-- TOC entry 4500 (class 2606 OID 1269786)
-- Name: CardSerie CardSerie_name_key669; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key669" UNIQUE (name);


--
-- TOC entry 4502 (class 2606 OID 1270336)
-- Name: CardSerie CardSerie_name_key67; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key67" UNIQUE (name);


--
-- TOC entry 4504 (class 2606 OID 1269790)
-- Name: CardSerie CardSerie_name_key670; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key670" UNIQUE (name);


--
-- TOC entry 4506 (class 2606 OID 1269788)
-- Name: CardSerie CardSerie_name_key671; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key671" UNIQUE (name);


--
-- TOC entry 4508 (class 2606 OID 1269104)
-- Name: CardSerie CardSerie_name_key672; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key672" UNIQUE (name);


--
-- TOC entry 4510 (class 2606 OID 1268986)
-- Name: CardSerie CardSerie_name_key673; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key673" UNIQUE (name);


--
-- TOC entry 4512 (class 2606 OID 1269102)
-- Name: CardSerie CardSerie_name_key674; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key674" UNIQUE (name);


--
-- TOC entry 4514 (class 2606 OID 1269100)
-- Name: CardSerie CardSerie_name_key675; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key675" UNIQUE (name);


--
-- TOC entry 4516 (class 2606 OID 1268988)
-- Name: CardSerie CardSerie_name_key676; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key676" UNIQUE (name);


--
-- TOC entry 4518 (class 2606 OID 1269098)
-- Name: CardSerie CardSerie_name_key677; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key677" UNIQUE (name);


--
-- TOC entry 4520 (class 2606 OID 1269722)
-- Name: CardSerie CardSerie_name_key678; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key678" UNIQUE (name);


--
-- TOC entry 4522 (class 2606 OID 1269724)
-- Name: CardSerie CardSerie_name_key679; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key679" UNIQUE (name);


--
-- TOC entry 4524 (class 2606 OID 1269358)
-- Name: CardSerie CardSerie_name_key68; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key68" UNIQUE (name);


--
-- TOC entry 4526 (class 2606 OID 1269830)
-- Name: CardSerie CardSerie_name_key680; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key680" UNIQUE (name);


--
-- TOC entry 4528 (class 2606 OID 1269726)
-- Name: CardSerie CardSerie_name_key681; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key681" UNIQUE (name);


--
-- TOC entry 4530 (class 2606 OID 1269828)
-- Name: CardSerie CardSerie_name_key682; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key682" UNIQUE (name);


--
-- TOC entry 4532 (class 2606 OID 1269728)
-- Name: CardSerie CardSerie_name_key683; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key683" UNIQUE (name);


--
-- TOC entry 4534 (class 2606 OID 1269730)
-- Name: CardSerie CardSerie_name_key684; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key684" UNIQUE (name);


--
-- TOC entry 4536 (class 2606 OID 1269732)
-- Name: CardSerie CardSerie_name_key685; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key685" UNIQUE (name);


--
-- TOC entry 4538 (class 2606 OID 1269734)
-- Name: CardSerie CardSerie_name_key686; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key686" UNIQUE (name);


--
-- TOC entry 4540 (class 2606 OID 1270224)
-- Name: CardSerie CardSerie_name_key687; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key687" UNIQUE (name);


--
-- TOC entry 4542 (class 2606 OID 1269736)
-- Name: CardSerie CardSerie_name_key688; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key688" UNIQUE (name);


--
-- TOC entry 4544 (class 2606 OID 1269738)
-- Name: CardSerie CardSerie_name_key689; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key689" UNIQUE (name);


--
-- TOC entry 4546 (class 2606 OID 1269360)
-- Name: CardSerie CardSerie_name_key69; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key69" UNIQUE (name);


--
-- TOC entry 4548 (class 2606 OID 1270222)
-- Name: CardSerie CardSerie_name_key690; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key690" UNIQUE (name);


--
-- TOC entry 4550 (class 2606 OID 1269740)
-- Name: CardSerie CardSerie_name_key691; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key691" UNIQUE (name);


--
-- TOC entry 4552 (class 2606 OID 1270220)
-- Name: CardSerie CardSerie_name_key692; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key692" UNIQUE (name);


--
-- TOC entry 4554 (class 2606 OID 1269742)
-- Name: CardSerie CardSerie_name_key693; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key693" UNIQUE (name);


--
-- TOC entry 4556 (class 2606 OID 1270156)
-- Name: CardSerie CardSerie_name_key694; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key694" UNIQUE (name);


--
-- TOC entry 4558 (class 2606 OID 1269744)
-- Name: CardSerie CardSerie_name_key695; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key695" UNIQUE (name);


--
-- TOC entry 4560 (class 2606 OID 1270154)
-- Name: CardSerie CardSerie_name_key696; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key696" UNIQUE (name);


--
-- TOC entry 4562 (class 2606 OID 1270152)
-- Name: CardSerie CardSerie_name_key697; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key697" UNIQUE (name);


--
-- TOC entry 4564 (class 2606 OID 1269746)
-- Name: CardSerie CardSerie_name_key698; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key698" UNIQUE (name);


--
-- TOC entry 4566 (class 2606 OID 1270150)
-- Name: CardSerie CardSerie_name_key699; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key699" UNIQUE (name);


--
-- TOC entry 4568 (class 2606 OID 1269800)
-- Name: CardSerie CardSerie_name_key7; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key7" UNIQUE (name);


--
-- TOC entry 4570 (class 2606 OID 1269362)
-- Name: CardSerie CardSerie_name_key70; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key70" UNIQUE (name);


--
-- TOC entry 4572 (class 2606 OID 1269748)
-- Name: CardSerie CardSerie_name_key700; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key700" UNIQUE (name);


--
-- TOC entry 4574 (class 2606 OID 1269754)
-- Name: CardSerie CardSerie_name_key701; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key701" UNIQUE (name);


--
-- TOC entry 4576 (class 2606 OID 1269750)
-- Name: CardSerie CardSerie_name_key702; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key702" UNIQUE (name);


--
-- TOC entry 4578 (class 2606 OID 1269752)
-- Name: CardSerie CardSerie_name_key703; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key703" UNIQUE (name);


--
-- TOC entry 4580 (class 2606 OID 1268956)
-- Name: CardSerie CardSerie_name_key704; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key704" UNIQUE (name);


--
-- TOC entry 4582 (class 2606 OID 1270436)
-- Name: CardSerie CardSerie_name_key705; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key705" UNIQUE (name);


--
-- TOC entry 4584 (class 2606 OID 1269886)
-- Name: CardSerie CardSerie_name_key706; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key706" UNIQUE (name);


--
-- TOC entry 4586 (class 2606 OID 1270434)
-- Name: CardSerie CardSerie_name_key707; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key707" UNIQUE (name);


--
-- TOC entry 4588 (class 2606 OID 1269888)
-- Name: CardSerie CardSerie_name_key708; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key708" UNIQUE (name);


--
-- TOC entry 4590 (class 2606 OID 1270432)
-- Name: CardSerie CardSerie_name_key709; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key709" UNIQUE (name);


--
-- TOC entry 4592 (class 2606 OID 1269308)
-- Name: CardSerie CardSerie_name_key71; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key71" UNIQUE (name);


--
-- TOC entry 4594 (class 2606 OID 1269890)
-- Name: CardSerie CardSerie_name_key710; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key710" UNIQUE (name);


--
-- TOC entry 4596 (class 2606 OID 1270430)
-- Name: CardSerie CardSerie_name_key711; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key711" UNIQUE (name);


--
-- TOC entry 4598 (class 2606 OID 1269892)
-- Name: CardSerie CardSerie_name_key712; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key712" UNIQUE (name);


--
-- TOC entry 4600 (class 2606 OID 1270428)
-- Name: CardSerie CardSerie_name_key713; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key713" UNIQUE (name);


--
-- TOC entry 4602 (class 2606 OID 1269894)
-- Name: CardSerie CardSerie_name_key714; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key714" UNIQUE (name);


--
-- TOC entry 4604 (class 2606 OID 1270426)
-- Name: CardSerie CardSerie_name_key715; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key715" UNIQUE (name);


--
-- TOC entry 4606 (class 2606 OID 1269896)
-- Name: CardSerie CardSerie_name_key716; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key716" UNIQUE (name);


--
-- TOC entry 4608 (class 2606 OID 1270424)
-- Name: CardSerie CardSerie_name_key717; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key717" UNIQUE (name);


--
-- TOC entry 4610 (class 2606 OID 1269114)
-- Name: CardSerie CardSerie_name_key718; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key718" UNIQUE (name);


--
-- TOC entry 4612 (class 2606 OID 1270422)
-- Name: CardSerie CardSerie_name_key719; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key719" UNIQUE (name);


--
-- TOC entry 4614 (class 2606 OID 1269364)
-- Name: CardSerie CardSerie_name_key72; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key72" UNIQUE (name);


--
-- TOC entry 4616 (class 2606 OID 1269116)
-- Name: CardSerie CardSerie_name_key720; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key720" UNIQUE (name);


--
-- TOC entry 4618 (class 2606 OID 1270420)
-- Name: CardSerie CardSerie_name_key721; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key721" UNIQUE (name);


--
-- TOC entry 4620 (class 2606 OID 1270096)
-- Name: CardSerie CardSerie_name_key722; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key722" UNIQUE (name);


--
-- TOC entry 4622 (class 2606 OID 1269118)
-- Name: CardSerie CardSerie_name_key723; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key723" UNIQUE (name);


--
-- TOC entry 4624 (class 2606 OID 1270094)
-- Name: CardSerie CardSerie_name_key724; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key724" UNIQUE (name);


--
-- TOC entry 4626 (class 2606 OID 1269120)
-- Name: CardSerie CardSerie_name_key725; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key725" UNIQUE (name);


--
-- TOC entry 4628 (class 2606 OID 1269152)
-- Name: CardSerie CardSerie_name_key726; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key726" UNIQUE (name);


--
-- TOC entry 4630 (class 2606 OID 1269122)
-- Name: CardSerie CardSerie_name_key727; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key727" UNIQUE (name);


--
-- TOC entry 4632 (class 2606 OID 1269150)
-- Name: CardSerie CardSerie_name_key728; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key728" UNIQUE (name);


--
-- TOC entry 4634 (class 2606 OID 1269124)
-- Name: CardSerie CardSerie_name_key729; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key729" UNIQUE (name);


--
-- TOC entry 4636 (class 2606 OID 1269306)
-- Name: CardSerie CardSerie_name_key73; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key73" UNIQUE (name);


--
-- TOC entry 4638 (class 2606 OID 1269148)
-- Name: CardSerie CardSerie_name_key730; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key730" UNIQUE (name);


--
-- TOC entry 4640 (class 2606 OID 1269126)
-- Name: CardSerie CardSerie_name_key731; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key731" UNIQUE (name);


--
-- TOC entry 4642 (class 2606 OID 1269146)
-- Name: CardSerie CardSerie_name_key732; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key732" UNIQUE (name);


--
-- TOC entry 4644 (class 2606 OID 1269128)
-- Name: CardSerie CardSerie_name_key733; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key733" UNIQUE (name);


--
-- TOC entry 4646 (class 2606 OID 1269144)
-- Name: CardSerie CardSerie_name_key734; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key734" UNIQUE (name);


--
-- TOC entry 4648 (class 2606 OID 1269130)
-- Name: CardSerie CardSerie_name_key735; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key735" UNIQUE (name);


--
-- TOC entry 4650 (class 2606 OID 1269142)
-- Name: CardSerie CardSerie_name_key736; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key736" UNIQUE (name);


--
-- TOC entry 4652 (class 2606 OID 1269132)
-- Name: CardSerie CardSerie_name_key737; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key737" UNIQUE (name);


--
-- TOC entry 4654 (class 2606 OID 1269140)
-- Name: CardSerie CardSerie_name_key738; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key738" UNIQUE (name);


--
-- TOC entry 4656 (class 2606 OID 1269134)
-- Name: CardSerie CardSerie_name_key739; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key739" UNIQUE (name);


--
-- TOC entry 4658 (class 2606 OID 1269532)
-- Name: CardSerie CardSerie_name_key74; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key74" UNIQUE (name);


--
-- TOC entry 4660 (class 2606 OID 1269138)
-- Name: CardSerie CardSerie_name_key740; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key740" UNIQUE (name);


--
-- TOC entry 4662 (class 2606 OID 1269136)
-- Name: CardSerie CardSerie_name_key741; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key741" UNIQUE (name);


--
-- TOC entry 4664 (class 2606 OID 1269112)
-- Name: CardSerie CardSerie_name_key742; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key742" UNIQUE (name);


--
-- TOC entry 4666 (class 2606 OID 1269898)
-- Name: CardSerie CardSerie_name_key743; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key743" UNIQUE (name);


--
-- TOC entry 4668 (class 2606 OID 1269110)
-- Name: CardSerie CardSerie_name_key744; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key744" UNIQUE (name);


--
-- TOC entry 4670 (class 2606 OID 1269900)
-- Name: CardSerie CardSerie_name_key745; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key745" UNIQUE (name);


--
-- TOC entry 4672 (class 2606 OID 1269902)
-- Name: CardSerie CardSerie_name_key746; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key746" UNIQUE (name);


--
-- TOC entry 4674 (class 2606 OID 1269108)
-- Name: CardSerie CardSerie_name_key747; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key747" UNIQUE (name);


--
-- TOC entry 4676 (class 2606 OID 1269904)
-- Name: CardSerie CardSerie_name_key748; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key748" UNIQUE (name);


--
-- TOC entry 4678 (class 2606 OID 1269106)
-- Name: CardSerie CardSerie_name_key749; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key749" UNIQUE (name);


--
-- TOC entry 4680 (class 2606 OID 1269612)
-- Name: CardSerie CardSerie_name_key75; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key75" UNIQUE (name);


--
-- TOC entry 4682 (class 2606 OID 1269906)
-- Name: CardSerie CardSerie_name_key750; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key750" UNIQUE (name);


--
-- TOC entry 4684 (class 2606 OID 1269908)
-- Name: CardSerie CardSerie_name_key751; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key751" UNIQUE (name);


--
-- TOC entry 4686 (class 2606 OID 1270228)
-- Name: CardSerie CardSerie_name_key752; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key752" UNIQUE (name);


--
-- TOC entry 4688 (class 2606 OID 1269910)
-- Name: CardSerie CardSerie_name_key753; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key753" UNIQUE (name);


--
-- TOC entry 4690 (class 2606 OID 1270226)
-- Name: CardSerie CardSerie_name_key754; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key754" UNIQUE (name);


--
-- TOC entry 4692 (class 2606 OID 1269912)
-- Name: CardSerie CardSerie_name_key755; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key755" UNIQUE (name);


--
-- TOC entry 4694 (class 2606 OID 1269914)
-- Name: CardSerie CardSerie_name_key756; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key756" UNIQUE (name);


--
-- TOC entry 4696 (class 2606 OID 1269916)
-- Name: CardSerie CardSerie_name_key757; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key757" UNIQUE (name);


--
-- TOC entry 4698 (class 2606 OID 1269962)
-- Name: CardSerie CardSerie_name_key758; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key758" UNIQUE (name);


--
-- TOC entry 4700 (class 2606 OID 1269918)
-- Name: CardSerie CardSerie_name_key759; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key759" UNIQUE (name);


--
-- TOC entry 4702 (class 2606 OID 1269614)
-- Name: CardSerie CardSerie_name_key76; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key76" UNIQUE (name);


--
-- TOC entry 4704 (class 2606 OID 1269960)
-- Name: CardSerie CardSerie_name_key760; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key760" UNIQUE (name);


--
-- TOC entry 4706 (class 2606 OID 1269920)
-- Name: CardSerie CardSerie_name_key761; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key761" UNIQUE (name);


--
-- TOC entry 4708 (class 2606 OID 1269922)
-- Name: CardSerie CardSerie_name_key762; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key762" UNIQUE (name);


--
-- TOC entry 4710 (class 2606 OID 1270264)
-- Name: CardSerie CardSerie_name_key763; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key763" UNIQUE (name);


--
-- TOC entry 4712 (class 2606 OID 1269924)
-- Name: CardSerie CardSerie_name_key764; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key764" UNIQUE (name);


--
-- TOC entry 4714 (class 2606 OID 1270262)
-- Name: CardSerie CardSerie_name_key765; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key765" UNIQUE (name);


--
-- TOC entry 4716 (class 2606 OID 1269926)
-- Name: CardSerie CardSerie_name_key766; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key766" UNIQUE (name);


--
-- TOC entry 4718 (class 2606 OID 1269050)
-- Name: CardSerie CardSerie_name_key767; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key767" UNIQUE (name);


--
-- TOC entry 4720 (class 2606 OID 1269928)
-- Name: CardSerie CardSerie_name_key768; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key768" UNIQUE (name);


--
-- TOC entry 4722 (class 2606 OID 1269048)
-- Name: CardSerie CardSerie_name_key769; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key769" UNIQUE (name);


--
-- TOC entry 4724 (class 2606 OID 1269624)
-- Name: CardSerie CardSerie_name_key77; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key77" UNIQUE (name);


--
-- TOC entry 4726 (class 2606 OID 1269930)
-- Name: CardSerie CardSerie_name_key770; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key770" UNIQUE (name);


--
-- TOC entry 4728 (class 2606 OID 1269054)
-- Name: CardSerie CardSerie_name_key771; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key771" UNIQUE (name);


--
-- TOC entry 4730 (class 2606 OID 1269932)
-- Name: CardSerie CardSerie_name_key772; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key772" UNIQUE (name);


--
-- TOC entry 4732 (class 2606 OID 1269052)
-- Name: CardSerie CardSerie_name_key773; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key773" UNIQUE (name);


--
-- TOC entry 4734 (class 2606 OID 1270286)
-- Name: CardSerie CardSerie_name_key774; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key774" UNIQUE (name);


--
-- TOC entry 4736 (class 2606 OID 1269934)
-- Name: CardSerie CardSerie_name_key775; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key775" UNIQUE (name);


--
-- TOC entry 4738 (class 2606 OID 1270284)
-- Name: CardSerie CardSerie_name_key776; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key776" UNIQUE (name);


--
-- TOC entry 4740 (class 2606 OID 1269936)
-- Name: CardSerie CardSerie_name_key777; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key777" UNIQUE (name);


--
-- TOC entry 4742 (class 2606 OID 1270086)
-- Name: CardSerie CardSerie_name_key778; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key778" UNIQUE (name);


--
-- TOC entry 4744 (class 2606 OID 1269938)
-- Name: CardSerie CardSerie_name_key779; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key779" UNIQUE (name);


--
-- TOC entry 4746 (class 2606 OID 1268968)
-- Name: CardSerie CardSerie_name_key78; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key78" UNIQUE (name);


--
-- TOC entry 4748 (class 2606 OID 1270084)
-- Name: CardSerie CardSerie_name_key780; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key780" UNIQUE (name);


--
-- TOC entry 4750 (class 2606 OID 1269940)
-- Name: CardSerie CardSerie_name_key781; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key781" UNIQUE (name);


--
-- TOC entry 4752 (class 2606 OID 1270082)
-- Name: CardSerie CardSerie_name_key782; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key782" UNIQUE (name);


--
-- TOC entry 4754 (class 2606 OID 1269560)
-- Name: CardSerie CardSerie_name_key783; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key783" UNIQUE (name);


--
-- TOC entry 4756 (class 2606 OID 1269942)
-- Name: CardSerie CardSerie_name_key784; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key784" UNIQUE (name);


--
-- TOC entry 4758 (class 2606 OID 1269558)
-- Name: CardSerie CardSerie_name_key785; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key785" UNIQUE (name);


--
-- TOC entry 4760 (class 2606 OID 1269944)
-- Name: CardSerie CardSerie_name_key786; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key786" UNIQUE (name);


--
-- TOC entry 4762 (class 2606 OID 1269952)
-- Name: CardSerie CardSerie_name_key787; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key787" UNIQUE (name);


--
-- TOC entry 4764 (class 2606 OID 1269946)
-- Name: CardSerie CardSerie_name_key788; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key788" UNIQUE (name);


--
-- TOC entry 4766 (class 2606 OID 1269950)
-- Name: CardSerie CardSerie_name_key789; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key789" UNIQUE (name);


--
-- TOC entry 4768 (class 2606 OID 1268970)
-- Name: CardSerie CardSerie_name_key79; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key79" UNIQUE (name);


--
-- TOC entry 4770 (class 2606 OID 1269948)
-- Name: CardSerie CardSerie_name_key790; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key790" UNIQUE (name);


--
-- TOC entry 4772 (class 2606 OID 1269674)
-- Name: CardSerie CardSerie_name_key791; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key791" UNIQUE (name);


--
-- TOC entry 4774 (class 2606 OID 1269672)
-- Name: CardSerie CardSerie_name_key792; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key792" UNIQUE (name);


--
-- TOC entry 4776 (class 2606 OID 1269622)
-- Name: CardSerie CardSerie_name_key793; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key793" UNIQUE (name);


--
-- TOC entry 4778 (class 2606 OID 1269616)
-- Name: CardSerie CardSerie_name_key794; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key794" UNIQUE (name);


--
-- TOC entry 4780 (class 2606 OID 1269620)
-- Name: CardSerie CardSerie_name_key795; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key795" UNIQUE (name);


--
-- TOC entry 4782 (class 2606 OID 1269618)
-- Name: CardSerie CardSerie_name_key796; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key796" UNIQUE (name);


--
-- TOC entry 4784 (class 2606 OID 1269706)
-- Name: CardSerie CardSerie_name_key797; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key797" UNIQUE (name);


--
-- TOC entry 4786 (class 2606 OID 1269018)
-- Name: CardSerie CardSerie_name_key798; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key798" UNIQUE (name);


--
-- TOC entry 4788 (class 2606 OID 1269704)
-- Name: CardSerie CardSerie_name_key799; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key799" UNIQUE (name);


--
-- TOC entry 4790 (class 2606 OID 1269840)
-- Name: CardSerie CardSerie_name_key8; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key8" UNIQUE (name);


--
-- TOC entry 4792 (class 2606 OID 1269530)
-- Name: CardSerie CardSerie_name_key80; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key80" UNIQUE (name);


--
-- TOC entry 4794 (class 2606 OID 1269020)
-- Name: CardSerie CardSerie_name_key800; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key800" UNIQUE (name);


--
-- TOC entry 4796 (class 2606 OID 1269702)
-- Name: CardSerie CardSerie_name_key801; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key801" UNIQUE (name);


--
-- TOC entry 4798 (class 2606 OID 1269022)
-- Name: CardSerie CardSerie_name_key802; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key802" UNIQUE (name);


--
-- TOC entry 4800 (class 2606 OID 1269700)
-- Name: CardSerie CardSerie_name_key803; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key803" UNIQUE (name);


--
-- TOC entry 4802 (class 2606 OID 1269024)
-- Name: CardSerie CardSerie_name_key804; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key804" UNIQUE (name);


--
-- TOC entry 4804 (class 2606 OID 1269698)
-- Name: CardSerie CardSerie_name_key805; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key805" UNIQUE (name);


--
-- TOC entry 4806 (class 2606 OID 1269026)
-- Name: CardSerie CardSerie_name_key806; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key806" UNIQUE (name);


--
-- TOC entry 4808 (class 2606 OID 1269696)
-- Name: CardSerie CardSerie_name_key807; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key807" UNIQUE (name);


--
-- TOC entry 4810 (class 2606 OID 1269582)
-- Name: CardSerie CardSerie_name_key808; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key808" UNIQUE (name);


--
-- TOC entry 4812 (class 2606 OID 1269028)
-- Name: CardSerie CardSerie_name_key809; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key809" UNIQUE (name);


--
-- TOC entry 4814 (class 2606 OID 1269522)
-- Name: CardSerie CardSerie_name_key81; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key81" UNIQUE (name);


--
-- TOC entry 4816 (class 2606 OID 1269580)
-- Name: CardSerie CardSerie_name_key810; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key810" UNIQUE (name);


--
-- TOC entry 4818 (class 2606 OID 1269030)
-- Name: CardSerie CardSerie_name_key811; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key811" UNIQUE (name);


--
-- TOC entry 4820 (class 2606 OID 1269042)
-- Name: CardSerie CardSerie_name_key812; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key812" UNIQUE (name);


--
-- TOC entry 4822 (class 2606 OID 1269032)
-- Name: CardSerie CardSerie_name_key813; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key813" UNIQUE (name);


--
-- TOC entry 4824 (class 2606 OID 1269040)
-- Name: CardSerie CardSerie_name_key814; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key814" UNIQUE (name);


--
-- TOC entry 4826 (class 2606 OID 1269034)
-- Name: CardSerie CardSerie_name_key815; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key815" UNIQUE (name);


--
-- TOC entry 4828 (class 2606 OID 1269038)
-- Name: CardSerie CardSerie_name_key816; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key816" UNIQUE (name);


--
-- TOC entry 4830 (class 2606 OID 1269036)
-- Name: CardSerie CardSerie_name_key817; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key817" UNIQUE (name);


--
-- TOC entry 4832 (class 2606 OID 1269460)
-- Name: CardSerie CardSerie_name_key818; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key818" UNIQUE (name);


--
-- TOC entry 4834 (class 2606 OID 1269454)
-- Name: CardSerie CardSerie_name_key819; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key819" UNIQUE (name);


--
-- TOC entry 4836 (class 2606 OID 1268972)
-- Name: CardSerie CardSerie_name_key82; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key82" UNIQUE (name);


--
-- TOC entry 4838 (class 2606 OID 1269458)
-- Name: CardSerie CardSerie_name_key820; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key820" UNIQUE (name);


--
-- TOC entry 4840 (class 2606 OID 1269456)
-- Name: CardSerie CardSerie_name_key821; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key821" UNIQUE (name);


--
-- TOC entry 4842 (class 2606 OID 1269256)
-- Name: CardSerie CardSerie_name_key822; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key822" UNIQUE (name);


--
-- TOC entry 4844 (class 2606 OID 1269248)
-- Name: CardSerie CardSerie_name_key823; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key823" UNIQUE (name);


--
-- TOC entry 4846 (class 2606 OID 1269254)
-- Name: CardSerie CardSerie_name_key824; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key824" UNIQUE (name);


--
-- TOC entry 4848 (class 2606 OID 1269250)
-- Name: CardSerie CardSerie_name_key825; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key825" UNIQUE (name);


--
-- TOC entry 4850 (class 2606 OID 1269252)
-- Name: CardSerie CardSerie_name_key826; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key826" UNIQUE (name);


--
-- TOC entry 4852 (class 2606 OID 1268926)
-- Name: CardSerie CardSerie_name_key827; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key827" UNIQUE (name);


--
-- TOC entry 4854 (class 2606 OID 1268928)
-- Name: CardSerie CardSerie_name_key828; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key828" UNIQUE (name);


--
-- TOC entry 4856 (class 2606 OID 1268930)
-- Name: CardSerie CardSerie_name_key829; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key829" UNIQUE (name);


--
-- TOC entry 4858 (class 2606 OID 1269508)
-- Name: CardSerie CardSerie_name_key83; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key83" UNIQUE (name);


--
-- TOC entry 4860 (class 2606 OID 1268932)
-- Name: CardSerie CardSerie_name_key830; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key830" UNIQUE (name);


--
-- TOC entry 4862 (class 2606 OID 1268934)
-- Name: CardSerie CardSerie_name_key831; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key831" UNIQUE (name);


--
-- TOC entry 4864 (class 2606 OID 1269166)
-- Name: CardSerie CardSerie_name_key832; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key832" UNIQUE (name);


--
-- TOC entry 4866 (class 2606 OID 1268936)
-- Name: CardSerie CardSerie_name_key833; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key833" UNIQUE (name);


--
-- TOC entry 4868 (class 2606 OID 1269164)
-- Name: CardSerie CardSerie_name_key834; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key834" UNIQUE (name);


--
-- TOC entry 4870 (class 2606 OID 1268938)
-- Name: CardSerie CardSerie_name_key835; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key835" UNIQUE (name);


--
-- TOC entry 4872 (class 2606 OID 1268942)
-- Name: CardSerie CardSerie_name_key836; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key836" UNIQUE (name);


--
-- TOC entry 4874 (class 2606 OID 1268940)
-- Name: CardSerie CardSerie_name_key837; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key837" UNIQUE (name);


--
-- TOC entry 4876 (class 2606 OID 1268798)
-- Name: CardSerie CardSerie_name_key838; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key838" UNIQUE (name);


--
-- TOC entry 4878 (class 2606 OID 1268804)
-- Name: CardSerie CardSerie_name_key839; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key839" UNIQUE (name);


--
-- TOC entry 4880 (class 2606 OID 1269510)
-- Name: CardSerie CardSerie_name_key84; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key84" UNIQUE (name);


--
-- TOC entry 4882 (class 2606 OID 1268800)
-- Name: CardSerie CardSerie_name_key840; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key840" UNIQUE (name);


--
-- TOC entry 4884 (class 2606 OID 1268802)
-- Name: CardSerie CardSerie_name_key841; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key841" UNIQUE (name);


--
-- TOC entry 4886 (class 2606 OID 1268754)
-- Name: CardSerie CardSerie_name_key842; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key842" UNIQUE (name);


--
-- TOC entry 4888 (class 2606 OID 1270440)
-- Name: CardSerie CardSerie_name_key843; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key843" UNIQUE (name);


--
-- TOC entry 4890 (class 2606 OID 1270442)
-- Name: CardSerie CardSerie_name_key844; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key844" UNIQUE (name);


--
-- TOC entry 4892 (class 2606 OID 1268752)
-- Name: CardSerie CardSerie_name_key845; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key845" UNIQUE (name);


--
-- TOC entry 4894 (class 2606 OID 1270444)
-- Name: CardSerie CardSerie_name_key846; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key846" UNIQUE (name);


--
-- TOC entry 4896 (class 2606 OID 1268750)
-- Name: CardSerie CardSerie_name_key847; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key847" UNIQUE (name);


--
-- TOC entry 4898 (class 2606 OID 1269512)
-- Name: CardSerie CardSerie_name_key85; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key85" UNIQUE (name);


--
-- TOC entry 4900 (class 2606 OID 1269520)
-- Name: CardSerie CardSerie_name_key86; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key86" UNIQUE (name);


--
-- TOC entry 4902 (class 2606 OID 1269514)
-- Name: CardSerie CardSerie_name_key87; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key87" UNIQUE (name);


--
-- TOC entry 4904 (class 2606 OID 1269516)
-- Name: CardSerie CardSerie_name_key88; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key88" UNIQUE (name);


--
-- TOC entry 4906 (class 2606 OID 1269518)
-- Name: CardSerie CardSerie_name_key89; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key89" UNIQUE (name);


--
-- TOC entry 4908 (class 2606 OID 1269842)
-- Name: CardSerie CardSerie_name_key9; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key9" UNIQUE (name);


--
-- TOC entry 4910 (class 2606 OID 1270142)
-- Name: CardSerie CardSerie_name_key90; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key90" UNIQUE (name);


--
-- TOC entry 4912 (class 2606 OID 1269756)
-- Name: CardSerie CardSerie_name_key91; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key91" UNIQUE (name);


--
-- TOC entry 4914 (class 2606 OID 1269758)
-- Name: CardSerie CardSerie_name_key92; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key92" UNIQUE (name);


--
-- TOC entry 4916 (class 2606 OID 1269760)
-- Name: CardSerie CardSerie_name_key93; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key93" UNIQUE (name);


--
-- TOC entry 4918 (class 2606 OID 1268982)
-- Name: CardSerie CardSerie_name_key94; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key94" UNIQUE (name);


--
-- TOC entry 4920 (class 2606 OID 1268984)
-- Name: CardSerie CardSerie_name_key95; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key95" UNIQUE (name);


--
-- TOC entry 4922 (class 2606 OID 1270140)
-- Name: CardSerie CardSerie_name_key96; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key96" UNIQUE (name);


--
-- TOC entry 4924 (class 2606 OID 1270414)
-- Name: CardSerie CardSerie_name_key97; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key97" UNIQUE (name);


--
-- TOC entry 4926 (class 2606 OID 1270012)
-- Name: CardSerie CardSerie_name_key98; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key98" UNIQUE (name);


--
-- TOC entry 4928 (class 2606 OID 1269302)
-- Name: CardSerie CardSerie_name_key99; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_name_key99" UNIQUE (name);


--
-- TOC entry 4930 (class 2606 OID 285249)
-- Name: CardSerie CardSerie_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSerie"
    ADD CONSTRAINT "CardSerie_pkey" PRIMARY KEY (id);


--
-- TOC entry 4932 (class 2606 OID 285258)
-- Name: CardSet CardSet_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSet"
    ADD CONSTRAINT "CardSet_pkey" PRIMARY KEY (id);


--
-- TOC entry 4948 (class 2606 OID 285354)
-- Name: CardType CardType_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardType"
    ADD CONSTRAINT "CardType_pkey" PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 285270)
-- Name: Card Card_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Card"
    ADD CONSTRAINT "Card_pkey" PRIMARY KEY (id);


--
-- TOC entry 4956 (class 2606 OID 285393)
-- Name: UserCardPossession UserCardPossession_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."UserCardPossession"
    ADD CONSTRAINT "UserCardPossession_pkey" PRIMARY KEY (id);


--
-- TOC entry 4954 (class 2606 OID 285386)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4950 (class 2606 OID 285367)
-- Name: logConsole logConsole_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."logConsole"
    ADD CONSTRAINT "logConsole_pkey" PRIMARY KEY (id);


--
-- TOC entry 4952 (class 2606 OID 285374)
-- Name: logEndpoint logEndpoint_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."logEndpoint"
    ADD CONSTRAINT "logEndpoint_pkey" PRIMARY KEY (id);


--
-- TOC entry 4959 (class 2606 OID 1270455)
-- Name: CardAbility CardAbility_cardEntityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardAbility"
    ADD CONSTRAINT "CardAbility_cardEntityId_fkey" FOREIGN KEY ("cardEntityId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4961 (class 2606 OID 1270465)
-- Name: CardAttackCost CardAttackCost_cardAttackId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardAttackCost"
    ADD CONSTRAINT "CardAttackCost_cardAttackId_fkey" FOREIGN KEY ("cardAttackId") REFERENCES public."CardAttack"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4960 (class 2606 OID 1270460)
-- Name: CardAttack CardAttack_cardEntityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardAttack"
    ADD CONSTRAINT "CardAttack_cardEntityId_fkey" FOREIGN KEY ("cardEntityId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4962 (class 2606 OID 1270470)
-- Name: CardAttribute CardAttribute_cardEntityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardAttribute"
    ADD CONSTRAINT "CardAttribute_cardEntityId_fkey" FOREIGN KEY ("cardEntityId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4963 (class 2606 OID 1270475)
-- Name: CardDamageModification CardDamageModification_cardEntityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardDamageModification"
    ADD CONSTRAINT "CardDamageModification_cardEntityId_fkey" FOREIGN KEY ("cardEntityId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4964 (class 2606 OID 1270480)
-- Name: CardDexId CardDexId_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardDexId"
    ADD CONSTRAINT "CardDexId_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4957 (class 2606 OID 1270445)
-- Name: CardSet CardSet_cardSerieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardSet"
    ADD CONSTRAINT "CardSet_cardSerieId_fkey" FOREIGN KEY ("cardSerieId") REFERENCES public."CardSerie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4965 (class 2606 OID 1270485)
-- Name: CardType CardType_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."CardType"
    ADD CONSTRAINT "CardType_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4958 (class 2606 OID 1270450)
-- Name: Card Card_setId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Card"
    ADD CONSTRAINT "Card_setId_fkey" FOREIGN KEY ("setId") REFERENCES public."CardSet"(id) ON UPDATE CASCADE;


--
-- TOC entry 4967 (class 2606 OID 1270502)
-- Name: UserCardPossession UserCardPossession_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."UserCardPossession"
    ADD CONSTRAINT "UserCardPossession_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4968 (class 2606 OID 1270497)
-- Name: UserCardPossession UserCardPossession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."UserCardPossession"
    ADD CONSTRAINT "UserCardPossession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4966 (class 2606 OID 1270492)
-- Name: logEndpoint logEndpoint_logConsoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."logEndpoint"
    ADD CONSTRAINT "logEndpoint_logConsoleId_fkey" FOREIGN KEY ("logConsoleId") REFERENCES public."logConsole"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2022-09-13 14:43:44 UTC

--
-- PostgreSQL database dump complete
--


    `)
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CardPossessionHistorics');
  }
};