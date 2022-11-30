select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("operacie", operacie)
                          ), version '1.0'
              ) as operacie_nemocnice_XML
      from (select (select XMLAgg(XMLElement("operacia",
                                             XMLElement("lekari", lekari),
                                             XMLElement("miestnost", nazov_miestnosti),
                                             XMLElement("datum_operacie", datum),
                                             XMLElement("trvanie_v_minutach", trvanie), 
                                             XMLElement("pacient", XMLAttributes(krvna_skupina as "typ_krvnej_skupiny",
                                                                        rod_cislo_pacienta as "rodne_cislo"),
                                                                   XMLElement("meno", meno_pacienta || ' ' || priezvisko_pacienta)
                                                        )
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
                                  nazov_miestnosti, datum, trvanie, krvna_skupina, 
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
                    ) as operacie, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = x);