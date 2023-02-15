export default class SortableTable {

  element; // Не зависят от входных параметров, то же самое this.element
  subElements = {};

  constructor(headerConfig = [], {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {

    this.headerConfig = headerConfig;
    this.data = data;
    this.isSortLocally = true;
    this.sorted = sorted;

    this.render();
  }

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc',
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset; // Из элемента берем текущий data-id, data-order
      const newOrder = toggleOrder(order);
      const sortedData = this.sortData(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow'); // Ищем стрелку (<div>)

      column.dataset.order = newOrder; // задаем data-order = newOrder; (asc, desc)

      if (!arrow) {
        column.append(this.subElements.arrow);// Если нет стрелки, добавляем. append "забирает" стрелку с другого элемента
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  }

  addListners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);

  }

  getTableRow(item) {
    return this.headerConfig.map(({ id, template }) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTableRows(data) {
    return data.map((item) => {
      return `<a href="/products/${item.id}" class="sortable-table__row">
              ${this.getTableRow(item)}
            </a>`;
    }).join('');
  }

  getHeaderRow(options) {
    const { id, title, sortable } = options;

    const order = this.sorted.order = id ? this.sorted.order : 'asc';

    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
              <span>${title}</span>
              ${this.getHeaderSortingArrow(id)}
            </div>`;
  }

  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';
    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getTableHeader() {
    //Создадим новый массив из того что вернет нам стрелочная функция и для каждого обьекта в this.headerConfig, вызовем метод getHeaderRow
    const sortableCell = this.headerConfig.map(item => this.getHeaderRow(item)).join('');

    return `<div data-element="header" class="sortable-table__header sortable-table__row">
            ${sortableCell}
            </div>`;
  }

  getTableBody(data) {
    return `<div data-element="body" class="sortable-table__body">
            ${this.getTableRows(data)}
            </div>`;
  }

  getTable(data) {
    //вызываем методы, для получения заголовков таблицы и тела таблицы
    return `<div class="sortable-table">
                ${this.getTableHeader()}
                ${this.getTableBody(data)}
            </div>`;
  }

  getSubElements(element) {
    // element = <div class = "sortable-table">
    //              <div data-element="header"></div>
    //               <div data-element="body"></div>
    //            </div>
    const result = {};
    const elements = element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element; // считываем атрибут data-element

      result[name] = subElement;
    }
    return result;
  }

  render() {
    const { id, order } = this.sorted;
    const wrap = document.createElement('div');
    const sortedData = this.sortData(id, order); // сразу сортируем

    wrap.innerHTML = this.getTable(sortedData); // getTable вернет строку, которая преобразуется в innerHTML к DOM элементу

    const element = wrap.firstElementChild; // достаем сам элемент
    this.element = element; //присваивает текущий элемент в this.element

    this.subElements = this.getSubElements(element); // те элементы, которые нужны позже для обновления { data: <div></div>}

    this.addListners();
  }

  // sort(field = 'price', order = 'asc') {
  //   const sortedData = this.sortData(field, order);
  //   const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
  //   const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

  //   // NOTE: Remove sorting arrow from other columns
  //   allColumns.forEach(column => {
  //     column.dataset.order = '';
  //   });

  //   currentColumn.dataset.order = order;
  //   this.subElements.body.innerHTML = this.getTableRows(sortedData);
  // }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType, customSorting } = column;
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
        case 'custom':
          return direction * customSorting(a, b);
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
