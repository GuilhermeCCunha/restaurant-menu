import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb"
import NextCors from 'nextjs-cors';


export default async function handler(request, response) {
  await NextCors(request, response, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  if (request.method === "DELETE") {
    const { Id } = request.query
    if (request.method !== 'DELETE') return

    const mongoClient = await clientPromise;
    const db = mongoClient.db("menu_items");
    const yourCollection = db.collection("foods");
    const result = await (await yourCollection.deleteOne({ _id: new ObjectId(Id) })).deletedCount;
    console.log(`deleted count::::${result}`)
    return response.json({
      result: `${result} item has been successfully deleted`,
      message: `food _id: ${Id} deleted`
    })
  }
  if (request.method === "PUT") {
    const { Id } = request.query;
    // const data = request.body;
    const mongoClient = await clientPromise;
    const db = mongoClient.db("menu_items");
    const yourCollection = db.collection("foods");
    try {
      const { name, category, image_url } = request.body;
      if (!name && !category && !image_url) return "inavalid data";
      const result = await yourCollection.replaceOne({ _id: new ObjectId(Id) }, { name, category, image_url });
      response.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);
      response.status(500).json({ success: false, error });
    }

  }
  if (request.method === "GET") {
    const { Id } = request.query;
    // const data = request.body;
    const mongoClient = await clientPromise;
    const db = mongoClient.db("menu_items");
    const yourCollection = db.collection("foods");
    try {
      const results = await yourCollection
        .findOne({ "_id": ObjectId(Id) })
      response.status(200).json(results);
    } catch (error) {
      console.error(error);
      response.status(500).json(error);
    }

  }
}
export const config = {
  api: {
    externalResolver: true, // Disables warnings for unresolved requests if the route is being handled by an external resolver like Express.js or Connect. Defaults to false.
  },
}