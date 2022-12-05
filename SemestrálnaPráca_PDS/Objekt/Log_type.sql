create or replace type Log_Type
         as object(   
    id_zamestnanca INTEGER,
    datum DATE,
    zmena_poctu INTEGER,
     member function vypis return varchar2,
    map member function tried return varchar2
  );
  /

  create or replace type body Log_Type
is 
    member function vypis
    return varchar2
    is
    begin
        if zmena_poctu > 0 then
            return  rpad(to_char(datum,'DD.MM.YYYY'),12) ||'zamestnanec s id ' || rpad(id_zamestnanca, 6) || ' vlozil ' || rpad(zmena_poctu,4);
        elsif zmena_poctu < 0 then
            return  rpad(to_char(datum,'DD.MM.YYYY'),12) || 'zamestnanec s id ' || rpad(id_zamestnanca, 6) || ' vybral ' || rpad(abs(zmena_poctu),4);
        end if;
    end;

    map member function tried
    return integer
    is
    begin
        return zmena_poctu;
    end;

end;
/