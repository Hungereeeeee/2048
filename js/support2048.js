function Support() {
    this.documentWidth = window.screen.availWidth;
    this.gridContainerWidth = 0.92*this.documentWidth;
    this.cellSideLength = 0.18*this.documentWidth;
    this.cellSpace=0.04*this.documentWidth;
}
Support.prototype.getPosTop = function (i,j){
    return this.cellSpace+i*(this.cellSpace+this.cellSideLength);
}
Support.prototype.getPosLeft = function (i,j){
    return this.cellSpace+j*(this.cellSpace+this.cellSideLength);
}
Support.prototype.getNumberBackgroundColor = function (number){
    switch (number){
        case 2:return '#eee4da';break;
        case 4:return '#ede0c8';break;
        case 8:return '#f2b179';break;
        case 16:return '#f59563';break;
        case 32:return '#f67c5f';break;
        case 64:return '#f65e3b';break;
        case 128:return '#edcf72';break;
        case 256:return '#edcc61';break;
        case 512:return '#9c0';break;
        case 1024:return '#33b5e5';break;
        case 2048:return '#09c';break;
        case 4096:return '#a6c';break;
        case 8192:return '#93c';break;
    }
    return "black";
}
Support.prototype.getNumberColor = function (number){
    if(number<=4)
        return '#776e65'
    return 'white';
}
Support.prototype.nospace = function (board){
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            if(board[i][j]==0)
                return false;
        }

    return true;
}
Support.prototype.nospace = function (board){
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            if(board[i][j]==0)
                return false;
        }

    return true;
}
Support.prototype.canMoveLeft = function (board){
    for(var i=0;i<4;i++)
        for(var j=1;j<4;j++)
            if(board[i][j]!=0)
                if(board[i][j-1]==0||board[i][j-1]==board[i][j])
                    return true;

    return false;
}
Support.prototype.canMoveRight = function (board){
    for(var i=0;i<4;i++)
        for(var j=2;j>=0;j--)
            if(board[i][j]!=0)
                if(board[i][j+1]==0||board[i][j]==board[i][j+1])
                    return true;

    return false;
}
Support.prototype.noBlockHorizontal = function (row,col1,col2,board){
    for(var i= col1+1;i<col2;i++)
        if(board[row][i]!=0)
            return false;

    return true;
}
Support.prototype.canMoveUp = function (board){
    for(var j=0;j<4;j++)
        for(var i=1;i<4;i++){
            if(board[i][j]!=0)
                if(board[i-1][j]==0||board[i-1][j]==board[i][j])
                    return true;
        }

    return false;
}
Support.prototype.canMoveDown = function (board){
    for(var j=0;j<4;j++)
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0)
                if (board[i+1][j]==0||board[i+1][j]==board[i][j])
                    return true;
        }

    return false;
}
Support.prototype.noBlockVertical = function (col,row1,row2,board){
    for(var i= row1+1;i<row2;i++)
        if(board[i][col]!=0)
            return false;

    return true;
}
Support.prototype.nomove = function (board){
    if (this.canMoveDown(board)||this.canMoveLeft(board)||this.canMoveRight(board)||this.canMoveUp(board))
        return false;

    return true;
}
var support = new Support();
export {support}
