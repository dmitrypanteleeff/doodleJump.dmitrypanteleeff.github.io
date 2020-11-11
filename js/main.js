document.addEventListener('DOMContentLoaded',() => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let doodlerBottomSpace = 250;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let gridHeight = grid.offsetHeight;
    let upTimerId; // время для движения вверх
    let downTimerId; // время для движения вниз
    let isJumping = true;
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
                    ((doodlerLeftSpace) <= (platformItem.left + 85)) // 85 - ширина платформы
                    )
            })
            
        },30);
    }

    function jump(){
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function(){
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > 450) {
                fall();
            }
        },30);
    }

    
    function control(e){
        if (e.key === "ArrowLeft"){
            //move left
        }
        else if (e.key === "ArrowRight"){
            //move right
        }
        else if (e.key === "ArrowUP" || e.key === "Space"){
            //move up
            console.log("Space");
        }
    }

    function start(){
        if (!isGameOver){   // if (gameOver == false)
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms,30);
            jump();
            control(e);
            
        }
    }


    start();
   
    
});