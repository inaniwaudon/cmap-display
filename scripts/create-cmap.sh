const_dir=src/const
public_dir=public

go run scripts/main.go $const_dir/UniJIS-UTF16-H > $const_dir/UniJIS-UTF16-H.json
go run scripts/main.go $const_dir/UniJIS-UTF16-V > $const_dir/UniJIS-UTF16-V.json
go run scripts/main.go $const_dir/UniJIS2004-UTF16-H > $const_dir/UniJIS2004-UTF16-H.json
go run scripts/main.go $const_dir/UniJIS2004-UTF16-V > $const_dir/UniJIS2004-UTF16-V.json

cp -r src/const/UniJIS-UTF16-H $public_dir/
cp -r src/const/UniJIS-UTF16-V $public_dir/
cp -r src/const/UniJIS2004-UTF16-H $public_dir/
cp -r src/const/UniJIS2004-UTF16-V $public_dir/