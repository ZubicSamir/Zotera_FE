import { withStyles } from "@material-ui/core/styles";
import ChartScatter from "./ChartingComponent";

import { Chart as charts, registerables } from "chart.js";
charts.register(...registerables);

const styles = () => ({
  "chart-container": {
    height: 220,
  },
});

const ChartTest = ({
  allLabelNames,
  arrayOfRespectiveDataset,
  dataSetbackgroundColor,
  siUnit,
  heightForChart = 120,
}) => {
  const labelN = allLabelNames.map((lblName, index) => ({
    label: lblName,
    pointRadius: 1,
    pointBackgroundColor: "black",
    data: arrayOfRespectiveDataset[index],
    fill: false,
    lineTension: 0,
    backgroundColor: dataSetbackgroundColor[index],
    borderColor: dataSetbackgroundColor[index],
    showLine: true,
  }));

  let dataChart = {
    lineChartData: {
      datasets: labelN,
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true,
      },
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: siUnit,
          },
        },
        x: {
          type: "time",
          display: true,
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <div style={{ height: heightForChart }}>
        {dataChart && dataChart?.lineChartData && (
          <ChartScatter
            data={dataChart.lineChartData}
            options={dataChart.lineChartOptions}
            type={"scatter"}
          />
        )}
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(ChartTest);
