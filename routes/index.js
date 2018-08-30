const express = require("express");
const path = require("path");

let router = express.Router();
const Client = require("../models/Client");
const Demande = require("../models/Demande");
const Domaine = require("../models/Domaine");
const Professionnel = require("../models/Professionnel");
const Statut = require("../models/Statut");
const Ville = require("../models/Ville");
const Admin = require("../models/Admin");

let mkdirp = require("mkdirp");
let fs = require("fs");
let getDirName = require("path").dirname;

function writeFile(path, contents, cb) {
    try {
        mkdirp(getDirName(path), function (err) {
            if (err) throw err;
            fs.writeFile(path, contents, cb);
        });
    } catch (e) {
        console.error(e);
    }
}

Array.prototype.compare = function (array) {
    if (!array) {
        return false;
    }
    if (this.length !== array.length) {
        return false;
    }
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].compare(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};

/**
 * @summary: EndPoint pour récuperer la liste de tous les domaines
 * @params: aucun
 * @return: Liste de tous les domaines. format: Json
 * @status: in_testing
 *
 **/
router.get("/ListeDomaine", async function (req, res) {
    try {
        let domaines = await Domaine.find({}).exec();
        res.json(domaines);
    } catch (err) {
        console.error(err);
        res.status(400).send("Error While Retrieving Domaines: " + err.message);
    }
});

/**
 * @summary: EndPoint pour récuperer la liste de toutes les villes
 * @param: aucun
 * @return: Liste de toutes les villes, format: Json
 * @status: in_testing
 **/
router.get("/ListeVille", async function (req, res) {
    try {
        let villes = await Ville.find({})
            .populate("professionnels")
            .exec();
        res.json(villes);
    } catch (e) {
        console.error(e);
        res.status(400).send("Error While Retrieving Domaines: " + e.message);
    }
});

/**
 * @summary: EndPoint pour récuperer la liste de toutes les statuts
 * @param: aucun
 * @return: Liste de toutes les statuts, format: Json
 * @status: Okay(v_2)
 **/
router.get("/ListeStatut", async function (req, res) {
    try {
        let statuts = await Statut.find({}).exec();
        res.json(statuts);
    } catch (e) {
        console.error(e);
        res.status(400).send("Error While Retrieving Statuts: " + e.message);
    }
});

/**
 * @summary: EndPoint pour récuperer la liste de toutes les demandes
 * @param: aucun
 * @return: Liste de toutes les demandes, format: Json
 * @status: in_testing
 **/
router.get("/ListeDemande", async function (req, res) {
    try {
        let demandes = await Demande.find({})
            .populate("ville")
            .populate("client")
            .populate("domaine")
            .populate("professionnel")
            .exec();
        res.json(demandes);
    } catch (e) {
        console.error(e);
        res.status(400).send("Error While Retrieving Demande: " + e.message);
    }
});

/**
 * @summary: EndPoint pour enregistrer une demande
 * @param: Demande demande, ObjectId idDomaine, ObjectId idVille
 * @return: true or false depend de si l'ajout a reussi ou non
 * @status: in_testing
 */
router.post("/SaveDemande", async function (req, res) {
    let demande = new Demande(req.body);
    try {
        await demande.save();
        res.json({result: true, data: "Votre demande a été enregistré"});
    } catch (e) {
        console.error(e);
        res.status(400).json({result: false, data: null});
    }
});

/**
 * @summary: Permet de vérifier les paramètres de connexion d'un client ou professionnel
 * @param: String email, String Password
 * @return:
 * @status: in_testing
 */
router.post("/Connexion", async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let client = await Client.findOne({email: email})
            .populate("professionnels")
            .exec();
        if (client) {
            if (client.validPassword(password)) {
                res.json({result: true, userType: "client", data: client});
            } else {
                res
                    .status(400)
                    .json({result: false, data: null, message: "Incorrect Password"});
            }
        } else {
            let professionnel = await Professionnel.findOne({email: email})
                .populate("statut")
                .populate("domaine")
                .populate("villes")
                .populate("clients")
                .exec();
            if (professionnel) {
                if (professionnel.validPassword(password)) {
                    return res.json({
                        result: true,
                        userType: "professionnel",
                        data: professionnel
                    });
                } else {
                    res
                        .status(400)
                        .json({result: false, data: null, message: "Incorrect Password"});
                }
            } else {
                res
                    .status(400)
                    .json({result: false, data: null, message: "Account not Found"});
            }
        }
    } catch (e) {
        console.error(e);
        res
            .status(400)
            .json({result: false, data: null, message: "Problem during process"});
    }
});

/**
 * @summary: Permet d"enregistrer un nouveau client
 * @param:  Client client
 * @return: true si le client a été enregistré, false sinon
 * @status: in_testing
 */
