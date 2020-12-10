#!/bin/bash
set -e

echo "This will build and upload images for each file in the current directory that starts with '.env.production.' but does not end with '.local'. For each such file '.env.production.X', the respective image will get the tag 'production.X'."
echo
echo "Images with the following tags will be built:"

GLOBIGNORE="*.local"
FILES=.env.production.*

for file in $FILES; do
	tag=${file#.env.}
	echo "  $tag"
done

read -p "Continue? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
	for file in $FILES; do
		tag=${file#.env.}
		./build-gitlab.sh $tag
	done
fi
