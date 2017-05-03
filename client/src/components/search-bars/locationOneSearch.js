import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import {retrieveData} from '../../lib/modules/modules.js';

class LocationOneSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            locations: [],
            value: '',
            suggestions: []
        }
    }

    retrieveLocationNames = (locationType) => {
        retrieveData(`http://localhost:8080/api/${locationType}`)
            .then(locations => {
                console.log(locations)
                this.setState({
                    locations
                })
            })
    }

    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : this.state.locations.filter(location => location.name.toLowerCase().slice(0, inputLength) === inputValue);
    }

    getSuggestionValue = suggestion => suggestion.name;

    renderSuggestion = suggestion => (<div>{suggestion.name}</div>);

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        })
    }

    requestLocationOne(){
        console.log(this.state.value)
    }

    onEnter = (event, data) => {
        console.log(event.target.value)
        this.requestLocationOne();
    }

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        })
    }
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    }

    componentWillMount = () => {
        this.retrieveLocationNames("states");
    }

    render(){
        const {value, suggestions} = this.state;
        const inputProps = {
            placeholder: 'Type a location...',
            value,
            onChange: this.onChange,
            onKeyDown: this.onEnter
        }
        console.log('serch bar state', this.state)
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />
        )
    }
}

export default LocationOneSearch;