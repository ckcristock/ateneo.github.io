import { ChartType } from '../../../core/interfaces/chart.interface';

const donutChart: ChartType = {
  labels: ['Sin datos'],
  datasets: [{ data: [0] }],
  options: {
    maintainAspectRatio: false,
    /* legend: {
            position: 'bottom',
        } */
  },
};

export { donutChart };
