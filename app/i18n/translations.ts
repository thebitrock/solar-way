export const translations = {
  uk: {
    title: 'Калькулятор стрінга сонячних панелей',
    common: {
      loading: 'Завантаження...'
    },
    tabs: {
      calculation: 'Розрахунок напруги',
      manufacturers: 'Виробники',
      solarPanels: 'Сонячні панелі'
    },
    modal: {
      close: 'Закрити',
      addSolarPanel: 'Додати сонячну панель',
      editSolarPanel: 'Редагувати сонячну панель',
      addManufacturer: 'Додати виробника',
      editManufacturer: 'Редагувати виробника'
    },
    calculation: {
      selectPanel: 'Виберіть сонячну панель',
      selectPanelPlaceholder: 'Виберіть панель зі списку',
      panelCount: 'Кількість панелей у стрингі',
      addPanel: 'Додати сонячну панель',
      panelInfo: 'Параметри вибраної панелі',
      panelParameters: {
        title: 'Параметри панелі',
        temperatureCoefficients: 'Температурні характеристики (STC)',
        temperatureCoefficients_isc: 'Температурний коефіцієнт Isc',
        temperatureCoefficients_voc: 'Температурний коефіцієнт Voc',
        temperatureCoefficients_pmax: 'Температурний коефіцієнт Pmax',
        vocCoefficient: 'Voc: %/°C',
        iscCoefficient: 'Isc: %/°C',
        pmaxCoefficient: 'Pmax: %/°C'
      },
      characteristics: {
        title: 'Характеристики панелі',
        parameters: 'Параметри',
        stc: 'STC',
        noct: 'NOCT',
        nmot: 'NMOT',
        pmax: 'Максимальна потужність (Pmax/W)',
        voc: 'Напруга холостого ходу (Voc/V)',
        isc: 'Струм короткого замикання (Isc/A)',
        vmp: 'Напруга при максимальній потужності (Vmp/V)',
        imp: 'Струм при максимальній потужності (Imp/A)'
      },
      name: 'Назва:',
      manufacturer: 'Виробник:',
      vocSTC: 'Voc STC:',
      vocNOCT: 'Voc NOCT:',
      temperatureCoefficient: 'Температурний коефіцієнт Voc:',
      temperatureCoefficientISC: 'Температурний коефіцієнт Isc:',
      temperatureCoefficientPmax: 'Температурний коефіцієнт Pmax:',
      impSTC: 'Струм при максимальній потужності (Imp/A) STC:',
      vmpSTC: 'Напруга при максимальній потужності (Vmp/V) STC:',
      iscSTC: 'Струм короткого замикання (Isc/A) STC:',
      totalVoltage: 'Загальна напруга:',
      temperature: 'Температура (°C)',
      temperatureRange: 'Діапазон температур',
      minTemp: 'Мінімальна температура',
      maxTemp: 'Максимальна температура',
      openCircuitVoltage: 'Напруга холостого ходу',
      shortCircuitCurrent: 'Струм короткого замикання',
      maximumPower: 'Максимальна потужність',
      totalPowerSTC: 'Загальна потужність при STC',
      totalPowerNOCT: 'Загальна потужність при NOCT',
      totalPowerNMOT: 'Загальна потужність при NMOT',
      mpptMaxVDC: 'Максимально допустима напруга MPPT',
      unknownPanel: 'Невідома панель',
      unknownManufacturer: 'Невідомий виробник',
      notProvided: 'Не надано',
      requiredField: '* Обов\'язкове поле',
      impNOCT: 'Струм при максимальній потужності (Imp/A) NOCT',
      vmpNOCT: 'Напруга при максимальній потужності (Vmp/V) NOCT',
      iscNOCT: 'Струм короткого замикання (Isc/A) NOCT',
      openCircuitVoltageNOCT: 'Напруга холостого ходу',
      shortCircuitCurrentNOCT: 'Струм короткого замикання',
      maximumPowerNOCT: 'Максимальна потужність',
      totalPower: 'Загальна потужність',
      solarPanels: {
        temperatureCoefficientOfISC: 'Температурний коефіцієнт Isc',
        temperatureCoefficientOfVOC: 'Температурний коефіцієнт Voc',
        temperatureCoefficientOfPmax: 'Температурний коефіцієнт Pmax'
      }
    },
    manufacturers: {
      name: 'Назва виробника',
      namePlaceholder: 'Введіть назву виробника',
      create: 'Створити виробника',
      update: 'Оновити виробника',
      cancel: 'Скасувати',
      creating: 'Створення...',
      updating: 'Оновлення...'
    },
    solarPanels: {
      characteristics: {
        stc: 'Стандартні умови тестування (STC)',
        noct: 'Номінальна робоча температура (NOCT)',
        nmot: 'Номінальна робоча температура модуля (NMOT)'
      },
      maximumPower: 'Максимальна потужність (Pmax/W)',
      maximumPowerPlaceholder: 'Введіть максимальну потужність (W)',
      openCircuitVoltage: 'Напруга холостого ходу (Voc/V)',
      openCircuitVoltagePlaceholder: 'Введіть напругу холостого ходу (V)',
      shortCircuitCurrent: 'Струм короткого замикання (Isc/A)',
      shortCircuitCurrentPlaceholder: 'Введіть струм короткого замикання (A)',
      voltageAtMaximumPower: 'Напруга при максимальній потужності (Vmp/V)',
      voltageAtMaximumPowerPlaceholder: 'Введіть напругу при максимальній потужності (V)',
      currentAtMaximumPower: 'Струм при максимальній потужності (Imp/A)',
      currentAtMaximumPowerPlaceholder: 'Введіть струм при максимальній потужності (A)',
      name: 'Назва панелі',
      namePlaceholder: 'Введіть назву панелі',
      selectManufacturer: 'Виберіть виробника',
      chooseManufacturer: 'Виберіть виробника',
      create: 'Створити сонячну панель',
      update: 'Оновити сонячну панель',
      cancel: 'Скасувати',
      temperatureCoefficientOfISC: 'Температурний коефіцієнт Isc',
      temperatureCoefficientOfVOC: 'Температурний коефіцієнт Voc',
      temperatureCoefficientOfPmax: 'Температурний коефіцієнт Pmax'
    },
    errors: {
      required: 'Це поле обов\'язкове',
      unknown: 'Сталася невідома помилка'
    }
  },
  en: {
    title: 'Solar string calculator',
    common: {
      loading: 'Loading...'
    },
    tabs: {
      calculation: 'Voltage calculation',
      manufacturers: 'Manufacturers',
      solarPanels: 'Solar panels'
    },
    modal: {
      close: 'Close',
      addSolarPanel: 'Add solar panel',
      editSolarPanel: 'Edit solar panel',
      addManufacturer: 'Add manufacturer',
      editManufacturer: 'Edit manufacturer'
    },
    calculation: {
      selectPanel: 'Select solar panel',
      selectPanelPlaceholder: 'Select a panel from the list',
      panelCount: 'Number of panels in string',
      addPanel: 'Add solar panel',
      panelInfo: 'Selected panel parameters',
      panelParameters: {
        title: 'Panel Parameters',
        temperatureCoefficients: 'Temperature Ratings (STC)',
        temperatureCoefficients_isc: 'Temperature Coefficient of Isc',
        temperatureCoefficients_voc: 'Temperature Coefficient of Voc',
        temperatureCoefficients_pmax: 'Temperature Coefficient of Pmax',
        vocCoefficient: 'Voc: %/°C',
        iscCoefficient: 'Isc: %/°C',
        pmaxCoefficient: 'Pmax: %/°C'
      },
      characteristics: {
        title: 'Panel Characteristics',
        parameters: 'Parameters',
        stc: 'STC',
        noct: 'NOCT',
        nmot: 'NMOT',
        pmax: 'Maximum Power (Pmax/W)',
        voc: 'Open Circuit Voltage (Voc/V)',
        isc: 'Short Circuit Current (Isc/A)',
        vmp: 'Voltage at Maximum Power (Vmp/V)',
        imp: 'Current at Maximum Power (Imp/A)'
      },
      name: 'Name:',
      manufacturer: 'Manufacturer:',
      vocSTC: 'Voc STC:',
      vocNOCT: 'Voc NOCT:',
      temperatureCoefficient: 'Temperature coefficient of Voc:',
      temperatureCoefficientISC: 'Temperature coefficient of Isc:',
      temperatureCoefficientPmax: 'Temperature coefficient of Pmax:',
      impSTC: 'Current at Maximum Power (Imp/A) STC:',
      vmpSTC: 'Voltage at Maximum Power (Vmp/V) STC:',
      iscSTC: 'Short Circuit Current (Isc/A) STC:',
      totalVoltage: 'Total voltage:',
      temperature: 'Temperature (°C)',
      temperatureRange: 'Temperature range',
      minTemp: 'Minimum temperature',
      maxTemp: 'Maximum temperature',
      openCircuitVoltage: 'Open Circuit Voltage',
      shortCircuitCurrent: 'Short Circuit Current',
      maximumPower: 'Maximum Power',
      totalPowerSTC: 'Total power at STC',
      totalPowerNOCT: 'Total power at NOCT',
      totalPowerNMOT: 'Total power at NMOT',
      mpptMaxVDC: 'Maximum MPPT Voltage',
      unknownPanel: 'Unknown panel',
      unknownManufacturer: 'Unknown manufacturer',
      notProvided: 'Not provided',
      requiredField: '* Required field',
      impNOCT: 'Current at Maximum Power (Imp/A) NOCT',
      vmpNOCT: 'Voltage at Maximum Power (Vmp/V) NOCT',
      iscNOCT: 'Short Circuit Current (Isc/A) NOCT',
      openCircuitVoltageNOCT: 'Open Circuit Voltage',
      shortCircuitCurrentNOCT: 'Short Circuit Current',
      maximumPowerNOCT: 'Maximum Power',
      totalPower: 'Total power',
      solarPanels: {
        temperatureCoefficientOfISC: 'Temperature Coefficient of Isc',
        temperatureCoefficientOfVOC: 'Temperature Coefficient of Voc',
        temperatureCoefficientOfPmax: 'Temperature Coefficient of Pmax'
      }
    },
    manufacturers: {
      name: 'Manufacturer name',
      namePlaceholder: 'Enter manufacturer name',
      create: 'Create manufacturer',
      update: 'Update manufacturer',
      cancel: 'Cancel',
      creating: 'Creating...',
      updating: 'Updating...'
    },
    solarPanels: {
      characteristics: {
        stc: 'Standard Test Conditions (STC)',
        noct: 'Nominal Operating Cell Temperature (NOCT)',
        nmot: 'Nominal Module Operating Temperature (NMOT)'
      },
      maximumPower: 'Maximum Power (Pmax/W)',
      maximumPowerPlaceholder: 'Enter maximum power (W)',
      openCircuitVoltage: 'Open Circuit Voltage (Voc/V)',
      openCircuitVoltagePlaceholder: 'Enter open circuit voltage (V)',
      shortCircuitCurrent: 'Short Circuit Current (Isc/A)',
      shortCircuitCurrentPlaceholder: 'Enter short circuit current (A)',
      voltageAtMaximumPower: 'Voltage at Maximum Power (Vmp/V)',
      voltageAtMaximumPowerPlaceholder: 'Enter voltage at maximum power (V)',
      currentAtMaximumPower: 'Current at Maximum Power (Imp/A)',
      currentAtMaximumPowerPlaceholder: 'Enter current at maximum power (A)',
      name: 'Panel name',
      namePlaceholder: 'Enter panel name',
      selectManufacturer: 'Select manufacturer',
      chooseManufacturer: 'Choose manufacturer',
      create: 'Create solar panel',
      update: 'Update solar panel',
      cancel: 'Cancel',
      temperatureCoefficientOfISC: 'Temperature Coefficient of Isc',
      temperatureCoefficientOfVOC: 'Temperature Coefficient of Voc',
      temperatureCoefficientOfPmax: 'Temperature Coefficient of Pmax'
    },
    errors: {
      required: 'This field is required',
      unknown: 'An unknown error occurred'
    }
  },
  ru: {
    title: 'Калькулятор строки солнечных панелей',
    common: {
      loading: 'Загрузка...'
    },
    tabs: {
      calculation: 'Расчет напряжения',
      manufacturers: 'Производители',
      solarPanels: 'Солнечные панели'
    },
    modal: {
      close: 'Закрыть',
      addSolarPanel: 'Добавить солнечную панель',
      editSolarPanel: 'Редактировать солнечную панель',
      addManufacturer: 'Добавить производителя',
      editManufacturer: 'Редактировать производителя'
    },
    calculation: {
      selectPanel: 'Выберите солнечную панель',
      selectPanelPlaceholder: 'Выберите панель из списка',
      panelCount: 'Количество панелей в строке',
      addPanel: 'Добавить солнечную панель',
      panelInfo: 'Параметры выбранной панели',
      panelParameters: {
        title: 'Параметры панели',
        temperatureCoefficients: 'Температурные характеристики (STC)',
        temperatureCoefficients_isc: 'Температурный коэффициент Isc',
        temperatureCoefficients_voc: 'Температурный коэффициент Voc',
        temperatureCoefficients_pmax: 'Температурный коэффициент Pmax',
        vocCoefficient: 'Voc: %/°C',
        iscCoefficient: 'Isc: %/°C',
        pmaxCoefficient: 'Pmax: %/°C'
      },
      characteristics: {
        title: 'Характеристики панели',
        parameters: 'Параметры',
        stc: 'STC',
        noct: 'NOCT',
        nmot: 'NMOT',
        pmax: 'Максимальная мощность (Pmax/W)',
        voc: 'Напряжение холостого хода (Voc/V)',
        isc: 'Ток короткого замыкания (Isc/A)',
        vmp: 'Напряжение при максимальной мощности (Vmp/V)',
        imp: 'Ток при максимальной мощности (Imp/A)'
      },
      name: 'Название:',
      manufacturer: 'Производитель:',
      vocSTC: 'Voc STC:',
      vocNOCT: 'Voc NOCT:',
      temperatureCoefficient: 'Температурный коэффициент Voc:',
      temperatureCoefficientISC: 'Температурный коэффициент Isc:',
      temperatureCoefficientPmax: 'Температурный коэффициент Pmax:',
      impSTC: 'Ток при максимальной мощности (Imp/A) STC:',
      vmpSTC: 'Напряжение при максимальной мощности (Vmp/V) STC:',
      iscSTC: 'Ток короткого замыкания (Isc/A) STC:',
      totalVoltage: 'Общее напряжение:',
      temperature: 'Температура (°C)',
      temperatureRange: 'Диапазон температур',
      minTemp: 'Минимальная температура',
      maxTemp: 'Максимальная температура',
      openCircuitVoltage: 'Напряжение холостого хода',
      shortCircuitCurrent: 'Ток короткого замыкания',
      maximumPower: 'Максимальная мощность',
      totalPowerSTC: 'Общая мощность при STC',
      totalPowerNOCT: 'Общая мощность при NOCT',
      totalPowerNMOT: 'Общая мощность при NMOT',
      mpptMaxVDC: 'Максимально допустимое напряжение MPPT',
      unknownPanel: 'Неизвестная панель',
      unknownManufacturer: 'Неизвестный производитель',
      notProvided: 'Не предоставлено',
      requiredField: '* Обязательное поле',
      impNOCT: 'Ток при максимальной мощности (Imp/A) NOCT',
      vmpNOCT: 'Напряжение при максимальной мощности (Vmp/V) NOCT',
      iscNOCT: 'Ток короткого замыкания (Isc/A) NOCT',
      openCircuitVoltageNOCT: 'Напряжение холостого хода',
      shortCircuitCurrentNOCT: 'Ток короткого замыкания',
      maximumPowerNOCT: 'Максимальная мощность',
      totalPower: 'Общая мощность',
      solarPanels: {
        temperatureCoefficientOfISC: 'Температурный коэффициент Isc',
        temperatureCoefficientOfVOC: 'Температурный коэффициент Voc',
        temperatureCoefficientOfPmax: 'Температурный коэффициент Pmax'
      }
    },
    manufacturers: {
      name: 'Название производителя',
      namePlaceholder: 'Введите название производителя',
      create: 'Создать производителя',
      update: 'Обновить производителя',
      cancel: 'Отменить',
      creating: 'Создание...',
      updating: 'Обновление...'
    },
    solarPanels: {
      characteristics: {
        stc: 'Стандартные условия испытания (STC)',
        noct: 'Номинальная рабочая температура (NOCT)',
        nmot: 'Номинальная рабочая температура модуля (NMOT)'
      },
      maximumPower: 'Максимальная мощность (Pmax/W)',
      maximumPowerPlaceholder: 'Введите максимальную мощность (W)',
      openCircuitVoltage: 'Напряжение холостого хода (Voc/V)',
      openCircuitVoltagePlaceholder: 'Введите напряжение холостого хода (V)',
      shortCircuitCurrent: 'Ток короткого замыкания (Isc/A)',
      shortCircuitCurrentPlaceholder: 'Введите ток короткого замыкания (A)',
      voltageAtMaximumPower: 'Напряжение при максимальной мощности (Vmp/V)',
      voltageAtMaximumPowerPlaceholder: 'Введите напряжение при максимальной мощности (V)',
      currentAtMaximumPower: 'Ток при максимальной мощности (Imp/A)',
      currentAtMaximumPowerPlaceholder: 'Введите ток при максимальной мощности (A)',
      name: 'Название панели',
      namePlaceholder: 'Введите название панели',
      selectManufacturer: 'Выберите производителя',
      chooseManufacturer: 'Выберите производителя',
      create: 'Создать солнечную панель',
      update: 'Обновить солнечную панель',
      cancel: 'Отменить',
      temperatureCoefficientOfISC: 'Температурный коэффициент Isc',
      temperatureCoefficientOfVOC: 'Температурный коэффициент Voc',
      temperatureCoefficientOfPmax: 'Температурный коэффициент Pmax'
    },
    errors: {
      required: 'Это поле обязательно',
      unknown: 'Произошла неизвестная ошибка'
    }
  }
}; 