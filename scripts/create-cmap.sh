public_dir=public

go run scripts/main.go $public_dir/UniJIS-UTF16-H > $public_dir/UniJIS-UTF16-H.json
go run scripts/main.go $public_dir/UniJIS-UTF16-V > $public_dir/UniJIS-UTF16-V.json
go run scripts/main.go $public_dir/UniJIS2004-UTF16-H > $public_dir/UniJIS2004-UTF16-H.json
go run scripts/main.go $public_dir/UniJIS2004-UTF16-V > $public_dir/UniJIS2004-UTF16-V.json
