 select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("hospitalizacie", hospitalizacie)
                          ), version '1.0'
              ) as hospitalizacie_nemocnice_XML
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
                                                        )                        
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
                    ) as hospitalizacie, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = 1);