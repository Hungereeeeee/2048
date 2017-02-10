import '../css/2048.css'
import {support} from './support2048.js'
import {show} from './showannimation2048.js'
import {local} from './localStorageManager.js'
import $ from 'jquery'

!function(){
    function Game(){
        this.board=new Array();
        this.hasConflicted=new Array();
        this.highScore = 0;
        this.flag = true;
        var _this=this;
        $(document).ready(function(){
            _this.prepareForMobile();
            _this.newgame();
            _this.bind();
        })
    }
    Game.prototype.prepareForMobile = function(){
        if(support.documentWidth>500){
            support.gridContainerWidth=500;
            support.cellSpace=20;
            support.cellSideLength=100;
        }
        $('#grid-container').css('width',support.gridContainerWidth-2*support.cellSpace);
        $('#grid-container').css('height',support.gridContainerWidth-2*support.cellSpace);
        $('#grid-container').css('padding',support.cellSpace);
        $('#grid-container').css('border-radius',0.02*support.gridContainerWidth);

        $('#cover').css('width',support.gridContainerWidth-2*support.cellSpace);
        $('#cover').css('height',support.gridContainerWidth-2*support.cellSpace);
        $('#cover').css('padding',support.cellSpace);
        $('#cover').css('border-radius',0.02*support.gridContainerWidth);
        $('#cover').css('line-height',(support.gridContainerWidth-2*support.cellSpace)+'px');

        $('.grid-ceil').css('width',support.cellSideLength);
        $('.grid-ceil').css('height',support.cellSideLength);
        $('.grid-ceil').css('border-radius',0.02*support.cellSideLength);
    }
    Game.prototype.newgame = function(){
        this.init();

        var highestscoreData = local.getHighestScore();
        this.highScore = JSON.parse(highestscoreData);
        show.updatehighScore(this.highScore)

        var localBoard = local.getStage();
        // var localconflicted = getConflicted();
        if(localBoard){
            this.board = JSON.parse(localBoard);
            var localScore = local.getScore();
            console.log(localScore)
            this.score = parseInt(localScore)
            this.updateBoardView()
            show.updateScore(this.score)

        }else{
            //在两个格子里生成数字
            this.generateOneNumber();
            this.generateOneNumber();
        }

    }
    Game.prototype.init = function(){

        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++){
                var gridCell = $("#grid-cell-"+i+"-"+j);
                gridCell.css('top',support.getPosTop(i,j) );
                gridCell.css('left',support.getPosLeft(i,j));
            }

        for(var i=0;i<4;i++){
            this.board[i]=new Array();
            this.hasConflicted[i] = new Array();
            for(var j=0;j<4;j++){
                this.board[i][j]=0;
                this.hasConflicted[i][j]=false;
            }

        }

        this.updateBoardView();

        this.score = 0;
    }
    Game.prototype.updateBoardView = function(){
        $(".number-cell").remove();
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
                var theNumberCell = $('#number-cell-'+i+'-'+j);

                if(this.board[i][j]==0){
                    theNumberCell.css('width','0px');
                    theNumberCell.css('height','0px');
                    theNumberCell.css('top',support.getPosTop(i,j)+support.cellSideLength/2);
                    theNumberCell.css('left',support.getPosLeft(i,j)+support.cellSideLength/2);
                }else{
                    theNumberCell.css('width',support.cellSideLength);
                    theNumberCell.css('height',support.cellSideLength);
                    theNumberCell.css('top',support.getPosTop(i,j));
                    theNumberCell.css('left',support.getPosLeft(i,j));
                    theNumberCell.css('background-color',support.getNumberBackgroundColor(this.board[i][j]));
                    theNumberCell.css('color',support.getNumberColor(this.board[i][j]));
                    theNumberCell.text(this.board[i][j])
                }
                this.hasConflicted[i][j] = false;
            }
        }
        $('.number-cell').css('line-height',support.cellSideLength+'px');
        $('.number-cell').css('font-size',0.3*support.cellSideLength+'px');
    }
    Game.prototype.generateOneNumber = function(){

        if(support.nospace(this.board))
            return false;
        //随机一个位置
        var randx = parseInt(Math.floor(Math.random()*4));
        var randy = parseInt(Math.floor(Math.random()*4));

        var times=0
        while(times<50){
            if(this.board[randx][randy]==0)
                break;
            randx = parseInt(Math.floor(Math.random()*4));
            randy = parseInt(Math.floor(Math.random()*4));

            times++;
        }
        if(times==50){
            for(var i=0;i<4;i++)
                for(var j=0;j<4;j++){
                    if(this.board[i][j]==0){
                        randx=i;
                        randy=j;
                    }
                }
        }
        //随机一个数字
        var randNumber=Math.random()<0.5?2:4;

        //在随机位置显示随机数字
        this.board[randx][randy] = randNumber;
        show.showNumberWithAnimation(randx,randy,randNumber);

        return true;
    }
    Game.prototype.isgameover = function(){
        if(support.nospace(this.board)&&support.nomove(this.board)){
            local.clearStage()
            this.gameover()
        }
    }
    Game.prototype.gameover = function(){
        $('#cover').show();
    }
    Game.prototype.moveLeft = function(){
        if(!support.canMoveLeft(this.board))
            return false;

        for(var i=0;i<4;i++)
            for(var j=1;j<4;j++) {
                if (this.board[i][j] != 0) {
                    for (var k = 0; k < j; k++) {
                        if (this.board[i][k] == 0 && support.noBlockHorizontal(i, k, j, this.board)) {
                            show.showMoveAnimation(i, j, i, k);
                            this.board[i][k] = this.board[i][j];
                            this.board[i][j] = 0;
                            continue;
                        } else if (this.board[i][k] == this.board[i][j] && support.noBlockHorizontal(i, k, j, this.board) && !this.hasConflicted[i][k]) {
                            show.showMoveAnimation(i, j, i, k);
                            //add
                            this.board[i][k] += this.board[i][j];
                            this.board[i][j] = 0;
                            //addscore
                            this.score += this.board[i][k];
                            this.hasConflicted[i][k] = true;
                            show.updateScore(this.score);
                            console.log(this.highScore)
                            if(this.score>this.highScore){
                                this.highScore = this.score;
                                show.updatehighScore(this.highScore);
                            }
                            continue;
                        }
                    }
                }
            }
        var _this=this;
        setTimeout(function(){
            _this.updateBoardView();
        },200);
        return true;
    }
    Game.prototype.moveRight = function(){
        if(!support.canMoveRight(this.board))
            return false;
        for(var i=0;i<4;i++)
            for(var j=2;j>=0;j--){
                if(this.board[i][j]!=0){
                    for(var k=3;k>j;k--){
                        if( this.board[i][k]==0&&support.noBlockHorizontal(i,j,k,this.board) ){
                            show.showMoveAnimation(i,j,i,k);
                            this.board[i][k]=this.board[i][j];
                            this.board[i][j]=0;
                            continue;
                        }else if( this.board[i][k]==this.board[i][j]&&support.noBlockHorizontal(i,j,k,this.board)&& !this.hasConflicted[i][k]){
                            show.showMoveAnimation(i,j,i,k);
                            //add
                            this.board[i][k] += this.board[i][j];
                            this.board[i][j]=0;
                            this.score += this.board[i][k];
                            this.hasConflicted[i][k] = true;
                            show.updateScore(this.score)
                            if(this.score>this.highScore){
                                this.highScore = this.score;
                                show.updatehighScore(this.highScore);
                            }
                            continue;
                        }
                    }
                }

            }
        var _this=this;
        setTimeout(function(){
            _this.updateBoardView();
        },200);
        return true;
    }
    Game.prototype.moveUp = function(){
        if(!support.canMoveUp(this.board))
            return false;

        for(var j=0;j<4;j++)
            for(var i=1;i<4;i++){
                if(this.board[i][j]!=0){
                    for(var k=0;k<i;k++){
                        if(this.board[k][j]==0&&support.noBlockVertical(j,k,i,this.board)){
                            show.showMoveAnimation(i,j,k,j);
                            this.board[k][j]=this.board[i][j];
                            this.board[i][j]=0;
                            continue;

                        }else if(this.board[k][j]==this.board[i][j]&&support.noBlockVertical(j,k,i,this.board)&& !this.hasConflicted[k][j]){
                            show.showMoveAnimation(i,j,k,j);
                            //add
                            this.board[k][j] *= 2;
                            this.board[i][j]=0;

                            this.score += this.board[k][j];
                            this.hasConflicted[k][j] = true;
                            show.updateScore(this.score);
                            console.log(this.highScore)
                            if(this.score>this.highScore){
                                this.highScore = this.score;
                                show.updatehighScore(this.highScore);
                            }
                            continue;
                        }
                    }
                }
            }
        var _this=this;
        setTimeout(function(){
            _this.updateBoardView();
        },200);
        return true;
    }
    Game.prototype.moveDown = function(){
        if(!support.canMoveDown(this.board))
            return false

        for(var j=0;j<4;j++)
            for(var i=2;i>=0;i--){
                if(this.board[i][j]!=0){
                    for(var k=3;k>i;k--){
                        if(this.board[k][j]==0&&support.noBlockVertical(j,i,k,this.board)){
                            show.showMoveAnimation(i,j,k,j);
                            this.board[k][j]=this.board[i][j];
                            this.board[i][j]=0;
                            continue;

                        }else if(this.board[k][j]==this.board[i][j]&&support.noBlockVertical(j,i,k,this.board)&& !this.hasConflicted[k][j]){
                            show.showMoveAnimation(i,j,k,j);
                            //add
                            this.board[k][j] *= 2;
                            this.board[i][j]=0;

                            this.score += this.board[k][j];
                            this.hasConflicted[k][j] = true;
                            show.updateScore(this.score);
                            console.log(this.highScore)
                            if(this.score>this.highScore){
                                this.highScore = this.score;
                                show.updatehighScore(this.highScore);
                            }
                            continue;
                        }
                    }
                }
            }
        var _this=this;
        setTimeout(function(){
            _this.updateBoardView();
        },200);
        return true;
    }
    Game.prototype.bind = function(){
        var _this=this;
        $('#newgamebutton').on('click',function(e){
            e.preventDefault()
            _this.score=0;
            show.updateScore(_this.score)
            _this.init();
            _this.generateOneNumber();
            _this.generateOneNumber();
            $('#cover').hide();
        })
        document.addEventListener('touchstart',function () {
            _this.startx=event.touches[0].pageX;
            _this.starty=event.touches[0].pageY;
        })
        document.addEventListener('touchmove',function () {
            //如果不正确使用preventDefault可能会导致touch不正确触发
            event.preventDefault();
        })
        document.addEventListener('touchend',function () {
            _this.endx = event.changedTouches[0].pageX;
            _this.endy = event.changedTouches[0].pageY;

            var deltax = _this.endx-_this.startx;
            var deltay= _this.endy-_this.starty;

            if(Math.abs(deltax)<0.2*support.documentWidth&&Math.abs(deltay)<0.2*support.documentWidth)
                return;
            //x
            if(Math.abs(deltax)>=Math.abs(deltay)){
                if(deltax>0){
                    //moveright
                    if(_this.moveRight()){
                        setTimeout(function(){
                            _this.generateOneNumber();
                        },210);
                        setTimeout(function(){
                            _this.isgameover();
                        },300);
                    }
                }else{
                    //moveLeft
                    if(_this.moveLeft()){
                        setTimeout(function(){
                            _this.generateOneNumber();
                        },210);
                        setTimeout(function(){
                            _this.isgameover();
                        },300);
                    }
                }

            }//y
            else{
                if(deltay>0){
                    //movedown
                    if(_this.moveDown()){
                        setTimeout(function(){
                            _this.generateOneNumber();
                        },210);
                        setTimeout(function(){
                            _this.isgameover();
                        },300);
                    }
                }else{
                    //moveup
                    if(_this.moveUp()){
                        setTimeout(function(){
                            _this.generateOneNumber();
                        },210);
                        setTimeout(function(){
                            _this.isgameover();
                        },300);
                    }
                }
            }
        })

        window.onunload = function(){
            if(support.nospace(_this.board)&&support.nomove(_this.board)){
                local.clearStage();
            }else{
                local.setStage(_this.board)
                // setConflicted(_this.hasConflicted)
                local.setScore(_this.score)
            }
            local.setHighestScore(_this.highScore)
        }

        $(document).keydown(function(event){
            switch(event.keyCode){
                case 37:
                    //阻止默认效果
                    event.preventDefault();
                    if(_this.flag){
                        if(_this.moveLeft()){
                            _this.flag = false;
                            setTimeout(function(){
                                _this.generateOneNumber();
                            },210);
                            setTimeout(function(){
                                _this.isgameover();
                                _this.flag = true;
                            },300);
                        }
                    }
                    break;
                case 38:
                    event.preventDefault();
                    if(_this.flag){
                        if(_this.moveUp()){
                            _this.flag = false
                            setTimeout(function(){
                                _this.generateOneNumber();
                            },210);
                            setTimeout(function(){
                                _this.isgameover();
                                _this.flag = true;
                            },300);
                        }
                    }

                    break;
                case 39:
                    event.preventDefault();
                    if(_this.flag){
                        if(_this.moveRight()){
                            _this.flag = false;
                            setTimeout(function(){
                                _this.generateOneNumber();
                            },210);
                            setTimeout(function(){
                                _this.isgameover();
                                _this.flag = true;
                            },300);
                        }
                    }

                    break;
                case 40:
                    event.preventDefault();
                    if(_this.flag){
                        if(_this.moveDown()){
                            _this.flag = false;
                            setTimeout(function(){
                                _this.generateOneNumber();
                            },210);
                            setTimeout(function(){
                                _this.isgameover();
                                _this.flag = true;
                            },300);
                        }
                    }
                    break;
                default:
                    break;
            }
        })
    }
    new Game();
}()