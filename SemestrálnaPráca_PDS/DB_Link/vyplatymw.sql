drop materialized view vyplaty_mw;        
                    
create materialized view vyplaty_mw
 refresh complete
  start with sysdate + 1
   next add_months(sysdate, 1)
   as select * from vyplata@db_link_vyplaty;
/