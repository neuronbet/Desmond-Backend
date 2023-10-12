const db = require("../models");
const LoginInfo = db.loginInfo;
const token = require("./variable");
exports.signUp =async (req, res) => {    
 
    // Validate request
    if (!req.body.loginName && !req.body.loginEmail) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    var condition1 = {
        loginName: req.body.loginName
    };
    var condition2 = {
        loginEmail: req.body.loginEmail
    };

    var count1 = 0,count2=0;

    
    await LoginInfo.find(condition1)
        .then(data => {
            count1 = data.length;
        })
    await LoginInfo.find(condition2)
        .then(data => {
            count2 = data.length;
        })
    
    if (count1 > 0 || count2>0) {
        res.status(401).send({ message: "This account is exist already" });
        return;
    }

    // Create a AccountInfo
    const account = new LoginInfo({
        loginName: req.body.loginName,
        loginEmail: req.body.loginEmail,
        loginPassWord: req.body.loginPassWord,
        isAdmin: req.body.isAdmin ? req.body.isAdmin : false
    });

    // Save AccountInfo in the database
    account
        .save(account)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while signUP."
            });
        });
}
exports.loginDelete = async (req, res) => {
    const email = req.query.loginEmail;
    var condition = {
        loginEmail: email
    };

    var count = 0;
    var client;
    await LoginInfo.find(condition)
        .then(data => {
            count = data.length;
            client = data;
        })
    // .catch(err => {
    //     res.status(500).send({
    //         message:
    //             err.message || "Some error occurred while finding acountInfos."
    //     });
    // });

    if (count === 1) {
        var id = client[0].id
        LoginInfo.findByIdAndRemove(id, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot delete logininfo with email=${email}. Maybe AccountInfo was not found!`
                    });
                } else {
                    res.send({
                        message: email + "logininfo was deleted successfully!"
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Could not delete logininfo " + email
                });
            });

    }
    else {
        res.status(401).send({ message: "Could not delete logininfo" + email });
    }

}
exports.login = (req, res) => {
    const name = req.query.loginName;
    const email = req.query.loginEmail;
    const password = req.query.loginPassWord;

    var condition1 = {
        loginName: name,
        loginPassWord: password
    };

    var condition2 = {
        loginEmail: email,
        loginPassWord: password
    };

    var condition = name ? condition1 : condition2;


    LoginInfo.find(condition)
        .then(data => {
            if (data.length > 0) {
                var Token = require('crypto').randomBytes(64).toString('hex');
                //console.log("_____", Token);
                token.SetToken(Token);
                res.status(200).send({
                    message:
                        "Login Success",
                    token: Token
                });
            }
            else
                res.status(404).send({
                    message:
                        "Login Failed"
                });

        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while Login."
            });
        });

}