import {support} from './support2048.js'
import $ from 'jquery'
function Show(){

}
Show.prototype.showNumberWithAnimation = function(i,j,randNumber){
    var theNumberCell = $('#number-cell-'+i+'-'+j);
    theNumberCell.css('background-color',support.getNumberBackgroundColor(randNumber));
    theNumberCell.css('color',support.getNumberColor(randNumber));
    theNumberCell.text(randNumber);

    theNumberCell.animate({
        width:support.cellSideLength,
        height:support.cellSideLength,
        top:support.getPosTop(i,j),
        left:support.getPosLeft(i,j)
    },50);
}
Show.prototype.showMoveAnimation = function(fromx,fromy,tox,toy){
    var theNumberCell = $('#number-cell-'+fromx+'-'+fromy);

    theNumberCell.animate({
        top:support.getPosTop(tox,toy),
        left:support.getPosLeft(tox,toy)
    },200);
}
Show.prototype.updateScore = function(score){
    $('#score').text(score);
}
Show.prototype.updatehighScore = function(highscore){
    $('#highscore').text(highscore);
}
var show = new Show();
export {show}