// import { connectToDatabase } from "../../lib/connectToDatabase";
import clientPromise from "../../lib/mongodb"
import NextCors from 'nextjs-cors';

export default async function handler(request, response) {
  await NextCors(request, response, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  if (request.method === "GET") {
    try {
      // const { mongoClient } = await connectToDatabase();
      const mongoClient = await clientPromise;
      const db = mongoClient.db("menu_items");
      const collection = db.collection("foods");
      const results = await collection
        .find({})
        .project({
        })
        .limit(20)
        .toArray();

      response.status(200).json(results);
    } catch (e) {
      console.error(e);
      response.status(500).json(e);
    }
  }
  else if (request.method === "POST") {
    const data = request.body;
    const mongoClient = await clientPromise;
    const db = mongoClient.db("menu_items");
    const yourCollection = db.collection("foods");
    const results = await yourCollection.insertOne(data);
    console.log(results);
    //client.close();
    response.status(201).json({ message: "Data inserted successfully!" });
  }
}

export const config = {
  api: {
    externalResolver: true, // Disables warnings for unresolved requests if the route is being handled by an external resolver like Express.js or Connect. Defaults to false.
  },
}