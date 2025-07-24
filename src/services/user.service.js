import userRepository from '../repositories/user.repository.js';
import { createHash, isValidPassword } from '../utils/password.utils.js';

class UserService {
    async getUserByEmail(email) {
    return await userRepository.findByEmail(email);
    }

    async createUser(userData) {
    const hashedPassword = createHash(userData.password);
    const newUser = { ...userData, password: hashedPassword };
    return await userRepository.create(newUser);
    }

    async resetPassword(userId, newPassword) {
    const newHashed = createHash(newPassword);
    return await userRepository.updatePassword(userId, newHashed);
    }

    async validatePassword(email, plainPassword) {
    const user = await userRepository.findByEmail(email);
    if (!user) return false;
    return isValidPassword(plainPassword, user.password);
    }
}

export default new UserService();
