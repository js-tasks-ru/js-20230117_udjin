export default class SortableTable {

  element; // Не зависят от входных параметров, то же самое this.element
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data.data;
    this.isSortLocally = true;

    this.render();
  }

  get template() {

  }



  getTableRow(item) {
    return this.headerConfig.map(({ id, template }) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTableRows(data = []) {
    // console.log(data)
    return data.map((item) => {
      return `<a href="/products/${item.id}" class="sortable-table__row">
              ${this.getTableRow(item)}
            </a>`;
    }).join('');
  }

  getHeaderRow(options) {
    const { id, title, sortable } = options;

    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="">
              <span>${title}</span>
              <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>
            </div>`;
  }

  // addMouseEvent(cells) {
  //   cells.forEach((cell) => cell.addEventListener('click', () => console.log('click')));
  // } ${this.addMouseEvent(sortableCell)}

  getTableHeader() {
    //Создадим новый массив из того что вернет нам стрелочная функция и для каждого обьекта в this.headerConfig, вызовем метод getHeaderRow
    const sortableCell = this.headerConfig.map(item => this.getHeaderRow(item)).join('');


    return `<div data-element="header" class="sortable-table__header sortable-table__row" onpointerdown= "alert('fff')">
            ${sortableCell}

            </div>`;
  }

  getTableBody() {
    return `<div data-element="body" class="sortable-table__body">
            ${this.getTableRows(this.data)}
            </div>`;
  }

  getTable() {
    //вызываем методы, для получения заголовков таблицы и тела таблицы
    return `<div class="sortable-table">
                ${this.getTableHeader()}
                ${this.getTableBody()}
            </div>`;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }
    return result;
  }

  render() {

    const wrap = document.createElement('div');
    wrap.innerHTML = this.getTable(); // getTable вернет строку, которая преобразуется в innerHTML к DOM элементу
    const element = wrap.firstElementChild; // достаем сам элемент

    this.element = element; //присваивает текущий элемент в this.element
    // this.sort();
    this.subElements = this.getSubElements(element); // те элементы, которые нужны позже для обновления
    this.sort();
  }

  sort(field = 'price', order = 'asc') {
    const sortedData = this.sortData(field, order);
    // console.log(sortedData)
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    // NOTE: Remove sorting arrow from other columns
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    // console.log(this.getTableRows(sortedData))
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    // console.log(arr)
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        default:
          throw new Error(`Unknown type ${sortType}`);
      }
    });
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
