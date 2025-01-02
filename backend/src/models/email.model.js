javascript
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database.config').default;

class Email extends Model {}

Email.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Sender email is required.' },
        isEmail: { msg: 'Sender email must be valid.' },
      },
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Recipient email is required.' },
        isEmail: { msg: 'Recipient email must be valid.' },
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachment: {
      type: DataTypes.STRING, // URL or file path
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Email',
    tableName: 'emails',
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = Email;