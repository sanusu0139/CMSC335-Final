const express = require('express');
const router = express.Router();
const PokemonModel = require("../model/pokemon.js");

const url = 'https://pokemon-unite-pokemons.p.rapidapi.com/pokemon?page=1&pageSize=48';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '3af99d3b2cmshbe62ec39daf56c6p1f3805jsnc316162655d7',
        'x-rapidapi-host': 'pokemon-unite-pokemons.p.rapidapi.com'
    }
};
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
        res.render("Release", {availablePokemon: pokeTable, errorMessage: null});
    }catch(error){
        console.log(error);
    }
});


router.post("/", async(req, res) => {
    const pokemonName = req.body.pokeName;
    try{
        const pokemon = await PokemonModel.findOne({ name: pokemonName });
        if(pokemon && pokemon.inBox && !pokemon.equipped){
                    await PokemonModel.updateOne(
                        { name: pokemonName },
                        { $set: {inBox: false}}
                      );   
        }else if(!pokemon.inBox){
            return res.render("Release", {availablePokemon: null, errorMessage: "This pokemon is not in your box." });
        }else if(pokemon.equipped){
            return res.render("Release", {availablePokemon: null, errorMessage: "This pokemon is equipped. Please deposit it before releasing." });
        }else{
            return res.render("Release", {availablePokemon: null, errorMessage: "This pokemon does not exist. Please choose a real pokemon." });
        }
        const pokemonList = await PokemonModel.find({ inBox: true });
        let pokeTable = '<table border="1">';
        pokeTable += '<tr><th>Pokemon</th></tr>';
        for(const pokemon of pokemonList){
            if(pokemon.inBox){
                pokeTable += `<tr><td>${pokemon.name}</td></tr>`;
            }
        }
        pokeTable += '</table>';
        res.render("Release", {availablePokemon: pokeTable, errorMessage: null});
    }catch(error){
        console.error(error);
    }
});

module.exports = router;
