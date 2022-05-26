up:
	docker-compose up --build
down:
	docker-compose  down --volumes --remove-orphans
bash:
	docker exec -it nodetarimage sh
	