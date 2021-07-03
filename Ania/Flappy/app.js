//document.addEventListener('DOMContentLoaded' , () => {
    const bird = document.querySelector('#bird')
    const gameDisplay = document.querySelector('.game-container')
    const ground = document.querySelector('.ground')
    const noticeBoard = document.querySelector('.noticeBoard')
    const noticeText = document.querySelector('.noticeText')
    const scoreText = document.querySelector('.score-count')
    const soundBtn = document.querySelector('.sound-button')

    let birdLeft = 220
    let birdBottom = 100
    let gravity = 2
    let isGameOver = false
    let gap = 430
    let headAngle = 45
    let score = 0
    let birdDropTimerId 
    let timerId
    let obstTimer;
    let highScore = 0;
    var myMusic;
    var mySound;
    let soundOn = true;

    document.addEventListener('keyup', clickStart)
    
    function toggleSound() {
        if (soundOn) {
            soundBtn.innerHTML = "Sound is off!"; 
            myMusic.stop();
            mySound.stop();
            soundOn = false;
        } else {
            soundBtn.innerHTML = "Sound is on!";
            if (!isGameOver) myMusic.play();
            soundOn = true;
        }
    }

    function clickStart(){
        initialise();
        birdDropTimerId = setInterval(birdSink, 20)
        generateObstacle()
        obstTimer = setInterval(generateObstacle, 3000)
    }

    function initialise(){
        document.querySelectorAll('.obstacle').forEach((elem) => elem.parentNode.removeChild(elem));
        document.querySelectorAll('.topObstacle').forEach((elem) => elem.parentNode.removeChild(elem));
        score = 0;
        noticeBoard.style.visibility = "hidden";
        bird.style.visibility = "visible";
        birdLeft = 220
        birdBottom = 200
        isGameOver = false
        scoreText.innerHTML = score;
        scoreText.style.visibility = "visible";
        myMusic = new sound("sounds/Monkeys-Spinning-Monkeys.mp3");
        mySound = new sound("sounds/salamisound-4275940-lotus-flute-4-slowly.mp3");
        if (soundOn) myMusic.play();
        document.removeEventListener('keyup', clickStart)
        document.addEventListener('keyup', control)
    }

    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.volume = 0.3;
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }    
    }

    function control(e) {
        if (e.keyCode === 38) {
            birdJump()
        }
    }

    function birdSink(){
            birdBottom -= gravity
            bird.style.bottom = birdBottom + 'px'
            bird.style.left = birdLeft + 'px'
            if (isGameOver) { console.log("Bird sink still running")}
    }

    function birdJump(){
        if (birdBottom < 500) birdBottom += 50
        bird.style.bottom = birdBottom + 'px'
        headAngle = -headAngle
        bird.style.transform = "rotate(" + headAngle + "deg)"
    }

    function generateObstacle() {
        let obstacleLeft = 500
        let randomHeight = Math.random() * 150
        let obstacleBottom = randomHeight
        const obstacle = document.createElement('div')
        const topObstacle = document.createElement('div')
        if (!isGameOver) {
            obstacle.classList.add('obstacle')
            topObstacle.classList.add('topObstacle')
        }
        gameDisplay.appendChild(obstacle)
        gameDisplay.appendChild(topObstacle)
        obstacle.style.left = obstacleLeft + 'px'
        topObstacle.style.left = obstacleLeft + 'px'
        obstacle.style.bottom = obstacleBottom + 'px'
        topObstacle.style.bottom = obstacleBottom + gap + 'px'
        topObstacle.style.height = (730 - gap - obstacleBottom) + 'px';

        function moveObstacle() {
            if (isGameOver) {
                clearInterval(timerId)
            }
            obstacleLeft -= 2
            obstacle.style.left = obstacleLeft + 'px'
            topObstacle.style.left = obstacleLeft + 'px'

            if (obstacleLeft < -50) {
                clearInterval(timerId)
                gameDisplay.removeChild(obstacle)
                gameDisplay.removeChild(topObstacle)
            }
            if (obstacleLeft > 160 && obstacleLeft < 280 && birdLeft === 220 &&
                ( birdBottom < obstacleBottom + 153 || birdBottom > obstacleBottom + gap -200 ) ||
                birdBottom === 0) {
                gameOver()
                clearInterval(timerId)
            }
            if (obstacleLeft < 200 && obstacleLeft > 197) {
                score += 1
                updateScore()
            }

        }
        let timerId = setInterval(moveObstacle, 20)
    }

    function updateScore() {
        scoreText.innerHTML = score;
    }

    function gameOver() {
        isGameOver = true
        myMusic.stop();
        if (soundOn) mySound.play();
        birdDrop()
        clearInterval(birdDropTimerId)
        clearInterval(obstTimer)
        bird.style.transform = 'none'
        scoreText.style.visibility = "hidden";
        if (score > highScore) highScore = score;
        displayScore()
        document.removeEventListener('keyup', control)
        var test = setTimeout(addTimer,1000);
    }

    function addTimer() {
        document.addEventListener('keyup', clickStart);
    }

    function birdDrop() {
        var drop = setInterval(dropper, 20)
        function dropper(){
            if (birdBottom < 10) {
                bird.style.bottom = '0px'
                clearInterval(drop)
            } else {
                birdBottom -= 10
                bird.style.bottom = birdBottom + 'px'                
            }
        }
    }
   
    function displayScore() {
        noticeBoard.style.height = '165px'
        noticeBoard.style.visibility = "visible";
        noticeText.innerText = 'Score: ' + score + String.fromCharCode(13) + 'High Score: ' + highScore + String.fromCharCode(13) + "--------------" + String.fromCharCode(13) + "Press the UP arrow to start again!" + String.fromCharCode(13) + "--------------"
    }
//})