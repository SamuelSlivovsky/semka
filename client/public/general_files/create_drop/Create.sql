/*
Created: 29. 10. 2022
Modified: 9. 11. 2022
Model: semka_final_3
Database: Oracle 19c
*/


-- Create tables section -------------------------------------------------

-- Table os_udaje

CREATE TABLE os_udaje(
  rod_cislo Char(11 ) NOT NULL,
  PSC Char(5 ) NOT NULL,
  meno Varchar2(60 ) NOT NULL,
  priezvisko Varchar2(60 ) NOT NULL,
  tel Varchar2(20 ) NOT NULL,
  mail Varchar2(50 )
)
/

-- Create indexes for table os_udaje

CREATE INDEX IX_Relationship1 ON os_udaje (PSC)
/

-- Add keys for table os_udaje

ALTER TABLE os_udaje ADD CONSTRAINT PK_os_udaje PRIMARY KEY (rod_cislo)
/

-- Table obec

CREATE TABLE obec(
  PSC Char(5 ) NOT NULL,
  nazov Varchar2(60 ) NOT NULL,
  id_okresu Char(3 ) NOT NULL
)
/

-- Create indexes for table obec

CREATE INDEX IX_Relationship15 ON obec (id_okresu)
/

-- Add keys for table obec

ALTER TABLE obec ADD CONSTRAINT PK_obec PRIMARY KEY (PSC)
/

-- Table zamestnanec

CREATE TABLE zamestnanec(
  id_zamestnanca Integer NOT NULL,
  rod_cislo Char(11 ) NOT NULL,
  id_oddelenia Integer NOT NULL,
  id_fotky Integer,
  dat_od Date NOT NULL,
  dat_do Date
)
/

-- Create indexes for table zamestnanec

CREATE INDEX IX_Relationship20 ON zamestnanec (rod_cislo)
/

CREATE INDEX IX_Relationship108 ON zamestnanec (id_oddelenia)
/

CREATE INDEX IX_Relationship110 ON zamestnanec (id_fotky)
/

-- Add keys for table zamestnanec

ALTER TABLE zamestnanec ADD CONSTRAINT PK_zamestnanec PRIMARY KEY (id_zamestnanca)
/

-- Table pacient

CREATE TABLE pacient(
  id_pacienta Integer NOT NULL,
  rod_cislo Char(11 ),
  id_poistenca Integer
)
/

-- Create indexes for table pacient

CREATE INDEX IX_Relationship19 ON pacient (rod_cislo)
/

CREATE INDEX IX_Relationship112 ON pacient (id_poistenca)
/

-- Add keys for table pacient

ALTER TABLE pacient ADD CONSTRAINT PK_pacient PRIMARY KEY (id_pacienta)
/

-- Table zdravotna_karta

CREATE TABLE zdravotna_karta(
  id_pacienta Integer NOT NULL,
  id_typu_krvnej_skupiny Integer NOT NULL,
  datum_zalozenia Date NOT NULL
)
/

-- Create indexes for table zdravotna_karta

CREATE INDEX IX_Relationship5 ON zdravotna_karta (id_pacienta)
/

CREATE INDEX IX_Relationship113 ON zdravotna_karta (id_typu_krvnej_skupiny)
/

-- Add keys for table zdravotna_karta

ALTER TABLE zdravotna_karta ADD CONSTRAINT PK_zdravotna_karta PRIMARY KEY (id_pacienta)
/

-- Table zdravotny_zaznam

CREATE TABLE zdravotny_zaznam(
  id_zaznamu Integer NOT NULL,
  id_pacienta Integer,
  id_prilohy Integer,
  popis Clob NOT NULL,
  datum Date NOT NULL
)
/

-- Create indexes for table zdravotny_zaznam

CREATE INDEX IX_Relationship16 ON zdravotny_zaznam (id_pacienta)
/

CREATE INDEX IX_Relationship109 ON zdravotny_zaznam (id_prilohy)
/

