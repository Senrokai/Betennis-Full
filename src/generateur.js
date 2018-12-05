const Partie = require('./modeles/partie');
const Joueur = require('./modeles/joueur');
const _ = require('lodash');
var opSocket = null;

const modificateurVitesse = Math.min(process.argv[2], 10);

const listePartie = [];

const demarrer = function (io) {
    opSocket = io;

    listePartie.push(new Partie(new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'Hale', '12h30', 0, opSocket));
    listePartie.push(new Partie(new Joueur('Andy', 'Murray', 28, 132, 'Angleterre'), new Joueur('Andy', 'Roddick', 36, 1000, 'États-Unis'), '2', 'Hale', '13h00', 30, opSocket));

    let tick = 0;
    setInterval(function () {
        for (const partie in listePartie) {
            if (listePartie[partie].tick_debut === tick) {
                demarrerPartie(listePartie[partie]);
            }
        }

        tick += 1;
    }, Math.floor(1000 / modificateurVitesse));
};

function demarrerPartie(partie) {
    let joueur1 = Math.floor(Math.random() * 10000);
    let joueur2 = Math.floor(Math.random() * 10000);

    for (var i = 0; i < joueur1; i++) {
        partie.parier(10, 0);
    }

    for (var i = 0; i < joueur2; i++) {
        partie.parier(10, 1);
    }

    const timer = setInterval(function () {
        partie.jouerTour();

        if (partie.estTerminee()) {
            let pari = "Vous n'avez pas parié sur ce match.";
            if (partie.userParis.montant !== null) {
                pari = "Votre pari vous à rapporter : ";
                let miseTotal = parseInt(partie.paris.montants[0]) + parseInt(partie.paris.montants[1]) +
                    parseInt(partie.userParis.montant);
                let miseTotalTaxed = miseTotal * 0.75;
                let partMockParieur = 10 / miseTotal;
                let partUser = parseInt(partie.userParis.montant) / miseTotal;
                if (_.isEqualWith(partie.userParis.joueur, partie.joueurs[0]) && partie.pointage.manches[0] === 2) {
                    let parieursTotal = parseInt(partie.paris.parieurs[0]);
                    let part = miseTotalTaxed / (partMockParieur * parieursTotal + partUser);
                    let gain = Math.floor(partUser * part);
                    pari += gain + "$.";
                } else if (_.isEqualWith(partie.userParis.joueur, partie.joueurs[1]) && partie.pointage.manches[1] === 2) {
                    let parieursTotal = parseInt(partie.paris.parieurs[1]);
                    let part = miseTotalTaxed / (partMockParieur * parieursTotal + partUser);
                    let gain = Math.floor(partUser * part);
                    pari += gain + "$.";
                } else {
                    pari = "Vous avez perdu votre pari de " + partie.userParis.montant + "$."
                }
            }
            opSocket.sockets.emit('matchEnded', {
                msg: 'La partie ' + partie.joueurs[0].nom + '(' + partie.pointage.manches[0] + ') vs ' +
                    partie.joueurs[1].nom + '(' + partie.pointage.manches[1] + ') est terminée.',
                body: pari
            });
            clearInterval(timer);
        }
    }, Math.floor(1000 / modificateurVitesse));
}

module.exports = {};
module.exports.demarrer = demarrer;
module.exports.liste_partie = listePartie;
