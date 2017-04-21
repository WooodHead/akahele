import React, { Component } from 'react';
import './index.css';
import {retrieveData} from '../../lib/modules/modules.js';
import ChartsContainer from '../../containers/Charts';
import Sidebar from '../../components/Sidebar.jsx';




class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false,
            isModalGraphOpen: false
        }
    }

  render() {


        console.log(this.state)
    return (

         <div className="bigContainer">
            <Sidebar/>
            <div className="chart-container">
                <h2>TESTING REACT-D3-LIBRARY</h2>
                <ChartsContainer />
            </div>
         </div>

    );
  }


}

export default App;