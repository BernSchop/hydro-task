import React, { ReactPropTypes } from 'react';
import Select from 'react-select';

import ChartDataService from '../services/ChartDataService';
import ChartConfigService from '../services/ChartConfigService';
import { ChartItem, SelectOption } from '../models/ChartModel';
import chartStyles from './Chart.module.css';
import { Grid, Row, Col } from 'react-flexbox-grid';

// @ts-ignore
import Highcharts from 'highcharts';
// @ts-ignore
import HighchartsExporting from 'highcharts/modules/exporting';

const ReactHighcharts = require('react-highcharts');

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts);
}

interface IState {
    error: string | null;
    isLoaded: boolean;
    chartData: ChartItem[];
    chartConfig: any;
    selectedData: SelectOption | null;
    selectedTheme: SelectOption | null;
}

interface IProps {
    selectedData: SelectOption | null;
    selectedTheme: SelectOption | null;
}

const options: SelectOption[] = [
    {value: '476d7474-9066-4da5-b40d-8990f09f5f3d', label: 'Dataset 1'},
    {value: 'c83e8d8a-0a8e-44be-bef8-c08bc2837a9c', label: 'Dataset 2'},
];

const themes: SelectOption[] = [
    {value: 'Hydro', label: 'Hydrogrid Theme'},
    {value: 'Randy', label: 'Randy Theme'},
];


export default class Chart extends React.Component {
    state: IState;

    constructor(props: IProps) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            chartData: [],
            chartConfig: {},
            selectedData: props.selectedData,
            selectedTheme: props.selectedTheme,
        };
    }

    componentDidMount(): void {
        this.setState({selectedData: options[0], selectedTheme: themes[0]})
        this.retrieveChartData(options[0].value);
    }

    retrieveChartData(id: string): void {
        this.setState({isLoaded: false})
        ChartDataService.getChartData(id).then(
            (res: ChartItem[]) => {
                this.setState({chartData: res});
                this.prepareChart();
            },
            ((e: Error) => {
                this.setState({
                    isLoaded: true,
                    error: e
                });
            }));
    }

    prepareChart(): void {
        const state: IState = this.state;
        if (state.chartData) {
            const config = ChartConfigService._setChartConfig(state.chartData, state.selectedData);
            this.setState({isLoaded: true, chartConfig: config});
            this.changeTheme(state.selectedTheme.value);
        }
    }

    changeTheme(theme: string) {
        const chartConfigState: IState = this.state.chartConfig;
        const chartConfig = ChartConfigService._changeTheme(theme, chartConfigState);
        this.setState({chartConfig: chartConfig})
    }

    // Known error(warning) with react-select: https://github.com/JedWatson/react-select/issues/4094
    // @TODO: update library when bug fix is released (v4.0.0)
    handleDataSetChange = (selectedData: any) => {
        this.setState({selectedData});
        this.retrieveChartData(selectedData.value);
    };

    handleThemeChange = (selectedTheme: any) => {
        this.setState({selectedTheme});
        this.changeTheme(selectedTheme.value);
    };


    render() {
        const {error, isLoaded, selectedData, selectedTheme} = this.state;

        if (error) {
            return <div>Error: {error}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Grid fluid>
                    <Row className={chartStyles.optionsContainer}>
                        <Col xs={6} md={3}>
                            <Select className={chartStyles.select}
                                    value={selectedData}
                                    onChange={this.handleDataSetChange}
                                    options={options}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <Select className={chartStyles.select}
                                    value={selectedTheme}
                                    onChange={this.handleThemeChange}
                                    options={themes}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <ReactHighcharts config={this.state.chartConfig} highcharts={Highcharts}/>
                        </Col>
                    </Row>
                </Grid>
            );
        }
    }
}