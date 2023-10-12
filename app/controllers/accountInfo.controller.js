const db = require("../models");
const AccountInfo = db.accountInfo;
const token = require("./variable");


// Create and Save a new AccountInfo
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.brokerName) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if (!this.verifyToken(req)) {
    res.status(401).send({ message: "Invalid Token" });
    return;
  }

  var _brokerName = req.body.brokerName;
  var _accountNumber = req.body.accountNumber;
  var condition = {
    brokerName: _brokerName,
    accountNumber: _accountNumber
  };

  var count = 0;
  var client;
  await AccountInfo.find(condition)
    .then(data => {
      count = data.length;
      client=data;
    })
  if (count > 0) {
    res.status(401).send({ message: "This is exist already" ,id:client[0].id});
    return;
  }
  // Create a AccountInfo
  const account = new AccountInfo({
    brokerName: req.body.brokerName,
    accountNumber: req.body.accountNumber,
    currentEquity: req.body.currentEquity,
    threshold: req.body.threshold ? req.body.threshold : 0,
    topUpAmount: req.body.topUpAmount ? req.body.topUpAmount : 0,
    activeStatus: req.body.activeStatus ? req.body.activeStatus : false,
    totalSwap: req.body.totalSwap,
    longSwap: req.body.longSwap,
    shortSwap: req.body.shortSwap,
    alertChecked: req.body.alertChecked ? req.body.alertChecked : false
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
          err.message || "Some error occurred while creating the AccountInfo."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const bName = req.query.brokerName;
  const accNum = req.query.accountNumber;
  if (!this.verifyToken(req)) {
    res.status(500).send({ message: "Invalid Token" });
    return;
  }
  var condition = {};
  if (bName && accNum) {
    condition = {
      brokerName: bName,
      accountNumber: accNum
    };
  }
  else if (bName && !accNum)
    condition = { brokerName: bName };
  else if (!bName && accNum)
    condition = {
      accountNumber: accNum
    };

  AccountInfo.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding acountInfos."
      });
    });
};

// Find a single AccountInfo with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!this.verifyToken(req)) {
    res.status(401).send({ message: "Invalid Token" });
    return;
  }

  AccountInfo.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found AccountInfo with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving AccountInfo with id=" + id });
    });
};
exports.sendAlert = (req, res) => {
  const id = req.params.id;
  if (!this.verifyToken(req)) {
    res.status(401).send({ message: "Invalid Token" });
    return;
  }
  AccountInfo.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found AccountInfo with id " + id });
      else {
        // console.log(data);
        res.send({ message: "Alert is success =>" + data.brokerName + ":" + data.accountNumber });
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error send Alert with id=" + id });
    });



}
// Update a AccountInfo by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  if (!this.verifyToken(req)) {
    res.status(401).send({ message: "Invalid Token" });
    return;
  }

  const id = req.params.id;

  AccountInfo.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update AccountInfo with id=${id}. Maybe AccountInfo was not found!`
        });
      } else res.send({ message: "AccountInfo was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating AccountInfo with id=" + id
      });
    });
};

// Delete a AccountInfo with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  if (!this.verifyToken(req)) {
    res.status(401).send({ message: "Invalid Token" });
    return;
  }

  AccountInfo.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete AccountInfo with id=${id}. Maybe AccountInfo was not found!`
        });
      } else {
        res.send({
          message: "AccountInfo was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete AccountInfo with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  if (!this.verifyToken(req)) {
    res.status(401).send({ message: "Invalid Token" });
    return;
  }
  AccountInfo.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Find all published Tutorials
exports.findAllActivated = (req, res) => {
  if (!this.verifyToken(req)) {
    res.status(401).send({ message: "Invalid Token" });
    return;
  }
  AccountInfo.find({ activeStatus: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

exports.verifyToken = (req) => {
  const token_ = req.headers.authorization;
  const _token = token.GetToken();
  if (token_ === "MT_EA_SIGNAL")
    return true;
  if (token_ === null)
    return false;
  if (token_ !== _token)
    return false;
  else
    return true;
}