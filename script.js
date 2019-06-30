window.onload = function(){   
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;

    init();
    
    // fonction initiale qui crée le canvas et les instances snakee et applee
    
    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
        
    }
    
    // rafraichit le canvas tout les "delay" de temps
    
    function refreshCanvas(){
        
        snakee.advance();
        if(snakee.checkCollision()){
                gameOver();
        } else {
            if(snakee.isEatingApple(applee)){
                    score++;
                    snakee.ateApple = true;
                    do{
                        applee.setNewPosition();
                    } while(applee.isOnSnake(snakee))     
                }
            ctx.clearRect(0,0, canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            
            timeout = setTimeout(refreshCanvas, delay);  
        }
        
    }
    
    // fonction qui permet d'ecrire du texte quand la partie est perdue
    
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY-180);
        ctx.fillText("Game Over", centreX, centreY-180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche espace pour rejouer", centreX, centreY-120);
        ctx.fillText("Appuyer sur la touche espace pour rejouer", centreX, centreY-120);
        ctx.restore();
    }
    
    // fonction qui permet de relancer le jeu apres un game over
    
    function restart(){
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();  
    }
    
    // fonction qui permet d'afficher le score
        
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();   
    }
    
    // dessine les cubes appartenant au corps du serpent
    
    function drawBlock(ctx, position){
        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }
    
    // constructeur du serpent
    
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        
        // methode qui permet de dessiner le serpent
        
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i=0; i<this.body.length;i++){
                    drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        
        // methode qui permet de faire avancer le serpent
        
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -=1;
                    break;
                case "right":
                    nextPosition[0] +=1;
                    break;
                case "down":
                    nextPosition[1] +=1;
                    break;
                case "up":
                    nextPosition[1] -=1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple){
                this.body.pop();

            } else {
                this.ateApple = false;;
            }
        };
        
        // methode qui permet de changer la direction du serpent tout en empechant les directions "impossibles"
        
        this.setDirection = function (newDirection){
            var allowedDirections;
            switch(this.direction){
                    case "left":
                    case "right":
                        allowedDirections = ["up", "down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ["left", "right"];
                        break;
                    default:
                        throw("Invalid Direction");
                }
            if(allowedDirections.indexOf(newDirection) > (-1)){
                    this.direction = newDirection;
                }
        };
        
        
        // methode qui verifie si le serpent ne s'est pas pris un mur ou le reste de son corps
        
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                    wallCollision = true;
                }
            for(var i = 0; i<rest.length; i++){
                    if(snakeX===rest[i][0] && snakeY===rest[i][1]){
                            snakeCollision = true;
                        }
                }
            
            return wallCollision || snakeCollision;    
        }
        
        // methode qui permet au serpent de manger les pommes
        
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0]===appleToEat.position[0] && head[1]===appleToEat.position[1]){
                return true;
            } else {
                return false;
            }
        }
    }
    
    // constructeur de la pomme
    
    function Apple (position){
        this.position=position;
        
        // methode qui permet de dessiner la pomme
        
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        
        // methode qui permet de replacer la pomme une fois qu'elle a ete mangee
        
        this.setNewPosition = function(){
            var newX = Math.round( Math.random()*(widthInBlocks - 1));
            var newY = Math.round( Math.random()*(heightInBlocks - 1));
            this.position = [newX, newY];
        };
        
        // methode qui verifie si la pomme est sur le corps du serpent
        
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            
            for(var i = 0; i < snakeToCheck.body.length; i++ ){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                        isOnSnake = true;
                    }
                return isOnSnake;
            }
            
            
        }
        
    }
    
    
    
    
    // fonction qui permet d'associer les nouvelles directions aux fleches du clavier

    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                    return;
        }
        snakee.setDirection(newDirection);
    }
}