-- Add keys for table zdravotny_zaznam

ALTER TABLE zdravotny_zaznam ADD CONSTRAINT PK_zdravotny_zaznam PRIMARY KEY (id_zaznamu)
/

-- Table nemocnica

CREATE TABLE nemocnica(
  id_nemocnice Integer NOT NULL,
  ICO Char(8 ) NOT NULL,
  nazov Varchar2(150 ) NOT NULL,
  ulica Varchar2(60 ) NOT NULL,
  PSC Char(5 ) NOT NULL
)
/

-- Create indexes for table nemocnica

CREATE INDEX IX_Relationship8 ON nemocnica (PSC)
/

-- Add keys for table nemocnica

ALTER TABLE nemocnica ADD CONSTRAINT PK_nemocnica PRIMARY KEY (id_nemocnice)
/

-- Table oddelenie

CREATE TABLE oddelenie(
  id_oddelenia Integer NOT NULL,
  id_nemocnice Integer NOT NULL,
  id_typu_oddelenia Integer NOT NULL
)
/

-- Create indexes for table oddelenie

CREATE INDEX IX_Relationship28 ON oddelenie (id_nemocnice)
/

CREATE INDEX IX_Relationship115 ON oddelenie (id_typu_oddelenia)
/

-- Add keys for table oddelenie

ALTER TABLE oddelenie ADD CONSTRAINT PK_oddelenie PRIMARY KEY (id_oddelenia)
/

-- Table lekar

CREATE TABLE lekar(
  id_lekara Integer NOT NULL,
  id_zamestnanca Integer NOT NULL,
  id_typu_lekara Integer NOT NULL
)
/

-- Create indexes for table lekar

CREATE INDEX IX_Relationship11 ON lekar (id_zamestnanca)
/

CREATE INDEX IX_Relationship104 ON lekar (id_typu_lekara)
/

-- Add keys for table lekar

ALTER TABLE lekar ADD CONSTRAINT PK_lekar PRIMARY KEY (id_lekara)
/

-- Table kraj

CREATE TABLE kraj(
  id_kraja Char(2 ) NOT NULL,
  nazov Varchar2(30 ) NOT NULL
)
/

-- Add keys for table kraj

ALTER TABLE kraj ADD CONSTRAINT PK_kraj PRIMARY KEY (id_kraja)
/

-- Table okres

CREATE TABLE okres(
  id_okresu Char(3 ) NOT NULL,
  nazov Varchar2(50 ) NOT NULL,
  id_kraja Char(2 ) NOT NULL
)
/

-- Create indexes for table okres

CREATE INDEX IX_Relationship14 ON okres (id_kraja)
/

-- Add keys for table okres

ALTER TABLE okres ADD CONSTRAINT PK_okres PRIMARY KEY (id_okresu)
/

-- Table lekar_pacient

CREATE TABLE lekar_pacient(
  id_lekara Integer NOT NULL,
  id_pacienta Integer NOT NULL
)
/

-- Add keys for table lekar_pacient

ALTER TABLE lekar_pacient ADD CONSTRAINT PK_lekar_pacient PRIMARY KEY (id_lekara,id_pacienta)
/

-- Table sklad

CREATE TABLE sklad(
  id_skladu Integer NOT NULL,
  id_oddelenia Integer NOT NULL
)
/

-- Create indexes for table sklad

CREATE INDEX IX_Relationship45 ON sklad (id_oddelenia)
/

-- Add keys for table sklad

ALTER TABLE sklad ADD CONSTRAINT PK_sklad PRIMARY KEY (id_skladu)
/

-- Table liek

CREATE TABLE liek(
  id_lieku Integer NOT NULL,
  id_sarze Integer NOT NULL
)
/

-- Create indexes for table liek

CREATE INDEX IX_Relationship52 ON liek (id_sarze)
/

-- Add keys for table liek

ALTER TABLE liek ADD CONSTRAINT PK_liek PRIMARY KEY (id_lieku)
/

