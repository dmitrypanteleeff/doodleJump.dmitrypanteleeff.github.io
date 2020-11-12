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

            })
        }
    }

    function gameOver(){
        console.log("game over");
        isGameOver = true;
        clearInterval(downTimerId);
        clearInterval(upTimerId);
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
                    ((doodlerLeftSpace + 65) >= platformItem.left) &&  // 65 ширина дудлера 
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
        console.log(e);
        if (e.code === "ArrowLeft"){
            moveLeft();
        }
        else if (e.code === "ArrowRight"){
            moveRight();
            //move right
        }
        else if (e.code === "ArrowUP" || e.code === "Space"){
            //move up
            console.log("Space");
        }
    }

    function moveLeft(){
        
        if (isGoingRight){            
            clearInterval(rightTimerId);
            isGoingRight = false;
        }    
        isGoingLeft = true;  
       // if (!isGoingRight) {
        if (!leftMoveTimerId){
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
                if (doodlerLeftSpace <= (400 - 65)){
                    doodlerLeftSpace += 5;
                    doodler.style.left = doodlerLeftSpace + 'px';
                //    clearInterval(leftTimerId);
                } else {
                   
                    moveLeft();
                }
            },30);
         }
            
      //  }
        //clearInterval(leftTimerId);
    }

    function start(){
        if (!isGameOver){   // if (gameOver == false)
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms,30);
            jump();
            document.addEventListener('keyup',control);
            
        }
    }


    start();
   
    
});