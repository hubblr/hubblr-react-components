#!/bin/bash

file="libIndex.js"

rm -f $file
touch $file

find src/lib \( -name "*.jsx" -o -name "*.js" \) \
  ! -path "src/lib/shared/*" \
  ! -path "src/lib/shared/**/*" \
  ! -path "src/lib/**/example/*" \
  ! -path "src/lib/**/example/**/*" \
  >> $file

sed -E -i "" "/util/s/(.*)\.jsx?$/export * from \"\.\/\1\"/" $file
sed -E -i "" "/\components|hooks/s/(^.*\/(.*))\.jsx?$/export { default as \2 } from \"\.\/\1\"/" $file

prettier -w $file
