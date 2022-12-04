create or replace procedure generovanie_vysetreni_p
as
type t_lekar is record
(
    id_lekar lekar.id_lekara%type
);

type t_zaznam is record
(
    id_zaznam zdravotny_zaznam.id_zaznamu%type
);

type t_lekar_pacient is record
(
    id_lekar lekar_pacient.id_lekara%type,
    id_pacient lekar_pacient.id_pacienta%type
);

type t_lekari_kol is table of t_lekar;
lekari t_lekari_kol;

type t_zaznamy_kol is table of t_zaznam;
zaznamy t_zaznamy_kol;

type t_lekar_pacienti_kol is table of t_lekar_pacient;
lekar_pacienti t_lekar_pacienti_kol;

rnd_id_lekara integer;
rnd_id_zaznamu integer;
najdene_id_pacienta integer;
prikaz varchar2(1000);
poc_zaznamov_lekar_pacient integer;
pom integer := 1;

begin
    select id_lekara bulk collect into lekari
        from lekar;
    select id_zaznamu bulk collect into zaznamy
        from zdravotny_zaznam
            where id_zaznamu between 1 and 10000;
        
    lekar_pacienti := t_lekar_pacienti_kol();    
        
    -------------------------INSERTY VYSETRENIE----------------------------
        
    for i in 1 .. 10000
        loop
            rnd_id_lekara := lekari(round(dbms_random.value(1,lekari.last))).id_lekar;
            rnd_id_zaznamu := zaznamy(i).id_zaznam;
            select id_pacienta into najdene_id_pacienta
                from zdravotny_zaznam 
                    where id_zaznamu = rnd_id_zaznamu;
                    
            insert into vysetrenie values (i, rnd_id_lekara, rnd_id_zaznamu);
            
            if existuje_lekar_pacient_f(rnd_id_lekara, najdene_id_pacienta) = false
                    then
                        lekar_pacienti.extend();
                        lekar_pacienti(pom).id_lekar := rnd_id_lekara;
                        lekar_pacienti(pom).id_pacient := najdene_id_pacienta;
                        pom:= pom + 1;    
                        
            end if;        
        end loop;
        
       -------------------------INSERTY LEKAR_PACIENT----------------------------
    for i in 1 .. lekar_pacienti.last
        loop
            if existuje_lekar_pacient_f(lekar_pacienti(i).id_lekar,  lekar_pacienti(i).id_pacient) = false
                then
                    insert into lekar_pacient values (lekar_pacienti(i).id_lekar, lekar_pacienti(i).id_pacient);
            end if;    
        end loop;
end;
/

exec generovanie_vysetreni_p;




