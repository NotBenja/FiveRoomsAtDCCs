import { app, connectDB } from './app';

const PORT = process.env.PORT || 3001;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
      console.log(`Server running on environment: ${process.env.NODE_ENV || 'non defined environment'}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error on startServer, could not start the server::', error);
    process.exit(1);
  }
};

startServer();