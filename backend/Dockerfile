FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Expose port 3000 for incoming traffic
EXPOSE 3000

# Set environment variables
ENV DATABASE_USER=kfhusername
ENV DATABASE_HOST=dbserver
ENV DATABASE_NAME=postgres
ENV DATABASE_PASSWORD=kfhpassword
ENV DATABASE_PORT=5432
ENV SERVER_PORT=3000
ENV ENCRYPTION_KEY_CVV="}R_vR|,8*o_Qaw<]hl>V%WoWMCe1N@Wq*Zr5u},FL)O'H(/(1*f.v^,x{AFx4tP"
ENV ENCRYPTION_KEY_CART="C$QM,<nbC>Hm}RT'fD59J~nBa$cB?0V1nvLEE)0`Mp]tCwdW?,q=p-SrkU6[kql"
ENV ENCRYPTION_KEY_ACCESS_TOEKN="5958E635F3B3994111AB3F4998DEB"
ENV ENCRYPTION_KEY_REFRESH_TOEKN="3C74A11FF27CD66ACD64E869AE3B8"
ENV REFRESH_TOKEN_EXPIRY=1200 
ENV ACCESS_TOKEN_EXPIRY=600 
ENV FRONT_END_BASE_URL="localhost"

# Start Node.js app
CMD ["npm", "start"]
