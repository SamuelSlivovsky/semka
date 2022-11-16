/*
Created: 29/10/2022
Modified: 13/11/2022
Model: semka_final_3
Database: Oracle 19c
*/


-- Drop relationships section -------------------------------------------------

ALTER TABLE operacia_lekar DROP CONSTRAINT Relationship132
/
ALTER TABLE operacia_lekar DROP CONSTRAINT Relationship131
/
ALTER TABLE log_liekov DROP CONSTRAINT Relationship130
/
ALTER TABLE ockovanie DROP CONSTRAINT Relationship129
/
ALTER TABLE zoznam_chorob DROP CONSTRAINT Relationship127
/
ALTER TABLE pacient_ZTP DROP CONSTRAINT Relationship126
/
ALTER TABLE zdravotny_zaznam DROP CONSTRAINT Relationship124
/
ALTER TABLE pacient DROP CONSTRAINT Relationship123
/
ALTER TABLE hospitalizacia DROP CONSTRAINT Relationship121
/
ALTER TABLE recept DROP CONSTRAINT Relationship119
/
ALTER TABLE hospitalizacia DROP CONSTRAINT Relationship118
/
ALTER TABLE miestnost DROP CONSTRAINT Relationship117
/
ALTER TABLE choroba DROP CONSTRAINT Relationship116
/
ALTER TABLE oddelenie DROP CONSTRAINT Relationship115
/
ALTER TABLE pacient DROP CONSTRAINT Relationship112
/
ALTER TABLE poistenec DROP CONSTRAINT Relationship111
/
ALTER TABLE zamestnanec DROP CONSTRAINT Relationship110
/
ALTER TABLE zdravotny_zaznam DROP CONSTRAINT Relationship109
/
ALTER TABLE zamestnanec DROP CONSTRAINT Relationship108
/
ALTER TABLE hospitalizacia DROP CONSTRAINT Relationship107
/
ALTER TABLE sestricka DROP CONSTRAINT Relationship106
/
ALTER TABLE pacient_ZTP DROP CONSTRAINT Relationship103
/
ALTER TABLE zoznam_chorob DROP CONSTRAINT Relationship101
/
ALTER TABLE vysetrenie DROP CONSTRAINT Relationship64
/
ALTER TABLE vysetrenie DROP CONSTRAINT Relationship62
/
ALTER TABLE ockovanie DROP CONSTRAINT Relationship58
/
ALTER TABLE operacia DROP CONSTRAINT Relationship57
/
ALTER TABLE operacia DROP CONSTRAINT Relationship56
/
ALTER TABLE sarza DROP CONSTRAINT Relationship53
/
ALTER TABLE sarza DROP CONSTRAINT Relationship50
/
ALTER TABLE sklad DROP CONSTRAINT Relationship45
/
ALTER TABLE hospitalizacia DROP CONSTRAINT Relationship99
/
ALTER TABLE hospitalizacia DROP CONSTRAINT Relationship38
/
ALTER TABLE lozko DROP CONSTRAINT Relationship37
/
ALTER TABLE miestnost DROP CONSTRAINT Relationship36
/
ALTER TABLE recept DROP CONSTRAINT Relationship32
/
ALTER TABLE recept DROP CONSTRAINT Relationship30
/
ALTER TABLE oddelenie DROP CONSTRAINT Relationship28
/
ALTER TABLE zamestnanec DROP CONSTRAINT Relationship20
/
ALTER TABLE pacient DROP CONSTRAINT Relationship19
/
ALTER TABLE lekar_pacient DROP CONSTRAINT Relationship18
/
ALTER TABLE lekar_pacient DROP CONSTRAINT Relationship17
/
ALTER TABLE obec DROP CONSTRAINT Relationship15
/
ALTER TABLE okres DROP CONSTRAINT Relationship14
/
ALTER TABLE lekar DROP CONSTRAINT Relationship11
/
ALTER TABLE nemocnica DROP CONSTRAINT Relationship8
/
ALTER TABLE os_udaje DROP CONSTRAINT Relationship1
/




-- Drop keys for tables section -------------------------------------------------

