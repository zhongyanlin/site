FROM tomcat:9.0-jdk11-temurin

ENV CATALINA_OPTS="-Xms64m -Xmx256m -XX:+ExitOnOutOfMemoryError"
WORKDIR /usr/local/tomcat
COPY relay.war /tmp/relay.war
RUN mkdir -p webapps/ROOT \
    && cd webapps/ROOT \
    && jar -xf /tmp/relay.war \
    && rm /tmp/relay.war \
    && printf 'ok\n' > healthz.txt \
    && printf '<!doctype html><html><head><title>Ningbo Relay</title></head><body><h1>Ningbo Relay</h1><p><a href="/appsites/attend/">Open attend</a></p></body></html>\n' > index.html
EXPOSE 8080
CMD ["catalina.sh", "run"]
