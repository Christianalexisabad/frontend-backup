import Chart from "react-apexcharts";
import React from "react";
import axios from "axios";
import { getHost } from "../../../../../../../utility/APIService";

export default class EmployeeType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [],
            options: {
                title: {
                    text: 'Employee Type',
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
                        fontSize: '12px',
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
            },
            styles: {
                chart: {
                    textTransform: 'capitalize',
                }
            }
        }
    }

    componentDidMount() {

        axios.get(getHost() + "/api/dashboard/employee-types/")
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
                height="150"
            />
        )
    }
}