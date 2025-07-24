export default class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.email = user.email;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.role = user.role;
    }
}

//No incluir datos sensibles (contraseñas,etc.)
