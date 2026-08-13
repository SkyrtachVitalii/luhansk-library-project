import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  static async register(data: any): Promise<IUser> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Беремо лише дозволені поля. НІКОЛИ не довіряємось role/gdprConsent з тіла запиту.
    const user = new User({
      firstName:    data.firstName,
      lastName:     data.lastName,
      patronymic:   data.patronymic,
      email:        data.email,
      phone:        data.phone,
      dateOfBirth:  data.dateOfBirth,
      gender:       data.gender,
      address:      data.address,
      education:    data.education,
      activitiField: data.activitiField,
      workplace:    data.workplace,
      addictionalInfo: data.addictionalInfo,
      gdprConsent:  Boolean(data.gdprConsent), // очікуємо булеве значення
      role:         'user', // завжди 'user' — підвищення ролі окремо через адмін-інтерфейс
      passwordHash,
    });

    await user.save();
    return user;
  }

  static async login(email: string, password: string): Promise<{ user: IUser, token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { user, token };
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