-- Table recept

CREATE TABLE recept(
  id_receptu Integer NOT NULL,
  id_pacienta Integer NOT NULL,
  id_lieku Integer NOT NULL,
  id_lekara Integer NOT NULL,
  datum Date NOT NULL,
  datum_vyzdvihnutia Date
)
/

-- Create indexes for table recept

CREATE INDEX IX_Relationship30 ON recept (id_pacienta)
/

CREATE INDEX IX_Relationship31 ON recept (id_lieku)
/

CREATE INDEX IX_Relationship32 ON recept (id_lekara)
/

-- Add keys for table recept

ALTER TABLE recept ADD CONSTRAINT PK_recept PRIMARY KEY (id_receptu)
/

-- Table poistovna

CREATE TABLE poistovna(
  id_poistovne Integer NOT NULL,
  nazov Varchar2(50 ) NOT NULL
)
/

-- Add keys for table poistovna

ALTER TABLE poistovna ADD CONSTRAINT PK_poistovna PRIMARY KEY (id_poistovne)
/

-- Table miestnost

CREATE TABLE miestnost(
  id_miestnosti Integer NOT NULL,
  id_oddelenia Integer NOT NULL,
  id_typu_miestnosti Integer NOT NULL,
  nazov_miestnosti Varchar2(50 ) NOT NULL
)
/

-- Create indexes for table miestnost

CREATE INDEX IX_Relationship36 ON miestnost (id_oddelenia)
/

CREATE INDEX IX_Relationship117 ON miestnost (id_typu_miestnosti)
/

-- Add keys for table miestnost

ALTER TABLE miestnost ADD CONSTRAINT PK_miestnost PRIMARY KEY (id_miestnosti)
/

-- Table lozko

CREATE TABLE lozko(
  id_lozka Integer NOT NULL,
  id_miestnosti Integer NOT NULL
)
/

-- Create indexes for table lozko

CREATE INDEX IX_Relationship37 ON lozko (id_miestnosti)
/

-- Add keys for table lozko

ALTER TABLE lozko ADD CONSTRAINT PK_lozko PRIMARY KEY (id_lozka)
/

-- Table hospitalizacia

CREATE TABLE hospitalizacia(
  id_hospitalizacie Integer NOT NULL,
  id_pacienta Integer NOT NULL,
  id_lekara Integer NOT NULL,
  id_lozka Integer NOT NULL,
  id_sestricky Integer,
  dat_od Date NOT NULL,
  dat_do Date
)
/

-- Create indexes for table hospitalizacia

CREATE INDEX IX_Relationship38 ON hospitalizacia (id_pacienta)
/

CREATE INDEX IX_Relationship107 ON hospitalizacia (id_sestricky)
/

CREATE INDEX IX_Relationship118 ON hospitalizacia (id_lekara)
/

-- Add keys for table hospitalizacia

ALTER TABLE hospitalizacia ADD CONSTRAINT PK_hospitalizacia PRIMARY KEY (id_hospitalizacie)
/

-- Table typ_lieku

CREATE TABLE typ_lieku(
  id_typu_lieku Integer NOT NULL,
  nazov Varchar2(150 ) NOT NULL
)
/

-- Add keys for table typ_lieku

ALTER TABLE typ_lieku ADD CONSTRAINT PK_typ_lieku PRIMARY KEY (id_typu_lieku)
/

-- Table sarza

CREATE TABLE sarza(
  id_sarze Integer NOT NULL,
  id_skladu Integer NOT NULL,
  id_typu_lieku Integer NOT NULL,
  dat_expiracie Date NOT NULL,
  pocet_liekov Integer NOT NULL
)
/

-- Create indexes for table sarza

CREATE INDEX IX_Relationship50 ON sarza (id_typu_lieku)
/

CREATE INDEX IX_Relationship53 ON sarza (id_skladu)
/

-- Add keys for table sarza

