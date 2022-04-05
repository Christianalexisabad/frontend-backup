import Chart from "react-apexcharts";
import React from "react";
import { getHost } from "../../../../../../../utility/APIService";
import axios from "axios";

export default class GenderRatio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [],
            options: {
                title: {
                    text: 'Gender',
                    style: {
                        fontWeight: 'normal',
                        color: 'rgb(120,120,120)'
                    }
                },
                fill: {
                    colors: ['rgb(10,10,250)', 'rgb(230,100,100)'],
                },
                dataLabels: {
                    style: {
                        fontSize: '15px',
                        colors: ['grey'],
                    },
                    background: {
                        enabled: true,
                        foreColor: '#fff',
                        padding: 4,
                        opacity: 1,
                        borderWidth: 0,
                      },
                },
                labels: [],
                colors: ['rgb(10,10,250)', 'rgb(230,100,100)'],
            },
            styles: {
                chart: {
                    textTransform: 'capitalize',
                }
            }
        }
    }

    componentDidMount() {

        axios.get(getHost() + "/api/dashboard/employee-sex/")
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