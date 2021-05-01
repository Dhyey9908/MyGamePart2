class Game{
    constructor(){
        
    }

    getState(){
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function(data){
            gameState = data.val();
        });
    }

    updateState(state){
        database.ref('/').update({
            gameState: state
        });
    }

    async start(){
        if(gameState === 0){
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            
            if(playerCountRef.exists()){
                playerCount = playerCountRef.val();
                player.getCount();
            }

            form = new Form();
            form.display();
        }
        boy1 = createSprite(300, 200);
        boy2 = createSprite(510, 200);
        boy3 = createSprite(720, 200);
        boy4 = createSprite(930, 200);

        boy1.addImage("boy1", boy1_img);
        boy1.scale = 0.3;
        boy2.addImage("boy2", boy2_img);
        boy2.scale = 0.3;
        boy3.addImage("boy3", boy3_img);
        boy3.scale = 0.3;
        boy4.addImage("boy4", boy4_img);
        boy4.scale = 0.7;

        boys = [boy1, boy2, boy3, boy4];

        passedFinish = false;
    }

    play(){
        form.hide();

        Player.getPlayerInfo();
        player.getFinishedPlayers();

        if(allPlayers !== "undefined"){
            //var displayPos = 150;
            image(track_img, -900*12.8,0 , 900*15,displayHeight );
            
            var index = 0;
            var x;
            var y = 100;
            for(var plr in allPlayers){
                index += 1;
               // x = 200 + (index * 200) + allPlayers[plr].xPos;
                //y = displayHeight - allPlayers[plr].distance - 70;
                x  = displayWidth - allPlayers[plr].distance - 70;
                y = (index * 150) + allPlayers[plr].xPos;

                if(index === player.index){
                    fill("black");

                    //camera.position.x = displayWidth/2;
                    //camera.position.y = boys[index - 1].y;
                    camera.position.x = boys[index -1].x;
                    camera.position.y = displayHeight/2
                }else{
                    fill("white");
                }

                boys[index - 1].x = x;
                boys[index - 1].y = y;

                textAlign(CENTER);
                textSize(20);
                text(allPlayers[plr].name, boys[index - 1].x, boys[index - 1].y + 75);
            }
        }

        if(player.distance < 10350){
            if(keyIsDown(26) && player.index !== null){
                yVel += 0.9;
                if(keyIsDown(24)){
                    xVel -= 0.2;
                }
                if(keyIsDown(25)){
                    xVel += 0.2;
                }
            }else if(keyIsDown(27) && yVel > 0 && player.index !== null){
                yVel -= 0.1;
                xVel *= 0.9;
            }else{
                yVel *= 0.985;
                xVel *= 0.985;
            }
        }else if(passedFinish === false){
            yVel *= 0.7;
            xVel *= 0.7;
            Player.updateFinishedPlayers();
            player.place = finishedPlayers;

            player.updateName();
            passedFinish = true;
        }else{
            yVel *= 0.8;
            xVel *= 0.8;
        }

        //move the car
        player.distance += yVel;
        yVel *= 0.98;
        player.xPos += xVel;
        xVel *= 0.985;
        player.updateName();
        //display sprites
        drawSprites();
    }

    displayRanks(){
        //display the medals
        camera.position.y = 0;
        camera.position.x = 0;

        imageMode(CENTER);

        Player.getPlayerInfo();

        image(bronze_img, displayWidth/-4, -100 + displayHeight/9, 200, 240);
        image(silver_img, displayWidth/4, -100 + displayHeight/10, 225, 270);
        image(gold_img, 0, -100, 250, 300);

        textAlign(CENTER);
        textSize(50);
        for(var plr in allPlayers){
            if(allPlayers[plr].place === 1){
                text("1st: " + allPlayers[plr].name, 0, 85);
            }else if(allPlayers[plr].place === 2){
                text("2nd: " + allPlayers[plr].name, displayWidth/4, displayHeight/9 + 73);
            }else if(allPlayers[plr].place === 3){
                text("3rd: " + allPlayers[plr].name, displayWidth/-4, displayHeight/10 + 76);
            }else{
                textSize(30);
                text("Honorable Mention: " + allPlayers[plr].name, 0, 225);
            }
        }
    }
}
