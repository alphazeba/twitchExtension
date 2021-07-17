import React from 'react'
import Authentication from '../../util/Authentication/Authentication'
import QuestionEntryForm from './QuestionEntryForm';

import './App.css'
import './General.css';

export default class App extends React.Component{
    constructor(props){
        super(props)
        this.Authentication = new Authentication()

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.state={
            finishedLoading:false,
            theme:'light',
            isVisible:true,
            counter: 0,
            question: this.getDefaultQuestion(),
        }
    }

    getDefaultQuestion(){
        return {
            qid: '0',
            question: '',
            answers: [],
        }
    }

    contextUpdate(context, delta){
        if(delta.includes('theme')){
            this.setState(()=>{
                return {theme:context.theme}
            })
        }
    }

    visibilityChanged(isVisible){
        this.setState(()=>{
            return {
                isVisible
            }
        })
    }

    componentDidMount(){
        if(this.twitch){
            this.twitch.onAuthorized((auth)=>{
                this.Authentication.setToken(auth.token, auth.userId)
                if(!this.state.finishedLoading){
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    this.setState(()=>{
                        return {finishedLoading:true}
                    })
                }
            })

            this.twitch.listen('broadcast',(target,contentType,body)=>{
                this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result... 

                // do something...

            })

            this.twitch.onVisibilityChanged((isVisible,_c)=>{
                this.visibilityChanged(isVisible)
            })

            this.twitch.onContext((context,delta)=>{
                this.contextUpdate(context,delta)
            })
        }
    }

    componentWillUnmount(){
        if(this.twitch){
            this.twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
        }
    }

    handleClick(){
        let newState = {...this.state};
        newState.counter = newState.counter+1;
        this.setState(newState);
    }

    handleTestCall(){
        let newQuestion = {
            question: "hello world",
            answers: [
                "one",
                "two",
                "three",
            ]
        }
        this.Authentication.makeCall(this.getUrl('quiz/newQuestion'),'POST',newQuestion);
    }

    handleQuestionSubmit(questionData){
        this.Authentication.makeCall(this.getUrl('quiz/newQuestion'), 'POST', questionData);
    }

    queryQuestions(){
        this.Authentication.makeCall(this.getUrl('quiz/getQuestion'),'GET')
        .then(response => response.json())
        .then(response=>{
            this.twitch.rig.log(JSON.stringify(response));
            this.setState(()=>{
                return {question:response}
            })
        })
    }

    handleRefreshQuestions(){
        this.queryQuestions();
    }

    getUrl(ending){
        return location.protocol + '//localhost:8081/' + ending;
    }

    renderQuestions(){
        let answers = this.state.question.answers.map(a=><input 
            key={a.id}
            value={a.text}
            type='button'/>)
        return <div className='questionBg'>
            <div>{this.state.question.question}</div>
            {answers}
        </div>
    }
    
    render(){
        if(this.state.finishedLoading && this.state.isVisible){
            return (
                <div className="App">
                    <div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'} >
                        <p>Hello world!</p>
                        <p>My token is: {this.Authentication.state.token}</p>
                        <p>My opaque ID is {this.Authentication.getOpaqueId()}.</p>
                        <div>{this.Authentication.isModerator() ? <p>I am currently a mod, and here's a special mod button 
                            <input 
                            value='mod button' 
                            type='button'
                            onClick={()=>this.handleClick()}
                            /></p>  : 'I am currently not a mod.'}</div>
                        <p>I have {this.Authentication.hasSharedId() ? `shared my ID, and my user_id is ${this.Authentication.getUserId()}` : 'not shared my ID'}.</p>
                        <p>{this.state.counter}</p>
                        <input 
                        value="test call"
                        type='button'
                        onClick={()=>this.handleTestCall()}
                        />
                        <input
                        value="refreshQuestions"
                        type='button'
                        onClick={()=>this.handleRefreshQuestions()}
                        />
                        {this.renderQuestions()}
                    </div>
                    
                    <QuestionEntryForm onSubmit={(questionData)=>this.handleQuestionSubmit(questionData)}/>
                </div>
            )
        }else{
            return (
                <div className="App">
                </div>
            )
        }

    }
}