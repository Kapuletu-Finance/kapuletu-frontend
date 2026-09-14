# Step 1: Base image and dependencies
FROM node:24-alpine

# Step 2: Install dependencies only when needed
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Step 3: Rebuild the source code only when needed
COPY . .

# Next.js telemetry is disabled
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Step 4: Production image, copy all the files and run next

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "start"]
