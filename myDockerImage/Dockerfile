
FROM node:alpine
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY server .
#COPY package*.json ./

RUN npm install
#RUN npm run populate
# If you are building your code for production
# RUN npm install --only=production
EXPOSE 8080

#CMD /usr/src/app/wait-for-postgres.sh && sequelize db:migrate && sequelize db:seed:all &&  npm run dev

CMD [ "npm","run","dev" ]
#CMD [ "./wait-for-postgres.sh" ]
#RUN npm run dev
