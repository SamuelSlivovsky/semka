create directory labat_sp as 'C:\Bloby_student\labat_sp\';

create or replace procedure insert_BLOB_into_table(tableName varchar2, blob_name varchar2)
is
    v_source_blob BFILE := BFILENAME('LABAT_SP', blob_name);
    v_size_blob integer;
    v_blob BLOB := EMPTY_BLOB();
    nove_id integer;
    poc_riadkov integer;
begin
    dbms_lob.open(v_source_blob, dbms_lob.lob_readonly);
        v_size_blob := dbms_lob.getlength(v_source_blob);
    
    if tableName = 'fotka' then
        select count(*) into poc_riadkov from fotka;
        if poc_riadkov = 0 then
            nove_id := 1;
        else
            select (max(id_fotky) + 1) into nove_id from fotka;
        end if;
        
        insert into fotka(id_fotky, fotka) 
            values(nove_id, EMPTY_BLOB())
                returning fotka into v_blob;
                
        dbms_lob.loadfromfile(v_blob, v_source_blob, v_size_blob);
        update fotka
            set fotka = v_blob
                where id_fotky = nove_id;           
                
    elsif tableName = 'priloha' then
        select count(*) into poc_riadkov from priloha;
        if poc_riadkov = 0 then
            nove_id := 1;
        else
            select (max(id_prilohy) + 1) into nove_id from priloha;
        end if;
        
        insert into priloha(id_prilohy, priloha) 
            values(nove_id, EMPTY_BLOB())
                returning priloha into v_blob;
                
        dbms_lob.loadfromfile(v_blob, v_source_blob, v_size_blob);
        update priloha
            set priloha = v_blob
                where id_prilohy = nove_id;               
    else
        raise_application_error( -20001, 'Invalid Table Name' );
    end if;
    
    dbms_lob.close(v_source_blob);
    
end;
/

exec insert_BLOB_into_table('fotka', 'defaultProfilePic.jpg');
exec insert_BLOB_into_table('fotka', 'pes.jpg');

select * from fotka;

exec insert_BLOB_into_table('priloha', 'RTG_hlava.jpg');
exec insert_BLOB_into_table('priloha', 'RTG_hrudnik.jpg');
exec insert_BLOB_into_table('priloha', 'RTG_krk.jpg');
exec insert_BLOB_into_table('priloha', 'RTG_panva.jpg');
exec insert_BLOB_into_table('priloha', 'RTG_zuby.jpg');
exec insert_BLOB_into_table('priloha', 'RTG_ruka.jpg');

select * from priloha;