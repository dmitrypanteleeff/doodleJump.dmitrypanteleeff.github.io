document.addEventListener('DOMContentLoaded',() => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let gridHeight = grid.offsetHeight;
    let upTimerId; // время для движения вверх
    let downTimerId; // время для движения вниз
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let leftMoveTimerId = false;
    let rightMoveTimerId = false;
    let score = 0;
    let again;
    console.dir(gridHeight);

    //let platform  = document.createElement('.platform');

    function createDoodler(){
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;  // садим Дудла на первую платформу относительно левой части
        doodlerBottomSpace = platforms[0].bottom; // садим Дудла на первую платформу относительно низа
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    class Platform{
        constructor(newPlatBottom){
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315; // 315 - так как из общей ширины вычли ширину платформы
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';

            grid.appendChild(visual);
        }
    }

    function createPlatforms(){
        for (let i = 0; i < platformCount; i++){
            let platGap = gridHeight / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);  // переходим в класс Platform который создаёт платформы
            platforms.push(newPlatform);

            //console.log(platforms);
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200){
            
            platforms.forEach(platformItem =>{
                platformItem.bottom = platformItem.bottom - 4;  //для каждого элемента массива platforms изменяю свойство bottom на -4
                let visual = platformItem.visual;  // визуализировали платформу
                visual.style.bottom = platformItem.bottom + 'px';
                //console.log(platformItem.bottom);

                if (platformItem.bottom < -15){ // 15 - высота платформы
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift(); //удаляем первый элемент
                    //console.log(platforms);
                    score++;
                    console.log(score);
                    let newPlatform = new Platform(600); // 600 высота игровой области
                    platforms.push(newPlatform);
                }
            })
        }
    }

    function gameOver(){
        console.log("game over");
        isGameOver = true;
        clearInterval(downTimerId);
        clearInterval(upTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        isGoingRight = false;
        isGoingLeft = false;
        leftMoveTimerId = false;
        rightMoveTimerId = false;
        while (grid.firstChild){
            grid.removeChild(grid.firstChild);
        }
       // grid.innerHTML = score;

        againDiv = document.createElement('div');
        againDiv.classList.add('againDiv');
        grid.appendChild(againDiv);
        againBtn = document.createElement('button');
        againBtn.classList.add('newgame-btn');

        scoreDiv = document.createElement('span');
        scoreDiv.innerHTML = score;
        scoreDiv.classList.add('score-div');
        againDiv.appendChild(scoreDiv);

        againDiv.appendChild(againBtn);
        againBtn.innerHTML="Начать новую игру";

        


        console.log(again);
        let newGame = document.querySelector('.newgame-btn');
        console.log(newGame);
        newGame.addEventListener('click',startNewGame);


    }

    function startNewGame(){
        isGameOver = false;
        doodlerLeftSpace = 50;
        startPoint = 150;
        doodlerBottomSpace = startPoint;
        isGameOver = false;
        platformCount = 5;
        platforms = [];
       // gridHeight = grid.offsetHeight;
        isJumping = true;
        isGoingLeft = false;
        isGoingRight = false;
        leftTimerId;
        rightTimerId;
        leftMoveTimerId = false;
        rightMoveTimerId = false;
        score = 0;
        if (againDiv){
            grid.removeChild(againDiv);

         //   grid.removeChild(againDiv); 
           // grid.removeChild(again);
        }
        start();
    }

    function fall(){
        clearInterval(upTimerId); //clearInterval отменяет многократное повторение действий
        isJumping = false;
        downTimerId = setInterval(function(){
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace < 0){
                gameOver();                
            }
            platforms.forEach(platformItem => {
                if (
                    (doodlerBottomSpace >= platformItem.bottom) &&
                    (doodlerBottomSpace <= (platformItem.bottom + 15) ) &&  // 15 - высота плафтормы
                    ((doodlerLeftSpace + 51) >= platformItem.left) &&  // 51 ширина дудлера 
                    ((doodlerLeftSpace) <= (platformItem.left + 85)) &&// 85 - ширина платформы
                    !isJumping) {
                        console.log("приземлился");
                        startPoint = doodlerBottomSpace;
                        jump();
                    }
            })
            
        },30);
    }

    function jump(){
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function(){
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > startPoint + 200 ) {
                fall();
            }
        },30);
    }

    
    function control(e){
        //console.log(e);
        if (!isGameOver){
            if (e.code === "ArrowLeft"){
                moveLeft();
            }
            else if (e.code === "ArrowRight"){
                moveRight();
                //move right
            }
            else if (e.code === "ArrowUp" || e.code === "Space"){
                moveStraight();
                console.log("Space");
            }
        }
    }

    function moveLeft(){
        
        if (isGoingRight){            
            clearInterval(rightTimerId);
            isGoingRight = false;
        }    
        isGoingLeft = true;  
       // if (!isGoingRight) {
        if (!leftMoveTimerId){ // проверка на ускорение
            leftMoveTimerId = true;
            rightMoveTimerId = false;
            leftTimerId = setInterval(function () {
                
                //  clearInterval(rightTimerId);
                if (doodlerLeftSpace >= 0) {
                    doodlerLeftSpace -= 5;
                    doodler.style.left = doodlerLeftSpace + 'px';
                   // clearInterval(rightTimerId);
                } else {
                    moveRight();
                }
            }, 30);
        }
            
      //  }  
                                
    }

    function moveRight(){
        
        if (isGoingLeft){            
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }    
        isGoingRight = true;   
     //   if (!isGoingLeft){
         if (!rightMoveTimerId){  // проверка на ускорение
            rightMoveTimerId = true;
            leftMoveTimerId = false;

            rightTimerId = setInterval(function(){
                if (doodlerLeftSpace <= (400 - 51)){
                    doodlerLeftSpace += 5;
                    doodler.style.left = doodlerLeftSpace + 'px';
                //    clearInterval(leftTimerId);
                } else {
                   
                    moveLeft();
                }
            },30);
         }
    }


    function moveStraight(){
        isGoingRight = false;
        isGoingLeft = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
        leftMoveTimerId = false;
        rightMoveTimerId = false;
    }

    function start(){
        if (!isGameOver){   // if (gameOver == false)
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms,30);
            jump();
            document.addEventListener('keydown',control);
            
        }
    }


    start();
    
   
    
});