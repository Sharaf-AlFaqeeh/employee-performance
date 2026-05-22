// const mongoose = require('mongoose');
// 
// const MONGO_URI = 'mongodb+srv://sharafalfaqeehforai_db_user:BrgSvDYyXu4jMksZ@cluster0.9k4jgd5.mongodb.net/?retryWrites=true&w=majority';
// 
// console.log('Connecting to MongoDB Atlas Admin...');
// mongoose.connect(MONGO_URI)
//   .then(async () => {
//     console.log('✅ Connected successfully!');
//     
//     // List all databases
//     const adminDb = mongoose.connection.client.db().admin();
//     const dbs = await adminDb.listDatabases();
//     console.log('Databases on this Cluster:');
//     for (const db of dbs.databases) {
//       console.log(` - Name: ${db.name}, Size: ${db.sizeOnDisk} bytes`);
//       
//       // List collections in this database
//       const currentDb = mongoose.connection.client.db(db.name);
//       const collections = await currentDb.listCollections().toArray();
//       console.log('   Collections:');
//       collections.forEach(c => console.log('     -', c.name));
//     }
//     
//     process.exit(0);
//   })
//   .catch(err => {
//     console.error('❌ Connection error:', err.message);
//     process.exit(1);
//   });

