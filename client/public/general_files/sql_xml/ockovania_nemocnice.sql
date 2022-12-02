select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("ockovania", ockovania)
                          ), version '1.0'
              ) as ockovania_nemocnice_XML
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
                                                    
                    ) as ockovania, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = 1); 