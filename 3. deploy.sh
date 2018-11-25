
docker rm $(docker stop $(docker ps -a -q --filter ancestor=trustlab/ixo-timelock-dapp --format="{{.ID}}"))

docker login -u trustlab -p trustlab
# docker pull nginx:stable
docker pull trustlab/ixo-timelock-dapp
docker run --name ixo-timelock -d trustlab/ixo-timelock-dapp
# sleep 10
# docker run --env-file .env.mainnet trustlab/ixo-timelock-dapp env