import createNextIntlPlugin from 'next-intl/plugin';
import { networkInterfaces } from 'node:os';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const allowedDevOrigins = Object.values(networkInterfaces())
  .flat()
  .filter((network): network is NonNullable<typeof network> => Boolean(network))
  .filter((network) => network.family === 'IPv4' && !network.internal)
  .map((network) => network.address);

export default withNextIntl({
  reactStrictMode: true,
  allowedDevOrigins
});