ALTER TABLE operacia_lekar DROP CONSTRAINT PK_operacia_lekar
/
ALTER TABLE log_liekov DROP CONSTRAINT PK_log_liekov
/
ALTER TABLE typ_miestnosti DROP CONSTRAINT PK_typ_miestnosti
/
ALTER TABLE typ_oddelenia DROP CONSTRAINT PK_typ_oddelenia
/
ALTER TABLE typ_choroby DROP CONSTRAINT PK_typ_choroby
/
ALTER TABLE krvna_skupina DROP CONSTRAINT PK_krvna_skupina
/
ALTER TABLE poistenec DROP CONSTRAINT PK_poistenec
/
ALTER TABLE fotka DROP CONSTRAINT PK_fotka
/
ALTER TABLE priloha DROP CONSTRAINT PK_priloha
/
ALTER TABLE sestricka DROP CONSTRAINT PK_sestricka
/
ALTER TABLE pacient_ZTP DROP CONSTRAINT PK_pacient_ZTP
/
ALTER TABLE typ_ZTP DROP CONSTRAINT PK_typ_ZTP
/
ALTER TABLE zoznam_chorob DROP CONSTRAINT PK_zoznam_chorob
/
ALTER TABLE choroba DROP CONSTRAINT PK_choroba
/
ALTER TABLE vysetrenie DROP CONSTRAINT PK_vysetrenie
/
ALTER TABLE ockovanie DROP CONSTRAINT PK_ockovanie
/
ALTER TABLE typ_ockovania DROP CONSTRAINT PK_typ_ockovania
/
ALTER TABLE operacia DROP CONSTRAINT PK_operacia
/
ALTER TABLE sarza DROP CONSTRAINT PK_sarza
/
ALTER TABLE liek DROP CONSTRAINT PK_liek
/
ALTER TABLE hospitalizacia DROP CONSTRAINT PK_hospitalizacia
/
ALTER TABLE lozko DROP CONSTRAINT PK_lozko
/
ALTER TABLE miestnost DROP CONSTRAINT PK_miestnost
/
ALTER TABLE poistovna DROP CONSTRAINT PK_poistovna
/
ALTER TABLE recept DROP CONSTRAINT PK_recept
/
ALTER TABLE sklad DROP CONSTRAINT PK_sklad
/
ALTER TABLE lekar_pacient DROP CONSTRAINT PK_lekar_pacient
/
ALTER TABLE okres DROP CONSTRAINT PK_okres
/
ALTER TABLE kraj DROP CONSTRAINT PK_kraj
/
ALTER TABLE lekar DROP CONSTRAINT PK_lekar
/
ALTER TABLE oddelenie DROP CONSTRAINT PK_oddelenie
/
ALTER TABLE nemocnica DROP CONSTRAINT PK_nemocnica
/
ALTER TABLE zdravotny_zaznam DROP CONSTRAINT PK_zdravotny_zaznam
/
ALTER TABLE pacient DROP CONSTRAINT PK_pacient
/
ALTER TABLE zamestnanec DROP CONSTRAINT PK_zamestnanec
/
ALTER TABLE obec DROP CONSTRAINT PK_obec
/
ALTER TABLE os_udaje DROP CONSTRAINT PK_os_udaje
/


-- Drop indexes section -------------------------------------------------