ALTER TABLE sarza ADD CONSTRAINT PK_sarza PRIMARY KEY (id_sarze)
/

-- Table operacia

CREATE TABLE operacia(
  id_operacie Integer NOT NULL,
  id_lekara Integer NOT NULL,
  id_miestnosti Integer NOT NULL,
  id_zaznamu Integer,
  trvanie Integer NOT NULL
)
/

-- Create indexes for table operacia

CREATE INDEX IX_Relationship56 ON operacia (id_miestnosti)
/

CREATE INDEX IX_Relationship57 ON operacia (id_zaznamu)
/

-- Add keys for table operacia

ALTER TABLE operacia ADD CONSTRAINT PK_operacia PRIMARY KEY (id_operacie,id_lekara)
/

-- Table typ_ockovania

CREATE TABLE typ_ockovania(
  id_typu_ockovania Integer NOT NULL,
  nazov Varchar2(80 ) NOT NULL
)
/

-- Add keys for table typ_ockovania

ALTER TABLE typ_ockovania ADD CONSTRAINT PK_typ_ockovania PRIMARY KEY (id_typu_ockovania)
/

-- Table pacient_ockovanie

CREATE TABLE pacient_ockovanie(
  dat_ockovania Date NOT NULL,
  id_ockovania Integer NOT NULL,
  id_pacienta Integer NOT NULL
)
/

-- Add keys for table pacient_ockovanie

ALTER TABLE pacient_ockovanie ADD CONSTRAINT PK_pacient_ockovanie PRIMARY KEY (id_ockovania,id_pacienta,dat_ockovania)
/

-- Table vysetrenie

CREATE TABLE vysetrenie(
  id_vysetrenia Integer NOT NULL,
  id_lekara Integer NOT NULL,
  id_zaznamu Integer NOT NULL
)
/

-- Create indexes for table vysetrenie

CREATE INDEX IX_Relationship62 ON vysetrenie (id_lekara)
/

CREATE INDEX IX_Relationship64 ON vysetrenie (id_zaznamu)
/

-- Add keys for table vysetrenie

ALTER TABLE vysetrenie ADD CONSTRAINT PK_vysetrenie PRIMARY KEY (id_vysetrenia)
/

-- Table choroba

CREATE TABLE choroba(
  id_choroby Integer NOT NULL,
  id_typu_choroby Integer,
  nazov Varchar2(150 ) NOT NULL
)
/

-- Create indexes for table choroba

CREATE INDEX IX_Relationship116 ON choroba (id_typu_choroby)
/

-- Add keys for table choroba

ALTER TABLE choroba ADD CONSTRAINT PK_choroba PRIMARY KEY (id_choroby)
/

-- Table zoznam_chorob

CREATE TABLE zoznam_chorob(
  id_pacienta Integer NOT NULL,
  id_choroby Integer NOT NULL,
  datum_od Date NOT NULL,
  datum_do Date
)
/

-- Add keys for table zoznam_chorob

ALTER TABLE zoznam_chorob ADD CONSTRAINT PK_zoznam_chorob PRIMARY KEY (id_pacienta,id_choroby,datum_od)
/

-- Table typ_ZTP

CREATE TABLE typ_ZTP(
  id_typu_ztp Integer NOT NULL,
  nazov Varchar2(80 ) NOT NULL
)
/

-- Add keys for table typ_ZTP

ALTER TABLE typ_ZTP ADD CONSTRAINT PK_typ_ZTP PRIMARY KEY (id_typu_ztp)
/

-- Table pacient_ZTP

CREATE TABLE pacient_ZTP(
  id_pacienta Integer NOT NULL,
  id_typu_ztp Integer NOT NULL,
  dat_od Date NOT NULL,
  dat_do Date
)
/

-- Add keys for table pacient_ZTP

ALTER TABLE pacient_ZTP ADD CONSTRAINT PK_pacient_ZTP PRIMARY KEY (id_pacienta,id_typu_ztp,dat_od)
/

