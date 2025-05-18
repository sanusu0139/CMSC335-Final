const express = require('express');
const router = express.Router();
const PokemonModel = require("../model/pokemon.js");

//On load
router.get("/", async (req, res) => {
    
    try{
        const pokemonList = await PokemonModel.find({ inBox: true });
        let pokeTable = '<table border="1">';
        pokeTable += '<tr><th>Pokemon</th><tr>';
        for(const pokemon of pokemonList){
            if(pokemon.inBox)
            pokeTable += `<tr><td>${pokemon.name}</td></tr>`;
        }
        pokeTable += '</table>';
        res.render("Withdraw", {availablePokemon: pokeTable, errorMessage: null});
    }catch(error){
        console.log(error);
    }
});


router.post("/", async(req, res) => {
    const pokemonName = req.body.pokeName;
    try{
        const pokemonList = await PokemonModel.find({ inBox: true });
        const equipCount = await PokemonModel.countDocuments({ equipped: true });
        const pokemon = await PokemonModel.findOne({ name: pokemonName });
        let pokeTable = '<table border="1">';
        pokeTable += '<tr><th>Pokemon</th></tr>';
        for(const pokemon of pokemonList){
            if(pokemon.inBox){
                pokeTable += `<tr><td>${pokemon.name}</td></tr>`;
            }     
        }
        pokeTable += '</table>';
        if (!pokemon) {
            return res.render("Withdraw", {
                availablePokemon: pokeTable,
                errorMessage: "This pokemon does not exist. Please choose a real pokemon."
            });
        }
        if(pokemon && equipCount < 6 && pokemon.inBox && !pokemon.equipped){
                    await PokemonModel.updateOne(
                        { name: pokemonName },
                        { $set: { equipped: true } }
                      );
        }else if(equipCount >= 6){
            return res.render("Withdraw", {availablePokemon: pokeTable, errorMessage: "You have to many pokemon equipped. Please deposit one or more before withrawing another" });
        }else if(!pokemon.inBox){
            return res.render("Withdraw", {availablePokemon: pokeTable, errorMessage: "This pokemon is not in your box. Please deposit it before withdrawing." });
        }else if(pokemon.equipped){
            return res.render("Withdraw", {availablePokemon: pokeTable, errorMessage: "This pokemon is already equipped. Please withdraw a different pokemon." });
        }
        
        return res.render("Withdraw", {availablePokemon: pokeTable, errorMessage: null});
    }catch(error){
        console.error(error);
    }
});

module.exports = router;
