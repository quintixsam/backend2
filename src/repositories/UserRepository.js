import UserDAO from '../dao/User.dao.js';

export default class UserRepository {
    constructor() {
    this.dao = new UserDAO();
    }

    async getUserById(id) {
    return this.dao.findById(id);
    }

    async getUserByEmail(email) {
    return this.dao.findByEmail(email);
    }

    async registerUser(userData) {
    return this.dao.createUser(userData);
    }

    async changePassword(id, newPassword) {
    return this.dao.updatePassword(id, newPassword);
    }

    async getAllUsers() {
    return this.dao.getAllUsers();
    }
}
