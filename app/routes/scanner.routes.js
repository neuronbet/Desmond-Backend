module.exports = app => {
  const AccountInfo = require("../controllers/accountInfo.controller.js");
  const loginInfo = require("../controllers/loginInfo.controller.js");

  var router = require("express").Router();
  // SignUp
  router.post("/signUp", loginInfo.signUp);
  // Login
  router.post("/login", loginInfo.login);
  // Login
  router.post("/loginDelete", loginInfo.loginDelete);

  // Create a new Tutorial
  router.post("/", AccountInfo.create);

  // Retrieve all Tutorials
  router.get("/", AccountInfo.findAll);

  // Retrieve all published Tutorials
  router.get("/activated", AccountInfo.findAllActivated);

  // Retrieve a single Tutorial with id
  router.get("/:id", AccountInfo.findOne);

  router.post("/alert/:id", AccountInfo.sendAlert);

  // Update a Tutorial with id
  router.post("/update/:id", AccountInfo.update);

  // Delete a Tutorial with id
  router.post("/delete/:id", AccountInfo.delete);

  // Delete  a new Tutorial
  router.post("/deleteAll", AccountInfo.deleteAll);

  app.use("/api/scanner", router);
};
