set serveroutput on;
create or replace procedure insert_hospitalizacie
is
    pacient int;
    datum_od date;
    oddelenie int;
    lekar int;
    zaznam int;
    vybrane_lozko int;
    sestricka int;
    datum_do date;
   
    
    type t_integre is table of integer;
    sestricky_oddelenia t_integre;
    lekari_oddelenia t_integre;
    
    type t_zac_hosp_pacienta is table of date;
    zac_datum_hosp_pacienta t_zac_hosp_pacienta;
    
begin
    for id_hospitalizacie in 1..11500
    loop
        zaznam := id_hospitalizacie + 18499;
        
        select id_pacienta,datum into pacient,datum_od from zdravotny_zaznam
        where id_zaznamu = zaznam;
        
        select datum bulk collect into zac_datum_hosp_pacienta from zdravotny_zaznam zz
        where id_pacienta = pacient
        and id_zaznamu >= 18500
        order by datum;
        
        for i in zac_datum_hosp_pacienta.first .. zac_datum_hosp_pacienta.last
        loop
            if(zac_datum_hosp_pacienta(i) = datum_od) then
                if(zac_datum_hosp_pacienta.exists(i+1)) then
                    datum_do:=datum_od + dbms_random.value(1,zac_datum_hosp_pacienta(i+1)-zac_datum_hosp_pacienta(i));    
                else
                    datum_do:=datum_od + dbms_random.value(1,30);
                    if(extract(year from datum_od)=2022) then
                        datum_do:=null;
                    end if;
                end if;
            end if;
        end loop;
              
        lekar:=dbms_random.value(1,1500);
        if(existuje_lekar_pacient_f(lekar,pacient)=false) then
            insert into lekar_pacient values(lekar,pacient);
        end if;
                
        select id_oddelenia into oddelenie from zamestnanec
            where id_zamestnanca = (select id_zamestnanca from lekar where id_lekara = lekar);
        
        for lozko_oddelenia in (select id_lozka from lozko l
                                    join miestnost m on(m.id_miestnosti = l.id_miestnosti and m.id_oddelenia = oddelenie))
        loop
            vybrane_lozko:=lozko_oddelenia.id_lozka;
            for hosp_lozko_oddelenia in (select dat_do,datum from hospitalizacia h
                                                    join zdravotny_zaznam zz on(zz.id_zaznamu = h.id_zaznamu)
                                                    join lozko l on (l.id_lozka = h.id_lozka and l.id_lozka = lozko_oddelenia.id_lozka))
            loop
                if(datum_do=null) then
                    vybrane_lozko:= -1;
                    exit;
                end if;
                if(hosp_lozko_oddelenia.datum > datum_od and  hosp_lozko_oddelenia.datum < datum_do) and (datum_do > hosp_lozko_oddelenia.dat_do) then 
                    datum_do:= hosp_lozko_oddelenia.datum;
                elsif(datum_od >= hosp_lozko_oddelenia.datum and  datum_od <= hosp_lozko_oddelenia.dat_do) then
                    vybrane_lozko := -1;
                    exit;
                elsif(datum_do > hosp_lozko_oddelenia.datum and datum_do < hosp_lozko_oddelenia.dat_do) then
                    if(datum_od < hosp_lozko_oddelenia.datum) then
                        datum_do := hosp_lozko_oddelenia.datum;
                    end if;
                end if;
            end loop;
            if(vybrane_lozko <> -1) then
             exit;
             end if;
        end loop;
                
        select id_sestricky bulk collect into sestricky_oddelenia
                from sestricka s join zamestnanec z on (z.id_zamestnanca = s.id_zamestnanca 
                                                            and z.id_oddelenia=oddelenie);
        if(sestricky_oddelenia.count = 0) then
            sestricka:= null;
        else
            sestricka:= sestricky_oddelenia(dbms_random.value(1,sestricky_oddelenia.count));
        end if;
        
        insert into hospitalizacia values(id_hospitalizacie, lekar, zaznam, vybrane_lozko, sestricka, datum_do);
    end loop;    
end;
/

exec insert_hospitalizacie;
commit;
