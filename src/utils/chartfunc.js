import moment from 'moment';

export const generateHighOptions = (label_array, show_from, chart_type) => {
  const options = {
    chart: {
      type: 'column',
      height: 250,
      scrollablePlotArea: {
        minWidth: 300,
        scrollPositionX: 1
      }
    },
    title: { text: null },
    xAxis: {
      categories: label_array,
      scrollbar: { enabled: true }
    },
    yAxis: {
      title: false,
      left: 40,
      min: 0,
      minRange : 1,
    },
    tooltip: {
      formatter: function() {
        return `<b>${chart_type === 'weekly' ? moment(show_from).add(this.point.index, 'day').format("YYYY-MM-DD") : this.point.category}</b><br/>
                <span style="color:${this.point.color}">\u25CF</span>${this.point.series.name}:${this.point.y}`;
      }
    },
    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      columnrange: {
        dataLabels: {
          enabled: true,
          formatter: function() { return ''}
        },
        marker: {
          enabled: false,
          lineWidth: 0
        },
        states: {
          hover: {
            enabled: false
          }
        },
        maxPointWidth: 20
      },
      column: {
        maxPointWidth: 20
      }
    },
  };
  return options;
}

export const getMonday = (d = '') => {
  d = d ? new Date(d) : new Date();
  var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export const getInitalDates = () => {
  let first_day = moment(getMonday()).format('MMM DD, YYYY');
  let last_day = moment(first_day).add(6, 'days').format('MMM DD, YYYY');
  return { first_day, last_day };
}

export const getEndOfMonth = (date) => {
  var endDay = moment(date).endOf('month').format('DD');
  return parseInt(endDay, 10);
}

export const generateLabelArray = (value, date) => {
  let label_array = [];
  if(value ==="daily"){
    label_array = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  } else if(value ==="weekly"){
    label_array = ["Mon", "Tue", "Wed", "Thu", "Fri","Sat","Sun"];
  } else if(value ==="monthly"){
    const endOfMonth = getEndOfMonth(date);
    for (let i = 1; i <= endOfMonth; i++)  {
      label_array.push(`${i}`);
    }
  } else if(value ==="yearly"){
    label_array = ["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  }
  return label_array;
}

export const RangeBtns = [
  { value: "daily", show: "D" },
  { value: "weekly", show: "W" },
  { value: "monthly", show: "M" },
  { value: "yearly", show: "Y" },
]