

import React from 'react';

import './General.css';

export default class SimpleInput extends React.Component {

    constructor(props){
        super(props)
    }

    handleUpdate(e){
        e.preventDefault();
        // TODO maybe check that e.value is valid or somethign?
        let value = e.target.value;
        this.props.onUpdate(value);
    }

    render(){
        if(this.props.type && this.props.type == 'textarea'){
            return <textarea onChange={(e)=>this.handleUpdate(e)}>
                {this.props.value}
            </textarea>
        }
        else
            return <input value={this.props.value} onChange={(e)=>this.handleUpdate(e)} type={this.props.type || 'text'}/>
    }
}