-- Table sestricka

CREATE TABLE sestricka(
  id_sestricky Integer NOT NULL,
  id_zamestnanca Integer NOT NULL
)
/

-- Create indexes for table sestricka

CREATE INDEX IX_Relationship106 ON sestricka (id_zamestnanca)
/

-- Add keys for table sestricka

ALTER TABLE sestricka ADD CONSTRAINT PK_sestricka PRIMARY KEY (id_sestricky)
/

-- Table typ_lekara

CREATE TABLE typ_lekara(
  id_typu_lekara Integer NOT NULL,
  nazov Varchar2(50 ) NOT NULL
)
/

-- Add keys for table typ_lekara

ALTER TABLE typ_lekara ADD CONSTRAINT PK_typ_lekara PRIMARY KEY (id_typu_lekara)
/

-- Table priloha

CREATE TABLE priloha(
  id_prilohy Integer NOT NULL,
  priloha Blob NOT NULL
)
/

-- Add keys for table priloha

ALTER TABLE priloha ADD CONSTRAINT PK_priloha PRIMARY KEY (id_prilohy)
/

-- Table fotka

CREATE TABLE fotka(
  id_fotky Integer NOT NULL,
  fotka Blob NOT NULL
)
/

-- Add keys for table fotka

ALTER TABLE fotka ADD CONSTRAINT PK_fotka PRIMARY KEY (id_fotky)
/

-- Table poistenec

CREATE TABLE poistenec(
  id_poistenca Integer NOT NULL,
  id_poistovne Integer NOT NULL
)
/

-- Create indexes for table poistenec

CREATE INDEX IX_Relationship111 ON poistenec (id_poistovne)
/

-- Add keys for table poistenec

ALTER TABLE poistenec ADD CONSTRAINT PK_poistenec PRIMARY KEY (id_poistenca)
/

-- Table krvna_skupina

CREATE TABLE krvna_skupina(
  id_typu_krvnej_skupiny Integer NOT NULL,
  krvna_skupina Varchar2(3 ) NOT NULL
)
/

-- Add keys for table krvna_skupina

ALTER TABLE krvna_skupina ADD CONSTRAINT PK_krvna_skupina PRIMARY KEY (id_typu_krvnej_skupiny)
/

-- Table typ_choroby

CREATE TABLE typ_choroby(
  id_typu_choroby Integer NOT NULL,
  typ Varchar2(50 ) NOT NULL
)
/

-- Add keys for table typ_choroby

ALTER TABLE typ_choroby ADD CONSTRAINT PK_typ_choroby PRIMARY KEY (id_typu_choroby)
/

-- Table typ_oddelenia

CREATE TABLE typ_oddelenia(
  id_typu_oddelenia Integer NOT NULL,
  nazov Varchar2(100 ) NOT NULL
)
/

-- Add keys for table typ_oddelenia

ALTER TABLE typ_oddelenia ADD CONSTRAINT PK_typ_oddelenia PRIMARY KEY (id_typu_oddelenia)
/

-- Table typ_miestnosti

CREATE TABLE typ_miestnosti(
  id_typu_miestnosti Integer NOT NULL,
  nazov Varchar2(50 ) NOT NULL
)
/

-- Add keys for table typ_miestnosti

ALTER TABLE typ_miestnosti ADD CONSTRAINT PK_typ_miestnosti PRIMARY KEY (id_typu_miestnosti)
/




-- Create foreign keys (relationships) section ------------------------------------------------- 

ALTER TABLE os_udaje ADD CONSTRAINT Relationship1 FOREIGN KEY (PSC) REFERENCES obec (PSC)
/



ALTER TABLE zdravotna_karta ADD CONSTRAINT Relationship5 FOREIGN KEY (id_pacienta) REFERENCES pacient (id_pacienta)
/



ALTER TABLE nemocnica ADD CONSTRAINT Relationship8 FOREIGN KEY (PSC) REFERENCES obec (PSC)
/



