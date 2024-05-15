const { ModuleFederationPlugin } = require("webpack").container;
const packageJson = require("./package.json");
const components = require("./components.json");
const path = require("path");

let entries = {};
Object.keys(components).forEach((key) => {
  entries[key] = path.join(__dirname, "components", components[key]);
});
module.exports = {
  entry: entries,
  mode: "none",
  target: "web",
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".json", ".jsx", ".tsx", ".ts"],
    alias: {
      "@": path.resolve(__dirname, "."),
      "@i18n": path.resolve(__dirname, "i18n"),
      "@commons": path.resolve(__dirname, "commons"),
      "@components": path.resolve(__dirname, "components"),
      "@pages": path.resolve(__dirname, "pages"),
      "@styles": path.resolve(__dirname, "styles"),
      "@utils": path.resolve(__dirname, "utils"),
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/[name].js",
    chunkFilename: "[name]/[name].js",
    clean: true,
    library: `${packageJson.name}-[name]`,
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: require.resolve("style-loader"),
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(tsx|ts|jsx|js)$/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
                "@babel/preset-typescript",
              ],
            },
          },
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024,
          },
        },
      },
      {
        exclude: /node_modules/,
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    // new ModuleFederationPlugin({
    //   name: packageJson.name,
    //   filename: 'remoteEntry.js',
    //   exposes: {
    //   },
    //   remotes: {
    //   },
    //   shared: {
    //     'react': {
    //       singleton: true,
    //       version: packageJson.dependencies.react,
    //       requiredVersion: packageJson.dependencies.react
    //     },
    //     'react-dom': {
    //       singleton: true,
    //       version: packageJson.dependencies["react-dom"],
    //       requiredVersion: packageJson.dependencies["react-dom"]
    //     },
    //     'react-intl': {
    //       singleton: true,
    //       version: packageJson.dependencies["react-intl"],
    //       requiredVersion: packageJson.dependencies["react-intl"]
    //     },
    //     'primereact/api': {
    //       singleton: true,
    //       version: packageJson.dependencies.primereact,
    //       requiredVersion: packageJson.dependencies.primereact
    //     }
    //   }
    // })
  ],
};
