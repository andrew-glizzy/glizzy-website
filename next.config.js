const withSvgr = require("next-svgr");

module.exports = withSvgr({
  reactStrictMode: true,
  images: {
    domains: ["images.ctfassets.net"]
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  }
});
