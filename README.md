# NestJs Chat Application

## Description

blalbalba

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Setup database

```bash
# Khởi tạo database
$ npx prisma init

# Update database
1. npx prisma migrate dev --create-only
2. Modify the generated SQL file.

From:
ALTER TABLE "Profile" DROP COLUMN "biograpy",
ADD COLUMN  "biography" TEXT NOT NULL;

To:
-> ALTER TABLE "Profile"
RENAME COLUMN "biograpy" TO "biography"

3. npx prisma migrate dev

```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
