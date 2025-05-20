root?=$(abspath .)
name?=$(notdir $(root))
install?=${GOPATH}/bin
src?=$(root)
build?=$(root)/bin
# tag?=`git tag | tail -n1`
tag?=$(shell git tag | tail -n1)
ifeq ($(tag),)
	tag="\#$(shell git rev-parse HEAD)"
endif
ldflags?="-s -w -X main.version=$(tag)"

default: run

tidy:
	go mod tidy
	go get -tool
	go tool gofumpt -e -w .

generate: tidy
	go generate ./...
	CGO_ENABLED=0 go run ./b64 > ./static/audio.js
	CGO_ENABLED=0 go tool templ generate

build: generate
	mkdir -p $(build)
	CGO_ENABLED=0 go build -ldflags=$(ldflags) -o $(build)/$(name) $(src)

run: build
	$(build)/$(name) $(arg)

install: build
	mv $(build)/$(name) $(install)/$(name)
	rm -rf $(build)

