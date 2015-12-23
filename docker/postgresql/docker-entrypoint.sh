#!/bin/bash
set -e

set_listen_addresses() {
  sedEscapedValue="$(echo "$1" | sed 's/[\/&]/\\&/g')"
  sed -ri "s/^#?(listen_addresses\s*=\s*)\S+/\1'$sedEscapedValue'/" "$PGDATA/postgresql.conf"
}

  mkdir -p "$PGDATA"
  chown -R postgres "$PGDATA"

  chmod g+s /run/postgresql
  chown -R postgres /run/postgresql

  # look specifically for PG_VERSION, as it is expected in the DB dir
  if [ ! -s "$PGDATA/PG_VERSION" ]
  then

    gosu postgres initdb

    # check password first so we can output the warning before postgres
    # messes it up
      pass="PASSWORD 'omatalous'"
      authMethod=md5

    { echo; echo "host all all 0.0.0.0/0 $authMethod"; } >> "$PGDATA/pg_hba.conf"

    # internal start of server in order to allow set-up using psql-client   
    # does not listen on TCP/IP and waits until start finishes
    gosu postgres pg_ctl -D "$PGDATA" \
      -o "-c listen_addresses=''" \
      -w start

    : ${POSTGRES_USER:=postgres}
    : ${POSTGRES_DB:=$POSTGRES_USER}
    export POSTGRES_USER POSTGRES_DB

    psql --username postgres --command "ALTER USER postgres WITH SUPERUSER PASSWORD 'omatalous';"
    psql --username postgres --command "CREATE ROLE omatalous WITH CREATEDB LOGIN PASSWORD 'omatalous';"
    psql --username postgres --command "CREATE DATABASE omatalous;"

    echo

    echo
    for f in /docker-entrypoint-initdb.d/*; do
      case "$f" in
        *.sh)  echo "$0: running $f"; . "$f" ;;
        *.sql) echo "$0: running $f"; psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" < "$f" && echo ;;
        *)     echo "$0: ignoring $f" ;;
      esac
      echo
    done

    gosu postgres pg_ctl -D "$PGDATA" -m fast -w stop
    set_listen_addresses '*'

    echo
    echo 'PostgreSQL init process complete; ready for start up.'
    echo
  
  fi
  
  exec gosu postgres "$@"

exec "$@"
