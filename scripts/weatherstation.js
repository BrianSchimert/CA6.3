/*************************************************************************
 * File: weatherstation.js
 * This file defines a React component that implements the Weather
 * Station app developed in Chapter 10.
 ************************************************************************/

/*************************************************************************
 * @class WeatherStation 
 * @Desc 
 * This React component uses the OpenWeatherMap API to render the weather
 * conditions at a given latitude and longitude.
 *************************************************************************/
class WeatherStation extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {latitude: this.props.latitude,
                    longitude: this.props.longitude
                   };
    }

    componentDidMount = () => {
        this.getCurrentObservations();
    }

    toggleUnits = () => {
        if (this.state.tempUnit == "F") {
            this.setState({tempUnit: "C", temp: Math.round((this.state.temp - 32) * 5/9)});
        } else {
            this.setState({tempUnit: "F", temp: Math.round((this.state.temp * 9/5) + 32)});
        }
    }

    getCurrentObservations = async() => {
        const response = await(fetch('https://api.weather.gov/points/' + this.state.latitude + ',' + this.state.longitude))
        const gridInfo = await response.json();
        const gridX = gridInfo.properties.gridX;
        const gridY = gridInfo.properties.gridY;
        const gridId = gridInfo.properties.gridId;
        const response1 = await(fetch('https://api.weather.gov/gridpoints/' + gridId + '/' + gridX + ','+ gridY + '/stations'))
        const stationInfo = await response1.json();
        const stationId = stationInfo.features[0].properties.stationIdentifier;
        const response2 = await fetch('https://api.weather.gov/stations/' + stationId + '/observations/latest');
        //const response = await fetch('https://api.weather.gov/stations/KBFI/observations/latest'); //for seattle gridpoint
        const currWeather = await response2.json();
        this.setState({place: 'Seattle, WA',
            retrieved: (new Date()).toLocaleDateString() + " at " + 
               (new Date()).toLocaleTimeString(),
            conditions: currWeather.properties.textDescription,
            visibility: currWeather.properties.visibility.value,
            visibilityUnit: "Meters",
            temp: currWeather.properties.temperature.value,
            tempUnit: "C",
            humidity: currWeather.properties.relativeHumidity.value,
            visibility: currWeather.properties.visibility.value,
            wind: currWeather.properties.windSpeed.value,
            windUnit: "Km/hr",
            windDirection: currWeather.properties.windDirection.value,
            windDirectionUnit: "Degrees"
        });
    }

   render() {
        return (
        <section className="jumbotron ws-centered ws-padding">
            <h1>Weather Conditions at {this.state.place}</h1>
                <p><i>Last updated: {this.state.retrieved}</i></p>
                <p>Conditions: {this.state.conditions}</p>
                <p>Visibility: {this.state.visibility + " " + this.state.visibilityUnit}</p>
                <p>Temp: {this.state.temp}&deg;&nbsp;{this.state.tempUnit}</p>
                <p>Humidity: {this.state.humidity}%</p>
                <p>Wind Speed: {this.state.wind + " " + this.state.windUnit}</p>
                <p>Wind Direction: {this.state.windDirection + " " + 
                    this.state.windDirectionUnit}</p>
            <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input" 
                       id={"switch-" + this.props.stationId} onClick={this.toggleUnits} />
                <label className="custom-control-label" 
                    htmlFor={"switch-" + this.props.stationId}>&nbsp;&deg;{this.state.tempUnit}</label>
            </div>
        </section>
        );
    }

}