router.post("/InscriptionClient", async function (req, res) {
    let client = new Client(req.body);

    try {
        {
            client.password
                ? (client.password = client.encryptPassword(client.password))
                : null;
        }
        let pro = await Professionnel.findOne({email: client.email}).exec();
        if (pro) {
            res
                .status(404)
                .json({
                    result: false,
                    data:
                        "Professionnel always use that email, Professionnel can't be a Client"
                });
        } else {
            await client.save();
            res.json({result: true, data: client});
        }
    } catch (e) {
        console.error(e);
        if (e.name === "MongoError" && e.code === 11000) {
            res.status(400).send("Email Already Exist");
        } else {
            res.status(400).send("Error during the process: " + e.message);
        }
    }
});

/**
 * @summary: Permet d'enregistrer un nouveau professionnel
 * @param: Professionnel pro
 * @return: true si le pro a été enregistré, false sinon
 * @statut: Okay
 */
router.post("/InscriptionPro", async function (req, res) {
    let professionnel = new Professionnel(req.body);
    try {
        if (professionnel.password) {
            professionnel.password = professionnel.encryptPassword(
                professionnel.password
            );
        }

        let clientOld = await Client.findOne({email: professionnel.email}).exec();
        if (clientOld) {
            res
                .status(404)
                .json({
                    result: false,
                    data: "Client always use that email, Client can't be a professionnel"
                });
        } else {
            await professionnel.save();
            res.json({result: true, data: professionnel});
        }
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e);
    }
});

/**
 * @summary: Permet de modifier un compte professionnel
 * @param: Professionnel pro
 * @return: true si le compte à été modifié avec succès, false sinon
 * @statut: in_testing
 * Tu dois juste bien construire le JSON à envoyer
 */
router.post("/EditerPro", async function (req, res) {
    try {
        let pro = await Professionnel.findById(req.body._id).exec();
        let proToDisplay;
        console.log(req.body._id);
        if (req.body.nom) pro.nom = req.body.nom;
        if (req.body.numero) pro.numero = req.body.numero;
        if (req.body.email) pro.email = req.body.email;
        if (req.body.lastLat) pro.lastLat = req.body.lastLat;
        if (req.body.lastLong) pro.lastLong = req.body.lastLong;
        if (req.body.password)
            pro.password = pro.encryptPassword(req.body.password);
        if (req.body.siteWeb) pro.siteWeb = req.body.siteWeb;
        if (req.body.statut) pro.statut = req.body.statut;
        if (req.body.domaine) pro.domaine = req.body.domaine;
        if (req.body.villes) pro.villes = req.body.villes;
        if (req.body.clients) pro.clients = req.body.clients;

        await pro.save();
        proToDisplay = await Professionnel.findById(pro._id).populate("domaine").populate("villes").populate("clients").exec();
        res.json({result: true, data: proToDisplay});
    } catch (e) {
        console.error(e);
        res
            .status(400)
            .json({result: false, data: "Error during the process: " + e.message});
    }
});

/**
 * @summary: Permet de récupérer l'ensemble des professionnels
 * @param: aucun
 * @return: retourne l'ensemble des professionnels
 * @statut: in_testing
 * Tu dois juste bien construire le JSON à envoyer
 */
router.get("/ListePro", async function (req, res) {
    try {
        let professionnels = await Professionnel.find({})
            .populate("statut")
            .populate("villes")
            .populate("clients")
            .populate("domaine")
            .exec();
        res.json(professionnels);
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e.message);
    }
});

/**
 * @summary: Permet de récupérer l'ensemble des professionnels d'une ville
 * @param: villeId
 * @return: retourne l'ensemble des professionnels de la ville
 * @statut: in_testing
 * Tu dois juste bien construire le JSON à envoyer exemple: http://ip:port/ListePro/villeId
 */
router.get("/ListePro/:villeId", async function (req, res) {
    try {
        let professionnels = await Professionnel.find({
            villes: req.params.villeId
        })
            .populate("statut")
            .populate("villes")
            .populate("clients")
            .populate("domaine")
            .exec();
        res.json(professionnels);
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e.message);
    }
});

/**
 * @summary: Permet de récupérer l'ensemble de créer un nouveau domaine
 * @param: object Domaine, image is the key of the image of the domaine
 * @return: retourne true si domaine crée, false avec un message sinon
 * @statut: in_testing
 */
