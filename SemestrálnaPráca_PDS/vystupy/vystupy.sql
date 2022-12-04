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

--11.	Pacienti s najviac chorobami
select poradie "Poradie", meno "Meno", priezvisko "Priezvisko", pocet_chorob "Počet chorôb" from 
                    (select meno, priezvisko, count(*) as pocet_chorob, rank() over(order by count(*) desc) as poradie
                        from os_udaje join pacient using(rod_cislo)
                                join zoznam_chorob zo using(id_pacienta)
                                    group by meno, priezvisko, rod_cislo) s_out
                                    where poradie <= :pocet;

--12.	Pacienti s najviac operáciami
select meno "Meno", priezvisko "Priezvisko", pocet_operacii "Počet operácií" from
                (select meno, priezvisko, count(*) as pocet_operacii, rank() over(order by count(*) desc) as poradie
                     from os_udaje join pacient using(rod_cislo)
                                join zdravotny_zaznam using(id_pacienta)
                                 join operacia using(id_zaznamu)
                                  group by meno, priezvisko, rod_cislo)
                                   where poradie <= (:percent/100)*(select count(*) from os_udaje join pacient using(rod_cislo)
                                                                                         join zdravotny_zaznam using(id_pacienta)
                                                                                          join operacia using(id_zaznamu));

--13.	Pacienti s najviac hospitalizáciami
select meno "Meno", priezvisko "Priezvisko", pocet_hospitalizacii "Počet hospitalizácií" from
                (select meno, priezvisko, count(*) as pocet_hospitalizacii, rank() over(order by count(*) desc) as poradie
                    from os_udaje join pacient using(rod_cislo)
                                join zdravotny_zaznam using(id_pacienta)
                                 join hospitalizacia using(id_zaznamu)
                                  group by meno, priezvisko, rod_cislo)
                                   where poradie <= (:percent/100)*(select count(*) from os_udaje join pacient using(rod_cislo)
                                                                                         join zdravotny_zaznam using(id_pacienta)
                                                                                          join hospitalizacia using(id_zaznamu));

--14.	Najlepšie platený zamestnanci
select nazov_nemocnice "Nemocnica", nazov_oddelenia "Oddelenie", listagg(mpz, ', ')
            within group(order by zarobok desc) as "Najlepšie zarábajúci"
                from (select nazov_nemocnice, nazov_oddelenia, mpz, zarobok 
                    from (select nem.nazov as nazov_nemocnice,
                             tod.nazov as nazov_oddelenia, meno || ' ' || priezvisko || ' - ' || sum(suma) || ' eur' as mpz, sum(suma) as zarobok,
                                dense_rank() over(partition by od.id_oddelenia order by sum(suma) desc) as poradie
                                    from os_udaje osu join zamestnanec zam on(osu.rod_cislo = zam.rod_cislo)
                                                   join oddelenie od on(od.id_oddelenia = zam.id_oddelenia)
                                                    join typ_oddelenia tod on(od.id_typu_oddelenia = tod.id_typu_oddelenia)
                                                     join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                                      join vyplaty_mw vyp on(vyp.id_zamestnanca = zam.id_zamestnanca)
                                                        group by nem.id_nemocnice, nem.nazov, tod.nazov, meno, priezvisko, osu.rod_cislo, od.id_oddelenia)
                                  where poradie <= :pocet)                               
                 group by nazov_nemocnice, nazov_oddelenia;

--15.	Počty očkovaní podľa typu pre pacientov
select  meno || ' ' || priezvisko as Meno,
                    sum(case when id_typu_ockovania=1 then 1 else 0 end) as "Záškrt",
                    sum(case when id_typu_ockovania=2 then 1 else 0 end) as "Tetanus",
                    sum(case when id_typu_ockovania=3 then 1 else 0 end) as "čierny kašeľ",
                    sum(case when id_typu_ockovania=4 then 1 else 0 end) as "Vírusový zápal pečene typu B (žltačka typu B)",
                    sum(case when id_typu_ockovania=5 then 1 else 0 end) as "Hemofilové invazívne nákazy",
                    sum(case when id_typu_ockovania=6 then 1 else 0 end) as "Detská obrna",
                    sum(case when id_typu_ockovania=7 then 1 else 0 end) as "Pneumokokové invazívne ochorenia",
                    sum(case when id_typu_ockovania=8 then 1 else 0 end) as "Osýpky",
                    sum(case when id_typu_ockovania=9 then 1 else 0 end) as "Ružienka",
                    sum(case when id_typu_ockovania=10 then 1 else 0 end) as "Mumps"
            from os_udaje join pacient using(rod_cislo)
                        join zdravotny_zaznam using(id_pacienta)
                        left join ockovanie using(id_zaznamu)
            group by meno, priezvisko, rod_cislo;

