import Chart from "react-apexcharts";
import React from "react";
import axios from "axios";
import { getHost } from "../../../../../../../utility/APIService";

export default class AgeRatio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [],
            options: {
                title: {
                    text: 'Age Ratio',
                    style: {
                        fontWeight: 'normal',
                        color: 'rgb(120,120,120)'
                    }
                },
                fill: {
                    borderColor: 'rgb(255,255,255)'
                },
                dataLabels: {
                    style: {
                        fontSize: '15px',
                        colors: ['grey'],
                    },
                    background: {
                        enabled: true,
                        foreColor: '#fff',
                        borderRadius: 2,
                        opacity: 0.9,
                        borderWidth: 0,
                      },
                },
                labels: [],
                colors: ['rgb(10,250,10)', 'rgb(230,10,10)'],
            },
            styles: {
                chart: {
                    textTransform: 'capitalize',
                }
            }
        }
    }

    componentDidMount(){

        axios.get(getHost() + "/api/dashboard/employee-age-ratio/")
        .then(res => {
            
            const { data } = res.data;

            this.setState({
                series: Object.values(data),
                options: { labels: Object.keys(data) }
            })
        })
    }

    render() {
        return (
            <Chart 
                style={this.state.styles.chart}
                options={this.state.options} 
                series={this.state.series} 
                type="donut" 
                width="90%"
                height="90%"
            />
        )
    }
}