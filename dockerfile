FROM  node:20

WORKDIR /src

COPY package* .


RUN npm ci
RUN npm install -g serve
COPY . .
RUN npm run build


EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]