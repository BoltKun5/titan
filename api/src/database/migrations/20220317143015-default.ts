import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction({ autocommit: false });

    try {
      await queryInterface.sequelize.query(
        `
        --
        -- PostgreSQL database dump
        --
        
        -- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
        -- Dumped by pg_dump version 14.1
        
        -- Started on 2022-03-17 14:28:29 UTC
        
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
        
        SET default_tablespace = '';
        
        SET default_table_access_method = heap;
        
        --
        -- TOC entry 213 (class 1259 OID 144297)
        -- Name: cryptions; Type: TABLE; Schema: public; Owner: root
        --
        
        CREATE TABLE public.cryptions (
            id character varying(255) NOT NULL,
            type integer NOT NULL,
            algorithm character varying(255) NOT NULL,
            "createdAt" timestamp with time zone NOT NULL,
            "updatedAt" timestamp with time zone NOT NULL,
            "startDate" timestamp with time zone,
            "byteSize" integer DEFAULT 0,
            "endDate" timestamp with time zone,
            "logEndpointId" character varying(255),
            "durationMs" integer
        );
        
        
        ALTER TABLE public.cryptions OWNER TO root;
        
        --
        -- TOC entry 211 (class 1259 OID 16466)
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
        -- TOC entry 212 (class 1259 OID 16476)
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
        -- TOC entry 3189 (class 2606 OID 144303)
        -- Name: cryptions cryptions_pkey; Type: CONSTRAINT; Schema: public; Owner: root
        --
        
        ALTER TABLE ONLY public.cryptions
            ADD CONSTRAINT cryptions_pkey PRIMARY KEY (id);
        
        
        --
        -- TOC entry 3185 (class 2606 OID 16473)
        -- Name: logConsole logConsole_pkey; Type: CONSTRAINT; Schema: public; Owner: root
        --
        
        ALTER TABLE ONLY public."logConsole"
            ADD CONSTRAINT "logConsole_pkey" PRIMARY KEY (id);
        
        
        --
        -- TOC entry 3187 (class 2606 OID 16482)
        -- Name: logEndpoint logEndpoint_pkey; Type: CONSTRAINT; Schema: public; Owner: root
        --
        
        ALTER TABLE ONLY public."logEndpoint"
            ADD CONSTRAINT "logEndpoint_pkey" PRIMARY KEY (id);
        
        
        --
        -- TOC entry 3191 (class 2606 OID 149876)
        -- Name: cryptions cryptions_logEndpointId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
        --
        
        ALTER TABLE ONLY public.cryptions
            ADD CONSTRAINT "cryptions_logEndpointId_fkey" FOREIGN KEY ("logEndpointId") REFERENCES public."logEndpoint"(id) ON UPDATE CASCADE;
        
        
        --
        -- TOC entry 3190 (class 2606 OID 149869)
        -- Name: logEndpoint logEndpoint_logConsoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
        --
        
        ALTER TABLE ONLY public."logEndpoint"
            ADD CONSTRAINT "logEndpoint_logConsoleId_fkey" FOREIGN KEY ("logConsoleId") REFERENCES public."logConsole"(id) ON UPDATE CASCADE ON DELETE CASCADE;
        
        
        -- Completed on 2022-03-17 14:28:29 UTC
        
        --
        -- PostgreSQL database dump complete
        --
        
        
        `,

        { transaction },
      );

      return await transaction.commit();
    } catch (error) {
      console.error(error);
      await transaction.rollback();
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction({ autocommit: false });

    try {
      await queryInterface.dropAllTables({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
