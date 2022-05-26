FROM node:16-buster as base

ENV WORKDIR="/nodetar" \
    PATH=/usr/local/texlive/2022/bin/x86_64-linux:$PATH

# copy the texlife profile
COPY texlive.profile /tmp/texlive.profile

RUN mkdir /tmp/texlive && \
    curl -Lsf http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz \
        | tar zxvf - --strip-components 1 -C /tmp/texlive/ && \
    /tmp/texlive/install-tl --profile /tmp/texlive.profile && \
    wget -P /tmp/ https://www.tug.org/fonts/getnonfreefonts/install-getnonfreefonts && \
    texlua /tmp/install-getnonfreefonts && \
    getnonfreefonts --sys arial-urw

COPY package.json .
RUN npm install --only=development

COPY . .

FROM base as production

ENV NODE_PATH=./dist

RUN npm i 
RUN npm run build


CMD [ "node", "dist/main.js" ]