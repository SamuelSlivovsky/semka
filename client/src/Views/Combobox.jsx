import React, { useState, useRef, useReducer } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';
import '../styles/combobox.css';
export default function Combobox() {
  const toast = useRef(null);
  const [select, setSelect] = useState(null);
  const [valuesInTable, setValuesInTable] = useState([]);
  const [columns, setColumns] = useState([]);
  const [inputVal1, setInputVal1] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputVal2, setInputVal2] = useState('');
  const [date, setDate] = useState(null);
  const [isDates, setIsDates] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [input1, setInput1] = useState(null);
  const [input2, setInput2] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showXmlDialog, setShowXmlDialog] = useState(false);
  const [xmlPath, setXmlPath] = useState(null);
  const [id, setId] = useState(null);
  const [zamestnanec, setZamestnanec] = useState(null);
  const splitItems = [
    {
      label: 'Hospitalizácie',
      icon: 'hospit-icon-small',
      command: () => {
        setShowXmlDialog(true);
        setXmlPath('http://localhost:5000/selects/hospitalizacieNemocniceXML/');
      },
    },
    {
      label: 'Vyšetrenia',
      icon: 'examination-icon-small',
      command: () => {
        setShowXmlDialog(true);
        setXmlPath('http://localhost:5000/selects/vysetreniaNemocniceXML/');
      },
    },
    {
      label: 'Operácie',
      icon: 'operation-icon-small',
      command: () => {
        setShowXmlDialog(true);
        setXmlPath('http://localhost:5000/selects/operacieNemocniceXML/');
      },
    },
    {
      label: 'Očkovania',
      icon: 'vax-icon-small',
      command: () => {
        setShowXmlDialog(true);
        setXmlPath('http://localhost:5000/selects/ockovaniaNemocniceXML/');
      },
    },
  ];

  const selects = [
    {
      name: 'Pacienti s najviac chorobami',
      path: 'selects/najviacChoriPocet',
      attribute1: 'count',
      fotka: false,
    },
    {
      name: 'Pacienti s najviac operáciami',
      path: 'selects/najviacOperovanyPercenta',
      attribute1: 'percent',
      fotka: false,
    },
    {
      name: 'Pacienti s najviac hospitalizáciami',
      path: 'selects/najviacHospitalizovaniPercenta',
      attribute1: 'percent',
      fotka: false,
    },
    {
      name: 'Najlepšie platený zamestnanci',
      path: 'selects/topZamestnanciVyplaty',
      attribute1: 'count',
      fotka: false,
    },
    {
      name: 'Typy očkovaní pacientov',
      path: 'selects/typyOckovaniaPacienti',
      fotka: false,
    },
    {
      name: 'Zamestnanci oddeleni',
      path: 'selects/zamestnanciOddeleni',
      fotka: false,
    },
    {
      name: 'Najčastejšie choroby roka',
      path: 'selects/najcastejsieChorobyRokaPocet',
      attribute1: 'count',
      attribute2: 'year',
      fotka: false,
    },
    {
      name: 'Neobsadené lôžka',
      path: 'selects/neobsadeneLozkaOddeleniaTyzden',
      attribute1: 'id',
      fotka: false,
    },
    {
      name: 'Zamestnanci oddelenia',
      path: 'selects/zamestnanciOddelenia',
      attribute1: 'id',
      fotka: true,
    },
    {
      name: 'Najviac predpisované lieky roka',
      path: 'selects/najviacPredpisovaneLiekyRoka',
      attribute1: 'year',
      fotka: false,
    },
    {
      name: 'Lieky s počtom menej ako',
      path: 'selects/liekyMenejAkoPocet',
      attribute1: 'count',
      fotka: false,
    },
    {
      name: 'Menovci medzi pacientami a lekármi',
      path: 'selects/menovciPacientLekar',
      fotka: false,
    },
    {
      name: 'Operácie podľa počtu lekárov a trvania',
      path: 'selects/operaciePocetLekarovTrvanie',
      attribute1: 'count',
      attribute2: 'howLong',
      fotka: false,
    },
    {
      name: 'Kraje podľa počtu operovaných pacientov',
      path: 'selects/krajePodlaPoctuOperovanych',
      fotka: false,
    },
  ];

  const clearInputs = () => {
    setInputVal1(null);
    setInputVal2(null);
  };

  const onSelectChange = (e) => {
    setValuesInTable(null);
    setColumns(null);
    setSelect(e.value);
    setIsDates(false);
    setInput1(null);
    setInput2(null);
    console.log(e.value);
    if (
      typeof e.value.attribute1 !== 'undefined' &&
      e.value.attribute1 != null
    ) {
      renderInput(e.value.attribute1, 1);
    } else {
      console.log('nullujem');
      setInputVal1(null);
    }
    if (
      typeof e.value.attribute2 !== 'undefined' &&
      e.value.attribute2 != null
    ) {
      renderInput(e.value.attribute2, 2);
    } else {
      console.log('nullujem');
      setInputVal2(null);
    }
  };

  const renderInput = (attr, level) => {
    let input = '';
    switch (attr) {
      case 'count':
        input = (
          <>
            <label htmlFor='withoutgrouping' style={{ marginRight: '1rem' }}>
              Zadajte pocet
            </label>
            <InputNumber
              inputId='withoutgrouping'
              value={level === 1 ? inputVal1 : inputVal2}
              onValueChange={(e) =>
                level === 1 ? setInputVal1(e.value) : setInputVal2(e.value)
              }
              mode='decimal'
              useGrouping={false}
            />
          </>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case 'id':
        input = (
          <>
            <label htmlFor='withoutgrouping' style={{ marginRight: '1rem' }}>
              Zadajte id
            </label>
            <InputNumber
              inputId='withoutgrouping'
              value={level === 1 ? inputVal1 : inputVal2}
              onValueChange={(e) =>
                level === 1 ? setInputVal1(e.value) : setInputVal2(e.value)
              }
              mode='decimal'
              useGrouping={false}
            />
          </>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case 'date':
        input = (
          <>
            <label htmlFor='withoutgrouping' style={{ marginRight: '1rem' }}>
              Zadajte rozsah datumov{' '}
            </label>
            <Calendar
              id='range'
              value={level === 1 ? inputVal1 : inputVal2}
              onChange={(e) =>
                level === 1
                  ? setInputVal1(e.value.toLocaleString('fr-CH'))
                  : setInputVal2(e.value.toLocaleString('fr-CH'))
              }
              readOnlyInput
            />
          </>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case 'percent':
        input = (
          <>
            <label htmlFor='withoutgrouping' style={{ marginRight: '1rem' }}>
              Zadajte percento
            </label>
            <InputNumber
              inputId='withoutgrouping'
              value={level === 1 ? inputVal1 : inputVal2}
              onValueChange={(e) =>
                level === 1 ? setInputVal1(e.value) : setInputVal2(e.value)
              }
              mode='decimal'
              suffix='%'
              useGrouping={false}
            />
          </>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case 'year':
        input = (
          <>
            <label htmlFor='withoutgrouping' style={{ marginRight: '1rem' }}>
              Zadajte rok
            </label>
            <Calendar
              id='range'
              value={level === 1 ? inputVal1 : inputVal2}
              onChange={(e) =>
                level === 1
                  ? setInputVal1(e.value.getFullYear())
                  : setInputVal2(e.value.getFullYear())
              }
              view='year'
              dateFormat='yy'
              readOnlyInput
            />
          </>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case 'dates':
        setIsDates(true);
        break;
      case 'howLong':
        input = (
          <>
            <label htmlFor='withoutgrouping' style={{ marginRight: '1rem' }}>
              Zadajte trvanie
            </label>
            <InputNumber
              inputId='withoutgrouping'
              value={level === 1 ? inputVal1 : inputVal2}
              onValueChange={(e) =>
                level === 1 ? setInputVal1(e.value) : setInputVal2(e.value)
              }
              mode='decimal'
              useGrouping={false}
            />
          </>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    fetch(
      `/${select.path}/${inputVal1 !== null ? inputVal1 : ''}/${
        inputVal2 !== null ? inputVal2 : ''
      }`
    )
      .then((res) => res.json())
      .then((result) => {
        setValuesInTable(result);
        loadColumnsHeaders(result);
        setLoading(false);
      });
    clearInputs();
    if (inputVal1 !== null || inputVal2 !== null) {
      clearInputs();
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

  const handleDatesChange = (dates) => {
    setDate(dates);
    if (dates[0] != null && dates[1] != null) {
      setInputVal1(dates[0].toLocaleDateString('fr-CH'));
      setInputVal2(dates[1].toLocaleDateString('fr-CH'));
    } else if (dates[0] == null && dates[1] == null) {
      setInputVal1('0');
      setInputVal2('0');
    }
  };

  const handleSelectedRow = (employee) => {
    setSelectedRow(employee);
    setShowDialog(true);
    fetch(`selects/zamestnanciFotka/${employee.Id}`)
      .then((res) => res.blob())
      .then((result) => {
        setImgUrl(URL.createObjectURL(result));
      });
    fetch(`selects/zamestnanec/${employee.Id}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setZamestnanec(result);
      });
  };

  const onHide = () => {
    setShowDialog(false);
    setShowXmlDialog(false);
    setImgUrl(null);
    setZamestnanec(null);
    setSelectedRow(null);
    setXmlPath(null);
    setId(null);
    setImgUrl('');
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label='Zavrieť'
          icon='pi pi-times'
          onClick={() => onHide()}
          className='p-button-text'
        />
        <Button
          icon='pi pi-check'
          label='Zadaj'
          onClick={() => {
            if (id !== null) {
              window.open(`${xmlPath}${id}`, '_blank', 'noopener,noreferrer');
              onHide();
            } else {
              toast.current.show({
                severity: 'error',
                summary: 'Zadajte ID nemocnice',
                life: 3000,
              });
            }
          }}
        ></Button>
      </div>
    );
  };

  return (
    <div className='card' style={{ marginTop: 10 }}>
      <Toast ref={toast} />
      <div className='parent'>
        <div className='div1'>
          <Dropdown
            value={select}
            options={selects}
            onChange={onSelectChange}
            optionLabel='name'
            placeholder='Vyber select'
          />
        </div>
        <div className='div2'>{input1}</div>
        <div className='div3'>{input2}</div>
        {isDates ? (
          <div className='div3'>
            <label htmlFor='withoutgrouping'>Zadajte rozsah datumov</label>
            <Calendar
              id='range'
              value={date}
              onChange={(e) => handleDatesChange(e.value)}
              selectionMode='range'
              readOnlyInput
            />
          </div>
        ) : (
          ''
        )}
        <div className='div4'>
          <Button
            icon='pi pi-check'
            label='Zadaj'
            onClick={handleSubmit}
          ></Button>
        </div>
        <div className='div5'>
          <SplitButton
            style={{ height: '30px' }}
            label='Xml výstupy'
            model={splitItems}
          ></SplitButton>
        </div>
      </div>
      <div className='card'>
        <DataTable
          value={valuesInTable}
          loading={loading}
          selectionMode={
            select !== null
              ? typeof select.fotka !== 'undefined' &&
                select.fotka != null &&
                select.fotka !== false
                ? 'single'
                : ''
              : ''
          }
          selection={
            select !== null
              ? typeof select.fotka !== 'undefined' &&
                select.fotka != null &&
                select.fotka !== false
                ? selectedRow
                : ''
              : ''
          }
          onSelectionChange={(e) =>
            select !== null
              ? typeof select.fotka !== 'undefined' &&
                select.fotka != null &&
                select.fotka !== false
                ? handleSelectedRow(e.value)
                : ''
              : ''
          }
          scrollable
          showGridlines
          scrollHeight='80vh'
          responsiveLayout='scroll'
        >
          {columns}
        </DataTable>
      </div>
      <Dialog
        visible={showDialog}
        style={{ width: '50vw' }}
        onHide={() => onHide()}
      >
        <h1>{zamestnanec !== null ? zamestnanec.MENO : ''}</h1>
        <img src={imgUrl} alt='' style={{ maxWidth: 400, maxHeight: 400 }} />
        <p>{`Vek: ${zamestnanec !== null ? zamestnanec.VEK : ''} rokov`} </p>
        <p>{`Pohlavie: ${
          zamestnanec !== null
            ? zamestnanec.ROD_CISLO.substring(2, 3) === '5' ||
              zamestnanec.ROD_CISLO.substring(2, 3) === '6'
              ? 'Žena'
              : 'Muž'
            : ''
        }`}</p>
        <p>{`Adresa: ${zamestnanec !== null ? zamestnanec.ADRESA : ''}`}</p>
      </Dialog>
      <Dialog
        visible={showXmlDialog}
        style={{ width: '50vw' }}
        onHide={() => onHide()}
        footer={renderFooter}
        header='Zadajte id nemocnice'
      >
        <InputNumber
          inputId='withoutgrouping'
          value={id}
          autoFocus
          onValueChange={(e) => setId(e.value)}
          mode='decimal'
          style={{ width: '100%' }}
          useGrouping={false}
        />
      </Dialog>
    </div>
  );
}
