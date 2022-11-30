 select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("ockovania", ockovania)
                          ), version '1.0'
              ) as ockovanie_nemocnice_XML
      from (select (select XMLAgg(XMLElement("ockovanie",
                                                        XMLElement("typ_ockovania", nazov),
                                                        XMLElement("pacient", XMLAttributes(krvna_skupina as "typ_krvnej_skupiny",
                                                                                    pou.rod_cislo as "rodne_cislo"),
                                                                            XMLElement("meno", pou.meno || ' ' || pou.priezvisko)
                                                                  ),
                                                        XMLElement("datum_ockovania", datum),
                                                        XMLElement("popis", popis)        
                                                                  
                                             )                    
                                  )                                              
                    from ockovanie oc join zdravotny_zaznam zz on(zz.id_zaznamu = oc.id_zaznamu)
                                        join pacient p on(p.id_pacienta = zz.id_pacienta)
                                         join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                          join krvna_skupina ks on(ks.id_typu_krvnej_skupiny = p.id_typu_krvnej_skupiny)
                                            join typ_ockovania toc on(toc.id_typu_ockovania = oc.id_typu_ockovania)
                                             where oc.id_nemocnice = nem_out.id_nemocnice
                                              group by oc.id_nemocnice
                                                    
                    ) as ockovania, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = X
                        group by nem_out.id_nemocnice, nazov);
                    
                    
update zdravotny_zaznam set popis = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu erat velit. Duis cursus convallis sem a euismod. Morbi vitae mauris non odio sagittis congue. Nam eu est sed risus commodo tristique sit amet sodales felis. Suspendisse aliquet mauris urna, id ullamcorper sem pretium sed. Sed quis urna non est vulputate scelerisque a ac nulla.';                    
                    
                    
 select XMLRoot(XMLElement("nemocnica", 
                          XMLElement("nazov_nemocnice", nazov_nemocnice),
                          XMLElement("ockovania", ockovania)
                          ), version '1.0'
              ) as ockovanie_nemocnice_XML
      from (select (select XMLAgg(XMLElement("ockovanie",
                                                        XMLElement("typ_ockovania", nazov),
                                                        XMLElement("pacient", XMLAttributes(krvna_skupina as "typ_krvnej_skupiny",
                                                                                    pou.rod_cislo as "rodne_cislo"),
                                                                            XMLElement("meno", pou.meno || ' ' || pou.priezvisko)
                                                                  ),
                                                        XMLElement("datum_ockovania", datum),
                                                        XMLElement("popis", popis)        
                                                                  
                                             )                    
                                  )                                              
                    from ockovanie oc join zdravotny_zaznam zz on(zz.id_zaznamu = oc.id_zaznamu)
                                        join pacient p on(p.id_pacienta = zz.id_pacienta)
                                         join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                          join krvna_skupina ks on(ks.id_typu_krvnej_skupiny = p.id_typu_krvnej_skupiny)
                                            join typ_ockovania toc on(toc.id_typu_ockovania = oc.id_typu_ockovania)
                                             where oc.id_nemocnice = nem_out.id_nemocnice
                                                    
                    ) as ockovania, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = X);                    
                    
                    