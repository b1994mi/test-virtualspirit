CREATE OR REPLACE FUNCTION ON_UPDATE_CURRENT_TIMESTAMP() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ language 'plpgsql';

CREATE TABLE public.tasks
(
    id bigserial,
    title character varying(258) NOT NULL,
    description text NOT NULL,
    completed boolean NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TRIGGER updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE ON_UPDATE_CURRENT_TIMESTAMP();

CREATE INDEX ON public.tasks (id);
CREATE INDEX ON public.tasks (completed, updated_at);
CREATE INDEX ON public.tasks (updated_at);
