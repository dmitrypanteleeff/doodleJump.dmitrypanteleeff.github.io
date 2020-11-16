document.addEventListener('DOMContentLoaded',() => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    const gridTest = document.querySelector('.grid-test');
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
    let timerMovePlatforms;
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
            let platGap = gridHeight / platformCount;  // расстояние между платформами
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);  // переходим в класс Platform который создаёт платформы
            platforms.push(newPlatform);

            //console.log(platforms);
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200){
            
            platforms.forEach(platformItem =>{
                platformItem.bottom -= 4;  //для каждого элемента массива platforms изменяю свойство bottom на -4
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
        clearInterval(timerMovePlatforms);
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
        nameGameTitle = document.createElement('span');
        nameGameTitle.classList.add('name-game-title');
        nameGameTitle.innerHTML='Новая компьютерная игра';

        nameGameDiv = document.createElement('span');
        nameGameDiv.classList.add('name-game');
        nameGameDiv.innerHTML='"ДУДЬл Джамп"';

        againDiv = document.createElement('div');
        againDiv.classList.add('againDiv');
        grid.appendChild(againDiv);
        againBtn = document.createElement('button');
        againBtn.classList.add('newgame-btn');

        againDiv.appendChild(nameGameDiv);
        againDiv.appendChild(nameGameTitle);


        scoreDiv = document.createElement('span');
        scoreDiv.innerHTML = score;
        scoreDiv.classList.add('score-div');
        againDiv.appendChild(scoreDiv);

        againDiv.appendChild(againBtn);
        newDudSpan = document.createElement('span');
        newDudSpan.classList.add('new-dud-span');
        newDudSpan.innerHTML="Запустить нового Дудя";
        againBtn.appendChild(newDudSpan);
        


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
     //   leftTimerId;
     //   rightTimerId;
        leftMoveTimerId = false;
        rightMoveTimerId = false;
        score = 0;
        
        if (againDiv){
            grid.removeChild(againDiv);

         //   grid.removeChild(againDiv); 
           // grid.removeChild(again);
        }
       // clearInterval(movePlatforms);
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
                    ((doodlerLeftSpace) <= (platformItem.left + 80)) &&// 80 - ширина платформы
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
           
            if (doodlerBottomSpace > startPoint + 300 ) {
                fall();
            }
        },30);
    }
    
/*
   function jump(){
    clearInterval(downTimerId);
    isJumping = true;
    if (doodlerBottomSpace <= 300){
        upTimerId = setInterval(function(){
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            console.log("Платформы вниз");
            platforms.forEach(platformItem =>{
               platformItem.bottom -= 6;  //для каждого элемента массива platforms изменяю свойство bottom на -4
               let visual = platformItem.visual;  // визуализировали платформу
               visual.style.bottom = platformItem.bottom + 'px';
                    //console.log(platformItem.bottom);
               });
            if (doodlerBottomSpace > startPoint + 300 ) {
                fall();
            }
        },30);
    }
    else {
        upTimerId = setInterval(function(){
            doodlerBottomSpace += 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            console.log("Платформы вниз");
            platforms.forEach(platformItem =>{
               platformItem.bottom -= 6;  //для каждого элемента массива platforms изменяю свойство bottom на -4
               let visual = platformItem.visual;  // визуализировали платформу
               visual.style.bottom = platformItem.bottom + 'px';
                    //console.log(platformItem.bottom);
               });
            if (doodlerBottomSpace > startPoint + 300 ) {
                fall();
            }
        },30);
    }
}*/
   
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
        var startPoint = {};
        var nowPoint;
        var ldelay;
        document.addEventListener('touchstart', function (event) {
            event.preventDefault();
            event.stopPropagation();
            startPoint.x = event.changedTouches[0].pageX;
            startPoint.y = event.changedTouches[0].pageY;
            ldelay = new Date();
        }, false);
        /*Ловим движение пальцем*/
        document.addEventListener('touchmove', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var otk = {};
            nowPoint = event.changedTouches[0];
            otk.x = nowPoint.pageX - startPoint.x;
            /*Обработайте данные*/
            /*Для примера*/
            if (Math.abs(otk.x) > 200) {
                if (otk.x < 0) { gridTest.innerHTML = "свайп влево";/*СВАЙП ВЛЕВО(ПРЕД.СТРАНИЦА)*/ }
                if (otk.x > 0) { gridTest.innerHTML = "свайп вправо";/*СВАЙП ВПРАВО(СЛЕД.СТРАНИЦА)*/ }
                startPoint = { x: nowPoint.pageX, y: nowPoint.pageY };
            }
        }, false);
        /*Ловим отпускание пальца*/
        document.addEventListener('touchend', function (event) {
            var pdelay = new Date();
            nowPoint = event.changedTouches[0];
            var xAbs = Math.abs(startPoint.x - nowPoint.pageX);
            var yAbs = Math.abs(startPoint.y - nowPoint.pageY);
            if ((xAbs > 20 || yAbs > 20) && (pdelay.getTime() - ldelay.getTime()) < 200) {
                if (xAbs > yAbs) {
                    if (nowPoint.pageX < startPoint.x) {/*СВАЙП ВЛЕВО*/ }
                    else {/*СВАЙП ВПРАВО*/ }
                }
                else {
                    if (nowPoint.pageY < startPoint.y) {/*СВАЙП ВВЕРХ*/ }
                    else {/*СВАЙП ВНИЗ*/ }
                }
            }
        }, false);
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
          //  movePlatforms();
            timerMovePlatforms = setInterval(movePlatforms,30);
            jump();
            document.addEventListener('keydown',control);
            
        }
    }


    start();
    
   
    
});