--16.	Všetci zamestnanci všetkých oddelení
select n.nazov  "Nemocnica", typ.nazov as "Oddelenie",
                    listagg(ou.meno || ' ' || ou.priezvisko, ', ') within group (order by ou.priezvisko) as "Zamestnanci"
            from oddelenie o join typ_oddelenia typ on (typ.id_typu_oddelenia = o.id_typu_oddelenia)
                            join nemocnica n on (n.id_nemocnice = o.id_nemocnice)
                            join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
                            join os_udaje ou on (z.rod_cislo = ou.rod_cislo)
            group by n.nazov, n.id_nemocnice, typ.nazov, o.id_oddelenia;

--17.	Najčastejšie choroby roka
select poradie "Poradie",pocet_chorob "Počet chorôb" , nazov "Názov choroby" from
                (select nazov, rank() over (order by count(id_choroby) desc) as poradie,
                count(id_choroby) as pocet_chorob
                    from zoznam_chorob join choroba using(id_choroby)
                        where to_char(datum_od,'YYYY')= :rok
                        or to_char(datum_od,'YYYY')= :rok
                        group by nazov, id_choroby
                )
            where poradie <= :pocet
                order by poradie;

--18.	Neobsadené lôžka na najbližší týždeň na oddelení
select id_lozka from lozko 
                join miestnost using(id_miestnosti)
                where id_lozka not in
                (select id_lozka from hospitalizacia
                                    join zdravotny_zaznam using(id_zaznamu)
                                        where sysdate < dat_do
                                        and sysdate + 7 < dat_do)
                and id_oddelenia = :id_oddelenia
                order by id_lozka;

--19.	Najviac predpisované lieky roka
select poradie "Poradie", nazov_lieku "Liek", pocet_predpisani "Počet predpísaní" from
            (select l.nazov as nazov_lieku, count(*) as pocet_predpisani, rank() over(order by count(*) desc) as poradie 
                    from liek l join recept r on(l.id_lieku = r.id_lieku)
                        where to_char(datum, 'YYYY') = :rok
                            group by l.nazov, l.id_lieku
                    ) where poradie <= 0.10*(select count(*) from liek join recept using(id_lieku)  where to_char(datum, 'YYYY') = :rok);

--20.	Lieky s počtom menej ako
select n.nazov "Nemocnica", typ.nazov "Oddelenie",
                    l.nazov "Liek", sum(pocet_liekov) as "Počet lieku"
            from liek l join sarza sa on(l.id_lieku = sa.id_lieku)
                    join sklad sk on(sk.id_skladu = sa.id_skladu )
                    join oddelenie o on(o.id_oddelenia = sk.id_oddelenia)
                    join typ_oddelenia typ on (typ.id_typu_oddelenia = o.id_typu_oddelenia)
                    join nemocnica n on(n.id_nemocnice = o.id_nemocnice)
            group by n.nazov, typ.nazov,l.nazov
            having sum(pocet_liekov) < :pocet;

--21.	Menovci medzi pacientami a lekármi
select p.meno "Meno", p.priezvisko as "Pacientovo priezvisko", l.priezvisko as "Lekárovo priezvisko" 
                    from lekar_pacient join pacient using(id_pacienta)
                    join os_udaje p on(p.rod_cislo = pacient.rod_cislo)
                    join lekar using(id_lekara)
                    join zamestnanec using(id_zamestnanca)
                    join os_udaje l on(l.rod_cislo = zamestnanec.rod_cislo)
                where p.meno = l.meno;

--22.	Operácie podľa počtu lekárov a trvania
select to_char(datum,'DD.MM.YYYY') "Dátum operácie", meno_pacienta "Pacient", trvanie "Trvanie", lekari "Lekári", id_operacie "Id operácie"
                    from (select datum, pou.meno || ' ' || pou.priezvisko as meno_pacienta, trvanie, op.id_operacie, 
                            (select listagg(meno || ' ' || priezvisko, ', ') within group(order by priezvisko) 
                                from operacia_lekar ol join lekar l on(l.id_lekara = ol.id_lekara)
                                                            join zamestnanec z on(z.id_zamestnanca = l.id_zamestnanca)
                                                            join os_udaje lou on(lou.rod_cislo = z.rod_cislo) where ol.id_operacie = op.id_operacie) as lekari
                        from operacia_lekar ol join operacia op on(op.id_operacie = ol.id_operacie)
                                                join zdravotny_zaznam zz on(zz.id_zaznamu = op.id_zaznamu)
                                                join pacient p on(p.id_pacienta = zz.id_pacienta)
                                                join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                group by datum, pou.meno, pou.priezvisko, trvanie, op.id_operacie
                            having count(id_lekara) > :pocet_lekarov and trvanie > :trvanie)
                        order by trvanie desc;

--23.	Kraje podľa počtu operovaných
select kraj.nazov "Kraj", count(distinct rod_cislo)"Počet pacientov", dense_rank() over(order by count(distinct rod_cislo) desc) "Poradie" 
                from obec join okres using(id_okresu)
                join kraj using(id_kraja)
                join os_udaje using(PSC)
                join pacient using(rod_cislo)
                join zdravotny_zaznam using(id_pacienta)
                join operacia using(id_zaznamu)
                group by kraj.nazov, id_kraja
                order by dense_rank() over(order by count(distinct rod_cislo) desc);         