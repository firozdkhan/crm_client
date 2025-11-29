import { Component, Input } from '@angular/core';
import Chart from 'chart.js/auto';

import { IFinance } from 'src/app/interfaces/dashboard/dashborad';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { TranslateService } from 'src/app/translate/translate.service';



@Component({
  selector: 'app-finance-chart',
  templateUrl: './finance-chart.component.html',
  styleUrls: ['./finance-chart.component.css']
})
export class FinanceChartComponent {
  /**
   *
   */

  // const fiteredArr = filterPipe.transform(chkArray,txtSearch);
  constructor(
    private trans: TranslatePipe
  ) {


  }

  dataArray: any = [];
  @Input() finance: IFinance[];
  ngOnInit() { }

  ngAfterViewInit() {
    let data: any,
      options: any,
      chart: any,
      ctx: any = document.getElementById('areaChart') as HTMLElement;

    // JSON:
    // Uncomment below and import * as data from 'json-path.json'.
    // Or Angular 14, create anonymous JSON array and fetch with http
    // constructor(private _http; HttpClient) {} ...
    // Replace datasets with dataArray

    // for (let key in chartData.items) {
    //   if (chartData.items.hasOwnProperty(key)) {
    //     this.dataArray.push(chartData.items[key]);
    //   }
    // }

    data = {
      labels: this.finance.filter(x => x.ttype == 'Income').map(x => x.months),
      datasets: [
        {
          label: this.trans.transform('Income'),
          data: this.finance.filter(x => x.ttype == 'Income').map(m => m.amount),

          fill: true,
          backgroundColor: 'rgba(29,201,183, 0.2)',
          borderColor: "#1dc9b7",
          pointBackgroundColor: "#179c8e",
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBorderWidth: 1,
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 4,


        },
        {
          label: this.trans.transform('Expenses'),
          data: this.finance.filter(x => x.ttype == 'Expenses').map(m => m.amount),
          fill: true,
          backgroundColor: 'rgba(136,106,181, 0.2)',
          borderColor: "#886ab5",
          pointBackgroundColor: "#6e4e9e",
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBorderWidth: 1,
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 4,

        },
      ],
    };

    options = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        position: 'top',
        text: 'Apples to Oranges',
        fontSize: 12,
        fontColor: '#666',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#999',
          fontSize: 14,
        },
      },
    };

    chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options,
    });
  }

}
