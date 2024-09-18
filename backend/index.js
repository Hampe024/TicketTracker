const { MongoWrapper } = require("./mongowrapper");

(async () => {
  const db = new MongoWrapper();
  await db.connected;
  db.insertOne("testcollection", { name: "Test2", age: 26 });
})();

