const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const dbName = "PokemonDB";
const collectionName = "pokemons";
const mongoose = require("mongoose");
app.use(express.static("CSS"));

app.use(bodyParser.urlencoded({extended:true}));
const PokemonModel = require("./model/pokemon.js");

require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

const { MongoClient, ServerApiVersion } = require("mongodb");

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

const depositRouter = require("./routes/DepositRoute.js");
const wdRouter = require("./routes/WithdrawRoute.js");
const pdRouter = require("./routes/PokedexRoute.js");
const releaseRouter = require("./routes/ReleaseRoute.js");
const equipRouter = require("./routes/EquipRoute.js");

app.use("/Deposit", depositRouter);
app.use("/Withdraw", wdRouter);
app.use("/Pokedex", pdRouter);
app.use("/Release", releaseRouter);
app.use("/Equipped", equipRouter);


app.get("/", async (req, res) => {
    const url = 'https://pokemon-unite-pokemons.p.rapidapi.com/pokemon?page=1&pageSize=48';
    const options = {
	    method: 'GET',
	    headers: {
		    'x-rapidapi-key': '3af99d3b2cmshbe62ec39daf56c6p1f3805jsnc316162655d7',
		    'x-rapidapi-host': 'pokemon-unite-pokemons.p.rapidapi.com'
	    }
    };

    try {
	    const response = await fetch(url, options);
	    const result = await response.json();
        const pokemonList = Object.values(result.items);
        for (const mon of pokemonList) {
            const existing = await PokemonModel.findOne({ name: mon.name });
        if (!existing) {
        const newPokemon = new PokemonModel({
          name: mon.name,
        });
        await newPokemon.save();
        }
    }
    res.render("HomePage");
} catch (error) {
	console.error(error);
}
    
});

app.get("/UserGuide", (req, res) =>{
    res.render("UserGuide");
});


const portNum = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Web server started and running at http://localhost:${portNum}`);
    process.stdout.write("Type stop to shutdown the server: ");
});
process.stdin.setEncoding("utf8"); 
process.stdin.on("readable", () => { 
	const dataInput = process.stdin.read();
	if (dataInput !== null) {
		const command = dataInput.trim();
		if (command === "stop") {
			process.stdout.write("Shutting down the server"); 
            process.exit(0); 
        }else {
			console.log(`Invalid command: ${command}`);
            process.stdout.write("Type stop to shutdown the server: ");
		}
		process.stdin.resume();
    }
});
