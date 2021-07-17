

module.exports = class StatTracker{
    constructor(historyLength=5){
        this.historyLength = historyLength;
        this.questionMap = {};
        this.qidHistory = [];
    }

    buildQuestionStat(qid='0',question='none',answers=[]){
        return {
            qid: qid,
            question: question,
            totalCount: 0,
            answersStats: answers.map((a)=>{
                return {
                    ...a,
                    count: 0
                }
            })
        }
    }

    getMostRecentQuestionStat(){
        let mostRecentQid = this.qidHistory[this.qidHistory]
        if(mostRecentQid){
            return this.getQuestionStat(mostRecentQid);
        }
        else {
            return this.buildQuestionStat();
        }
    }

    getMostRecentQid(){
        let mostRecentIndex = this.qidHistory.length-1;
        if(mostRecentIndex >=0) return this.qidHistory[mostRecentIndex];
        return null
    }

    getQuestionStat(qid){
        if(qid in this.questionMap){
            return this.questionMap[qid];
        }
        return null;
    }

    getAnswerStat(questionStat,aid){
        for(let answerStat of questionStat.answersStats){
            if(answerStat.id == aid){
                return answerStat;
            }
        }
        return null;
    }

    ingestAnswer(qid, aid){
        let questionStat = this.getQuestionStat(qid);
        if(questionStat == null) return;
        let answerStat = this.getAnswerStat(questionStat,aid);
        if(answerStat == null) return;

        questionStat.totalCount +=1;
        answerStat.count += 1;
    }

    addQuestion(question){
        let newQuestionStat = this.buildQuestionStat(question.qid,question.question,question.answers);
        this.questionMap[question.qid] = newQuestionStat;
        this.qidHistory.push(question.qid);
        this.maintainHistoryLength();
    }

    maintainHistoryLength(){
        if(this.qidHistory.length > this.historyLength){
            // prune the oldest stats that are being kept.
            let oldestQid = this.qidHistory.shift();
            delete this.questionMap[oldestQid];
        }
    }
}