require('dotenv').config()
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require("nodemailer")

exports.emailer = function emailer(type, values){
const oauth2Client = new OAuth2(
     process.env.CLIENT_ID, // ClientID
     process.env.CLIENT_SECRET, // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);


oauth2Client.setCredentials({
     refresh_token: process.env.REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken()
const smtpTransport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "projectekatraofficial@gmail.com", 
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken
     }});

var mailOptions;
if(type===1)
{
var html = `<div style="background-color: #f2f4f6; text-align: center; padding-left:3px;padding-right: 3px;"><img style="width: 35px;" src="https://i.ibb.co/1dFQQv7/forfavicon.png" /><p>Hi ${values.author}!</p><p style="text-align: left;">Congratulations on your valuable contribution towards making free educational content on internet more accessible.<br />We are thankful to you for adding the following resource into <strong>Project Ekatra</strong>. We hope a lot of learners will make use of this hidden treasure.</p><div><table style="text-align: left;"><tbody><tr><td>Heading:</td><td>${values.heading}</td></tr><tr><td >Link:</td><td ><a href="${values.link}">${values.link}</a></td></tr><tr><td style="vertical-align:top;">Description:</td><td>${values.description}</td></tr><tr><td style="vertical-align:top;">Category:</td><td>${values.category.map(x=>" "+x.label).toString()}</td></tr></tbody></table></div><p style="padding-bottom:10px;"><a href="https://projectekatra.github.io/#/contribute">Wanna Contribute More</a></div></p><div style="text-align:center;"><p>Copyright 2021, Project Ekatra.<br />For the Learners by the Learners</p></div>`;

mailOptions = {
     from: '"Project Ekatra" <projectekatraofficial@gmail.com>',
     to: `${values.authorEmail}`,
     subject: "Thank You For Your Contribution to Project Ekatra.",
     generateTextFromHTML: true,
     html: html
};
}
else if(type===2)
{
var html = `Hi ${values.name},<br/> You need to verify your email address to access features like forgot password. <a href="https://projectekatra.github.io/#/activate/${values.hash}">Click Here</a> to do the same.<br />
If above link doesn't work, try copying pasting following url: <a href="https://projectekatra.github.io/#/activate/${values.hash}">https://projectekatra.github.io/#/activate/${values.hash}</a>.<br />
Thanks. 🙂`

mailOptions = {
    from: '"Project Ekatra" <projectekatraofficial@gmail.com>',
    to: `${values.email}`,
    subject: "Email Verification",
    generateTextFromHTML: true,
    html: html
};
}

else if(type===3)
{
var html = `To reset your password, <a href = "https://projectekatra.github.io/#/reset/${values.hash}">click here</a>. If above link doesn't work, try copying-pasting following url: <a href = "https://projectekatra.github.io/#/reset/${values.hash}">https://projectekatra.github.io/#/reset/${values.hash}</a><br />Thanks. 🙂`
mailOptions = {
	from: '"Project Ekatra" <projectekatraofficial@gmail.com>',
	to: `${values.email}`,
	subject: "Reset Your Password",
	generateTextFromHTML: true,
	html: html
};
}

else if(type === 5)
{
     var html = `Details are here (Time: ${values.time}): <br/> ${JSON.stringify(values.header)} <br/> <br/> Method1 (req.headers["x-forwarded-for"]): <br/> ${values.ip1} <br/><br/>
     Method3 (req.socket.remoteAddress): <br/> ${values.ip2} <br/><br/>
     Method3 (userIP): <br/> ${values.ip3} <br/><br/>
     Method3 (req.ip): <br/> ${values.ip4} <br/><br/>`

     mailOptions = {
          from: '"Project Ekatra" <projectekatraofficial@gmail.com>',
          to: `prakashaditya369@gmail.com`,
          subject: "Meeting details",
          generateTextFromHTML: true,
          html: html
     };
}

smtpTransport.sendMail(mailOptions, (error, response) => {
     error ? console.log(error) : console.log(response);
     smtpTransport.close();
});

}
