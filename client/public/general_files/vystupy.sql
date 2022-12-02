-- 1.	Počet pacientov oddelenia:
select count(distinct lp.id_pacienta) as pocet_pacientov from oddelenie o 
          join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
          join lekar l on (l.id_zamestnanca = z.id_zamestnanca)
          join lekar_pacient lp on (lp.id_lekara = l.id_lekara)
          where z.id_oddelenia = :id_oddelenia;

-- 2.	Počet zamestnancov oddelenia:
select count(id_zamestnanca) as pocet_zamestnancov from oddelenie o 
        join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
        where z.id_oddelenia = :id_oddelenia
        and (to_char(dat_od, 'YYYY') <= :rok 
          or to_char(dat_do, 'YYYY') >= :rok
            );

--3.	Počet vykonaných hospitalizácií:           
select count(id_hospitalizacie) as poc_hospit from hospitalizacia h 
          join zdravotny_zaznam z on (z.id_zaznamu = h.id_zaznamu)
          join lozko l on (l.id_lozka = h.id_lozka)
          join miestnost m on (m.id_miestnosti = l.id_miestnosti)
          where m.id_oddelenia = :id_oddelenia
          and to_char(z.datum,'YYYY') = :rok;

--4.	Počet vykonaných operácií:
select count(id_operacie) as poc_operacii from operacia o 
          join zdravotny_zaznam z on (z.id_zaznamu = o.id_zaznamu)
          join miestnost m on (m.id_miestnosti = o.id_miestnosti)
          where m.id_oddelenia = :id_oddelenia
          and to_char(z.datum,'YYYY') = :rok;

--5.	Počet vykonaných vyšetrení:
select count(id_vysetrenia) as poc_vys from vysetrenie v 
      join zdravotny_zaznam z on (z.id_zaznamu = v.id_zaznamu)
      join lekar l on (l.id_lekara = v.id_lekara)
      join zamestnanec zam on (zam.id_zamestnanca = l.id_zamestnanca)
      where zam.id_oddelenia = :id_oddelenia
      and to_char(z.datum,'YYYY') = :rok;

--6.	Podiel mužských a ženských pacientov:
select trunc(zeny, 2) as zeny, trunc(100-zeny, 2) as muzi from
          (select count(case when (substr(os.rod_cislo, 3, 1)) in ('5','6') then 1 else null end)/count(*)*100 as zeny
              from os_udaje os join pacient p on(p.rod_cislo = os.rod_cislo)
              join lekar_pacient lp on (lp.id_pacienta = p.id_pacienta)
              join lekar l on (l.id_lekara = lp.id_lekara)
              join zamestnanec z on (z.id_zamestnanca = l.id_zamestnanca)
              where z.id_oddelenia = :id_oddelenia)

--7.	Rozdelenie pacientov podľa veku:
select count(*) as pocet, trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek
            from pacient join os_udaje using(rod_cislo)
             group by trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
              order by 2;

--8.	Výplaty v mesiacoch:
select sum(case when to_char(datum, 'MM') = '01' then suma else 0 end) as Januar,
                sum(case when to_char(datum, 'MM') = '02' then suma else 0 end) as Februar,
                sum(case when to_char(datum, 'MM') = '03' then suma else 0 end) as Marec,
                sum(case when to_char(datum, 'MM') = '04' then suma else 0 end) as April,
                sum(case when to_char(datum, 'MM') = '05' then suma else 0 end) as Maj,
                sum(case when to_char(datum, 'MM') = '06' then suma else 0 end) as Jun,
                sum(case when to_char(datum, 'MM') = '07' then suma else 0 end) as Jul,
                sum(case when to_char(datum, 'MM') = '08' then suma else 0 end) as August,
                sum(case when to_char(datum, 'MM') = '09' then suma else 0 end) as September,
                sum(case when to_char(datum, 'MM') = '10' then suma else 0 end) as Oktober,
                sum(case when to_char(datum, 'MM') = '11' then suma else 0 end) as November,
                sum(case when to_char(datum, 'MM') = '12' then suma else 0 end) as December
                from nemocnica join oddelenie using(id_nemocnice)
                             join zamestnanec using(id_oddelenia)
                              join vyplaty_mw using(id_zamestnanca)
                                 where id_oddelenia = :id_oddelenia and to_char(datum, 'YYYY') = :rok;

--9.	Najlepšie zarábajúci zamestnanci:
--top 5
select  poradie, Zamestnanec, zarobok "Zárobok"
        from (select meno || ' ' || priezvisko as Zamestnanec ,nazov_nemocnice, nazov_oddelenia, zarobok, poradie 
          from (select meno, priezvisko, nem.nazov as nazov_nemocnice,
                   tod.nazov as nazov_oddelenia, sum(suma) as zarobok,
                      dense_rank() over(order by sum(suma) desc) as poradie
                          from os_udaje osu join zamestnanec zam on(osu.rod_cislo = zam.rod_cislo)
                                         join oddelenie od on(od.id_oddelenia = zam.id_oddelenia)
                                          join typ_oddelenia tod on(od.id_typu_oddelenia = tod.id_typu_oddelenia)
                                           join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                            join vyplaty_mw vyp on(vyp.id_zamestnanca = zam.id_zamestnanca)
                                             where od.id_oddelenia = :id_oddelenia and to_char(datum, 'YYYY') = :rok
                                              group by nem.id_nemocnice, nem.nazov, tod.nazov, meno, priezvisko, osu.rod_cislo, od.id_oddelenia)
                        where poradie <= 5);
                        

--10.	Počet typov krvnej skupiny u pacientov:
select krvna_skupina, count(id_typu_krvnej_skupiny) as pocet from krvna_skupina join pacient using(id_typu_krvnej_skupiny)
                                                                                    join lekar_pacient using(id_pacienta)
                                                                                    join lekar using(id_lekara)
                                                                                    join zamestnanec using(id_zamestnanca)
                                                                                    where id_oddelenia = :id_oddelenia
                                                                                        group by krvna_skupina;

         