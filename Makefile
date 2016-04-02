NAME=ragnarb/sector7
VERSION=0.1.0

.PHONY: container
container:
	docker build --tag ${NAME} ${CURDIR}
	docker tag --force ${NAME}:latest ${NAME}:${VERSION}

.PHONY: clean
clean:
	-docker rmi --force ${NAME}:latest
	-docker rmi --force ${NAME}:${VERSION}
