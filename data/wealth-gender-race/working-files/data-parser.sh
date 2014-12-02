script=`cat data-parser.js`
cat all-vars.json | 
underscore process "$script" -o toSift.json
