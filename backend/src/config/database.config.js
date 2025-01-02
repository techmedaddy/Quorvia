import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  logging: false, // Disable SQL query logging
});

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw new Error('Failed to connect to the database. Please check your configuration or database status.');
  }
}

export default {
  sequelize,
  connectToDatabase,
};