ALTER TABLE lekar ADD CONSTRAINT Relationship11 FOREIGN KEY (id_zamestnanca) REFERENCES zamestnanec (id_zamestnanca)
/



ALTER TABLE okres ADD CONSTRAINT Relationship14 FOREIGN KEY (id_kraja) REFERENCES kraj (id_kraja)
/



ALTER TABLE obec ADD CONSTRAINT Relationship15 FOREIGN KEY (id_okresu) REFERENCES okres (id_okresu)
/



ALTER TABLE zdravotny_zaznam ADD CONSTRAINT Relationship16 FOREIGN KEY (id_pacienta) REFERENCES zdravotna_karta (id_pacienta)
/



ALTER TABLE lekar_pacient ADD CONSTRAINT Relationship17 FOREIGN KEY (id_lekara) REFERENCES lekar (id_lekara)
/



ALTER TABLE lekar_pacient ADD CONSTRAINT Relationship18 FOREIGN KEY (id_pacienta) REFERENCES pacient (id_pacienta)
/



ALTER TABLE pacient ADD CONSTRAINT Relationship19 FOREIGN KEY (rod_cislo) REFERENCES os_udaje (rod_cislo)
/



ALTER TABLE zamestnanec ADD CONSTRAINT Relationship20 FOREIGN KEY (rod_cislo) REFERENCES os_udaje (rod_cislo)
/



ALTER TABLE oddelenie ADD CONSTRAINT Relationship28 FOREIGN KEY (id_nemocnice) REFERENCES nemocnica (id_nemocnice)
/



ALTER TABLE recept ADD CONSTRAINT Relationship30 FOREIGN KEY (id_pacienta) REFERENCES pacient (id_pacienta)
/



ALTER TABLE recept ADD CONSTRAINT Relationship31 FOREIGN KEY (id_lieku) REFERENCES liek (id_lieku)
/



ALTER TABLE recept ADD CONSTRAINT Relationship32 FOREIGN KEY (id_lekara) REFERENCES lekar (id_lekara)
/



ALTER TABLE miestnost ADD CONSTRAINT Relationship36 FOREIGN KEY (id_oddelenia) REFERENCES oddelenie (id_oddelenia)
/



ALTER TABLE lozko ADD CONSTRAINT Relationship37 FOREIGN KEY (id_miestnosti) REFERENCES miestnost (id_miestnosti)
/



ALTER TABLE hospitalizacia ADD CONSTRAINT Relationship38 FOREIGN KEY (id_pacienta) REFERENCES pacient (id_pacienta)
/



ALTER TABLE hospitalizacia ADD CONSTRAINT Relationship99 FOREIGN KEY (id_lozka) REFERENCES lozko (id_lozka)
/



ALTER TABLE sklad ADD CONSTRAINT Relationship45 FOREIGN KEY (id_oddelenia) REFERENCES oddelenie (id_oddelenia)
/



ALTER TABLE sarza ADD CONSTRAINT Relationship50 FOREIGN KEY (id_typu_lieku) REFERENCES typ_lieku (id_typu_lieku)
/



ALTER TABLE liek ADD CONSTRAINT Relationship52 FOREIGN KEY (id_sarze) REFERENCES sarza (id_sarze)
/



ALTER TABLE sarza ADD CONSTRAINT Relationship53 FOREIGN KEY (id_skladu) REFERENCES sklad (id_skladu)
/



ALTER TABLE operacia ADD CONSTRAINT Relationship54 FOREIGN KEY (id_lekara) REFERENCES lekar (id_lekara)
/



ALTER TABLE operacia ADD CONSTRAINT Relationship56 FOREIGN KEY (id_miestnosti) REFERENCES miestnost (id_miestnosti)
/



ALTER TABLE operacia ADD CONSTRAINT Relationship57 FOREIGN KEY (id_zaznamu) REFERENCES zdravotny_zaznam (id_zaznamu)
/



