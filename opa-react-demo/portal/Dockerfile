FROM clojure:tools-deps-bullseye-slim
WORKDIR /app
COPY . .

EXPOSE 5678
# TODO(sr): build at build time, run uberjar here
ENTRYPOINT ["clj", "-X", "start/run"]
