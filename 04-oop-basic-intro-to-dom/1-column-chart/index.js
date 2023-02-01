export default class ColumnChart {

  chartHeight = 50;

  constructor({
    data = [],
    label = "",
    link = "",
    value = 0,
    formatHeading = data => data
  } = {}) {

    this._data = data;
    this._label = label;
    this._link = link;
    this._value = formatHeading(value);

    this.render();
  }

  render() {
    const wrap = document.createElement('div');

    const link = (this._link ? `<a href="/sales" class="column-chart__link">View all</a>` : '');
    const isData = Boolean(this._data.length);
    wrap.innerHTML = isData ?
      `
                      <div class="dashboard__chart_${this._label}">
                        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
                          <div class="column-chart__title">
                            Total ${this._label}
                            ${link}
                          </div>
                          <div class="column-chart__container">
                            <div data-element="header" class="column-chart__header">${this._value}</div>
                            <div data-element="body" class="column-chart__chart">

                              ${this.getCharts()}

                            </div>
                          </div>
                        </div>
                      </div>
                      `
      :

      `
                      <div class="dashboard__chart_${this._label}">
                        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
                          <div class="column-chart__title">
                            Total ${this._label}
                            ${link}
                          </div>
                          <div class="column-chart__container">
                          <img src="charts-skeleton.svg"/>
                          </div>
                        </div>
                      </div>
                      `;
    this.element = wrap;
  }

  getCharts() {

    const val = this.getColumnProps(this._data);

    return val.map((item) => {

      return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`;
    }).join('');
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  update(data = []) {
    this._data = data;
    this.render();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = {};
  }
}


// const ordersChart = new ColumnChart({
//   data: ordersData,
//   label: 'orders',
//   value: 344,
//   link: '#'
// });
