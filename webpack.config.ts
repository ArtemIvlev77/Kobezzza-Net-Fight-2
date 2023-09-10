import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import ESLintPlugin from 'eslint-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

module.exports = (env: unknown, argv: unknown & { mode: string }) => {
  const isProd = argv.mode === 'production'
  const isDev = argv.mode === 'development'

  const fileName = (ext: string) => isProd ?
    `[name].[contenthash].bundle.${ext}` : `[name].bundle.${ext}`

  const plugins = () => {
    const base: unknown[] = [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'assets'),
            to: path.resolve(__dirname, 'dist', 'assets'),
          },
        ],
      }),
      new MiniCssExtractPlugin(),
      new CompressionPlugin({
        algorithm: 'gzip',
      })
    ]

    if (isDev) {
      base.push(
        new ESLintPlugin()
      )
    }

    return base
  }

  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: './index.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: fileName('js'),
      chunkFilename: fileName('js'),
      clean: true,
      publicPath: '/'
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'vendors',
            enforce: true,
            chunks: 'all'
          }
        }
      },
      minimizer: [
        new CssMinimizerPlugin()
      ]
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        "app": path.resolve(__dirname, "./src/app/"),
        "widgets": path.resolve(__dirname, "./src/widgets/"),
        "modules": path.resolve(__dirname, "./src/modules/"),
        "shared": path.resolve(__dirname, "./src/shared/"),
      }
    },
    devServer: {
      port: 3010,
      open: true,
      hot: true,
      watchFiles: './',
      historyApiFallback: true,
    },
    plugins: plugins(),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript', '@babel/preset-env'],
              plugins: [
                ["@babel/plugin-proposal-decorators", { "version": "2023-05" }]
              ]
            }
          }
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
              },
            },
          ]
        },
        {
          test: /\.(png|jpg(eg)?|gif|ico|svg|mp3)$/,
          type: 'asset/resource',
        }
      ]
    }
  }
}
