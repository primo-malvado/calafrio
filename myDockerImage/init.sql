
--CREATE USER docker;
--CREATE DATABASE docker;
--GRANT ALL PRIVILEGES ON DATABASE docker TO docker;



create TABLE migration(
    id bigserial not null,

    version bigint not null
);
INSERT INTO migration (version) VALUES (0);
INSERT INTO migration (version) VALUES (1);
INSERT INTO migration (version) VALUES (2);
INSERT INTO migration (version) VALUES (3);


