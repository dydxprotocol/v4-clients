// This function runs once before all tests.
export default async () => {
  // eslint-disable-next-line
  const { config } = await import('dotenv-flow');
  config();
};
