import React from 'react';

import './App.css';
import './ToggleOpen.css';

export default class ToggleOpen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: true
        }
    }

    handlehide(){
        this.setState(()=>{
            return {open: false}
        })
    }

    handleOpen(){
        this.setState(()=>{
            return {open: true}
        })
    }

    render(){
        if(this.state.open){
            return <div className='anchor'>
                <input className='toggleButtonPos hideButton' value="O" type='button' onClick={()=>this.handlehide()} />
                <div>
                    {this.props.children}
                </div>
            </div>
        }
        else {
            return <div className='anchor toggleBG'>
                {this.props.openText || "click to open"}
                <input className='toggleButtonPos openButton' value="O" type='button' onClick={()=>this.handleOpen()} />
            </div>
        }
    }
}