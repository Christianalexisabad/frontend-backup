import React from "react";
import Chart from "react-apexcharts";
import "./YearlyItemCount.css";

export default class YearlyItemCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                title: {
                    text: "Item count by year",
                    enabled: false,
                    style: {
                        fontWeight: 'normal',
                        color: 'rgb(120,120,120)'
                    }
                },
                xaxis: {
                    categories: []
                }
            },
            series: [
                {
                    data: []
                }
            ],
        };
    }

    componentWillReceiveProps(nextProps) {

        const data = {
            '2018': 100,
            '2019': 120,
            '2020': 110,
            '2021': 90,
            '2022': 138
        }
        
        this.setState({
            series: [
                {
                    data: Object.values(data)
                }
            ],
            options: { 
                xaxis: {
                    categories: Object.keys(data) 
                },
            }
        })
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width="100%"
                height="250px"
            />
        )
    }
}