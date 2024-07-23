import { CurrencyPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    ApexAnnotations,
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexFill,
    ApexLegend,
    ApexPlotOptions,
    ApexResponsive,
    ApexTooltip,
    ApexXAxis,
    ApexYAxis,
    ChartComponent,
} from 'ng-apexcharts';

import { Worker } from '@api/models';
import { GenderPipe } from '@shared/pipes';

export type ChartOptions = {
    annotations: ApexAnnotations;
    chart: ApexChart;
    colors: string[];
    dataLabels: ApexDataLabels;
    fill: ApexFill;
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive[];
    series: ApexAxisChartSeries;
    tooltip: ApexTooltip;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
};

@Component({
    selector: 'giz-report-workers-chart',
    templateUrl: './report-workers-chart.component.html',
    styleUrl: './report-workers-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ReportWorkersChartComponent implements OnInit, OnChanges {
    @Input({ required: true }) currencyCode?: string;
    @Input({ required: true }) workers?: Worker[];
    @Input({ required: true }) benchmark!: number;

    @ViewChild('chart') chart?: ChartComponent;

    public chartOptions?: ChartOptions;

    private readonly currencyPipe = inject(CurrencyPipe);
    private readonly genderPipe = inject(GenderPipe);

    public ngOnInit() {
        if (this.workers) {
            this.getChartOptions();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['workers'] && this.chart) {
            this.chart.updateSeries?.(this.getSeries());
        }
    }

    public getChartOptions() {
        this.chartOptions = {
            annotations: this.getAnnotations(),
            chart: this.getChart(),
            colors: this.getColors(),
            dataLabels: this.getDataLabels(),
            fill: this.getFill(),
            legend: this.getLegend(),
            series: this.getSeries(),
            plotOptions: this.getPlotOptions(),
            responsive: this.getResponsive(),
            tooltip: this.getTooltip(),
            xaxis: this.getXAxis(),
            yaxis: this.getYAxis(),
        };
    }

    private getAnnotations(): ApexAnnotations {
        return {
            yaxis: [{
                y: this.benchmark,
                borderColor: '#c30f08',
                borderWidth: 2,
                strokeDashArray: 3,
                label: {
                    text: $localize`:benchmark:Benchmark`,
                    position: 'left',
                    offsetX: 60,
                    borderWidth: 0,
                    style: {
                        background: '#fff',
                        color: '#c30f08',
                        padding: {
                            left: 2,
                            right: 2,
                            top: 2,
                            bottom: 2,
                        },
                    },
                },
            }],
        };
    }

    private getChart(): ApexChart {
        return {
            type: 'bar',
            stacked: true,
            stackOnlyBar: true,
            height: 450,
            fontFamily: 'Barlow',
            animations: {
                enabled: true,
                easing: 'linear',
                animateGradually: {
                    enabled: false,
                },
            },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                },
            },
            zoom: {
                enabled: true,
                type: 'x',
            },
        };
    }

    private getColors(): string[] {
        // sq base, sq bonus, sq ikb, sc base, sc bonus, sc ikb
        return ['#8c8c8c', '#a9a9a9', '#c5c5c5',
            '#a1be47', '#f2a950', '#fdc400'];
    }

    private getDataLabels(): ApexDataLabels {
        return {
             formatter: (val: number): string | number => {
                 return this.formatCurrency(val);
             },
        };
    }

    private getFill(): ApexFill {
        return {
            opacity: 1,
        };
    }

    private getLegend(): ApexLegend {
        return {
            position: 'bottom',
            horizontalAlign: 'left',
            offsetX: 2,
            offsetY: 6,
            fontSize: '13px',
            onItemClick: {
                toggleDataSeries: false,
            },
        };
    }

    private getPlotOptions(): ApexPlotOptions {
        return {
            bar: {
                horizontal: false,
            },
        };
    }

    private getResponsive(): ApexResponsive[] {
        return [
            {
                breakpoint: 480,
                options: {
                    xaxis: {
                        max: this.workers && this.workers.length > 5 ? 5 : undefined,
                    },
                },
            },
            {
                breakpoint: 768,
                options: {
                    xaxis: {
                        max: this.workers && this.workers.length > 8 ? 8 : undefined,
                    },
                },
            },
        ];
    }

    // eslint-disable-next-line max-lines-per-function
    private getSeries(): ApexAxisChartSeries {
        if (!this.workers) {
            return [];
        }

        return [
            {
                name: $localize`:baseWage status-quo label:Base wage (status-quo)`,
                type: 'bar',
                group: 'status-quo',
                data: this.workers.map(worker => {
                    return {
                        x: this.getCategory(worker),
                        y: worker.remuneration?.baseWage ?? 0,
                    };
                }),
            },
            {
                name: $localize`:bonuses status-quo label:Bonuses (status-quo)`,
                type: 'bar',
                group: 'status-quo',
                data: this.workers.map(worker => {
                    return {
                        x: this.getCategory(worker),
                        y: worker.remuneration?.bonuses ?? 0,
                    };
                }),
            },
            {
                name: $localize`:ikb status-quo label:IKB (status-quo)`,
                type: 'bar',
                group: 'status-quo',
                data: this.workers.map(worker => {
                    return {
                        x: this.getCategory(worker),
                        y: worker.remuneration?.ikb ?? 0,
                    };
                }),
            },
            {
                name: $localize`:baseWage scenario label:Base wage (scenario)`,
                type: 'column',
                group: 'scenario',
                data: this.workers.map(worker => {
                    return {
                        x: this.getCategory(worker),
                        y: worker.scenario.remuneration?.baseWage ?? 0,
                    };
                }),
            },
            {
                name: $localize`:bonuses scenario label:Bonuses (scenario)`,
                type: 'column',
                group: 'scenario',
                data: this.workers.map(worker => {
                    return {
                        x: this.getCategory(worker),
                        y: worker.scenario.remuneration?.bonuses ?? 0,
                    };
                }),
            },
            {
                name: $localize`:ikb scenario label:IKB (scenario)`,
                type: 'column',
                group: 'scenario',
                data: this.workers.map(worker => {
                    return {
                        x: this.getCategory(worker),
                        y: worker.scenario.remuneration?.ikb ?? 0,
                    };
                }),
            },
        ];
    }

    private getTooltip(): ApexTooltip {
        return {
            shared: true,
            intersect: false,
            inverseOrder: true,
            x:  {
                formatter: (val: number): any => {
                    if (!this.workers) {
                        return;
                    }
                    // Value is index
                    const worker = this.workers[val - 1];
                    const category = this.getCategory(worker);
                    return category.join(' -' );
                },
            },
            y: {
                formatter: (val: number): string => {
                    return this.formatCurrency(val);
                },
            },
        };
    }

    private getXAxis(): ApexXAxis {
        return {
            type: 'category',
            categories: this.workers ? this.workers.map((worker, index) => index): [],
            tickPlacement: 'on',
            tickAmount: 20,
            labels: {
                hideOverlappingLabels: true,
                style: {
                    colors: '#2d2d32',
                    fontSize: '14px',
                    fontWeight: 500,
                    cssClass: 'chart__category',
                },
            },
        };
    }

    private getYAxis(): ApexYAxis {
        return {
            forceNiceScale: true,
            min: 0,
            labels: {
                formatter: (val: number): string | string[] => {
                    return this.formatCurrency(val);
                },
            },
        };
    }

    private getCategory(worker: Worker): string[] {
        const workersPlural = $localize`:workers:workers`;
        const workerSingle = $localize`:worker:worker`;

        return [worker.name, `${ this.genderPipe.transform(worker.gender) }, ${ worker.nrOfWorkers } ${ worker.nrOfWorkers > 0 ? workersPlural : workerSingle }`];
    }

    private formatCurrency(value?: number): string {
        if (!value) {
            return '';
        }
        const formatted = this.currencyPipe.transform(value, this.currencyCode, '');
        return `${ formatted ?? '' } ${ this.currencyCode ?? '' }`;
    }
}
