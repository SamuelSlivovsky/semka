--select ktory vypise x pacientov s najviac chorobami
                 	               
select meno, priezvisko, pocet_chorob from 
    (select meno, priezvisko, count(*) as pocet_chorob, dense_rank() over(order by count(*) desc) as poradie
        from os_udaje join pacient using(rod_cislo)
                        join zoznam_chorob zo using(id_pacienta)
                            group by meno, priezvisko, rod_cislo) s_out
                            where poradie <= 5;

--x % najviac ockovanych pacientov
                            
select meno, priezvisko, pocet_operacii from
    (select meno, priezvisko, count(*) as pocet_operacii, rank() over(order by count(*) desc) as poradie
        from os_udaje join pacient using(rod_cislo)
                        join zdravotny_zaznam using(id_pacienta)
                         join operacia using(id_zaznamu)
                          group by meno, priezvisko, rod_cislo)
                           where poradie <= 0.01*(select count(*) from os_udaje join pacient using(rod_cislo)
                                                                                 join zdravotny_zaznam using(id_pacienta)
                                                                                  join operacia using(id_zaznamu));

--x % najviac hospitalizovanych pacientov

select meno, priezvisko, pocet_hospitalizacii from
    (select meno, priezvisko, count(*) as pocet_hospitalizacii, rank() over(order by count(*) desc) as poradie
        from os_udaje join pacient using(rod_cislo)
                        join zdravotny_zaznam using(id_pacienta)
                         join hospitalizacia using(id_zaznamu)
                          group by meno, priezvisko, rod_cislo)
                           where poradie <= 0.01*(select count(*) from os_udaje join pacient using(rod_cislo)
                                                                                 join zdravotny_zaznam using(id_pacienta)
                                                                                  join hospitalizacia using(id_zaznamu));

--oddelenia a ich zamestnanci s celkovymi vyplatami

select nazov_nemocnice, nazov_oddelenia, listagg(mpz, ', ')
                            within group(order by zarobok desc)
                                from (select nem.nazov as nazov_nemocnice,
                                             tod.nazov as nazov_oddelenia, meno || ' ' || priezvisko || ' - ' || sum(suma) || ' eur' as mpz, sum(suma) as zarobok        
                                                from os_udaje osu join zamestnanec zam on(osu.rod_cislo = zam.rod_cislo)
                                                                   join oddelenie od on(od.id_oddelenia = zam.id_oddelenia)
                                                                    join typ_oddelenia tod on(od.id_typu_oddelenia = tod.id_typu_oddelenia)
                                                                     join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                                                      join vyplata@db_link_vyplaty vyp on(vyp.id_zamestnanca = zam.id_zamestnanca)
                                                                       group by nem.nazov, tod.nazov, meno, priezvisko, osu.rod_cislo, od.id_oddelenia, nem.id_nemocnice)
                                                                        group by nazov_nemocnice, nazov_oddelenia;
                                                                        
--oddelenia a x zamestnancov s najvyssou sumou vyplat                                                                     
                                                                        
select nazov_nemocnice, nazov_oddelenia, listagg(mpz, ', ')
                            within group(order by zarobok desc)
                                from (select nazov_nemocnice, nazov_oddelenia, mpz, zarobok 
                                    from (select nem.nazov as nazov_nemocnice,
                                             tod.nazov as nazov_oddelenia, meno || ' ' || priezvisko || ' - ' || sum(suma) || ' eur' as mpz, sum(suma) as zarobok,
                                                dense_rank() over(partition by od.id_oddelenia order by sum(suma) desc) as poradie
                                                    from os_udaje osu join zamestnanec zam on(osu.rod_cislo = zam.rod_cislo)
                                                                   join oddelenie od on(od.id_oddelenia = zam.id_oddelenia)
                                                                    join typ_oddelenia tod on(od.id_typu_oddelenia = tod.id_typu_oddelenia)
                                                                     join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                                                      join vyplata@db_link_vyplaty vyp on(vyp.id_zamestnanca = zam.id_zamestnanca)
                                                                       where zam.id_zamestnanca in(select id_zamestnanca from lekar)
                                                                        group by nem.id_nemocnice, nem.nazov, tod.nazov, meno, priezvisko, osu.rod_cislo, od.id_oddelenia)
                                                  where poradie <= 5)                               
                                 group by nazov_nemocnice, nazov_oddelenia;


-- x% najviac predpisovanych liekov za rok XXXX

select nazov_lieku, pocet_predpisani, poradie from
    (select l.nazov as nazov_lieku, count(*) as pocet_predpisani, rank() over(order by count(*) desc) as poradie 
            from liek l join recept r on(l.id_lieku = r.id_lieku)
                where to_char(datum, 'YYYY') = '2020'
                    group by l.nazov, l.id_lieku
            ) where poradie <= 0.10*(select count(*) from liek join recept using(id_lieku)  where to_char(datum, 'YYYY') = '2020');


--sumy vyplat za jednotlive mesiace vybraneho roka pre nemocnice

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
                         join vyplata@db_link_vyplaty using(id_zamestnanca)
                            where id_nemocnice = 1;





