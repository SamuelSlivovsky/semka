create or replace function getVysetreniaNemocnice_f(p_id_nemocnice integer)
return CLOB
is    
nemxml CLOB;
begin
      select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("vysetrenia", vysetrenia)
                          ), version '1.0'
              ).getclobval() into nemxml
      from (select (select XMLAgg(XMLElement("vysetrenie",
                                                        XMLElement("datum_vysetrenia", to_char(datum, 'DD.MM.YYYY')),
                                                        XMLElement("pacient", XMLAttributes(krvna_skupina as "typ_krvnej_skupiny",
                                                                                    pou.rod_cislo as "rodne_cislo"),
                                                                  XMLElement("meno", pou.meno || ' ' || pou.priezvisko)
                                                                  ),
                                                        XMLElement("lekar",
                                                                   XMLElement("meno", lou.meno || ' ' || lou.priezvisko)
                                                                             ),
                                                        XMLElement("popis", popis)                       
                                             )                    
                                  )                                              
                    from vysetrenie v join zdravotny_zaznam zz on(zz.id_zaznamu = v.id_zaznamu)
                                        join pacient p on(p.id_pacienta = zz.id_pacienta)
                                         join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                          join krvna_skupina ks on(ks.id_typu_krvnej_skupiny = p.id_typu_krvnej_skupiny)
                                           join lekar l on(v.id_lekara = l.id_lekara)
                                            join zamestnanec z on(z.id_zamestnanca = l.id_zamestnanca)
                                             join os_udaje lou on(lou.rod_cislo = z.rod_cislo)
                                              join oddelenie od on(z.id_oddelenia = od.id_oddelenia)
                                               where od.id_nemocnice = nem_out.id_nemocnice
                                                    
                    ) as vysetrenia, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = p_id_nemocnice);           
                    return nemxml;
end;
/