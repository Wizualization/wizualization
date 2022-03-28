# Wizualization
This is the rendering system for the Optomancy grammar of graphics.

## Notes
* Currently `npm link`ed to spellbook; clone the spellbook repo, `cd spellbook` and `npm link`, `cd ../wizualization` and `npm link spellbook`
* after `npm link` you must open `node_modules/react-scripts/config/webpack.config.js` and remove the line `include: paths.appSrc`; you must do this again every time you `npm install` a new package because react-scripts transpilers are traaaaaaash when paired with `npm link`. See https://stackoverflow.com/questions/65893787/create-react-app-with-typescript-and-npm-link-enums-causing-module-parse-failed
* You must also, to get react-speech-recognition to work, modify `node_modules/react-scripts/config/webpack.config.js` to include `sourceType: 'unambiguous'` as part of babel loader `'options'` element object, e.g., as follows: 
```
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets: [
                  [
                    require.resolve('babel-preset-react-app'),
                    {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
                ],

                sourceType: 'unambiguous',
                
                [...]
              }
            }
```
