javascript
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database.config').default;

class User extends Model {
  // Compare provided password with hashed password
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Error in password verification:', error.message);
      throw new Error('Password verification failed. Please try again.');
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Name is required.' },
        notEmpty: { msg: 'Name cannot be empty.' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'A valid email address is required.' },
        notNull: { msg: 'Email is required.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required.' },
        len: {
          args: [8, 100],
          msg: 'Password must be at least 8 characters long.',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        try {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        } catch (error) {
          console.error('Error in password hashing:', error.message);
          throw new Error('Failed to hash password.');
        }
      },
    },
  }
);

module.exports = User;