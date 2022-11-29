--pre vsetky pripady, kedy pacient ma rovnake krstne meno ako jeho lekar, vypis ich krstne meno a priezviska
select p.meno, p.priezvisko as priezvisko_pacient, l.priezvisko as priezvisko_lekar 
from lekar_pacient join pacient using(id_pacienta)
join os_udaje p on(p.rod_cislo = pacient.rod_cislo)
join lekar using(id_lekara)
join zamestnanec using(id_zamestnanca)
join os_udaje l on(l.rod_cislo = zamestnanec.rod_cislo)
where p.meno = l.meno;

--vypis operacie, ktory sa zucastnili aspon 3 lekari a ktore trvali aspon 300 minut
select id_operacie, trvanie, count(id_lekara) as pocet_lekarov
from operacia_lekar join operacia using(id_operacie)
group by id_operacie, trvanie
having count(id_lekara) > 2 and trvanie > 300
order by trvanie desc;

--zorad okresy podla poctu ludi, ktori boli operovani
select kraj.nazov, count(distinct rod_cislo), dense_rank() over(order by count(distinct rod_cislo) desc) as poradie 
from obec join okres using(id_okresu)
join kraj using(id_kraja)
join os_udaje using(PSC)
join pacient using(rod_cislo)
join zdravotny_zaznam using(id_pacienta)
join operacia using(id_zaznamu)
group by kraj.nazov
order by poradie;

--vypis pacientov, ktorym bola diagnostikovana choroba v piatok 13. a nazov tejto choroby
select meno, priezvisko, nazov
from os_udaje join pacient using(rod_cislo)
join zoznam_chorob using(id_pacienta)
join choroba using(id_choroby)
where to_char(datum_od, 'D') = '5' and to_char(datum_od, 'DD') = '13'
order by meno, priezvisko;

--aky je priemerny vek lekara
select 
(select sum(vek) from
(select extract(year from sysdate) - extract(year from datum_narodenia) as vek
from (select to_date(substr(rod_cislo, 5, 2) || '.' || (case when substr(rod_cislo, 3, 1) = '5' then '0' when substr(rod_cislo, 3, 1) = '6' then '1' end) 
|| substr(rod_cislo, 4, 1) ||  '.19' || substr(rod_cislo, 1, 2), 'DD.MM.YYYY') as datum_narodenia
from os_udaje join zamestnanec using(rod_cislo)
join lekar using(id_zamestnanca)))) /
(select count(distinct id_zamestnanca) from lekar) as priemerny_vek
from dual;
