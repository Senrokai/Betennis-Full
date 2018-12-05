const Partie = require('./modeles/partie');
const Joueur = require('./modeles/joueur');
var opSocket = null;

const modificateurVitesse = Math.min(process.argv[2], 1);

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
        let pari = "";
        if(partie.userParis.montant !== null) {
            pari = "Votre pari vous à rapporter : ";
            let miseTotal = partie.paris.montants[0] + partie.paris.montants[1] + partie.userParis.montant;
            let miseTotalTaxed = miseTotal * 0.75;
            let partMockParieur = 10 / miseTotal;
            let partUser = partie.userParis.montant / miseTotal;

            if ((partie.userParis.joueur === 0 && partie.pointage.manches[0] === 2)) {
                let parieursTotal = partie.paris.parieurs[0];
                let part = miseTotalTaxed / (partMockParieur * parieursTotal + partUser);
                let gain = Math.floor(partUser * part);
                pari +=  gain + "$.";
            } else if (partie.userParis.joueur === 1 && partie.pointage.manches[1] === 2) {
                let parieursTotal = partie.paris.parieurs[1];
                let part = miseTotalTaxed / (partMockParieur * parieursTotal + partUser);
                let gain = Math.floor(partUser * part);
                pari += gain + "$.";
            } else {
                pari = "Vous avez perdu votre pari de " + partie.userParis.montant + "$."
            }
        }

        if (partie.estTerminee()) {
            opSocket.sockets.emit('matchEnded', {
                msg: 'La partie ' + partie.joueurs[0].nom + '(' + partie.pointage.manches[0] + ') vs ' +
                    partie.joueurs[1].nom + '(' + partie.pointage.manches[1] + ') est terminée. ' + pari
            });
            clearInterval(timer);
        }
    }, Math.floor(1000 / modificateurVitesse));
}

module.exports = {};
module.exports.demarrer = demarrer;
module.exports.liste_partie = listePartie;
