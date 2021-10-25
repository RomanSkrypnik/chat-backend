class UserDto {
    email;
    id;
    photo;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.photo = model.photo;
    }
}

module.exports = UserDto;