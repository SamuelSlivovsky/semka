create sequence log_liekov_seq
    start with 2314
    increment by 1;

create sequence sarza_seq
    start with 49368
    increment by 1;    
  

create or replace procedure sarza_insert_proc(pid_skladu integer, pid_lieku integer, pdat_expiracie date, ppocet_liekov integer, pid_zamestnanca integer)
is
id_sarze integer;
begin
    if (ppocet_liekov > 1) and (pdat_expiracie > sysdate)
    then
        id_sarze := sarza_seq.nextval;
        insert into sarza values (id_sarze, pid_skladu, pid_lieku, pdat_expiracie, ppocet_liekov);
        insert into log_liekov values (log_liekov_seq.nextval, id_sarze, Log_Type(pid_zamestnanca ,sysdate, ppocet_liekov));
    end if;    
end;
/

create or replace procedure sarza_update_proc(pid_sarze integer, ppocet_liekov integer, pid_zamestnanca integer)
is
akt_poc_liekov integer;
begin
    select pocet_liekov into akt_poc_liekov
        from sarza
            where id_sarze = pid_sarze;
            
    if akt_poc_liekov = 0 and ppocet_liekov < 1
        then
            RAISE_APPLICATION_ERROR(-20000, 'Nie je mozne tento liek vybrat, nakolko je sarza prazdna');
        
    elsif akt_poc_liekov > ppocet_liekov
        then
            update sarza set pocet_liekov = ppocet_liekov
                where id_sarze = pid_sarze;
            insert into log_liekov values (log_liekov_seq.nextval, pid_sarze, Log_Type(pid_zamestnanca ,sysdate, ppocet_liekov - akt_poc_liekov));
    elsif akt_poc_liekov < ppocet_liekov
        then
            update sarza set pocet_liekov = ppocet_liekov
                where id_sarze = pid_sarze;
            insert into log_liekov values (log_liekov_seq.nextval, pid_sarze, Log_Type(pid_zamestnanca ,sysdate, akt_poc_liekov - ppocet_liekov));       
    end if;        
end;
/
