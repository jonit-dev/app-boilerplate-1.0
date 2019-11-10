FROM node:10

# Where our app will live in the container
WORKDIR /usr/src/app 


# Move package.json and package.lock.json into our container root path (./). It will be used to install all of them later, with npm install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy our current root to the docker root
COPY . .

# Expose port 3000, so we can access our server. This is defined in src/constants/serverConfig.dev.ts
EXPOSE 3000

# This will run our npm run dev command under package.json
CMD ["npm","run","dev"] 
