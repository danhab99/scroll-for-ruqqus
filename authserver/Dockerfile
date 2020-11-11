FROM node:14.5.0

WORKDIR /root

ADD package* ./
RUN npm install
ADD . ./

CMD npm start