# Migration `20190908160636-init`

This migration has been generated at 9/8/2019, 4:06:36 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new_UserStats"("id" TEXT NOT NULL  ,"createdAt" DATE NOT NULL  ,"updatedAt" DATE NOT NULL DEFAULT '1970-01-01 00:00:00' ,"state" TEXT NOT NULL DEFAULT 'OPEN' ,"user" TEXT   REFERENCES "User"(id) ON DELETE SET NULL,"exercise" TEXT   REFERENCES "Exercise"(id) ON DELETE SET NULL,"card" TEXT   REFERENCES "Card"(id) ON DELETE SET NULL,PRIMARY KEY ("id"))
;

INSERT INTO "new_UserStats" ("id","createdAt","updatedAt","state","user","exercise","card") SELECT "id","createdAt","updatedAt","state","user","exercise","card" from "UserStats"

DROP TABLE "lift"."UserStats";

ALTER TABLE "lift"."new_UserStats" RENAME TO "UserStats";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;

PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new__ExerciseToUser"("A" TEXT   REFERENCES "Exercise"(id) ON DELETE CASCADE,"B" TEXT   REFERENCES "User"(id) ON DELETE CASCADE)
;

INSERT INTO "new__ExerciseToUser" ("A","B") SELECT "A","B" from "_ExerciseToUser"

DROP TABLE "lift"."_ExerciseToUser";

ALTER TABLE "lift"."new__ExerciseToUser" RENAME TO "_ExerciseToUser";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;

PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new__LevelToUser"("A" TEXT   REFERENCES "Level"(id) ON DELETE CASCADE,"B" TEXT   REFERENCES "User"(id) ON DELETE CASCADE)
;

INSERT INTO "new__LevelToUser" ("A","B") SELECT "A","B" from "_LevelToUser"

DROP TABLE "lift"."_LevelToUser";

ALTER TABLE "lift"."new__LevelToUser" RENAME TO "_LevelToUser";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;

CREATE UNIQUE INDEX "lift"."User.id._UNIQUE" ON "User"("id")

CREATE UNIQUE INDEX "lift"."User.email._UNIQUE" ON "User"("email")

CREATE UNIQUE INDEX "lift"."User.resetPasswordToken._UNIQUE" ON "User"("resetPasswordToken")

CREATE UNIQUE INDEX "lift"."UserStats.id._UNIQUE" ON "UserStats"("id")

CREATE UNIQUE INDEX "lift"."Exercise.id._UNIQUE" ON "Exercise"("id")

CREATE UNIQUE INDEX "lift"."Card.id._UNIQUE" ON "Card"("id")

CREATE UNIQUE INDEX "lift"."Level.id._UNIQUE" ON "Level"("id")

CREATE UNIQUE INDEX "lift"."Level.levelId._UNIQUE" ON "Level"("levelId")
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..20190908160636-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,73 @@
+datasource db {
+    provider = "sqlite"
+    url      = "file:dev.db"
+}
+
+generator photon {
+    provider = "photonjs"
+}
+
+model User {
+    id                  String      @default(cuid()) @id @unique
+    email               String      @unique
+    password            String
+    resetPasswordToken  String?     @unique
+    resetPasswordExpire Float?
+    createdAt           DateTime    @default(now())
+    updatedAt           DateTime    @updatedAt
+    name                String?
+    exercises           Exercise[]  @relation(onDelete: NONE)
+    levels              Level[]     @relation(onDelete: NONE)
+    stats               UserStats[] @relation(onDelete: CASCADE)
+}
+
+model UserStats {
+    id        String        @default(cuid()) @id @unique
+    createdAt DateTime      @default(now())
+    updatedAt DateTime      @updatedAt
+    user      User
+    exercise  Exercise
+    state     ExerciseState
+    card      Card?
+}
+
+enum ExerciseState {
+    OPEN
+    FAILED
+    FINISHED
+}
+
+model Exercise {
+    id        String      @default(cuid()) @id @unique
+    published Boolean
+    title     String
+    content   String?
+    level     Level?
+    cards     Card[]      @relation(onDelete: NONE)
+    stats     UserStats[] @relation(onDelete: NONE)
+    users     User[]      @relation(onDelete: NONE)
+    createdAt DateTime    @default(now())
+    updatedAt DateTime    @updatedAt
+}
+
+model Card {
+    id        String      @default(cuid()) @id @unique
+    published Boolean
+    content   String
+    correct   Boolean
+    createdAt DateTime    @default(now())
+    updatedAt DateTime    @updatedAt
+    stats     UserStats[] @relation(onDelete: NONE)
+}
+
+model Level {
+    id        String     @default(cuid()) @id @unique
+    levelId   String     @unique
+    rank      String?
+    published Boolean
+    title     String
+    exercises Exercise[] @relation(onDelete: NONE)
+    users     User[]     @relation(onDelete: NONE)
+    createdAt DateTime   @default(now())
+    updatedAt DateTime   @updatedAt
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20190908160636-init)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20190908160636-init'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
