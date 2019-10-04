all: build

docker: build
	docker build -t dagal/trippy-gis .
	docker run --rm -p 8088:8088 -t dagal/trippy-gis

build:
	go build .
	cd view/src && npm install && npm run build
