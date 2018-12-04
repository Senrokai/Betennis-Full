const express = require('express');
const router = express.Router();

const gen = require('../generateur');

/* GET parties listing. */
router.get('/', function (req, res, next) {
    res.send(gen.liste_partie);
});

router.get('/:id', function (req, res, next) {
    res.send(gen.liste_partie[req.params.id]);
});

router.get('/:id/paris', function (req, res, next) {
    res.send(gen.liste_partie[req.params.id].getParis())
});

/* PUT parties listing. */

router.put('/:id/paris/:joueur/:montant', function (req, res, next) {
    let partie = gen.liste_partie[req.params.id];
    let montant = req.params.montant;
    let joueur = req.params.joueur;
    if (partie.userPari(montant, joueur) === 0) {
        res.status(403).json({error: "Vous ne pouvez plus parier après la première manche !"});
    }
    else {
        res.send("Votre paris de " + montant + " sur " + joueur.nom + " " + joueur.prenom + " à bien été pris en compte.");
    }
});

module.exports = router;
