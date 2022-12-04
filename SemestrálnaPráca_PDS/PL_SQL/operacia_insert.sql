ALTER SESSION SET NLS_DATE_FORMAT = 'DD.MM.YYYY';
set serveroutput on;

create or replace procedure generovanie_operacii_p -- procedura na vygenerovanie operacii
as
    type t_pacienti_id_tab is table of pacient.id_pacienta%type;
    type t_miestnosti_id_tab is table of miestnost.id_miestnosti%type;
    type t_insert_values_rec is record (
        p_id_operacie operacia.id_operacie%type,
        p_id_miestnosti operacia.id_miestnosti%type,
        p_id_zaznamu operacia.id_zaznamu%type,
        p_trvanie operacia.trvanie%type
    );
    type t_insert_values_tab is table of t_insert_values_rec;
    
    pacienti_id_tab t_pacienti_id_tab := t_pacienti_id_tab();
    miestnosti_id_tab t_miestnosti_id_tab := t_miestnosti_id_tab();
    insert_values t_insert_values_rec;
    insert_values_tab t_insert_values_tab := t_insert_values_tab();
    
    pocet_miestnosti integer;
    pocet_op_miestnost integer;
    index_operacie integer := 0;
    pocet_pacientov integer;
    
    prikaz varchar(500);
    posl_datum date;
begin   
    select id_miestnosti bulk collect into miestnosti_id_tab from miestnost join oddelenie using(id_oddelenia)
                                                                             join nemocnica using(id_nemocnice) where id_nemocnice between 1 and 3
                                                                                                                and id_typu_miestnosti = 2;
    select id_pacienta bulk collect into pacienti_id_tab from pacient;
    select count(*) into pocet_pacientov from pacient;
    for i in 1..miestnosti_id_tab.last
        loop
            pocet_op_miestnost := round(dbms_random.value(7, 20));
            insert_values.p_id_miestnosti := miestnosti_id_tab(i);
            posl_datum := to_date('01.01.2000','DD.MM.YYYY') + dbms_random.value(5, 320);
            for j in 1..pocet_op_miestnost
                loop
                    posl_datum := posl_datum + trunc(dbms_random.value(1, 100));
                    index_operacie := index_operacie + 1;                    
                    insert_values.p_id_operacie := index_operacie;     
                    insert_values.p_trvanie := round(dbms_random.value(60, 421)); 
                    generovanie_zdr_zazn_p(pacienti_id_tab(round(dbms_random.value(1, pocet_pacientov))), posl_datum);
                    insert_values.p_id_zaznamu := zdr_zazn_id_seq.currval;
                    insert_values_tab.extend();
                    insert_values_tab(insert_values_tab.LAST) := insert_values;
                end loop;      
        end loop;
     for k in 1..insert_values_tab.last   
        loop
            select 'insert into operacia(id_operacie, id_miestnosti, id_zaznamu, trvanie)' 
             || ' values (' || insert_values_tab(k).p_id_operacie || ', '    
             || insert_values_tab(k).p_id_miestnosti || ' ,' || insert_values_tab(k).p_id_zaznamu 
             || ', ' || insert_values_tab(k).p_trvanie || ')'  into prikaz from dual;
            --dbms_output.put_line(k || ' - ' || prikaz);
            execute immediate prikaz;
        end loop;
end;
/

select max(id_zaznamu) from zdravotny_zaznam;

create sequence zdr_zazn_id_seq start with 30000;
select zdr_zazn_id_seq.nextval from dual;
drop sequence zdr_zazn_id_seq;

create or replace trigger zdr_zazn_on_insert 
  before insert on zdravotny_zaznam
  for each row
begin
  select zdr_zazn_id_seq.nextval
  into :new.id_zaznamu
  from dual;
end;
/


create or replace procedure generovanie_zdr_zazn_p(id_pacienta integer,  posl_datum date) --vytvori pre operaciu zdravotny zaznam
as
    prikaz CLOB;
    popis CLOB := 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla nec est ut sagittis. Aenean consectetur sed lorem id viverra. Etiam bibendum lectus enim, sed hendrerit tellus dignissim non.';
begin
    select 'insert into zdravotny_zaznam(id_pacienta, id_prilohy, popis, datum)' 
      || ' values (' || id_pacienta || ', NULL, '''      
      || popis || ''', ''' || posl_datum ||  ''')'  into prikaz from dual;
    --dbms_output.put_line(prikaz);
    execute immediate prikaz;
end;
/

create or replace procedure generovanie_operacia_lekar_p --procedura na vygenerovanie dat tabulky operacia_lekar tak aby lekar bol zo spravneho oddelenia
as
    type tr_op_rec is record (
        p_id_miestnosti operacia.id_miestnosti%type,
        p_id_operacie operacia.id_operacie%type
    );
    type tt_op_tab is table of tr_op_rec;   
    op_tab tt_op_tab := tt_op_tab();
     
    type tt_lekari_tab is table of lekar.id_lekara%type;
    
    lekari_tab tt_lekari_tab := tt_lekari_tab();
     
    prikaz varchar(200);
    pocet_lekarov_op integer;
begin
    select id_miestnosti, id_operacie bulk collect into op_tab from operacia;
    for i in 1..op_tab.last  
        loop
        pocet_lekarov_op := trunc(dbms_random.value(1, 4));
            for lekar in (select id_lekara from 
                            (select id_lekara, dense_rank() over(order by id_lekara) rn from lekar
                                join zamestnanec using(id_zamestnanca)
                                    join miestnost on(zamestnanec.id_oddelenia = miestnost.id_oddelenia)
                                        where id_miestnosti = op_tab(i).p_id_miestnosti)
                                            where rn <= pocet_lekarov_op)
                loop
                    select 'insert into operacia_lekar(id_operacie, id_lekara)' 
                            || ' values (' || op_tab(i).p_id_operacie     
                            || ', ' || lekar.id_lekara ||  ')'  into prikaz from dual;
                            --dbms_output.put_line(prikaz);
                            execute immediate prikaz;
                end loop;                                       
        end loop;
end;
/


create or replace procedure generovanie_lekar_pacient_operacia_p --vytvorenie vztahu medzi lekarom a pacientom ak neexistuje v pripade operacie
as
begin
    for riadok in (select id_lekara, id_pacienta from operacia 
                    join operacia_lekar using(id_operacie) 
                        join zdravotny_zaznam using(id_zaznamu))
        loop
            if existuje_lekar_pacient_f(riadok.id_lekara,  riadok.id_pacienta) = false
                then
                    insert into lekar_pacient values (riadok.id_lekara, riadok.id_pacienta);
            end if;                  
        end loop;
end;
/

----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------

execute generovanie_operacii_p;
execute generovanie_operacia_lekar_p;
execute generovanie_lekar_pacient_operacia_p;

commit;

