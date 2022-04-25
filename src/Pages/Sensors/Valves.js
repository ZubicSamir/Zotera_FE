import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OutgoingValve from "../../Images/outgoingValve.png";
import { HeaderCard } from "../ReuseableComponents/HeaderCard";
import Button from "@material-ui/core/Button";
import DeviceDetailCard from "../ReuseableComponents/DeviceDetailCard";
import { Typography, Box, FormControl, Select, MenuItem, Grid, Card } from "@material-ui/core";
import { DeviceValueWithStatus } from "../ReuseableComponents/DeviceValue";
import Charts from "../ReuseableComponents/Chart/Charts";
import { useGlobalContext } from "../../Components/context";
import GlobalChart from '../ReuseableComponents/Chart/GlobalChart'

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const useStyles = makeStyles({
  container: {
    display: "flex"
  },
  paper: {
    height: 200,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8
  },

  root: {
    width: '100%',
  },
  media: {
    width: '10%'
  },
  headerCardCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonColor: {
    backgroundColor: '#26616a',
    color: 'white'
  },
  dropDownBtnStyle: {
    backgroundColor: '#26616a',
    color: 'white',
    paddingTop: '4px',
    paddingLeft: '15px',
    paddingBottom: '4px',
    paddingRight: '14px',
    borderRadius: '5px'
  },
  alignCenter: {
    textAlign: 'center'
  },
  outgoingValveImageWidth: {
    maxWidth: '27%'
  },
  centerText: {
    flexGrow: 1,
    textAlign: 'center',
    alignItems: 'center'
  },

});
const Valves = () => {
  const { globalData,
    upperTankOutgoingValve,
    upperTankIncomingValve,
    lowerTankOutgoingValve
  } = useGlobalContext();
  const [values, setValues] = React.useState([
    "1 week",
    "2 week",
    "3 week",
    "4 week",
  ]);
  const [selected, setSelectedHistory] = useState("Last 1 Hour");

  function handleChange(event) {
    setSelectedHistory(event.target.value);
  }
  const classes = useStyles();

  const [uprTnkIncmngValve, setUprTnkIncmngValve] = useState([]);
  const [uprTnkIncmingValve, setUprTnkIncmingValve] = useState([]);
  const [lwrTnkOutgngValve, setLwrTnkOutgngValve] = useState([]);

  const pmpInletHistoryOption = {
    lasthour: "Last 1 Hour",
    lastday: "Last 1 Day",
    lastWeek: "Last 1 Week",
    lastTwoweeks: "Last 2 Week",
  };

  const pmpInletHistoryOptionKeys = Object.keys(pmpInletHistoryOption);

  const pmpInletHandleChange = (event) => {
    event.preventDefault();
    setSelectedHistory(event.target.value);
    fetch(`https://test-zotera-server-dev.azurewebsites.net/getListData?history=${event.target.value}&sensorType=UpperTankOutgoingValve`)
    //fetch(`http://localhost:8080/getListData?history=${event.target.value}&sensorType=UpperTankOutgoingValve`)
      .then((response) => response.json())
      .then((responseJson) => {
        // setOldDataPmpInlet(responseJson)
        validateAndSetFunction([], setUprTnkIncmngValve, "clear")
        for(var i=responseJson.length-1; i>=0; i--){
          validateAndSetFunction([responseJson[i]], setUprTnkIncmngValve, "add")
        }
      })
      .catch(error => {
        // setMsg('Please refresh page and try one more time .There has been a problem with your fetch operation:', error)
        // console.error('Please refresh page and try one more time .There has been a problem with your fetch operation:', error);
      });

    fetch(`https://test-zotera-server-dev.azurewebsites.net/getListData?history=${event.target.value}&sensorType=LowerTankOutgoingValve`)
    //fetch(`http://localhost:8080/getListData?history=${event.target.value}&sensorType=LowerTankOutgoingValve`)
      .then((response) => response.json())
      .then((responseJson) => {
        // setOldDataUpperTank(responseJson)
        validateAndSetFunction([], setLwrTnkOutgngValve, "clear")
        for(var i=responseJson.length-1; i>=0; i--){
          validateAndSetFunction([responseJson[i]], setLwrTnkOutgngValve, "add")
        }
      })
      .catch(error => {
        // setMsg('Please refresh page and try one more time .There has been a problem with your fetch operation:', error)
        // console.error('Please refresh page and try one more time .There has been a problem with your fetch operation:', error);
      });

      
    fetch(`https://test-zotera-server-dev.azurewebsites.net/getListData?history=${event.target.value}&sensorType=UpperTankIncomingValve`)
    //fetch(`http://localhost:8080/getListData?history=${event.target.value}&sensorType=UpperTankIncomingValve`)
    .then((response) => response.json())
    .then((responseJson) => {
      // setOldDataUpperTank(responseJson)
      validateAndSetFunction([], setUprTnkIncmingValve, "clear")
      for(var i=responseJson.length-1; i>=0; i--){
        validateAndSetFunction([responseJson[i]], setUprTnkIncmingValve, "add")
      }
    })
    .catch(error => {
      // setMsg('Please refresh page and try one more time .There has been a problem with your fetch operation:', error)
      // console.error('Please refresh page and try one more time .There has been a problem with your fetch operation:', error);
    });
  }

  function handleChange(event) {
    setSelectedHistory(event.target.value);
  }
  const validateAndSetFunction = (recivedArrayName, setFunctionName, action) => {
    if (recivedArrayName.length > 0) {
      //setFunctionName(recivedArrayName)
      setFunctionName(oldArray => {
        let oldData = [...oldArray];
        if (oldData.length > 15) {
          oldData.shift();
          return [...oldData, recivedArrayName[0]]
        } else {
          return [...oldData, recivedArrayName[0]]
        }
      })      
    }
    else if (action=='clear'){
      setFunctionName(oldArray => {
        return []
      })
    }
  }

  useEffect(() => {
    fetch('https://test-zotera-server-dev.azurewebsites.net/getListData?history=lasthour&sensorType=UpperTankOutgoingValve')
    //fetch('http://localhost:8080/getListData?history=lasthour&sensorType=UpperTankOutgoingValve')
      .then((response) => response.json())
      .then((responseJson) => {
        // setOldDataPmpInlet(responseJson)
        for(var i=responseJson.length-1; i>=0; i--){             
          validateAndSetFunction([responseJson[i]], setUprTnkIncmngValve, "add")
        }
      })
      .catch(error => {
        // setMsg('Please refresh page and try one more time .There has been a problem with your fetch operation:', error)
        // console.error('Please refresh page and try one more time .There has been a problem with your fetch operation:', error);
      });

    fetch('https://test-zotera-server-dev.azurewebsites.net/getListData?history=lasthour&sensorType=LowerTankOutgoingValve')
    //fetch('http://localhost:8080/getListData?history=lasthour&sensorType=LowerTankOutgoingValve')
      .then((response) => response.json())
      .then((responseJson) => {
        // setOldDataUpperTank(responseJson)
        for(var i=responseJson.length-1; i>=0; i--){
          validateAndSetFunction([responseJson[i]], setLwrTnkOutgngValve, "add")
        }
      })
      .catch(error => {
        // setMsg('Please refresh page and try one more time .There has been a problem with your fetch operation:', error)
        // console.error('Please refresh page and try one more time .There has been a problem with your fetch operation:', error);
      });

    fetch('https://test-zotera-server-dev.azurewebsites.net/getListData?history=lasthour&sensorType=UpperTankIncomingValve')
    //fetch('http://localhost:8080/getListData?history=lasthour&sensorType=UpperTankIncomingValve')
    .then((response) => response.json())
    .then((responseJson) => {
      // setOldDataUpperTank(responseJson)
      for(var i=responseJson.length-1; i>=0; i--){
        validateAndSetFunction([responseJson[i]], setUprTnkIncmingValve, "add")
      }
    })
    .catch(error => {
      // setMsg('Please refresh page and try one more time .There has been a problem with your fetch operation:', error)
      // console.error('Please refresh page and try one more time .There has been a problem with your fetch operation:', error);
    });
  }, [])

  useEffect(() => {
    validateAndSetFunction(upperTankOutgoingValve,setUprTnkIncmngValve, "add")
    validateAndSetFunction(upperTankIncomingValve,setUprTnkIncmingValve, "add")
    validateAndSetFunction(lowerTankOutgoingValve,setLwrTnkOutgngValve, "add")
  }, [globalData])

  return (
    <React.Fragment className={classes.container}>
      <Grid container spacing={2} display="flex"  >
        <Grid xs={4} item>
          <Box className={classes.headerCardCenter}>
            <HeaderCard lableName={'Description : '} labelValue={'Valve/Actuator'} />
          </Box>
        </Grid>
        <Grid xs={3} item>
          <Box className={classes.headerCardCenter}>
            <HeaderCard lableName={'Model Number : '} labelValue={'SV8050'} />
          </Box>
        </Grid>
        <Grid xs={3} item>
          <Box className={classes.headerCardCenter}>
            <HeaderCard lableName={'Location : '} labelValue={'Centennial '} />
          </Box>
        </Grid>
        <Grid xs={2} item>
          <Box className={classes.headerCardCenter}>
            <Button className={classes.buttonColor} variant="contained">
              More
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={16} justify="flex-start">
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Box className={classes.paper}>
            <DeviceDetailCard
              imagePath={OutgoingValve}
              deviceNameBlueClr={'Upper Tank Outgoing Valve'}
              deviceDetailBlackColor={null}
              deviceDetailBlackColorSiUnit={null}
              deviceReading={null}
              classNameUsed={classes.outgoingValveImageWidth} />
          </Box>
          {/* <Box className={classes.headerCardCenter}>
            <DeviceValueWithStatus classNameUsed={classes.ltovVal} valueOne={'33'} deviceStatus={' Open '} />
          </Box> */}
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Box className={classes.paper}>
            <DeviceDetailCard
              imagePath={OutgoingValve}
              deviceNameBlueClr={'Lower Tank Outgoing Valve'}
              deviceDetailBlackColor={null}
              deviceDetailBlackColorSiUnit={null}
              deviceReading={null}
              classNameUsed={classes.outgoingValveImageWidth} />
          </Box>
          {/* <Box className={classes.headerCardCenter}>
            <DeviceValueWithStatus classNameUsed={classes.ltovVal} valueOne={'70'} deviceStatus={' Open '} />
          </Box> */}
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Box className={classes.paper}>
            <DeviceDetailCard
              imagePath={OutgoingValve}
              deviceNameBlueClr={'Upper Tank Incoming Valve'}
              deviceDetailBlackColor={null}
              deviceDetailBlackColorSiUnit={null}
              deviceReading={null}
              classNameUsed={classes.outgoingValveImageWidth} />
          </Box>
          {/* <Box className={classes.headerCardCenter}>
            <DeviceValueWithStatus classNameUsed={classes.ltovVal} valueOne={'100'} deviceStatus={' Open '} />
          </Box> */}
        </Grid>
      </Grid>

      <Grid container spacing={2} display="flex" className={classes.headerCardCenter}>
        <Grid xs={4} item  >
          <Card className={classes.root} >
            <Grid container spacing={2} display="flex" className={classes.headerCardCenter}>
              <Grid xs={7} item >
                <b> Status History </b>
              </Grid>
              <Grid xs={2} item>
                <FormControl>
                  {/* <Select className={classes.dropDownBtnStyle}
                    value={selected}
                    onChange={handleChange}
                    inputProps={{
                      name: "statusHistory",
                      id: "statusHistory",

                    }}
                  >
                    {values.map((value, index) => {
                      return <MenuItem value={value} key={index * 2.54}>{value}</MenuItem>;
                    })}
                  </Select> */}
                  <Select className={classes.dropDownBtnStyle}
                      // value={selected ? selected : ''}
                      onChange={pmpInletHandleChange}
                      inputProps={{
                        name: "statusHistory",
                        id: "statusHistory",
                      }}
                      defaultValue='lasthour'
                    >

                      {pmpInletHistoryOptionKeys.map((value, index) => {
                        return <MenuItem value={value} key={index * 2.54}>{pmpInletHistoryOption[value]}</MenuItem>;
                      })}
                    </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} display="flex" className={classes.headerCardCenter}>
        <Grid xs={4} item >
          <Card className={classes.root} >
            <Grid container spacing={2} display="flex" className={classes.headerCardCenter}>
              <Grid xs={7} item >
                <b> Alerts : 7 </b>
              </Grid>
              <Grid xs={2} item>
                <Button className={classes.buttonColor} variant="contained">
                  Details
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={16} justify="flex-start">
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Box className={classes.centerText}>
            <br />
            <Typography gutterBottom  >
              <b>Upper Tank Outgoing Valve Rotation</b>
            </Typography>
            {/* <Charts  newBackGrndColr={'yellow'} newBorderColr={'yellow'}  newLabelName={'UpperTankOutgoingValve'}/> */}

            <GlobalChart
              newBackGrndColr={'rgb(29, 213, 169)'}
              newBorderColr={'rgb(29, 213, 169)'}
              allLabelNames={['UpperTankOutgoingValve']}
              arrayOfRespectiveDataset={[uprTnkIncmngValve]}
              dataSetbackgroundColor={['rgb(29, 213, 169)']}
              siUnit={'Level %'}
              heightForChart={250}
            />

          </Box>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Box className={classes.centerText}>
            <br />
            <Typography gutterBottom  >
              <b>Lower Tank Outgoing Valve Rotation</b>
            </Typography>
            {/* <Charts newBackGrndColr={'#EE82EE'} newBorderColr={'#EE82EE'} newLabelName={'LowerTankOutgoingValve'} /> */}

            <GlobalChart
              newBackGrndColr={'#EE82EE'}
              newBorderColr={'#EE82EE'}
              allLabelNames={['LowerTankOutgoingValve']}
              arrayOfRespectiveDataset={[lwrTnkOutgngValve]}
              dataSetbackgroundColor={['#EE82EE']}
              siUnit={'Level %'}
              heightForChart={250}
            />

          </Box>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Box className={classes.centerText}>
            <br />
            <Typography gutterBottom  >
              <b>Upper Tank Incoming Valve Rotation</b>
            </Typography>
            {/* <Charts newBackGrndColr={'red'} newBorderColr={'red'} newLabelName={'UpperTankIncomingValve'} /> */}

            <GlobalChart
              newBackGrndColr={'red'}
              newBorderColr={'red'}
              allLabelNames={['UpperTankIncomingValve']}
              arrayOfRespectiveDataset={[uprTnkIncmingValve]}
              dataSetbackgroundColor={['red']}
              siUnit={'Level %'}
              heightForChart={250}
            />
          </Box>
        </Grid>
      </Grid>

    </React.Fragment>
  );
};

export default Valves;