import React, { useState, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import GetUserData from '../Auth/GetUserData.jsx';

import '../styles/stat.css';
export default function Statistics() {
  const toast = useRef(null);
  const [render, setRender] = useState(false);
  const [muziZeny, setMuziZeny] = useState(null);
  const [valuesInTable, setValuesInTable] = useState([]);
  const [columns, setColumns] = useState(null);
  const [pocetZam, setPocetZam] = useState(null);
  const [pocetPac, setPocetPac] = useState(null);
  const [pocetOpe, setPocetOpe] = useState(null);
  const [pocetHosp, setPocetHosp] = useState(null);
  const [pocetVys, setPocetVys] = useState(null);
  const [krv, setKrv] = useState(null);
  const [year, setYear] = useState('');
  const [pacientiVek, setPacientiVek] = useState(null);
  const [pacientiVekOptions, setPacientiVekOptions] = useState(null);
  const [sumaVyplat, setSumaVyplat] = useState(null);
  const [sumaVyplatOptions, setSumaVyplatOptions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    const token = localStorage.getItem('hospit-user');
    const userId = GetUserData(token).UserInfo.userid;
    const headers = { authorization: 'Bearer ' + token };
    if (year !== null) {
      setRender(true);
      setLoading(true);
      fetch(`/api/selects/pomerMuziZeny/${userId}`, { headers })
        .then((res) => res.json())
        .then((result) => {
          setMuziZeny({
            labels: ['Muzi', 'Zeny'],
            datasets: [
              {
                label: '%',
                data: [result[0].MUZI, result[0].ZENY],
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
                hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D'],
              },
            ],
          });
        });

      fetch(`/api/selects/krvneSkupinyOddelenia/${userId}`, { headers })
        .then((res) => res.json())
        .then((result) => {
          setLoading(false);
          setKrv({
            labels: result.map((item) => item.TYP_KRVI),
            datasets: [
              {
                data: result.map((item) => item.POCET),
                backgroundColor: [
                  '#ff595e',
                  '#ffca3a',
                  '#8ac926',
                  '#82A5F5',
                  '#1982c4',
                  '#6a4c93',
                  '#BBDEF0',
                  '#00A6A6',
                ],
                hoverBackgroundColor: [
                  '#ff595e',
                  '#ffca3a',
                  '#8ac926',
                  '#82A5F5',
                  '#1982c4',
                  '#6a4c93',
                  '#BBDEF0',
                  '#00A6A6',
                ],
              },
            ],
          });
        });

      fetch(`/api/selects/priemernyVek`, { headers })
        .then((res) => res.json())
        .then((result) => {});

      fetch(`/api/selects/pocetZamOddelenia/${userId}/${year.getFullYear()}`, {
        headers,
      })
        .then((res) => res.json())
        .then((result) => {
          setPocetZam(result[0].POCET_ZAMESTNANCOV);
        });

      fetch(`/api/selects/pocetOperOddelenia/${userId}/${year.getFullYear()}`, {
        headers,
      })
        .then((res) => res.json())
        .then((result) => {
          setPocetOpe(result[0].POC_OPERACII);
        });

      fetch(
        `/api/selects/pocetHospitOddelenia/${userId}/${year.getFullYear()}`,
        {
          headers,
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setPocetHosp(result[0].POC_HOSPITALIZACII);
        });

      fetch(`/api/selects/pocetVyseOddelenia/${userId}/${year.getFullYear()}`, {
        headers,
      })
        .then((res) => res.json())
        .then((result) => {
          setPocetVys(result[0].POC_VYS);
        });

      fetch(`/api/selects/pocetPacOddelenia/${userId}`, { headers })
        .then((res) => res.json())
        .then((result) => {
          setPocetPac(result[0].POCET_PACIENTOV);
        });
      /*fetch(
        `/selects/topZamestnanciVyplatyOddelenie/${id}/${year.getFullYear()}`,
        { headers }
      )
        .then((res) => res.json())
        .then((result) => {
          setValuesInTable(result);
          loadColumnsHeaders(result);
        });

      fetch(`/api/selects/sumaVyplatRoka/${id}/${year.getFullYear()}`, { headers })
        .then((res) => res.json())
        .then((result) => {
          setSumaVyplat({
            labels: [
              'Január',
              'Február',
              'Marec',
              'Apríl',
              'Máj',
              'Jún',
              'Júl',
              'August',
              'September',
              'Október',
              'November',
              'December',
            ],
            datasets: [
              {
                label: 'Súčet výplat',
                backgroundColor: '#42A5F5',
                data: [
                  result[0].JANUAR,
                  result[0].FEBRUAR,
                  result[0].MAREC,
                  result[0].APRIL,
                  result[0].MAJ,
                  result[0].JUN,
                  result[0].JUL,
                  result[0].AUGUST,
                  result[0].SEPTEMBER,
                  result[0].OKTOBER,
                  result[0].NOVEMBER,
                  result[0].DECEMBER,
                ],
              },
            ],
          });
          setSumaVyplatOptions({
            plugins: {
              legend: {
                labels: {
                  color: '#495057',
                },
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Suma v €',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Mesiac',
                },
              },
            },
          });
        });
*/
      fetch(`/api/selects/pocetPacientiPodlaVeku`, { headers })
        .then((res) => res.json())
        .then((result) => {
          setPacientiVek({
            labels: result.map((item) => item.VEK),
            datasets: [
              {
                label: 'Pacienti',
                backgroundColor: '#42A5F5',
                data: result.map((item) => item.POCET),
              },
            ],
          });
          setPacientiVekOptions({
            plugins: {
              legend: {
                labels: {
                  color: '#495057',
                },
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Počet',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Vek',
                },
              },
            },
          });
        });
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Zadajte ID oddelenia',
        life: 3000,
      });
    }
  };

  const loadColumnsHeaders = (data) => {
    if (Object.keys(...data).length > 0) {
      loadColumns(Object.keys(...data));
    }
  };

  const loadColumns = (keys) => {
    let array = '';
    keys.forEach((element) => {
      array = [
        ...array,
        <Column
          field={element}
          header={element}
          key={element}
          rowSpan={10}
        ></Column>,
      ];
    });
    setColumns(array);
  };

  return (
    <div>
      <div className='grid' style={{ marginTop: '1rem' }}>
        <Toast ref={toast} />
        <div className='field col-4 md:col-3'>
          <label htmlFor='withoutgrouping' style={{ marginRight: '1rem' }}>
            Zadajte rok
          </label>
          <Calendar
            id='range'
            value={year}
            onChange={(e) => {
              setYear(e.value);
            }}
            view='year'
            dateFormat='yy'
            readOnlyInput
          />
        </div>
        <div className='field col-4 md:col-3'>
          <Button
            icon='pi pi-check'
            label='Zadaj'
            onClick={handleSubmit}
          ></Button>
        </div>
        {render && !loading ? (
          <>
            <div className='xl:col-12'>
              <div className='grid'>
                <div className='col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card'>
                  Počet pacientov
                  <p>{pocetPac}</p>
                </div>
                <div className='col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card'>
                  Počet zamestnancov
                  <p>{pocetZam}</p>
                </div>
                <div className='col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card'>
                  Počet vykonaných operácií
                  <p>{pocetOpe}</p>
                </div>
                <div className='col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card'>
                  Počet vykonaných hospitalizácií
                  <p>{pocetHosp}</p>
                </div>
                <div className='col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card'>
                  Počet vykonaných vyšetrení
                  <p>{pocetVys}</p>
                </div>
              </div>
            </div>
            <div className='xl:col-12 justify-content-center align-content-center flex'>
              <Chart
                type='bar'
                data={pacientiVek}
                options={pacientiVekOptions}
                style={{ width: '35%' }}
              />
              <Chart
                type='bar'
                data={sumaVyplat}
                options={sumaVyplatOptions}
                style={{ width: '35%' }}
              />
              <DataTable
                size='small'
                value={valuesInTable}
                style={{ width: '25%', marginLeft: '1rem' }}
                scrollable
                showGridlines
                responsiveLayout='scroll'
              >
                {columns}
              </DataTable>
            </div>
            <div className='xl:col-12 justify-content-center align-content-center flex h-auto'>
              <Chart
                type='pie'
                data={muziZeny}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'Podiel pohlaví pacientov (%)',
                    },
                  },
                }}
                style={{ position: 'relative', width: '30%' }}
              />
              <Chart
                type='pie'
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'Podiel typu krvi u pacientov',
                    },
                  },
                }}
                data={krv}
                style={{ position: 'relative', width: '30%' }}
              />
            </div>{' '}
          </>
        ) : (
          ''
        )}
      </div>
      {loading ? (
        <ProgressBar
          mode='indeterminate'
          style={{ height: '6px', width: '99%' }}
        ></ProgressBar>
      ) : (
        ''
      )}
    </div>
  );
}
