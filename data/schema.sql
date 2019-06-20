DROP TABLE IF EXISTS stop;
CREATE TABLE stop
(
	id     varchar primary key,
	ctr_id integer unique,
	name   varchar,
	lat    float,
	lon    float
);

--CREATE INDEX stop_i_ctr_id ON stop(ctr_id);


DROP TABLE IF EXISTS line;
CREATE TABLE line
(
	id   varchar primary key,
	name varchar
);


DROP TABLE IF EXISTS line_stop;
CREATE TABLE line_stop
(
	line_id varchar references line (id),
	stop_ctr_id integer references stop (ctr_id),
	seq     integer,
	primary key (line_id, stop_ctr_id)
);


DROP TABLE IF EXISTS journey;
CREATE TABLE journey
(
	line_id varchar references line (id),
	journey_id integer,
	start_date timestamp,
	primary key (line_id, journey_id)
);
