create or replace function existuje_lekar_pacient_f(id_lekara_p integer, id_pacienta_p integer)
return boolean
is
poc_zaznamov_lekar_pacient integer;
begin
    select count(*) into poc_zaznamov_lekar_pacient
                from lekar_pacient
                    where id_lekara = id_lekara_p
                    and id_pacienta = id_pacienta_p;
            
            if poc_zaznamov_lekar_pacient = 0
                    then
                        return false;
            end if;
            return true;
end;
/