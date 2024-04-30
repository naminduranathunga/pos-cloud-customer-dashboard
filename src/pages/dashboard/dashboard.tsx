
import "chart.js/auto";
import { Line, Doughnut } from 'react-chartjs-2';

export default function Dashboard() {
    const sales_data = {
        labels: ['29', '30', '31', '1', '2', '3', '4'],
        datasets: [
          {
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3, 9],
            fill: true,
            backgroundColor: 'rgba(22, 163, 74, 0.2)',
            borderColor: 'rgba(22, 163, 74, 0.8)',
          },
        ],
    };

    const shades = [
        'rgb(22, 163, 74)',
        'rgb(44, 143, 94)',
        'rgb(66, 123, 114)',
        'rgb(88, 103, 134)',
        'rgb(110, 83, 154)',
        'rgb(132, 63, 174)'
    ];

    const doughnut_data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: shades,
            hoverOffset: 4,
        }],
    };

    const chart_options = {
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x:{
                display: false,
            },
            y:{
                display: false,
            },
        }
    }

    return (
        <div className="">
            <h1 className="text-lg md:text-2xl font-semibold mb-4">Dashboard</h1>
            <hr />

            <div className="grid grid-cols-4 mt-6 gap-6">
                <div className="border rounded-md shadow bg-white p-4">
                    <h3 className="font-semibold text-xl">Sales Summery</h3>
                    <div className="w-[200px] h-[100px] rounded-full">
                        <Line data={sales_data} options={chart_options} /> 
                    </div>
                    
                </div>
                
                <div className="border rounded-md shadow bg-white p-4">
                    <h3 className="font-semibold text-xl">Sales Summery</h3>
                    <div className="w-[100px] h-[100px] rounded-full">
                        <Doughnut data={doughnut_data} options={chart_options} /> 
                    </div>
                </div>

                <div className="border rounded-md shadow bg-white p-4">
                    <h3 className="font-semibold text-xl">Daily Income</h3>
                    <div className="w-[200px] h-[100px] rounded-full">
                        <Line data={sales_data} options={chart_options} /> 
                    </div>
                    
                </div>
                
                <div className="border rounded-md shadow bg-white p-4">
                    <h3 className="font-semibold text-xl">Sales Summery</h3>
                    <div className="w-[100px] h-[100px] rounded-full">
                        <Doughnut data={doughnut_data} options={chart_options} /> 
                    </div>
                </div>
                
            </div>
        </div>
    );
}
