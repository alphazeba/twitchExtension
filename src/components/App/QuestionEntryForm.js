import React from 'react'

import SimpleInput from './SimpleInput';
import ToggleOpen from './ToggleOpen';

import './QuestionEntryForm.css';
import './General.css';


export default class QuestionEntryForm extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            question: '',
            answers: ['']
        }
    }


    renderAnswers(){
        return this.state.answers.map((answerText,i)=>this.renderAnswer(answerText,i))
    }

    renderAnswer(answerText, index){
        return <div className='qefAnswerSpace'>
            <span>
                {index+1}: 
                <SimpleInput value={answerText} onUpdate={(t)=>this.handleAnswerUpdate(t,index)} />
                <input value="X" type='button' onClick={()=>this.handleAnswerDelete(index)} />
            </span>
        </div>
    }
    
    handleQuestionUpdate(text){
        this.setState(() => {
            return {question: text}
        });
    }

    handleAnswerAdd(){
        let newAnswers = [...this.state.answers];
        newAnswers.push("");
        this.setState(()=>{
            return {answers: newAnswers}
        })
    }

    handleAnswerDelete(index){
        let newAnswers = this.state.answers.filter((text,i)=>i!=index);
        this.setState(()=>{
            return {answers: newAnswers}
        })
    }

    handleAnswerUpdate(text,index){
        // TODO need to do something here.
        let newAnswers = [...this.state.answers];
        newAnswers[index] = text;
        this.setState(()=>{
            return{answers: newAnswers}
        });
    }

    handleSubmit(){
        this.props.onSubmit(this.state);
    }

    render(){
        return <ToggleOpen openText="new question form" closeText="hide question form">
            <div className='qefBG'>
                <div className='qefSpace'>
                    <div>question entry form.</div>
                    <div>question:</div>
                    <SimpleInput type='textarea' value={this.state.question} onUpdate={(t)=>this.handleQuestionUpdate(t)}/>
                    <div className='qefSpace'>
                        <input value="add Answer" type='button' onClick={()=>this.handleAnswerAdd()} />
                    </div>
                    {this.renderAnswers()}
                </div>
                <div className='qefSpace'>
                    <input value="Submit" type='button' onClick={()=>this.handleSubmit()} />
                </div>

            </div>
        </ToggleOpen>
        
    }

}