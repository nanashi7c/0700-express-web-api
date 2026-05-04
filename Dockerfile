FROM postres:16-bookworm

RUN apt-get update \ 
&& apt-get install -y --no-install-recommends locales \ 
&& sed -i '/^# ja_JP.UTP-8 UTF-8$/s/^# //' /etc/locale.gen \
&& locale-gen ja_JP/UTF-8' \
&& update-locale LANG=ja_JP.UTF-8 \
&& rm -rf /var/lib/apt/lists/*

ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV POSTGRES_INITDB_ARGS="--encoding=UTF8 --locale=ja_JP.UTF-8"