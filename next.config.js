const withCss = require("@zeit/next-css");
const withPurgeCss = require("next-purgecss");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

module.exports = withBundleAnalyzer(
  withMDX(
    withCss(
      withPurgeCss({
        purgeCssEnabled: ({ dev, isServer }) => !dev && !isServer,
        purgeCssPaths: ["pages/**/*", "components/**/*"],
        purgeCss: {
          whitelist: () => ["html", "body", "__next"],
        },
        webpack(config, options) {
          config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
          return config;
        },
        pageExtensions: ["js", "jsx", "mdx"],
      })
    )
  )
);
