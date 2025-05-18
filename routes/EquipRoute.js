const express = require('express');
const router = express.Router();
const PokemonModel = require("../model/pokemon.js");

router.get("/", async (req, res) => { 
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '3af99d3b2cmshbe62ec39daf56c6p1f3805jsnc316162655d7',
            'x-rapidapi-host': 'pokemon-unite-pokemons.p.rapidapi.com'
        }
    };
    try{
        const pokemonList = await PokemonModel.find({ equipped: true });
        let pokeTable = '<table border="1">';
        pokeTable += '<tr><th>Pokemon</th><th>Skills</th><tr>';
        for(const pokemon of pokemonList){
            let url = `https://pokemon-unite-pokemons.p.rapidapi.com/pokemon/${pokemon.name}`;
            let response = await fetch(url, options);
	        let result = await response.json();
            let skillList = result.skills.map(skill => skill.name).join(", ");
            pokeTable += `<tr><td>${pokemon.name}</td><td>${skillList}</td></tr>`;
        }
        pokeTable += '</table>';
        res.render("Equipped", {pokeTable: pokeTable});
    }catch(error){
        console.log(error);
    }
});


module.exports = router;