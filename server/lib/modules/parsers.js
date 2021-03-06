const csv = require('csvtojson');
const parse = require('csv-parse');
const csvFilePath = './lib/2015_CRIME.csv';
const fs = require('fs');
const stateNames = require('./seed-data.js').stateNames;


function firstLetterUpperCase(string) {
    let newWord = '';
    let words = string.split(' ');
    words.forEach(word => {
        newWord += word.charAt(0) + word.slice(1).toLowerCase() + ' ';
        })
    return newWord.substring(0, newWord.length - 1);
}

function parseCsvCities() {
    let tempArray = [];
    csv()
    .fromFile('./lib/data/YEAR_2015.csv')
    .on('json', (obj, index) => {
        if(obj.State !== ''){
            obj.State = firstLetterUpperCase(obj.State)
        } else if(obj.State === ''){
            obj.State = tempArray[index -1].State;
        }
        let state_id = stateNames.indexOf(obj.State) + 1;
       let cityObj = {
            State: obj.State,
            City: obj.City,
            state_id
       }
       tempArray.push(cityObj);
    })
    .on('end', error => {
        console.log('done parsing for cities...');
        console.log(tempArray)
        fs.writeFile('./lib/data/json/cities.json', JSON.stringify(tempArray), err => {
            if(err){console.log(err)};
            console.log("done writing cities json");
        })
    })
}

function parseCsv(filePath, year) {
    console.log('sanity')
    let tempArray = [];
    csv()
    .fromFile(filePath)
    .on('json', (obj, index) => {
        if(obj.State !== ''){
            obj.State = firstLetterUpperCase(obj.State)
        } else if(obj.State === ''){
            obj.State = tempArray[index -1].State;
        }
        for(let key in obj){
            if(obj[key] === ''){
                obj[key] = '0';
            }
        }
        obj.population = parseInt(obj.population.replace(/,/g,''));
        obj.violent_crime = parseInt(obj.violent_crime.replace(/,/g,''));
        obj.murder_and_manslaughter = parseInt(obj.murder_and_manslaughter.replace(/,/g,''));
        obj.rape = parseInt(obj.rape.replace(/,/g,''));
        obj.robbery = parseInt(obj.robbery.replace(/,/g,''));
        obj.aggravated_assault = parseInt(obj.aggravated_assault.replace(/,/g,''));
        obj.property_crime = parseInt(obj.property_crime.replace(/,/g,''));
        obj.burglary = parseInt(obj.burglary.replace(/,/g,''));
        obj.larceny_theft = parseInt(obj.larceny_theft.replace(/,/g,''));
        obj.motor_vehicle_theft = parseInt(obj.motor_vehicle_theft.replace(/,/g,''));
        obj.arson = parseInt(obj.arson.replace(/,/g,''));
        obj.year = year;
        tempArray.push(obj)
    })
    .on('end', error => {
        console.log('done parsing...')

        fs.writeFile(`./lib/data/json/YEAR_${year}.json`, JSON.stringify(tempArray), err => {
            if (err) {console.log(err)}
                console.log("Saved data to json...")
        })

    })
}

function reduceNationData(array, year) {
    let tempArray = [];
    let tempObj = {year, state: 'Alabama', population: 0, violent_crime: 0, murder_and_manslaughter: 0, rape: 0, robbery: 0, aggravated_assault: 0, property_crime: 0, burglary: 0, larceny_theft: 0, motor_vehicle_theft: 0, arson: 0, createdAt: new Date(), updatedAt: new Date()};
    for(let i = 0; i < array.length; i++){    // console.log(array[i])
        if(array[i].State === tempObj.state){
            tempObj.population += array[i].population;
            tempObj.violent_crime += array[i].violent_crime;
            tempObj.murder_and_manslaughter += array[i].murder_and_manslaughter;
            tempObj.rape += array[i].rape;
            tempObj.robbery += array[i].robbery;
            tempObj.aggravated_assault += array[i].aggravated_assault;
            tempObj.property_crime += array[i].property_crime;
            tempObj.burglary += array[i].burglary;
            tempObj.motor_vehicle_theft += array[i].motor_vehicle_theft;
            tempObj.arson += array[i].arson;
        } else if(array[i].State !== tempObj.state){
            tempArray.push(tempObj);
            tempObj = {year, state: array[i].State , population: 0, violent_crime: 0, murder_and_manslaughter: 0, rape: 0, robbery: 0, aggravated_assault: 0, property_crime: 0, burglary: 0, larceny_theft: 0, motor_vehicle_theft: 0, arson: 0, createdAt: new Date(), updatedAt: new Date()};
        }
    }
    return tempArray;
}


module.exports = {
    parseCsv,
    parseCsvCities,
    reduceNationData
}