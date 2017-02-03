/**
 * Created by Administrator on 2017/2/3.
 */
function showNumberWithAnimation(i,j,randNumber){
    var theNumberCell = $('#number-cell-'+i+'-'+j);
    console.log(randNumber)
    theNumberCell.css('background-color',getNumberBackgroundColor(randNumber));
    theNumberCell.css('color',getNumberColor(randNumber));
    theNumberCell.text(randNumber);

    theNumberCell.animate({
        width:"100px",
        height:"100px",
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);
}
function showMoveAnimation(fromx,fromy,tox,toy){
    var theNumberCell = $('#number-cell-'+fromx+'-'+fromy);

    theNumberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}
function updateScore(score){
    $('#score').text(score);
}