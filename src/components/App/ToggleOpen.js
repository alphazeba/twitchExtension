import React from 'react';

export default class ToggleOpen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false
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
            return <div>
                <input value={this.props.closeText || "click to hide"} type='button' onClick={()=>this.handlehide()} />
                <div>
                    {this.props.children}
                </div>
            </div>
        }
        else {
            return <input value={this.props.openText || "click to open"} type='button' onClick={()=>this.handleOpen()} />
        }
    }
}