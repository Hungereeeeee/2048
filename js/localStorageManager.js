function Local(){

}
Local.prototype.setHighestScore = function(highscore){
    var highscoreData = JSON.stringify(highscore)
    window.localStorage.setItem('highscoreData',highscoreData);
}
Local.prototype.getHighestScore = function(){
    return window.localStorage.getItem('highscoreData')
}
Local.prototype.setStage = function(board){
    var boarddata = JSON.stringify(board)
    window.localStorage.setItem('boardData',boarddata)
}
Local.prototype.getStage = function(){
    return window.localStorage.getItem('boardData')
}
Local.prototype.setScore = function(score){
    var scoreData = JSON.stringify(score)
    window.localStorage.setItem('scoreData',scoreData);
}
Local.prototype.getScore = function(){
    return window.localStorage.getItem('scoreData')
}
Local.prototype.clearStage = function(){
    window.localStorage.removeItem('boardData')
    //window.localStorage.removeItem('conflictedData')
}
var local = new Local()
export {local}
// function setConflicted(conflicted){
//     var conflicteddata =JSON.stringify(conflicted)
//     window.localStorage.setItem('conflictedData',conflicteddata)
// }
// function getConflicted() {
//     return window.localStorage.getItem('conflictedData')
// }