ALTER TABLE pacient_ockovanie ADD CONSTRAINT Relationship58 FOREIGN KEY (id_ockovania) REFERENCES typ_ockovania (id_typu_ockovania)
/



ALTER TABLE pacient_ockovanie ADD CONSTRAINT Relationship59 FOREIGN KEY (id_pacienta) REFERENCES zdravotna_karta (id_pacienta)
/



ALTER TABLE vysetrenie ADD CONSTRAINT Relationship62 FOREIGN KEY (id_lekara) REFERENCES lekar (id_lekara)
/



ALTER TABLE vysetrenie ADD CONSTRAINT Relationship64 FOREIGN KEY (id_zaznamu) REFERENCES zdravotny_zaznam (id_zaznamu)
/



ALTER TABLE zoznam_chorob ADD CONSTRAINT Relationship100 FOREIGN KEY (id_pacienta) REFERENCES zdravotna_karta (id_pacienta)
/



ALTER TABLE zoznam_chorob ADD CONSTRAINT Relationship101 FOREIGN KEY (id_choroby) REFERENCES choroba (id_choroby)
/



ALTER TABLE pacient_ZTP ADD CONSTRAINT Relationship102 FOREIGN KEY (id_pacienta) REFERENCES zdravotna_karta (id_pacienta)
/



ALTER TABLE pacient_ZTP ADD CONSTRAINT Relationship103 FOREIGN KEY (id_typu_ztp) REFERENCES typ_ZTP (id_typu_ztp)
/



ALTER TABLE lekar ADD CONSTRAINT Relationship104 FOREIGN KEY (id_typu_lekara) REFERENCES typ_lekara (id_typu_lekara)
/



ALTER TABLE sestricka ADD CONSTRAINT Relationship106 FOREIGN KEY (id_zamestnanca) REFERENCES zamestnanec (id_zamestnanca)
/



ALTER TABLE hospitalizacia ADD CONSTRAINT Relationship107 FOREIGN KEY (id_sestricky) REFERENCES sestricka (id_sestricky)
/



ALTER TABLE zamestnanec ADD CONSTRAINT Relationship108 FOREIGN KEY (id_oddelenia) REFERENCES oddelenie (id_oddelenia)
/



ALTER TABLE zdravotny_zaznam ADD CONSTRAINT Relationship109 FOREIGN KEY (id_prilohy) REFERENCES priloha (id_prilohy)
/



ALTER TABLE zamestnanec ADD CONSTRAINT Relationship110 FOREIGN KEY (id_fotky) REFERENCES fotka (id_fotky)
/



ALTER TABLE poistenec ADD CONSTRAINT Relationship111 FOREIGN KEY (id_poistovne) REFERENCES poistovna (id_poistovne)
/



ALTER TABLE pacient ADD CONSTRAINT Relationship112 FOREIGN KEY (id_poistenca) REFERENCES poistenec (id_poistenca)
/



ALTER TABLE zdravotna_karta ADD CONSTRAINT Relationship113 FOREIGN KEY (id_typu_krvnej_skupiny) REFERENCES krvna_skupina (id_typu_krvnej_skupiny)
/



ALTER TABLE oddelenie ADD CONSTRAINT Relationship115 FOREIGN KEY (id_typu_oddelenia) REFERENCES typ_oddelenia (id_typu_oddelenia)
/



ALTER TABLE choroba ADD CONSTRAINT Relationship116 FOREIGN KEY (id_typu_choroby) REFERENCES typ_choroby (id_typu_choroby)
/



ALTER TABLE miestnost ADD CONSTRAINT Relationship117 FOREIGN KEY (id_typu_miestnosti) REFERENCES typ_miestnosti (id_typu_miestnosti)
/



ALTER TABLE hospitalizacia ADD CONSTRAINT Relationship118 FOREIGN KEY (id_lekara) REFERENCES lekar (id_lekara)
/




