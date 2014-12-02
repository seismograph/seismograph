script=`cat race-parser.js`
RAW=raw/race/*
for f in $RAW
do
	cat $f | 
	underscore process "$script" -o json/${f#raw/race/} #--outfmt dense
done