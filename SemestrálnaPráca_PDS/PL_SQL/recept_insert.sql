create or replace procedure RECEPT_INSERT
as
type t_riadok is record (
     id_receptu recept.id_receptu%type,
     id_pacienta recept.id_pacienta%type,
     id_lieku recept.id_lieku%type,
     id_lekara recept.id_lekara%type,
     datum recept.datum%type,
     datum_vyzdvihnutia recept.datum_vyzdvihnutia%type
 );

type t_pole_id_pacienta is table of recept.id_pacienta%type;
pole_id_pacienta t_pole_id_pacienta;

type t_pole_id_lekara is table of recept.id_lekara%type;
pole_id_lekara t_pole_id_lekara;

type t_pole_id_lieku is table of recept.id_lieku%type;
pole_id_lieku t_pole_id_lieku;

max_id_receptu recept.id_receptu%type;
nove_id_pacienta recept.id_pacienta%type;
nove_id_lekara recept.id_lekara%type;
nove_id_lieku recept.id_lieku%type;
novy_datum varchar2(10);

novy_riadok t_riadok;

existuje_lekar_pacient boolean := false;

begin
    select max(id_receptu) into max_id_receptu from recept;

    select id_pacienta bulk collect into pole_id_pacienta from pacient;
    select id_lekara bulk collect into pole_id_lekara from lekar;
    select id_lieku bulk collect into pole_id_lieku from liek;

    for i in 1..10 loop
        --generuj id_receptu
        max_id_receptu := max_id_receptu + 1;

        --generuj validne id_pacienta a id_lekara
        while existuje_lekar_pacient = false loop
            nove_id_pacienta := pole_id_pacienta(dbms_random.value(1,pole_id_pacienta.last));
            nove_id_lekara := pole_id_lekara(dbms_random.value(1,pole_id_lekara.last));
            if EXISTUJE_LEKAR_PACIENT_F(nove_id_lekara, nove_id_pacienta) = true then
                existuje_lekar_pacient := true;
            end if;
        end loop;

        --generuj id_lieku
        nove_id_lieku := pole_id_lieku(dbms_random.value(1,pole_id_lieku.last));

        --generuj datum
        novy_datum := to_char(TO_DATE(TRUNC(DBMS_RANDOM.VALUE(TO_CHAR(DATE '2000-01-01', 'J'), TO_CHAR(DATE '2022-12-31', 'J'))), 'J'), 'DD.MON.YY');

        --vypis bygenerovane udaje
        dbms_output.put_line('novy insert: ' || max_id_receptu || ', ' || nove_id_pacienta || ', ' || nove_id_lieku || ', ' || nove_id_lekara || ', ' || novy_datum);

        --vytvor novy record
        novy_riadok.id_receptu := max_id_receptu;
        novy_riadok.id_pacienta := nove_id_pacienta;
        novy_riadok.id_lieku := nove_id_lieku;
        novy_riadok.id_lekara := nove_id_lekara;
        novy_riadok.datum := novy_datum;
        novy_riadok.datum_vyzdvihnutia := null;

        --insert
        insert into recept values(novy_riadok.id_receptu, novy_riadok.id_lieku, novy_riadok.id_pacienta, novy_riadok.id_lekara, novy_riadok.datum, novy_riadok.datum_vyzdvihnutia);

        existuje_lekar_pacient := false;
    end loop;

end;
