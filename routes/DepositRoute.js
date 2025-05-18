const express = require('express');
const router = express.Router();
const PokemonModel = require("../model/pokemon.js");

router.get("/", (req, res) => {
    res.render("Deposit", { errorMessage: null});
});

router.post("/", async (req, res) => {
    const pokemonName = req.body.pokeName;
    try{
        const pokemon = await PokemonModel.findOne({ name: pokemonName });
        if(pokemon){
            await PokemonModel.updateOne(
                { name: pokemonName },
                { $set: {equipped: false, inBox: true}}
              );
        }
            return res.render("Deposit", { errorMessage: null});
       else{
            return res.render("Deposit", { errorMessage: ` ${pokemonName} is not a pokemon. Please deposit an acutal pokemon` });
       } 
    }catch(error){
        console.error(error);
        res.render("Deposit", { errorMessage: "An error has occured"});
    }
});

module.exports = router;
