class MessageDto {
    text;
    email;
    date;

    constructor(model) {
        this.text = model.text;
        this.email = model.email;
        this.date = model.date;
    }
}

module.exports = MessageDto;