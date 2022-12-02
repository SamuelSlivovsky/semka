create or replace function getHospitalizacieNemocnice_f(p_id_nemocnice integer)
return CLOB
is    
nemxml CLOB;
begin
    select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("hospitalizacie", hospitalizacie)
                          ), version '1.0'
              ).getclobval() into nemxml
      from (select (select XMLAgg(XMLElement("hospitalizacia",
                                             XMLElement("datum_hospitalizacie", zz.datum),
                                             XMLElement("datum_ukoncenia", h.dat_do),
                                             XMLElement("pacient", XMLAttributes(pks.krvna_skupina as "typ_krvnej_skupiny",
                                                                        pou.rod_cislo as "rodne_cislo"),
                                                                   XMLElement("meno", pou.meno || ' ' || pou.priezvisko)
                                                        ),
                                             XMLElement("lekar",
                                                        XMLElement("meno", lou.meno || ' ' || lou.priezvisko)
                                                        ),
                                             XMLElement("sestricka",
                                                        XMLElement("meno", sou.meno || ' ' || sou.priezvisko)
                                                        ),     
                                             XMLElement("miestnost", XMLAttributes(m.nazov_miestnosti as "nazov"), 
                                                        XMLElement("lozko", XMLAttributes(h.id_lozka as "id"))
                                                        ),
                                             XMLElement("popis", popis)           
                                             )
                                  ) from hospitalizacia h join lozko loz on(loz.id_lozka = h.id_lozka)
                                                           join miestnost m on(m.id_miestnosti = loz.id_miestnosti)
                                                            join sestricka s on(s.id_sestricky = h.id_sestricky)
                                                             join zamestnanec zs on(zs.id_zamestnanca = s.id_zamestnanca)
                                                              join os_udaje sou on(sou.rod_cislo = zs.rod_cislo)
                                                               join lekar l on(l.id_lekara = h.id_lekara)
                                                                join zamestnanec zl on(zl.id_zamestnanca = l.id_zamestnanca)
                                                                 join os_udaje lou on(lou.rod_cislo = zl.rod_cislo)
                                                                  join zdravotny_zaznam zz on(zz.id_zaznamu = h.id_zaznamu)
                                                                   join pacient p on(p.id_pacienta = zz.id_pacienta)
                                                                    join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                                                     join krvna_skupina pks on(pks.id_typu_krvnej_skupiny = p.id_typu_krvnej_skupiny) 
                                                                      join oddelenie od on(od.id_oddelenia = m.id_oddelenia)
                                                                       join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                                                        where nem.id_nemocnice = nem_out.id_nemocnice
                    ) as hospitalizacie, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = p_id_nemocnice);
                    return nemxml;
end;
/

create or replace function getOperacieNemocnice_f(p_id_nemocnice integer)
return CLOB
is    
nemxml CLOB;
begin
    select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("operacie", operacie)
                          ), version '1.0'
              ).getclobval() into nemxml
      from (select (select XMLAgg(XMLElement("operacia",
                                             XMLElement("datum_operacie", datum),
                                             XMLElement("lekari", lekari),
                                             XMLElement("miestnost", nazov_miestnosti),    
                                             XMLElement("trvanie_v_minutach", trvanie), 
                                             XMLElement("pacient", XMLAttributes(krvna_skupina as "typ_krvnej_skupiny",
                                                                        rod_cislo_pacienta as "rodne_cislo"),
                                                                   XMLElement("meno", meno_pacienta || ' ' || priezvisko_pacienta)
                                                        ),
                                            XMLElement("popis", popis)            
                                            )       
                                    ) 
                    from (select (select XMLAgg(XMLElement("lekar",
                                                   XMLElement("meno", meno || ' ' || priezvisko),
                                                   XMLElement("oddelenie", nazov)
                                                          )
                                               )
                         from operacia_lekar ol join lekar l on(l.id_lekara = ol.id_lekara)
                                              join zamestnanec z on(z.id_zamestnanca = l.id_zamestnanca)
                                               join os_udaje ou on(ou.rod_cislo = z.rod_cislo)
                                                join oddelenie od on(od.id_oddelenia = z.id_oddelenia)
                                                 join typ_oddelenia tod on(tod.id_typu_oddelenia = od.id_typu_oddelenia)
                                                  where ol.id_operacie = op.id_operacie
                                  ) as lekari,
                                  nazov_miestnosti, datum, trvanie, krvna_skupina, popis,
                                  os_p.rod_cislo as rod_cislo_pacienta, 
                                  os_p.meno as meno_pacienta,
                                  os_p.priezvisko as priezvisko_pacienta
                                   from operacia op join zdravotny_zaznam zz on(op.id_zaznamu = zz.id_zaznamu)
                                    join pacient p on(p.id_pacienta = zz.id_pacienta)
                                     join krvna_skupina ks on(ks.id_typu_krvnej_skupiny = p.id_typu_krvnej_skupiny)
                                      join os_udaje os_p on(os_p.rod_cislo = p.rod_cislo)
                                       join miestnost m on(m.id_miestnosti = op.id_miestnosti)
                                        join oddelenie odd on(odd.id_oddelenia = m.id_oddelenia)
                                         join nemocnica nem_in on(nem_in.id_nemocnice = odd.id_nemocnice)
                                          where nem_in.id_nemocnice = nem_out.id_nemocnice
                         )
                    ) as operacie, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = p_id_nemocnice);
                    return nemxml;
end;
/

create or replace function getOckovaniaNemocnice_f(p_id_nemocnice integer)
return CLOB
is    
nemxml CLOB;
begin
     select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("ockovania", ockovania)
                          ), version '1.0'
              ).getclobval() into nemxml
      from (select (select XMLAgg(XMLElement("ockovanie",
                                                        XMLElement("datum_ockovania", datum),                   
                                                        XMLElement("typ_ockovania", nazov),
                                                        XMLElement("pacient", XMLAttributes(krvna_skupina as "typ_krvnej_skupiny",
                                                                                    pou.rod_cislo as "rodne_cislo"),
                                                                            XMLElement("meno", pou.meno || ' ' || pou.priezvisko)
                                                                  ),
                                                        XMLElement("popis", popis)           
                                             )                    
                                  )                                              
                    from ockovanie oc join zdravotny_zaznam zz on(zz.id_zaznamu = oc.id_zaznamu)
                                        join pacient p on(p.id_pacienta = zz.id_pacienta)
                                         join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                          join krvna_skupina ks on(ks.id_typu_krvnej_skupiny = p.id_typu_krvnej_skupiny)
                                            join typ_ockovania toc on(toc.id_typu_ockovania = oc.id_typu_ockovania)
                                             where oc.id_nemocnice = nem_out.id_nemocnice
                                                    
                    ) as ockovania, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = p_id_nemocnice);              
                    return nemxml;
end;
/

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
                                                        XMLElement("datum_vysetrenia", datum),
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