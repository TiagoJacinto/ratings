import { createDataSource } from './create-data-source';
import { Rating } from './entities/Rating';
import { Weight } from './entities/Weight';

export async function loadDb(dbFileHandle: FileSystemFileHandle) {
  const dataSource = await createDataSource(dbFileHandle);

  await dataSource.initialize();

  {
    const rating = new Rating();
    rating.name = 'Rating 1';
    rating.description = 'Description 1';
    await dataSource.manager.save(rating);

    const weight1 = new Weight();
    weight1.name = 'Weight 1';
    weight1.value = 50;
    weight1.rating = rating;
    await dataSource.manager.save(weight1);

    const weight2 = new Weight();
    weight2.name = 'Weight 2';
    weight2.value = 10;
    weight2.rating = rating;
    await dataSource.manager.save(weight2);

    const weight3 = new Weight();
    weight3.name = 'Weight 3';
    weight3.value = 40;
    weight3.rating = rating;
    await dataSource.manager.save(weight3);
  }

  return {
    orm: dataSource,
    async clear() {
      const writable = await dbFileHandle.createWritable();
      await writable.write('');
      await writable.close();
    },
  };
}
