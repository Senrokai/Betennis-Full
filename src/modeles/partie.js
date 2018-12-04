const Pointage = require('./pointage.js');

class Partie {
    constructor(joueur1, joueur2, terrain, tournoi, heureDebut, tickDebut, io) {
        this.joueurs = [joueur1, joueur2];
        this.terrain = terrain;
        this.tournoi = tournoi;
        this.heure_debut = heureDebut;
        this.pointage = new Pointage(this);
        this.temps_partie = 0;
        this.joueur_au_service = Math.floor(Math.random() * 2);
        this.vitesse_dernier_service = 0;
        this.nombre_coup_dernier_echange = 0;
        this.constestation = [3, 3];
        this.tick_debut = tickDebut;
        this.paris = {
            montants: [0, 0],
            parieurs: [0, 0]
        };
        this.userParis = {
            joueur: null,
            montant: null
        };
        this.io = io;
    }

    jouerTour() {
        let contestationReussi = false;
        if ((Math.random() * 100) < 3) { // 3% de contestation
            const contestant = Math.floor(Math.random() * 2);
            if (!Partie.contester()) {
                this.constestation[contestant] = Math.max(0, this.constestation[contestant] - 1);
                this.io.sockets.emit('contestation',{msg:this.joueurs[contestant].nom + ' échoue sa contestation.'});
                console.log('contestation echouee');
            } else {
                contestationReussi = true;
                this.io.sockets.emit('contestation',{msg:this.joueurs[contestant].nom + ' réussi sa contestation.'});
                console.log('contestation reussie');
            }
        }

        if (!contestationReussi) {
            var winner = Math.floor(Math.random() * 2);
            this.pointage.ajouterPoint(winner);
        }
        this.temps_partie += Math.floor(Math.random() * 60); // entre 0 et 60 secondes entre chaque point
        this.vitesse_dernier_service = Math.floor(Math.random() * (250 - 60 + 1)) + 60; // entre 60 et 250 km/h
        this.nombre_coup_dernier_echange = Math.floor(Math.random() * (30 - 1 + 1)) + 1; // entre 1 et 30 coups par échange
    }

    static contester() {
        return (Math.random() * 100) > 25; // 75% de chance que la contestation passe
    }

    changerServeur() {
        this.joueur_au_service = (this.joueur_au_service + 1) % 2;
    }

    nouvelleManche() {
        this.io.sockets.emit('nouvelleManche',{msg:'Manche terminée : ' + this.joueurs[0].nom + ' (' + this.pointage.manches[0] + ') / ' + 
                                                                          this.joueurs[1].nom + ' (' + this.pointage.manches[1] + ')'});
        this.constestation = [3, 3];
    }

    estTerminee() {
        return this.pointage.final;
    }

    parier(somme, joueur) {
        this.paris.montants[joueur] += somme;
        this.paris.parieurs[joueur] += 1;
    }

    userPari(somme, joueur) {
        if (this.pointage.manches[0] <= 1 && this.pointage.manches[1] <= 1) {
            this.userParis.joueur = joueur;
            this.userParis.montant = somme;
        } else {
            return 0;
        }
    }

    getParis() {
        return this.paris;
    }

    toJSON() {
        return {
            'joueur1': this.joueurs[0],
            'joueur2': this.joueurs[1],
            'terrain': this.terrain,
            'tournoi': this.tournoi,
            'heure_debut': this.heure_debut,
            'pointage': this.pointage,
            'temps_partie': this.temps_partie,
            'serveur': this.joueur_au_service,
            'vitesse_dernier_service': this.vitesse_dernier_service,
            'nombre_coup_dernier_echange': this.nombre_coup_dernier_echange,
            'constestation': this.constestation,
            'paris': this.paris,
            'userParis': this.userParis
        };
    }
}

module.exports = Partie;
