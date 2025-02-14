drop table if exists projects;

create table projects(

                         id integer AUTO_INCREMENT primary key,
                         project_id varchar(20) unique not null,
                         project_name varchar(20) not null,
                         project_description varchar(255) not null,
                         link varchar(399) not null

);