import React, { Component } from 'react';
import './index.css';
import {retrieveData} from '../../lib/modules/modules.js';
import ChartsContainer from '../../containers/Charts';
// import Sidebar from '../../components/Sidebar.jsx';
import NewSidebar from '../../components/newSidebar.jsx';




class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false,
            isModalGraphOpen: false
        }
    }

  render() {


        // console.log(this.state)
        // console.log(this.props.graphType);
    return (

         <div className="bigContainer">
         <NewSidebar/>
            <div className="main-container">
                <h2>TESTING REACT-D3-LIBRARY</h2>

            </div>
         </div>

    );
  }


}

export default App;