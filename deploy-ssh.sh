#!/bin/sh
set -e
IMAGE=hyventaminen-web
ARCHIVE=${IMAGE}.tar.gz
HOST=blargg

if [ "$1" != "--skip-build" ]; then
	docker build -t ${IMAGE}:latest .
	docker save ${IMAGE}:latest | gzip > $ARCHIVE
fi

scp $ARCHIVE ${HOST}:/tmp/${ARCHIVE}
rm $ARCHIVE
ssh $HOST <<-EOF
	sudo docker load -i /tmp/${ARCHIVE}
	rm /tmp/${ARCHIVE}
	sudo docker stop $CONTAINER
	sudo docker rm $CONTAINER
	sudo docker run -d -p 5580:80 --name $CONTAINER ${IMAGE}:latest            
EOF
