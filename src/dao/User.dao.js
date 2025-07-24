// src/dao/User.dao.js
import UserModel from '../models/User.js';

export default class UserDAO {
    async findById(id) {
    return await UserModel.findById(id);
    }

    async findByEmail(email) {
    return await UserModel.findOne({ email });
    }

    async createUser(userData) {
    return await UserModel.create(userData);
    }

    async updatePassword(id, newPassword) {
    return await UserModel.findByIdAndUpdate(id, { password: newPassword });
    }

    async getAllUsers() {
    return await UserModel.find();
    }
}
