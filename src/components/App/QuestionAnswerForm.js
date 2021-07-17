

import React from 'react';
import ToggleOpen from './ToggleOpen';

import './form.css';

export default class QuestionAnswerForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            lastSubmittedQid: "",
            lastSubmittedAid: "",
        }
    }

    handleClickAnswer(answerId, questionId){
        if(this.questionAlreadyAnswered()) return;
        this.setState(()=>{
            return {lastSubmittedAid: answerId, lastSubmittedQid: questionId}
        })
        this.props.onSubmitAnswer(answerId,questionId)
    }

    questionAlreadyAnswered(qid){
        return this.state.lastSubmittedQid == qid;
    }

    isAnswerSelected(aid){
        return this.state.lastSubmittedAid == aid;
    }
    
    renderAnswer(answer){
        window.Twitch.ext.rig.log(answer)
        let text = answer.text;
        let id = answer.id;
        let qid = this.props.question.qid;
        let classes = "qafAnswer";
        if(this.questionAlreadyAnswered(qid)) {
            classes += " qafAnswerDeactivated";
            if(this.isAnswerSelected(id)){
                classes += " qafAnswerSelected";
            } 
        }
        
        return  <div className='qefAnswerSpace'>
            <input 
                className={classes}
                value={text} 
                key={id} 
                type='button' 
                onClick={()=>this.handleClickAnswer(id,qid)} 
            />
        </div>
    }

    renderQuestion(questionState){
        let question = questionState.question;
        let answers = questionState.answers;

        return <div className='qefBG'>
            <div className='qefSpace'>
                Q: {question}
            </div>
            <div className='qefSpace'>
                {answers.map(a=>this.renderAnswer(a))}
            </div>
        </div>
    }
    
    render(){
        let content = this.props.question ? this.renderQuestion(this.props.question) : <div> no question currently</div>;
 
        return <ToggleOpen>
            {content}
        </ToggleOpen>
        
    }

}