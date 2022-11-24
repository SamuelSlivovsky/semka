--Vypisat pocet jednotlivych typov ockovani ku kazdemu pacientovi
select  meno || ' ' || priezvisko as meno,
        sum(case when id_typu_ockovania=1 then 1 else 0 end) as "Záškrt",
        sum(case when id_typu_ockovania=2 then 1 else 0 end) as "Tetanus",
        sum(case when id_typu_ockovania=3 then 1 else 0 end) as "Èierny kaše¾",
        sum(case when id_typu_ockovania=4 then 1 else 0 end) as "Vírusový zápal peèene typu B (žltaèka typu B)",
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

--Ku kazdemu oddeleniu v nemocnici vypisat doktorov a sestricky v nom
select n.nazov as nazov_nemocnice, typ.nazov as nazov_oddelenia,
        listagg(ou.meno || ' ' || ou.priezvisko, ', ') within group (order by ou.priezvisko) as "Zamestnanci"
from oddelenie o join typ_oddelenia typ on (typ.id_typu_oddelenia = o.id_typu_oddelenia)
                 join nemocnica n on (n.id_nemocnice = o.id_nemocnice)
                 join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
                 join os_udaje ou on (z.rod_cislo = ou.rod_cislo)
group by n.nazov, n.id_nemocnice, typ.nazov, o.id_oddelenia;

--Vypisat prve tri najcastejsie choroby v roku 2022
select nazov from
(select nazov,rank() over (order by count(id_choroby) desc) as rank
    from zoznam_chorob join choroba using(id_choroby)
        where to_char(datum_od,'YYYY')='2022'
        or to_char(datum_do,'YYYY')='2022'
        group by nazov, id_choroby
)
where rank<=3;

--Vypisat lozka ktore nebudu najblizsi tyzden obsadene na oddeleni s id 1
select id_lozka from lozko 
join miestnost using(id_miestnosti)
where id_lozka not in
(select id_lozka from hospitalizacia
                    join zdravotny_zaznam using(id_zaznamu)
                        where sysdate < dat_do
                        and sysdate + 7 < dat_do)
and id_oddelenia = 1
order by id_lozka;


--Vypisat lieky k oddeleniam v nemocnici, ktorych je v sklade na oddeleni menej ako 5
select n.nazov as nazov_nemocnice, typ.nazov nazov_oddelenia,
        l.nazov nazov_lieku, sum(pocet_liekov) as celkovy_pocet
from liek l join sarza sa on(l.id_lieku = sa.id_lieku)
          join sklad sk on(sk.id_skladu = sa.id_skladu )
          join oddelenie o on(o.id_oddelenia = sk.id_oddelenia)
          join typ_oddelenia typ on (typ.id_typu_oddelenia = o.id_typu_oddelenia)
          join nemocnica n on(n.id_nemocnice = o.id_nemocnice)
group by n.nazov, typ.nazov,l.nazov
having sum(pocet_liekov) < 5;

