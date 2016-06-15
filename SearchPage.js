import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image
} from 'react-native'

import SearchResults from './SearchResults'
import houseImage from './Resources/house.png'

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
})

const urlForQueryAndPage = (key, value, pageNumber) => {
  const data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber
  }
  data[key] = value

  const queryString = Object
    .keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&')

  return `http://api.nestoria.co.uk/api?${queryString}`
}

export default class SearchPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchString: 'london',
      isLoading: false,
      message: ''
    }
  }

  _executeQuery(query) {
    this.setState({
      isLoading: true
    })

    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error =>
        this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
        }))
  }

  _handleResponse(response) {
    this.setState({
      isLoading: false,
      message: ''
    })
    if(response.application_response_code.substr(0, 1) === '1') {
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {
          listings: response.listings.map((property, idx) => Object.assign({}, property, {guid: idx}))
        }
      })
    } else {
      this.setState({ message: 'Location not recognized: please try again. '})
    }
  }

  onSearchPressed() {
    const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query)
  }

  onSearchTextChanged(event) {
    this.setState({
      searchString: event.nativeEvent.text
    })
  }

  onLocationPressed(event) {
    navigator.geolocation.getCurrentPosition(
      location => {
        const search = `${location.coords.latitude},${location.coords.longitude}`;
        const query = urlForQueryAndPage('centre_point', search, 1)

        this.setState({ searchString: search })
        this._executeQuery(query)
      },
      error => {
        this.setState({
          message: `There was a problem with obtaining your location: ${JSON.stringify(error)}`
        })
      }
    )
  }

  render() {
    const spinner = this.state.isLoading
                  ? (<ActivityIndicatorIOS size="large" />)
                  : (<View />)

    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='Search via name or postcode'/>
          <TouchableHighlight
            style={styles.button}
            underlayColor='#99d9f4'
            onPress={this.onSearchPressed.bind(this)}
          >
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          style={styles.button}
          underlayColor='#99d9f4'
          onPress={this.onLocationPressed.bind(this)}
        >
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>
        <Image source={houseImage} style={styles.image} />
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    )
  }
}
