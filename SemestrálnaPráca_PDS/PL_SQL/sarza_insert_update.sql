create sequence log_liekov_seq
    start with 2314
    increment by 1;

create sequence sarza_seq
    start with 49368
    increment by 1;    
  

create or replace procedure sarza_insert_proc(pid_skladu integer, pid_lieku integer, pdat_expiracie date, ppocet_liekov integer, pid_zamestnanca integer)
is
id_sarze integer;
id_oddelenia_sarze integer;
id_oddelenia_zamestnanca integer;
begin

    select id_oddelenia into id_oddelenia_sarze
        from  sklad
            where id_skladu = pid_skladu;
            
    select id_oddelenia into id_oddelenia_zamestnanca
        from zamestnanec
            where id_zamestnanca = pid_zamestnanca;
            
    if id_oddelenia_sarze <> id_oddelenia_zamestnanca
        then
            RAISE_APPLICATION_ERROR(-20000, 'Tento lekar nepracuje na oddeleni v ktorom je ulozena sarza');
    end if;             

    if (ppocet_liekov > 1) and (pdat_expiracie > sysdate)
    then
        id_sarze := sarza_seq.nextval;
        insert into sarza values (id_sarze, pid_skladu, pid_lieku, pdat_expiracie, ppocet_liekov);
        insert into log_liekov values (log_liekov_seq.nextval, id_sarze, Log_Type(pid_zamestnanca, sysdate, ppocet_liekov));
    end if;    
end;
/

create or replace procedure sarza_update_proc(pid_sarze integer, ppocet_liekov integer, pid_zamestnanca integer)
is
akt_poc_liekov integer;
id_oddelenia_sarze integer;
id_oddelenia_zamestnanca integer;
begin
    select pocet_liekov into akt_poc_liekov
        from sarza
            where id_sarze = pid_sarze;
            
    select id_oddelenia into id_oddelenia_sarze
        from sarza join sklad using(id_skladu)
            where id_sarze = pid_sarze;
            
    select id_oddelenia into id_oddelenia_zamestnanca
        from zamestnanec
            where id_zamestnanca = pid_zamestnanca;
           
    if id_oddelenia_sarze <> id_oddelenia_zamestnanca
        then
            RAISE_APPLICATION_ERROR(-20000, 'Tento lekar nepracuje na oddeleni v ktorom je ulozena sarza');
    end if;            
            
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



select * from log_liekov
    where id_sarze = 734;
    
select * from sarza 
    where id_sarze = 734;
    
create or replace procedure uprava_sarze
as
    type t_zamestnanec is record
    (
        id_zamestnanca zamestnanec.id_zamestnanca%type,
        id_oddelenia zamestnanec.id_oddelenia%type
    );
        
    type t_sarza is record
    (
        id_sarze sarza.id_sarze%type,
        id_oddelenia sklad.id_oddelenia%type,
        pocet_liekov sarza.pocet_liekov%type
    );  
    
    type t_zamestnanci_kol is table of t_zamestnanec;
    zamestnanci t_zamestnanci_kol;
    
    type t_sarze_kol is table of t_sarza;
    sarze t_sarze_kol;
    
    rnd_zamestnanec t_zamestnanec;
    rnd_sarza t_sarza;

    rnd_pocet integer;
begin
    select id_sarze, id_oddelenia, pocet_liekov bulk collect into sarze
        from sarza join sklad using(id_skladu);
            
    for i in 1..10
    loop
        rnd_sarza := sarze(round(DBMS_RANDOM.VALUE (1, sarze.last)));
        
        select id_zamestnanca, id_oddelenia bulk collect into zamestnanci
            from zamestnanec
                where id_oddelenia = rnd_sarza.id_oddelenia;
        
        rnd_zamestnanec := zamestnanci(round(DBMS_RANDOM.VALUE (1, zamestnanci.last))); 
        rnd_pocet := round(DBMS_RANDOM.VALUE (0, rnd_sarza.pocet_liekov + 100));
        
        sarza_update_proc(rnd_sarza.id_sarze, rnd_pocet, rnd_zamestnanec.id_zamestnanca);
    end loop;
    
end;
/
