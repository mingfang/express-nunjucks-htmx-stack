FROM node:18

# Default to Python 3
RUN apt-get update
RUN apt-get install -y python3.9-dev
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.9 100
RUN ln -s /usr/bin/python /usr/local/bin/python

# pip
RUN apt-get install -y python3-distutils
RUN wget -O - https://bootstrap.pypa.io/get-pip.py | python

WORKDIR /app

COPY package*.json ./
COPY requirements.txt ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV="production"
ENV PORT 3000
CMD [ "npm", "start" ]