const mailer = require('nodemailer');
const { mail } = require('../configs/configs');

class Mail {
    to = [];
    from = '';
    title = '';
    html = '';
    subject = '';

    addTo(email, name) {
        if (email == '' || email == null) {
            throw new Error('The email is required.');
        }

        let address = { address: email };

        if (name && name.trim().length > 0) {
            address.name = name.trim();
        }

        this.to.push(address);

        return this;
    }

    addSubject(subject) {
        if (
            subject == ''
            || subject == null
            || subject.trim().length < 1
        ) {
            throw new Error('Please provide a valid subject.');
        }

        this.subject = subject.trim();

        return this;
    }

    #transporter() {
        return mailer.createTransport({
            host: mail.host,
            port: mail.port,
            // secure: mail.ssl,
            auth: {
                user: mail.user,
                pass: mail.pass
            }
        })
    }

    #options() {
        return ({
            from: this.from || mail.from,
            to: this.to,
            subject: this.subject,
            html: this.html,
            // text: ''
        });
    }

    async send(html) {
        this.html = html;
        this.#validate();

        return this.#transporter()
            .sendMail(this.#options());
    }

    #validate() {
        if (this.from == '' && !Boolean(mail.from)) {
            throw new Error('Configure a from address to send email.');
        }

        if (this.to.length < 1) {
            throw new Error('No recipient has been provided to send this email.');
        }

        if (this.subject == '') {
            throw new Error('Kindly provide a subject to send this email.');
        }

        if (
            this.html == ''
            || this.html == null
            || this.html.trim().length < 1
        ) {
            throw new Error('Invalid html.');
        }
    }
}

module.exports = Mail;