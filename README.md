### Hexlet tests and linter status:
[![Actions Status](https://github.com/vadim-kudr/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/vadim-kudr/frontend-project-lvl2/actions/workflows/hexlet-check.yml)

[![lint & test](https://github.com/vadim-kudr/frontend-project-lvl2/workflows/lint%20&%20test/badge.svg)](https://github.com/vadim-kudr/frontend-project-lvl2/actions/workflows/check.yml)

[![Maintainability](https://api.codeclimate.com/v1/badges/27fa21068d56a2a4b9d9/maintainability)](https://codeclimate.com/github/vadim-kudr/frontend-project-lvl2/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/27fa21068d56a2a4b9d9/test_coverage)](https://codeclimate.com/github/vadim-kudr/frontend-project-lvl2/test_coverage)


### Проект "Вычислитель отличий"
Позволяет сравнивать файлы конфигурации в формате json/yml и выводить их различия. Вывод различий происходит в текстовом формате и доступен в 3х вариантах:

* plain - 
* stylish -
* json - 

Поставляется в виде npm пакета библиотеки и исполняемого файла.

Пример использования:

```
import genDiff from '@hexlet/code';

const filepath1 = 'config1.json';
const filepath2 = 'config2.json';
const formatter = 'stylish';

const formattedDiff = genDiff(filepath1, filepath2, formatter);

```

### Установка

Для установки потребуется node.js >= 14 версии и unix подобная среда.
Далее скачиваем репозиторий `git clone https://github.com/vadim-kudr/frontend-project-lvl2.git`
И устанавливаем зависимости `make install`

### asciinema
usage https://asciinema.org/a/Tktc4vLkxZuB23RBovCCPsgRq

yml support: https://asciinema.org/a/FYlUL36gYMjQHjc1seq8qpGex

plain formatter: https://asciinema.org/a/vtrEAxig9gF4ubxYKjyJlsX4W

json formatter: https://asciinema.org/a/TSde0zXiLZtYUPMRWOSqvtT1G