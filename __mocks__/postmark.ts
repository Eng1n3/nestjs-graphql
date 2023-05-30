module.exports = {
  Client: jest.fn(() => ({
    sendEmailWithTemplate: jest.fn(() => {
      return true;
    }),
  })),
  ServerClient: jest.fn(() => ({ sendEmail: jest.fn(() => true) })),
};
