script=`cat gender-parser.js`
RAW=raw/gender/*
for f in $RAW
do
	cat $f | 
	underscore process "$script" -o json/${f#raw/gender/} --outfmt dense
done