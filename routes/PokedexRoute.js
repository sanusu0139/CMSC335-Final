const express = require('express');
const router = express.Router();
const PokemonModel = require("../model/pokemon.js");

router.get("/", async (req, res) => {
    const url = 'https://pokemon-unite-pokemons.p.rapidapi.com/pokemon?page=1&pageSize=48';
    const options = {
	    method: 'GET',
	    headers: {
		    'x-rapidapi-key': '3af99d3b2cmshbe62ec39daf56c6p1f3805jsnc316162655d7',
		    'x-rapidapi-host': 'pokemon-unite-pokemons.p.rapidapi.com'
	    }
    };

    try{
        const response = await fetch(url, options);
	    const result = await response.json();
        const pokemonList = Object.values(result.items);
        let pokeTable = '<table border="1">';
        pokeTable += '<tr><th>Pokemon</th><th>Damage Type</th></tr>';
        for(const pokemon of pokemonList){
            pokeTable += `<tr><td>${pokemon.name}</td><td>${pokemon.damageType}</td></tr>`;
        }
        pokeTable += '</table>';
        res.render("Pokedex", {pokeTable: pokeTable})
    }catch(error){
        console.error(error);
    }
});

module.exports = router;