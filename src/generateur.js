const Partie = require('./modeles/partie');
const Joueur = require('./modeles/joueur');

const modificateurVitesse = Math.min(process.argv[2], 1);

const listePartie = [];

listePartie.push(new Partie(new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'Hale', '12h30', 0));
listePartie.push(new Partie(new Joueur('Andy', 'Murray', 28, 132, 'Angleterre'), new Joueur('Andy', 'Roddick', 36, 1000, 'États-Unis'), '2', 'Hale', '13h00', 30));

const demarrer = function () {
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
        partie.parier(Math.floor(Math.random() * 100), 0);
    }

    for (var i = 0; i < joueur2; i++) {
        partie.parier(Math.floor(Math.random() * 100), 1);
    }

    const timer = setInterval(function () {
        partie.jouerTour();
        if (partie.estTerminee()) {
            clearInterval(timer);
        }
    }, Math.floor(1000 / modificateurVitesse));
}

module.exports = {};
module.exports.demarrer = demarrer;
module.exports.liste_partie = listePartie;
