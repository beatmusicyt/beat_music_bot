const { Telegraf } = require("telegraf");
const express = require("express");
const mongoose = require("mongoose");

app = express();



mongoose.connect(process.env.DB_URL).then(() => {
	console.log("Connected to Database");
}).catch(err => console.log("Error while connecting - "+err));

mongoose.connection.on("error", err => console.log("Runtime Connection Error - "+err));

const songSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    }
});

const TSong = new mongoose.model("TSong", songSchema);
/*
app.get("/admin",(req,res)=>{
    var authheader = req.headers.authorization;
    console.log(req.headers);
 
    if (!authheader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        res.end(err)
    }
 
    var auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
 
    if (user == 'kumar_prakhar_01' && pass == 'LOFI1211') {
        res.sendFile("adminPanel.html");
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        res.end(err);
    }
});
*/
app.get("/api/addSong", async(req,res)=>{
    if(!req.query.token=="iamunknown#321"){
        res.json({
            msg:"invalid token"
        });
    }else{
        var name = req.query.name;
        var link = req.query.link;
        var newSong = new TSong({
            name,link
        });
        try {
            await newSong.save();
            res.json({
                msg:"success"
            });
        } catch (error) {
            res.json({
                msg:"err",
                error
            });
        }
    }
});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(function(ctx){
	ctx.reply("Hello, "+ctx.from.first_name+	".\nI am Beat Music Bot ! \n𝕃𝔼𝕋 𝕋ℍ𝔼 ℍ𝔼𝔸ℝ𝕋 𝔹𝔼𝔸𝕋 𝕎𝕀𝕋ℍ 𝕋ℍ𝔼 \n𝔹𝔼𝔸𝕋 𝕆𝔽 𝕄𝕌𝕊𝕀ℂ 🎶");
});

bot.on("left_chat_member", function(ctx){
	ctx.reply("Tell us the reason for leaving. So that we can improve. 🙂");
});

bot.on("new_chat_members", function(ctx){
	ctx.reply("Hello, "+ctx.message.new_chat_member.first_name+
	".\nWelcome to Beat Music ! \n𝕃𝔼𝕋 𝕋ℍ𝔼 ℍ𝔼𝔸ℝ𝕋 𝔹𝔼𝔸𝕋 𝕎𝕀𝕋ℍ 𝕋ℍ𝔼 \n𝔹𝔼𝔸𝕋 𝕆𝔽 𝕄𝕌𝕊𝕀ℂ 🎶");
});

bot.help(function(ctx){
	ctx.reply("Help -\n\nThis bot is still under development !\nUse /search <tags> to search for a song.\n\nOfficial Group - @lofi1211\nOwner - @kumar_prakhar_01\n\n𝕃𝔼𝕋 𝕋ℍ𝔼 ℍ𝔼𝔸ℝ𝕋 𝔹𝔼𝔸𝕋 𝕎𝕀𝕋ℍ 𝕋ℍ𝔼 \n𝔹𝔼𝔸𝕋 𝕆𝔽 𝕄𝕌𝕊𝕀ℂ 🎶");
});

bot.command("search", async(ctx)=>{
	if(ctx.message.text.startsWith("/search@beatmusic_yt_bot")){
	    var srch = ctx.message.text.substring(25);
	}else{
	    var srch = ctx.message.text.substring(8);
	}
	if(srch.trim()!=""){
        var res_cnt = 0;
        var res = "";
        var all_data = await TSong.find();
        all_data.forEach(function(song){
            if(song.name.toLowerCase().includes(srch.trim().toLowerCase())){
                res_cnt++;
                res = res +res_cnt+ ". "+song.name+"\n"+"Link: "+song.link+"\n\n";
            }
        });
        if(res_cnt!=0){
            ctx.reply(res_cnt+" valid search results found 🎶 :\n\n"+res);
        }else{
            ctx.reply("⚠️ No valid search results for \""+srch+"\" were found !");
        }
	
	}else{
		ctx.reply("Please enter a keyword to search.\nExample: /search dil");
	}
});


bot.launch()

console.log("Bot Running");

//app.listen(process.env.PORT||3000);
