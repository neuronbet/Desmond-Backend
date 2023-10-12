const db = require("./app/models");
const AccountInfo = db.accountInfo;
var nodemailer = require('nodemailer');

const reset_Amount = 1000;
const active_scan_second = 30;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    //port: 465,
    //secure: false,
    // secureConnection: false,
    // tls: {
    //     rejectUnauthorized: false,
    // },
    // requireTLS: true,
    auth: {
        user: 'brodybbdd@gmail.com',
        pass: 'unxcfgnnpqrrdckw',
    },
    // connectionTimeout: 5 * 60 * 1000,//5min
    //logger: true,
    //debug: true
});

var mailOptions = {
    from: 'brodybbdd@gmail.com',
    to: 'eugeneozy@gmail.com, rextoo1992@gmail.com, neuron9801@gmail.com, desmondgiam@gmail.com',
    subject: 'The Threshold Notification',
    text: 'The current equity was reached at threshold'
};

exports.sendEmail = async () => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("== Email is sent", info.messageId);
        return true;
    }
    catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}



exports.alertProcess = async () => {
    var original = [];
    await AccountInfo.find({})
        .then(data => {
            original = data;
        })
    if (original.length > 0) {
        for (let i = 0; i < original.length; i++) {

            var id = original[i].id;

            if (original[i].currentEquity > original[i].threshold + reset_Amount && original[i].alertChecked) {
                original[i].alertChecked = false;
                await AccountInfo.findByIdAndUpdate(id, original[i], { useFindAndModify: false })
                    .then(data => {
                        console.log("----", original[i].brokerName, " <alertchecked> is updated by reset");
                    })
            }

            if (original[i].currentEquity < original[i].threshold && !original[i].alertChecked) {
                // alert process here
                mailOptions.text = "BrokerName: " + original[i].brokerName + "\n" +
                    "accountNumber: " + original[i].accountNumber + "\n" +
                    "threshold: " + original[i].threshold + "\n" +
                    "current Equity: " + original[i].currentEquity;
                console.log("Trying sending of email ... ...");

                original[i].alertChecked = true;
                await AccountInfo.findByIdAndUpdate(id, original[i], { useFindAndModify: false })
                    .then(data => {
                        console.log("----", original[i].brokerName, " <alertchecked> is updated by threshold");
                    })

                var sent = await this.sendEmail();
                if (sent) {
                    console.log('------Email is sent: ', mailOptions.text);
                }
            }

            let now = new Date();
            if (now - original[i].updatedAt > active_scan_second * 1000 && original[i].activeStatus) {
                original[i].activeStatus = false;
                await AccountInfo.findByIdAndUpdate(id, original[i], { useFindAndModify: false })
                    .then(data => {
                        console.log("----", original[i].brokerName, " <activeStatus> is updated ");
                    })
            }

        }
    }
}