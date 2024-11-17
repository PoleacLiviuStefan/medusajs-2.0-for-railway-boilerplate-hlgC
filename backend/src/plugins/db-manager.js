import { DataSource } from "typeorm";

const dbManagerLoader = async ({ container }) => {
  const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
  });

  await dataSource.initialize();

  container.register("manager", dataSource.manager);
  console.log("DB Manager registered successfully.");
};

export default dbManagerLoader;