router.post("/NouveauDomaine", async function (req, res) {
    try {
        let domaine;
        if (req.body._id) {
            domaine = Domaine.findById(req.body._id).exec();
            if (req.body.domaine) domaine.domaine = req.body.domaine;
            if (req.body.description) domaine.description = req.body.description;
            if (req.body.count) domaine.count = req.body.count;
            if (req.body.color) domaine.color = req.body.color;
        } else {
            domaine = new Domaine(req.body);
        }
        if (req.body.image) {
            console.log("here");
            let name;
            let nameToSave;
            let imagePath = path.join(
                "__dirname",
                "..",
                "public",
                "images",
                "upload"
            );
            let base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, "");

            base64Data = base64Data.replace(/^data:image\/jpg;base64,/, "");
            nameToSave = "/images/upload" + "/" + domaine._id + "_img.jpg";
            name = "/" + domaine._id + "_img.jpg";

            if (base64Data.startsWith("data:image/png;base64")) {
                base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
                nameToSave = "/images/upload" + "/" + domaine._id + "_img.png";
                name = "/" + domaine._id + "_img.png";
            }
            console.log(imagePath);
            try {
                writeFile(imagePath + "/" + name, base64Data, "base64");
            } catch (e) {
                console.error(e);
            }
            domaine.image = nameToSave;
        }
        await domaine.save();
        {
            req.body._id ? res.json({
                result: true,
                data: "Votre Domaine a été créer avec succès"
            }) : res.json({result: true, data: "Votre domaine a été modifié avec succès"})
        }
        ;
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e.message);
    }
});

/**
 * @summary: Permet d'actualiser le token FCM d'un client ou professionel
 * @param: _id userId, token, userType
 * @return: retourne true si domaine crée, false avec un message sinon
 * @statut: in_testing
 */
router.post("/RenewToken", async (req, res) => {
    try {
        let user;
        let userType = req.body.userType;
        let _id = req.body._id;
        let token = req.body.token;

        if (userType === "client") {
            user = await Client.findById(_id).exec();
            user.set({token: token});
            await user.save();
        } else {
            user = await Professionnel.findById(_id).exec();
            user.set({token: token});
            await user.save();
        }
    } catch (e) {
        console.error(e.message);
        res.status(400).send("Error during the process: " + e.message);
    }
});

/**
 * @summary: Permet de retrouver un client
 * @param: _id userId
 * @return: retourne true si domaine crée, false avec un message sinon
 * @statut: in_testing
 */
router.get("/FindClient/:clientId", async (req, res) => {
    try {
        let client;
        client = await Client.findById(req.params.clientId).populate("professionnels").exec();
        res.json({data: client});
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e.message);
    }
});

/**
 * @summary: Permet de retrouver un professionnel
 * @param: _id userId
 * @return: retourne true si domaine crée, false avec un message sinon
 * @statut: in_testing
 */
router.get("/FindPro/:proId", async (req, res) => {
    try {
        let pro;
        pro = await Professionnel.findById(req.params.proId)
            .populate("statut")
            .populate("villes")
            .populate("domaine")
            .populate("clients")
            .exec();
        res.json({data: pro});
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e.message);
    }
});

/**
 * @summary: Permet d'attribuer une demande à un professionnel
 * @param: _id pro, _id demande
 * @return: retourne true si domaine crée, false avec un message sinon
 * @statut: in_testing
 */
router.post("/SetDemandeToPro", async (req, res) => {
    try {
        let demande = await Demande.findById(req.body.IdDemande).exec();
        let pro = await Professionnel.findById(req.body.idPro).exec();

        demande.set({professionnel: pro});
        await demande.save();
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e.message);
    }
});

router.post("/CheckAdmin", async (req, res) => {
    let admin1 = new Admin();
    let password = admin1.encryptPassword(req.body.password);
    let admin = await Admin.findOne({password: password}).exec();

    if (admin) {
        res.json({data: admin});
    } else {
        res.json({data: null});
    }
});

/**
 * @summary: Permet d'actualiser le token FCM d'un admin
 * @param: _id userId, token, userType
 * @return: retourne true si domaine crée, false avec un message sinon
 * @statut: in_testing
 */
router.post("/RenewTokenAdmin", async (req, res) => {
    try {
        let admin = await Admin.findById(req.body._id).exec();
        let token = req.body.token;

        admin.set({token: token});
        await admin.save();
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e.message);
    }
});

/**
 * @summary: Permet de supprimer une liste de domaine
 * @param: Array of domaineId
 * @return: retourne true si reussi, false sinon
 * @statut: in_testing
 */
router.post("/DeleteDomaines", async (req, res) => {
    try {
        let domainesId = req.body.arrayOfDomaineId;
        await Domaine.deleteMany({_id: {$in: domainesId}});
        res.json({result: true});
    } catch (e) {
        console.error(e);
        res.status(400).send("Error during the process: " + e.message);
    }
});

module.exports = router;
