--select pre vsetky vysetrenia, operacia a hospitalizacie. Treba oddelit podla typu. 
--Ku kazdej z nich aj pacienta, lekara a asi oddelenie.

select * from zdravotny_zaznam join operacia using(id_zaznamu)
                                join pacient using(id_pacienta)
                                 join os_udaje using(rod_cislo);
                                 
select * from zdravotny_zaznam join vysetrenie using(id_zaznamu)
                                join pacient using(id_pacienta)
                                 join os_udaje using(rod_cislo);                                 
                                 
select * from zdravotny_zaznam join hospitalizacia using(id_zaznamu)
                                join pacient using(id_pacienta)
                                 join os_udaje using(rod_cislo);                                 
                                 
select * from zdravotny_zaznam join ockovanie using(id_zaznamu)
                                join pacient using(id_pacienta)
                                 join os_udaje using(rod_cislo)
                                  join typ_ockovania using(id_typu_ockovania);                                   
                                
--select pre vypisanie poctu lekarov danej nemocnice

select count(*) from nemocnica join oddelenie using(id_nemocnice)
                                join zamestnanec using(id_oddelenia)
                                 join lekar using(id_zamestnanca) where id_nemocnice = 1;
 

--select pre vypisanie poctu vykonanych operacii danej nemocnice

select count(*) from operacia join miestnost using(id_miestnosti)
                               join oddelenie using(id_oddelenia)
                                join nemocnica using(id_nemocnice) where id_nemocnice  = 3;

--select pre vypisanie poctu vykonanych hospitalizacii danej nemocnice

select count(*) from hospitalizacia join lozko using(id_lozka)
                                     join miestnost using(id_miestnosti)
                                      join oddelenie using(id_oddelenia)
                                       join nemocnica using(id_nemocnice) where id_nemocnice  = 1;

--select pre vypisanie poctu vykonanych vysetreni danej nemocnice

select count(*) from vysetrenie join lekar using(id_lekara)
                                 join zamestnanec using(id_zamestnanca)
                                  join oddelenie using(id_oddelenia)
                                   join nemocnica using(id_nemocnice) where id_nemocnice = 1;

--select ktory vypise percentualny podiel medzi zenami a muzmi

select round(zeny) as zeny, round(100-zeny) as muzi from
    (select count(case when (substr(rod_cislo, 3, 1)) in ('5','6') then 1 else null end)/count(*)*100 as zeny
        from os_udaje join pacient using(rod_cislo));

--select ktory vypise podiel vekovych kategorii pacientov

select count(*), trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as vek
    from pacient join os_udaje using(rod_cislo)
     group by trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
      order by 2;

--select ktory vypise podiel jednotlivych chorob medzi pacientami

select count(*), nazov from pacient join zoznam_chorob using(id_pacienta)
                                     join choroba using(id_choroby)
                                        group by nazov, id_choroby
                                         order by 1 desc;

--select ktory vypise cloveka s najviac chorobami
			    
            
select count(*), meno, priezvisko from os_udaje
    join pacient using(rod_cislo)
     join zoznam_chorob using(id_pacienta)
       group by meno, priezvisko, rod_cislo
        having count(*) = (select max(count(*)) from os_udaje
                                join pacient using(rod_cislo)
                                 join zoznam_chorob using(id_pacienta)
                                     group by rod_cislo);


--select ktory vypise cloveka s najviac postihnutiami
			    
select count(*), meno, priezvisko from os_udaje
    join pacient using(rod_cislo)
     join pacient_ztp using(id_pacienta)
       group by meno, priezvisko, rod_cislo
        having count(*) = (select max(count(*)) from os_udaje
                                join pacient using(rod_cislo)
                                 join pacient_ztp using(id_pacienta)
                                     group by rod_cislo);                
                
                
--select ktory vypise cloveka s najviac operaciami

select count(*), meno, priezvisko from os_udaje
    join pacient using(rod_cislo)
     join zdravotny_zaznam using(id_pacienta)
      join operacia using(id_zaznamu)
       group by meno, priezvisko, rod_cislo
        having count(*) = (select max(count(*)) from os_udaje
                                join pacient using(rod_cislo)
                                 join zdravotny_zaznam using(id_pacienta)
                                  join operacia using(id_zaznamu)
                                     group by rod_cislo);   

--select ktory vypise cloveka s najviac vysetreniami

select count(*), meno, priezvisko from os_udaje
    join pacient using(rod_cislo)
     join zdravotny_zaznam using(id_pacienta)
      join vysetrenie using(id_zaznamu)
       group by meno, priezvisko, rod_cislo
        having count(*) = (select max(count(*)) from os_udaje
                                join pacient using(rod_cislo)
                                 join zdravotny_zaznam using(id_pacienta)
                                  join vysetrenie using(id_zaznamu)
                                     group by rod_cislo);   

--select pre vypisanie receptov pacienta                                 
                                 
select * from recept join pacient using(id_pacienta);                               
                                    