DROP INDEX IX_Relationship130
/
DROP INDEX IX_Relationship111
/
DROP INDEX IX_Relationship106
/
DROP INDEX IX_Relationship116
/
DROP INDEX IX_Relationship62
/
DROP INDEX IX_Relationship64
/
DROP INDEX IX_Relationship56
/
DROP INDEX IX_Relationship57
/
DROP INDEX IX_Relationship50
/
DROP INDEX IX_Relationship53
/
DROP INDEX IX_Relationship38
/
DROP INDEX IX_Relationship107
/
DROP INDEX IX_Relationship118
/
DROP INDEX IX_Relationship121
/
DROP INDEX IX_Relationship37
/
DROP INDEX IX_Relationship36
/
DROP INDEX IX_Relationship117
/
DROP INDEX IX_Relationship30
/
DROP INDEX IX_Relationship32
/
DROP INDEX IX_Relationship119
/
DROP INDEX IX_Relationship45
/
DROP INDEX IX_Relationship14
/
DROP INDEX IX_Relationship11
/
DROP INDEX IX_Relationship28
/
DROP INDEX IX_Relationship115
/
DROP INDEX IX_Relationship8
/
DROP INDEX IX_Relationship109
/
DROP INDEX IX_Relationship124
/
DROP INDEX IX_Relationship19
/
DROP INDEX IX_Relationship112
/
DROP INDEX IX_Relationship123
/
DROP INDEX IX_Relationship20
/
DROP INDEX IX_Relationship108
/
DROP INDEX IX_Relationship110
/
DROP INDEX IX_Relationship15
/
DROP INDEX IX_Relationship1
/


-- Drop tables section ---------------------------------------------------

DROP TABLE operacia_lekar CASCADE CONSTRAINTS PURGE
/
DROP TABLE log_liekov CASCADE CONSTRAINTS PURGE
/
DROP TABLE typ_miestnosti CASCADE CONSTRAINTS PURGE
/
DROP TABLE typ_oddelenia CASCADE CONSTRAINTS PURGE
/
DROP TABLE typ_choroby CASCADE CONSTRAINTS PURGE
/
DROP TABLE krvna_skupina CASCADE CONSTRAINTS PURGE
/
DROP TABLE poistenec CASCADE CONSTRAINTS PURGE
/
DROP TABLE fotka CASCADE CONSTRAINTS PURGE
/
DROP TABLE priloha CASCADE CONSTRAINTS PURGE
/
DROP TABLE sestricka CASCADE CONSTRAINTS PURGE
/
DROP TABLE pacient_ZTP CASCADE CONSTRAINTS PURGE
/
DROP TABLE typ_ZTP CASCADE CONSTRAINTS PURGE
/
DROP TABLE zoznam_chorob CASCADE CONSTRAINTS PURGE
/
DROP TABLE choroba CASCADE CONSTRAINTS PURGE
/
DROP TABLE vysetrenie CASCADE CONSTRAINTS PURGE
/
DROP TABLE ockovanie CASCADE CONSTRAINTS PURGE
/
DROP TABLE typ_ockovania CASCADE CONSTRAINTS PURGE
/
DROP TABLE operacia CASCADE CONSTRAINTS PURGE
/
DROP TABLE sarza CASCADE CONSTRAINTS PURGE
/
DROP TABLE liek CASCADE CONSTRAINTS PURGE
/
DROP TABLE hospitalizacia CASCADE CONSTRAINTS PURGE
/
DROP TABLE lozko CASCADE CONSTRAINTS PURGE
/
DROP TABLE miestnost CASCADE CONSTRAINTS PURGE
/
DROP TABLE poistovna CASCADE CONSTRAINTS PURGE
/
DROP TABLE recept CASCADE CONSTRAINTS PURGE
/
DROP TABLE sklad CASCADE CONSTRAINTS PURGE
/
DROP TABLE lekar_pacient CASCADE CONSTRAINTS PURGE
/
DROP TABLE okres CASCADE CONSTRAINTS PURGE
/
DROP TABLE kraj CASCADE CONSTRAINTS PURGE
/
DROP TABLE lekar CASCADE CONSTRAINTS PURGE
/
DROP TABLE oddelenie CASCADE CONSTRAINTS PURGE
/
DROP TABLE nemocnica CASCADE CONSTRAINTS PURGE
/
DROP TABLE zdravotny_zaznam CASCADE CONSTRAINTS PURGE
/
DROP TABLE pacient CASCADE CONSTRAINTS PURGE
/
DROP TABLE zamestnanec CASCADE CONSTRAINTS PURGE
/
DROP TABLE obec CASCADE CONSTRAINTS PURGE
/
DROP TABLE os_udaje CASCADE CONSTRAINTS PURGE
/
-- Drop user data types section --------------------------------------------------- 

DROP TYPE Log_Type
/


